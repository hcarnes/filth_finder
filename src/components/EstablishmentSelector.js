import React, { useState, useEffect } from "react";
import Establishment from "../models/Establishment";
import EstablishmentList from "./EstablishmentList";
import { geolocated } from "react-geolocated";
import { Heading, Box, TextInput } from "grommet";

const EstablishmentSelector = props => {
  const [search, setSearch] = useState("")
  const [establishments, setEstablishments] = useState(null);
  const fetchEstablishments = async (longitude, latitude, search) => {
    const fetchedEstablishments = await Establishment.near(longitude, latitude, search);
    setEstablishments(fetchedEstablishments);
  };
  useEffect(() => {
    if (props.coords) {
      fetchEstablishments(props.coords.longitude, props.coords.latitude, search);
    }
  }, [props.coords, search]);

  if (props.isGeolocationEnabled) {
    if (establishments) {
      return (
        <Box align="center">
          <Heading color="brand">Establishments near you:</Heading>
          <TextInput
            value={search}
            placeholder="Search all establishments"
            onChange={event => {
              setSearch(event.target.value)
            }}
          />
          <EstablishmentList establishments={establishments} />
        </Box>
      );
    } else {
      return <h1>Loading Establishments near you</h1>;
    }
  } else {
    return <h1>Location not available</h1>;
  }
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 60000
})(EstablishmentSelector);
