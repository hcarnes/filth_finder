import axios from "axios";
import haversine from "haversine-distance";

const fetchDetails = async camis => {
  const response = await axios.get(
    "https://data.cityofnewyork.us/resource/9w7m-hzhe.json",
    { params: { camis } }
  );
  return response.data;
};
class Establishment {
  static async near(lng, lat, search = null) {
    const establishments = await axios.get(`https://storage.googleapis.com/filth-finder/index.json`);

    const establishmentsWithDistance = establishments.data.flatMap(e => {
      const distance = haversine({lat: e.latitude, lng: e.longitude}, {lat, lng})
      if (isNaN(distance)) {
        return []
      } else {
        return {...e, distance}
      }
    })

    const sortedEstablishments = establishmentsWithDistance.sort((a, b) => a.distance - b.distance);

    if (search) {
      return sortedEstablishments.filter((e) => e.dba && e.dba.toLowerCase().includes(search.toLowerCase())).slice(0, 20)
    } else {
      return sortedEstablishments.slice(0, 20)
    }  
  }

  static async detail(camis) {
    const detailsData = await fetchDetails(camis);
    const aggViolations = violations => {
      return violations.flatMap(violation => {
        if (violation.violation_code && violation.violation_description) {
          return [{
            code: violation.violation_code,
            description: violation.violation_description,
          }];
        } else {
          return [];
        }
      });
    };
    const aggInspections = details => {
      const inspectionViolations = details.reduce((objectsByKeyValue, obj) => {
        const value = obj["inspection_date"] + obj["inspection_type"]; 
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});
      return Object.values(inspectionViolations).map(
        groupedViolations => {
          return {
            grade: groupedViolations[0].grade,
            score: groupedViolations[0].score,
            action: groupedViolations[0].action,
            date: groupedViolations[0].inspection_date,
            violations: aggViolations(groupedViolations),
          };
        }
      );
    };

    const establishmentDetail = {
      dba: detailsData[0].dba,
      inspections: aggInspections(detailsData).sort(
        (a, b) => Date.parse(a.date) - Date.parse(b.date)
      )
    };

    if (establishmentDetail) {
      return establishmentDetail;
    } else {
      return null;
    }
  }
}

export default Establishment;
