import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import EstablishmentDetail from './components/EstablishmentDetail'
import EstablishmentSelector from './components/EstablishmentSelector'

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
