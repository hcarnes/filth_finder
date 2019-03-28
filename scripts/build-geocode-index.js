import axios from "axios"
import {Storage} from '@google-cloud/storage'

async function updateGeocodedEstablishmentsIndex() {
  const establishmentListing = await axios.get("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$group=camis,boro,building,street,zipcode,dba&$select=camis,boro,building,street,zipcode,dba&$limit=50000")

  const geocodedEstablishments = []
  let numberGeocoded = 0
  
  // Use for of so we don't try to send 50k requests at once
  for (const establishment of establishmentListing.data) {
    try {
      const location = await axios.get(`https://api.cityofnewyork.us/geoclient/v1/address.json?houseNumber=${establishment.building}&street=${establishment.street}&borough=${establishment.boro}&app_id=dc074185&app_key=5538af0b4a556296c7b536df853f8697`)
      const geocodedEstablishment = {
        camis: establishment.camis,
        dba: establishment.dba,
        latitude: location.data.address.latitude,
        longitude: location.data.address.longitude
      }
      geocodedEstablishments.push(geocodedEstablishment)
      numberGeocoded += 1
      if (numberGeocoded % 10 == 0) console.log("Geocoded %d establishments", numberGeocoded)
    } catch(err) {
      console.log(`encountered error: ${err} when geocoding %j`, establishment)
    }
  }
  
  storeToGCS(geocodedEstablishments)
}

function storeToGCS(indexArray) {
  const storage = new Storage({
    projectId: 'filth-finder',
  });
  
  const bucketName = 'filth-finder';

  const indexFile =  storage.bucket(bucketName).file("index.json")
  const indexWriteStream = indexFile.createWriteStream({
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=86400',
    },
  })
  
  indexWriteStream.on("finish", () => console.log("Stored %d establishments to the index", indexArray.length))
  indexWriteStream.write(JSON.stringify(indexArray))
  indexWriteStream.end()
}
  
updateGeocodedEstablishmentsIndex()