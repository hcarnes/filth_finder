import React, {useState, useEffect} from "react";
import NYCEstablishment from "../models/NYCEstablishment";
import SeattleEstablishment from "../models/SeattleEstablishment";
import styles from "./EstablishmentDetail.module.css";
import { Heading, Text, Accordion, AccordionPanel, Box } from "grommet";

const EstablishmentDetail = (props) => {
  const id = props.match.params.id;
  const [establishment, setEstablishment] = useState(null);

  const fetchEstablishment = async (id) => {
    const city = props.match.params.city;
    const inspectionInfoImpl = (city === "nyc") ? NYCEstablishment : SeattleEstablishment

    const fetchedEstablishment = await inspectionInfoImpl.detail(id);
    setEstablishment(fetchedEstablishment);
  }

  useEffect(() => {
    fetchEstablishment(id)
  }, [id]);

  const gradeColor = (grade) => {
    if (grade === "A") {
      return "mediumseagreen"
    } else if (grade === "B") {
      return "goldenrod"
    } else if (grade === "C") {
      return "crimson"
    } else
      return "black"
  }

  const renderGrade = (grade, score, action) => {
    if (action && action.includes("Closed")) {
      return (
        <span role="img" aria-label="Establishment closed">
          - &#x1F922;
        </span>
      );
    } else {
      if (grade && grade !== "Z") {
        return `- ${grade}`
      } else if (score){
        return <span role="img" aria-label="Grade pending">- &#x23F3;</span>;
      } else {
        return null
      }
    }
  }

  const handleScore = (score) => {
    if (score) {
      return `(${score})`
    } else {
      return null
    }
  }

  const AccordionLabel = ({date, grade, score, action}) => {
    return (
      <Box pad={{ horizontal: 'xsmall' }}>
        <Heading level={4}>
          <span>{`${new Date(date).toLocaleDateString()}`}</span>
          <span style={{color: gradeColor(grade)}}> {renderGrade(grade, score, action)} {handleScore(score)}</span>
        </Heading>
      </Box>
    )
  }

  
  const cleanDescription = (description) => {
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
          <Text>{establishment.address}</Text>
          <ul className={styles.EstablishmentDetail}>
            <Accordion direction="column-reverse" data-heap="Establishment Violation Accordion">
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
                          {inspection.violations.length > 0 ? (
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
