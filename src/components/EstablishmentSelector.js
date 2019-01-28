import React from "react";
import Establishment from "../models/Establishment";
import EstablishmentList from "./EstablishmentList";

class EstablishmentSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { establishments: null };
  }

  componentDidMount = async () => {
    const establishments = await Establishment.near(1, 1);
    console.log(establishments)
    this.setState({establishments})
  };

  render = props => {
    if (this.state.establishments) {
      return (
        <>
          <h1>Establishments near you:</h1>
          <EstablishmentList establishments={this.state.establishments} />
        </>
      );
    } else {
      return <h1>Loading Establishments near you</h1>;
    }
  };
}

export default EstablishmentSelector;
