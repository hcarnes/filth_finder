export const seattleLocation = {lat: 47.608013, lng: -122.335167};
export const nycLocation = {lat: 40.7128,lng: -74.0060};

export type CityLocations = {
  nyc: {
    lat: number,
    lng: number
  },
  seattle: {
    lat: number,
    lng: number
  }
}
export const CityLocations: CityLocations = {
  nyc: nycLocation,
  seattle: seattleLocation,
}