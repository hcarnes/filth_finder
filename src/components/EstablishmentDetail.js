import React from "react";
import Establishment from "../models/Establishment";
import styles from "./EstablishmentDetail.module.css";
import { Heading, Text, Accordion, AccordionPanel, Box } from "grommet";

const renderPanelHeader = title => (
  <Box direction="row" align="center" pad="medium" gap="small">
    <strong>
      <Text>{title}</Text>
    </strong>
  </Box>
);
class EstablishmentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { camis: props.match.params.camis, establishment: null };
  }

  componentDidMount = async () => {
    const establishment = await Establishment.detail(this.state.camis);
    this.setState({ establishment });
    console.log(establishment);
  };

  render = () => {
    const establishment = this.state.establishment;
    if (establishment) {
      return (
        <>
          
            <Heading>Violations at {establishment.dba}</Heading>
            
            <Text>CAMIS: {this.state.camis}</Text>
            <ul className={styles.EstablishmentDetail}>
              <Accordion>
                {establishment.inspections.map(inspection => {
                  return (
                    <AccordionPanel header={renderPanelHeader(`${inspection.date} - ${inspection.grade}`)}>
                      <li key={inspection.date}>
                        <Box
                          pad="medium"
                          background="light-2"
                          style={{ textAlign: "left" }}
                        >
                          <Text>Grade: {inspection.grade}</Text>
                          <br />
                          <Text>Violations:</Text>
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
          
        </>
      );
    } else {
      return <div>Loading violations for CAMIS: {this.state.camis}</div>;
    }
  };
}

export default EstablishmentDetail;
