import React from "react";
import { Link } from "react-router-dom";

const CityPicker = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/seattle">Seattle</Link>
        </li>
        <li>
          <Link to="/nyc">NYC</Link>
        </li>
      </ul>
    </>
  );
};

export default CityPicker;
