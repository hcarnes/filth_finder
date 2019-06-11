import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import EstablishmentDetail from './components/EstablishmentDetail'
import EstablishmentSelector from './components/EstablishmentSelector'
import CityPicker from './components/CityPicker'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={CityPicker} />
          <Route path="/:city" exact component={EstablishmentSelector}/>
          <Route path="/:city/:id" component={EstablishmentDetail} />
        </div>
      </Router>
    );
  }
}

export default App;
