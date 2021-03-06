import React, {useState, useEffect} from "react";
import NYCEstablishment from "../models/NYCEstablishment";
import SeattleEstablishment from "../models/SeattleEstablishment";
import styles from "./EstablishmentDetail.module.css";
import { Heading, Text, Accordion, AccordionPanel, Box } from "grommet";
import { EstablishmentDetail as EstablishmentDetailData } from "../models/IInspectionInfo"
import { RouteComponentProps } from "react-router-dom";

const EstablishmentDetail = (props: RouteComponentProps<{id: string, city: string}>) => {
  const id = props.match.params.id;
  const [establishment, setEstablishment] = useState<EstablishmentDetailData | null>(null);
  const city = props.match.params.city;
  const inspectionInfoImpl = (city === "nyc") ? NYCEstablishment : SeattleEstablishment

  const fetchEstablishment = async (id: string) => {

    const fetchedEstablishment = await inspectionInfoImpl.detail(id);
    setEstablishment(fetchedEstablishment);
  }

  useEffect(() => {
    fetchEstablishment(id)
  }, [id]);

  const gradeColor = (grade?: string) => {
    if (grade === "A") {
      return "mediumseagreen"
    } else if (grade === "B") {
      return "goldenrod"
    } else if (grade === "C") {
      return "crimson"
    } else
      return "black"
  }

  const handleScore = (score: string) => {
    if (score) {
      return `(${score})`
    } else {
      return null
    }
  }

  const AccordionLabel = ({date, grade, score, action}: {date: string, grade?: string, score: string, action: string}) => {
    return (
      <Box pad={{ horizontal: 'small' }}>
        <Heading level={"4"}>
          <span>{`${new Date(date).toLocaleDateString()}`}</span>
          <span style={{color: gradeColor(grade)}}> {inspectionInfoImpl.renderGrade(grade, score, action)} {handleScore(score)}</span>
        </Heading>
      </Box>
    )
  }

  const cleanDescription = (description: string) => {
    const regex = /Â/gi;

    if (description) {
      return description.replace(regex, '');
    } else {
      return "";
    }
  }

  if (establishment) {
    return (
      <>
        <Box align="center">
          <Heading color="brand">Violations at {establishment.dba}</Heading>
          <Text>Establishment ID: {id}</Text>
          {establishment.latestGrade ? (<Text>Latest Grade: {establishment.latestGrade}</Text>) : (<></>)}
          <Text>{establishment.address}</Text>
          <ul className={styles.EstablishmentDetail}>
            <Accordion data-heap="Establishment Violation Accordion">
              {establishment.inspections.map(inspection => {
                return (
                  <AccordionPanel
                    data-heap="Establishment Violation Accordion Panel"
                    label={
                      <AccordionLabel
                        date={inspection.date}
                        grade={inspection.grade}
                        score={inspection.score}
                        action={inspection.action}
                      />
                    }
                  >
                    <li key={inspection.date}>
                      <Box
                        pad="medium"
                        background="light-2"
                        style={{ textAlign: "left" }}
                      >
                        <p>{inspection.action}</p>
                        <ul className={styles.EstablishmentDetail}>
                          {inspection.violations ? (
                            inspection.violations.map(v => {
                              return (
                                <li key={inspection.date + v.code}>
                                  <p>
                                    {v.code} -{" "}
                                    {cleanDescription(v.description)}
                                  </p>
                                </li>
                              );
                            })
                          ) : (
                            <li key={inspection.date}>
                              <p>
                                No violations found{" "}
                                <span role="img" aria-label="one hundred">
                                  💯
                                </span>
                              </p>
                            </li>
                          )}
                        </ul>
                      </Box>
                    </li>
                  </AccordionPanel>
                );
              })}
            </Accordion>
          </ul>
        </Box>
      </>
    );
  } else {
    return <div>Loading violations for Establishment ID: {id}</div>;
  }
};

export default EstablishmentDetail;
