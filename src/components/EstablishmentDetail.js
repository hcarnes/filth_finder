import React from "react";
import Establishment from "../models/Establishment";

const EstablishmentDetail = ({ match }) => {
  const establishment = Establishment.detail(match.params.camid);

  return (
    <>
      <h1>Violations at {establishment.dba} </h1>
      <p>CAMID: {match.params.camid}</p>
      <ul>
        {establishment.inspections.map(inspection => {
          return (
            <li key={inspection.date}>
              Grade: {inspection.grade} - Date: {inspection.date}<br />
              Violations:
              <ul>
                {inspection.violations.map(v => {
                  return (
                    <li key={inspection.date+v.violationCode}>
                      <p>Code: {v.violationCode}</p>
                      <p>Description: {v.violationDescription}</p>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default EstablishmentDetail;
