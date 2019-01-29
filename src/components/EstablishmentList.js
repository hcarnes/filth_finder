import React from "react";
import { Link } from "react-router-dom";
import styles from './EstablishmentList.module.css'

const EstablishmentList = ({ establishments }) => {
  return (
    <>      
      <ul className={styles.EstablishmentList}>
        {establishments.map(establishment => {
          return (
            <li key={establishment.dba}>
              <Link to={`/${establishment.camis}`}>{establishment.dba} - {establishment.grade}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default EstablishmentList;
