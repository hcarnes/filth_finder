import axios from "axios";

const fetchDetails = async camis => {
  const response = await axios.get(
    "https://data.cityofnewyork.us/resource/9w7m-hzhe.json",
    { params: { camis } }
  );
  return response.data;
};
class Establishment {
  static async near(lng, lat, search = "") {
    const establishments = await axios.get(`https://storage.googleapis.com/filth-finder/index.json`);

    return establishments.data;
  }

  static async detail(camis) {
    const detailsData = await fetchDetails(camis);
    const aggViolations = violations => {
      return violations.flatMap(violation => {
        if (violation.violation_code && violation.violation_description) {
          return [{
            code: violation.violation_code,
            description: violation.violation_description
          }];
        } else {
          return [];
        }
      });
    };
    const aggInspections = details => {
      const violationDateBuckets = details.reduce((objectsByKeyValue, obj) => {
        const value = obj["inspection_date"];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});
      return Object.values(violationDateBuckets).map(
        violationsByInspectionDate => {
          return {
            grade: violationsByInspectionDate[0].grade,
            date: violationsByInspectionDate[0].inspection_date,
            violations: aggViolations(violationsByInspectionDate)
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
