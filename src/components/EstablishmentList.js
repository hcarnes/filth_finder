import React from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";

const List = props => <Box fill tag="ul" border="top" {...props} list-style-type="none" />;

const ListItem = props => (
  <Box
    tag="li"
    border="bottom"
    pad="small"
    direction="row"
    justify="between"
    {...props}
  />
);

const EstablishmentList = ({ establishments, city }) => {
  return (
    <List alignContent="start">
        {establishments.map(establishment => {
          return (
            <ListItem >
              <Text key={establishment.dba}>
                  <Link to={`${city}/${establishment.id}`} data-heap="Establishment Item">
                    {establishment.dba}
                  </Link>
              </Text>
            </ListItem>
          );
        })}
    </List>
  );
};

export default EstablishmentList;
