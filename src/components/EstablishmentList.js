import React from "react";
import { Link } from "react-router-dom";

const EstablishmentList = ({ establishments }) => {
  return (
    <>
      <ul>
        {establishments.map(establishment => {
          return (
            <li>
              <Link to={`/${establishment.camis}`}>{establishment.dba}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default EstablishmentList;
