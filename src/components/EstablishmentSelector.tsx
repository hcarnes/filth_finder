import React, { useState, useEffect, useRef } from "react";
import NYCEstablishment from "../models/NYCEstablishment";
import SeattleEstablishment from "../models/SeattleEstablishment";
import EstablishmentList from "./EstablishmentList";
import { Heading, Box, TextInput, Meter, Anchor } from "grommet";
import { Github, Twitter } from 'grommet-icons';
import { CityLocations } from '../models/Locations'
import { useDebounce } from 'use-debounce'
import { GeolocatedProps } from "react-geolocated";
import { RouteComponentProps } from "react-router";
import { Establishment } from "../models/IInspectionInfo";

type EstablishmentSelectorProps = GeolocatedProps & RouteComponentProps<{city: string}>


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
        values={[{ label: "", value: timer, color: timer > 50 ? "accent-2" : "accent-1" }]}
      />
    </Box>
  );
}

const EstablishmentSelector = (props: EstablishmentSelectorProps) => {
  let city: "nyc" | "seattle" = props.match.params.city.toLowerCase() == "seattle" ? "seattle" : "nyc"
  
  const [searchState, setSearch] = useState("");
  const [search] = useDebounce(searchState, 500);
  const [establishments, setEstablishments] = useState<Establishment[] | null>(null);
  const fetchEstablishments = async (longitude: number, latitude: number, search?: string) => {
    const inspectionInfoImpl = (city === "nyc") ? NYCEstablishment : SeattleEstablishment;
    const fetchedEstablishments = await inspectionInfoImpl.near(longitude, latitude, search);
    setEstablishments(fetchedEstablishments);
  };
  useEffect(() => {
    if (props.coords) {
      fetchEstablishments(props.coords.longitude, props.coords.latitude, search);
    } else {
      fetchEstablishments(CityLocations[city].lng, CityLocations[city].lat, search);
    }
  }, [props.coords, search, city]);

  useEffect(() => {
    const heap = (window as any).heap;
    if (heap) {
      if (props.isGeolocationEnabled) {
        if (props.coords) {
          heap.track("Geolocation coordinates received", {
            accuracy: props.coords.accuracy,
            altitude: props.coords.altitude,
            altitudeAccuracy: props.coords.altitudeAccuracy,
            heading: props.coords.heading,
            latitude: props.coords.latitude,
            longitude: props.coords.longitude,
            speed: props.coords.speed
          });
        }
      } else if (props.isGeolocationAvailable) {
        heap.track("Geolocation not allowed by user", {});
      }
    }
  }, [props.isGeolocationEnabled, props.coords])

  if (establishments) {
    return (
      <Box align="center">
        <Box direction="row" justify="center">
          <Anchor
            target="_blank"
            a11yTitle="Get your hands dirty on Github"
            href="https://github.com/hcarnes/filth_finder"
            icon={<Github color="brand" size="large" />}
          />
          <Anchor
            target="_blank"
            a11yTitle="Follow me on Twitter"
            href="https://twitter.com/ketoaustin"
            icon={<Twitter color="brand" size="large" />}
          />
        </Box>
        <Heading color="brand">Establishments near you:</Heading>
        <TextInput
          value={searchState}
          placeholder="Search all establishments"
          onChange={event => {
            setSearch(event.target.value);
          }}
          data-heap="Establishment Search Box"
        />
        <EstablishmentList establishments={establishments} city={city} />
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
};

export default EstablishmentSelector;
