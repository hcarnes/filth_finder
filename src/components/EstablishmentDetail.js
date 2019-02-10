import React from "react";
import Establishment from "../models/Establishment";
class EstablishmentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { camis: props.match.params.camis, establishment: null };
  }

  componentDidMount = async () => {
    const establishment = await Establishment.detail(this.state.camis);
    this.setState({establishment})
    console.log(establishment)
  };

  render = () => {
    const establishment = this.state.establishment;
    if (establishment) {
      return (
        <>
          <Box align="center">
            <Heading color="brand">Violations at {establishment.dba}</Heading>
            <Text>CAMIS: {this.state.camis}</Text>
            <ul className={styles.EstablishmentDetail}>
              <Accordion>
                {establishment.inspections.map(inspection => {
                  return (
                    <AccordionPanel
                      label={<AccordionLabel date={inspection.date} grade={inspection.grade} />}
                    >
                      <li key={inspection.date}>
                        <Box
                          pad="medium"
                          background="light-2"
                          style={{ textAlign: "left" }}
                        >
                          <ul className={styles.EstablishmentDetail}>
                            {inspection.violations.map(v => {
                              return (
                                <li key={inspection.date + v.code}>
                                  <p>
                                    {v.code} - {v.description}
                                  </p>
                                </li>
                              );
                            })}
                          </ul>
                        </Box>
                      </li>
                    </AccordionPanel>
                  );
                })}
              </Accordion>
            </ul>
          </Box>
        </>
      );
    } else {
      return <div>Loading violations for CAMIS: {this.state.camis}</div>;
    }
  };
}

export default EstablishmentDetail;
