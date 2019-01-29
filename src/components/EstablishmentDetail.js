import React from "react";
import Establishment from "../models/Establishment";
import styles from "./EstablishmentDetail.module.css"
import {Box} from 'grommet';
class EstablishmentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { camis: props.match.params.camis, establishment: null };
  }

  componentDidMount = async () => {
    const establishment = await Establishment.detail(this.state.camis);
    this.setState({establishment})
    console.log(establishment)
  };

  render = () => {
    const establishment = this.state.establishment;
    if (establishment) {
      return (
        <>
          <Box alignment="start">
          <h1>Violations at {establishment.dba} </h1>
          <p>CAMIS: {this.state.camis}</p>
          <ul className={styles.EstablishmentDetail}>
            {establishment.inspections.map(inspection => {
              return (
                <li key={inspection.date}>
                  Grade: {inspection.grade} - Date: {inspection.date}
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
              );
            })}
          </ul>
          )
          </Box>
        </>
      );
    } else {
      return <div>Loading violations for CAMIS: {this.state.camis}</div>;
    }
  };
}

export default EstablishmentDetail;
