import React from "react";
import Establishment from "../models/Establishment";
import EstablishmentList from "./EstablishmentList";
import { geolocated } from "react-geolocated";

class EstablishmentSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { establishments: null };
  }

  componentDidUpdate = async prevProps => {
    if (this.props.coords !== prevProps.coords) {
      if (this.props.coords) {
        const establishments = await Establishment.near(this.props.coords.longitude, this.props.coords.latitude);
        this.setState({ establishments });
      }
    }
  };

  render = props => {
    if (this.props.isGeolocationEnabled) {
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
    } else {
      return <h1>Location not available</h1>;
    }
  };
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 60000
})(EstablishmentSelector);
