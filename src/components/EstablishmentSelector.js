import React, { useState, useEffect, useRef } from "react";
import Establishment from "../models/Establishment";
import EstablishmentList from "./EstablishmentList";
import { geolocated } from "react-geolocated";
import { Heading, Box, TextInput, Meter, Anchor, Text } from "grommet";
import { Github } from 'grommet-icons';

const LoadingSpinner = () => {
  const timerRef = useRef(10)
  const [timer, setTimer] = useState(10)
  useEffect(() => {
    const interval = setInterval(() => {
      timerRef.current = timerRef.current < 100 ? timerRef.current + 5 : 0;
      setTimer(timerRef.current);
    }, 100);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <Box align="center" pad="large">
      <Meter
        type="circle"
        background="light-2"
        values={[{ value: timer, color: timer > 50 ? "accent-2" : "accent-1" }]}
      />
    </Box>
  );
}

const EstablishmentSelector = props => {
  const [search, setSearch] = useState("");
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
          <Anchor
            target="_blank"
            a11yTitle="Get your hands dirty on Github"
            href="https://github.com/hcarnes/filth_finder"
            icon={<Github color="brand" size="large" />}
          />
          <Heading color="brand">Establishments near you:</Heading>
          <TextInput
            value={search}
            placeholder="Search all establishments"
            onChange={event => {
              setSearch(event.target.value);
            }}
          />
          <EstablishmentList establishments={establishments} />
        </Box>
      );
    } else {
      return (
      <>
        <h1>Loading establishments near you</h1>
        <LoadingSpinner />
      </>
      );
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
