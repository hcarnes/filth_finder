import React, {useState, useEffect} from "react";
import Establishment from "../models/Establishment";
import styles from "./EstablishmentDetail.module.css";
import { Heading, Text, Accordion, AccordionPanel, Box } from "grommet";

const EstablishmentDetail = (props) => {
  const camis = props.match.params.camis;
  const [establishment, setEstablishment] = useState(null);

  const fetchEstablishment = async (camis) => {
    const fetchedEstablishment = await Establishment.detail(camis);
    setEstablishment(fetchedEstablishment);
  }

  useEffect(() => {
    fetchEstablishment(camis)
  }, [camis]);

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

  const handleMissingGrade = (grade) => {
    if (grade) {
      return grade
    } else {
      return "No grade assigned."
    }
  }

  const AccordionLabel = ({date, grade}) => {
    return (
      <Box pad={{ horizontal: 'xsmall' }}>
        <Heading level={4}>
          <span>{`${new Date(date).toLocaleDateString()}`}</span> -
          <span style={{color: gradeColor(grade)}}> {handleMissingGrade(grade)}</span>
        </Heading>
      </Box>
    )
  }

  if (establishment) {
    return (
      <>
        <Box align="center">
          <Heading color="brand">Violations at {establishment.dba}</Heading>
          <Text>CAMIS: {camis}</Text>
          <ul className={styles.EstablishmentDetail}>
            <Accordion>
              {establishment.inspections.map(inspection => {
                return (
                  <AccordionPanel
                    label={<AccordionLabel date={inspection.date} grade={inspection.grade} />}
                  >
                    <li key={inspection.date}>
                      <Box
                        pad="medium"
                        background="light-2"
                        style={{ textAlign: "left" }}
                      >
                        <ul className={styles.EstablishmentDetail}>
                          {inspection.violations.map(v => {
                            return (
                              <li key={inspection.date + v.code}>
                                <p>
                                  {v.code} - {v.description}
                                </p>
                              </li>
                            );
                          })}
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
    return <div>Loading violations for CAMIS: {camis}</div>;
  }
};

export default EstablishmentDetail;
