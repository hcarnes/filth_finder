import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import EstablishmentDetail from "./components/EstablishmentDetail";
import EstablishmentSelector from "./components/EstablishmentSelector";
import CityPicker from "./components/CityPicker";
import { geolocated } from "react-geolocated";
import haversine from "haversine-distance";
import { seattleLocation, nycLocation } from './models/Locations'

const App = (props) => {

  const getNearestCity = (props) => {
    const distanceFromSeattle = haversine({lat: props.coords.latitude, lng: props.coords.longitude}, {lat: seattleLocation.lat, lng: seattleLocation.lng});
    const distanceFromNYC = haversine({lat: props.coords.latitude, lng: props.coords.longitude}, {lat: nycLocation.lat, lng: nycLocation.lng});

    return distanceFromSeattle < distanceFromNYC ? "/seattle" : "/nyc";
  }

  return (
    <Router>
      <div className="App">
        <Route exact path="/" render={() => (props.coords) ? (<Redirect to={getNearestCity(props)}/>) : (<CityPicker/>)} />
        <Route exact path="/:city" render={(routeProps) => <EstablishmentSelector {...routeProps} coords={props.coords} isGeolocationAvailable={props.isGeolocationAvailable} isGeolocationEnabled={props.isGeolocationEnabled}/>} />
        <Route path="/:city/:id" component={EstablishmentDetail} />
      </div>
    </Router>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 60000
})(App);
