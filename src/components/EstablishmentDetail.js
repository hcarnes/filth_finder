import React from "react";
import Establishment from "../models/Establishment";
import styles from "./EstablishmentDetail.module.css";
import { Heading, Text, Accordion, AccordionPanel } from "grommet";
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
              {establishment.inspections.map(inspection => {
                return (
                  <Accordion>
                  <AccordionPanel
                    header={`Grade: ${inspection.grade} - Date: ${
                      inspection.date
                    }`}
                  >
                    <li key={inspection.date}>
                      <br />
                      Violations:
                      <ul className={styles.EstablishmentDetail}>
                        {inspection.violations.map(v => {
                          return (
                            <li key={inspection.date + v.code}>
                              <p>Code: {v.code}</p>
                              <p>Description: {v.description}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </AccordionPanel>
                  </Accordion>
                );
              })}
            </ul>
          
        </>
      );
    } else {
      return <div>Loading violations for CAMIS: {this.state.camis}</div>;
    }
  };
}

export default EstablishmentDetail;
