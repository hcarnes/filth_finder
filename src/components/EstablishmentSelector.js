import React from "react";
import Establishment from '../models/Establishment'
import EstablishmentList from "./EstablishmentList";
import { Heading, Box } from 'grommet';
<<<<<<< HEAD
import rat from '../rat.png';

=======
>>>>>>> dccbd3fc287f2f673715d4515bb8aeed0239f2be

const EstablishmentSelector = () => {
  return (
    <>
    <Box align="center">
      <Heading color="brand">Establishments near you:</Heading>
<<<<<<< HEAD
      <img src={rat} alt="logo" height="100" />
=======
>>>>>>> dccbd3fc287f2f673715d4515bb8aeed0239f2be
      <EstablishmentList establishments={Establishment.near(1,1)}/>
     </Box>
    </>
  );
};

export default EstablishmentSelector;