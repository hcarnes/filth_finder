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
      address: [
        detailsData[0].building,
        detailsData[0].street,
        detailsData[0].boro,
        "NY",
        detailsData[0].zipcode
      ].join(" "),
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

// {
//       "grade" : "C",
//       "phone" : "9293377732",
//       "violation_description" : "Food contact surface not properly washed, rinsed and sanitized after each use and following any activity when contamination may have occurred.",
//       "zipcode" : "11201",
//       "score" : "33",
//       "dba" : "PINTO",
//       "boro" : "BROOKLYN",
//       "street" : "MONTAGUE ST",
//       "grade_date" : "2018-06-04T00:00:00.000",
//       "action" : "Violations were cited in the following area(s).",
//       "inspection_date" : "2018-06-04T00:00:00.000",
//       "critical_flag" : "Critical",
//       "cuisine_description" : "Thai",
//       "violation_code" : "06D",
//       "building" : "128",
//       "camis" : "50045118",
//       "record_date" : "2019-05-17T06:01:02.000",
//       "inspection_type" : "Cycle Inspection / Re-inspection"
//    },