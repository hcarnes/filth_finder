import React from "react";
import Establishment from '../models/Establishment'
import EstablishmentList from "./EstablishmentList";
import { Heading, Box } from 'grommet';

const EstablishmentSelector = () => {
  return (
    <>
    <Box align="center">
      <Heading>Establishments near you:</Heading>
      <EstablishmentList establishments={Establishment.near(1,1)}/>
     </Box>
    </>
  );
};

export default EstablishmentSelector;