import React from "react";
import Establishment from '../models/Establishment'
import EstablishmentList from "./EstablishmentList";
import { Heading, Box } from 'grommet';
import rat from '../rat.png';


const EstablishmentSelector = () => {
  return (
    <>
    <Box align="center">
      <Heading color="brand">Establishments near you:</Heading>
      <img src={rat} alt="logo" height="100" />
      <EstablishmentList establishments={Establishment.near(1,1)}/>
    </>
  );
};

export default EstablishmentSelector;