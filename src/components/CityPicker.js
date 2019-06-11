import React from "react";
import { Link } from "react-router-dom";
import { Heading, Box } from "grommet";
import styles from "./CityPicker.module.css";

const CityPicker = () => {
  return (
    <Box align="center">
      <Heading color="brand">Select a city:</Heading>
      <ul className={styles.CityPicker}>
        <li>
          <span role="img" aria-label="coffee">
            ☕
          </span>
          <Link to="/seattle">Seattle</Link>
        </li>
        <li>
          <span role="img" aria-label="statue of liberty">
            🗽
          </span>
          <Link to="/nyc">NYC</Link>
        </li>
      </ul>
    </Box>
  );
};

export default CityPicker;
