import React from "react";
import Establishment from "../models/Establishment";
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
          <h1>Violations at {establishment.dba} </h1>
          <p>CAMIS: {this.state.camis}</p>
          <ul>
            {establishment.inspections.map(inspection => {
              return (
                <li key={inspection.date}>
                  Grade: {inspection.grade} - Date: {inspection.date}
                  <br />
                  Violations:
                  <ul>
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
        </>
      );
    } else {
      return <div>Loading violations for CAMIS: {this.state.camis}</div>;
    }
  };
}

export default EstablishmentDetail;
