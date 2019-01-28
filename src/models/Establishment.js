import axios from "axios";

const fetchDetails = async camis => {
  const response = await axios.get(
    "https://data.cityofnewyork.us/resource/9w7m-hzhe.json",
    { params: { camis } }
  );
  return response.data;
};
class Establishment {
  static near(lat, lng) {
    return [
      { camis: "40363098", dba: "Dunkin Donuts", grade: "A" },
      { camis: "40369608", dba: "River Cafe", grade: "B" },
      { camis: "40373272", dba: "Henry's End", grade: "A" },
      { camis: "40376635", dba: "Tripoli Restaurant", grade: "A" },
      { camis: "40376635", dba: "Clark's Restaurant", grade: "C" }
    ];
  }

  static async detail(camis) {
    const detailsData = await fetchDetails(camis);
    const aggViolations = violations => {
      return violations.map(violation => {
        return {
          code: violation.violation_code,
          description: violation.violation_description
        };
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
      inspections: aggInspections(detailsData).sort((a, b) => Date.parse(b.date) - Date.parse(a.date) )
    };

    if (establishmentDetail) {
      return establishmentDetail;
    } else {
      return null;
    }
  }
}

export default Establishment;
