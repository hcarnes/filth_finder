import React from "react";
import Establishment from '../models/Establishment'
import EstablishmentList from "./EstablishmentList";

const EstablishmentSelector = () => {
  return (
    <>
      <h1>Establishments near you:</h1>
      <EstablishmentList establishments={Establishment.near(1,1)}/>
    </>
  );
};

export default EstablishmentSelector;