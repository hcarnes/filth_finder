import React from "react";
import Establishment from "../models/Establishment";
import styles from "./EstablishmentDetail.module.css";
import { Heading, Text, Accordion, AccordionPanel, Box } from "grommet";
class EstablishmentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camis: props.match.params.camis,
      establishment: null
    };
  }

  componentDidMount = async () => {
    const establishment = await Establishment.detail(this.state.camis);
    this.setState({ establishment });
  };


  render = () => {
    const establishment = this.state.establishment;
    
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
            <Text>CAMIS: {this.state.camis}</Text>
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
<<<<<<< HEAD
=======
                          <Text>Grade: {inspection.grade}</Text>
                          <br />
                          <Text>Violations:</Text>
>>>>>>> dccbd3fc287f2f673715d4515bb8aeed0239f2be
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
      return <div>Loading violations for CAMIS: {this.state.camis}</div>;
    }
  };
}

export default EstablishmentDetail;
