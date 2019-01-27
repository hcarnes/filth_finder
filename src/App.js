import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const EstablishmentSelector = () => {
  return (
    <>
      <Link to="/12345">Hanny Cafe</Link>
    </>
  );
};
const EstablishmentDetail = ({ match }) => <h2>CAMID: {match.params.camid}</h2>;

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={EstablishmentSelector} />
          <Route path="/:camid" component={EstablishmentDetail} />
        </div>
      </Router>
    );
  }
}

export default App;
