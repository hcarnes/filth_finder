import axios from "axios";
import haversine from "haversine-distance";
import {Establishment, EstablishmentDetail, IInspectionInfo} from "./IInspectionInfo";
import React from "react";

type LocationIndexEntry = {
  inspection_business_name: string,
  longitude: number,
  latitude: number,
  Business_ID: string,
}

type EstablishmentInspectionResult = {
  business_id: string,
  violation_type: string,
  description: string,
  inspection_closed_business: boolean,
  inspection_date: string,
  latitude: string,
  name:string,
  phone:string,
  zip_code: string,
  inspection_score: string,
  grade: string,
  violation_points: string,
  city: string,
  program_identifier: string,
  inspection_serial_num: string,
  inspection_result: string,
  address: string,
  violation_description: string,
  longitude:string,
  inspection_type: string,
  inspection_business_name:string,
  violation_record_id: string,
}

type SeattleEstablishment = Establishment
type CodeMapping = {
  [key: string] : string
}

const fetchDetails = async (Business_ID: string) => {
  const response = await axios.get<EstablishmentInspectionResult[]>(
    "https://data.kingcounty.gov/resource/f29f-zza5.json",
    { params: { Business_ID } }
  );
  return response.data;
};

const expandViolationDescription = (truncatedViolationDescription: string): string => {
  const [code, _rest] = truncatedViolationDescription.split(" - ");

  const codeMapping: CodeMapping = {
    "4000": "4000 - Food and non-food surfaces properly used and constructed; cleanable",
    "4100": "4100 - Warewashing facilities properly installed, maintained, used; test strips available and used",
    "5000": "5000 - Posting of permit; mobile establishment name easily visible",
    "1900": "1900 - No room temperature storage; proper use of time as a control",
    "1710": "1710 - Proper Hot Holding Temperatures (<135°F)",
    "2110": "2110 - Proper cold holding temperatures (>41°F)",
    "2120": "2120 - Proper cold holding temperatures between 42°F to 45°F",
    "2200": "2200 - Accurate thermometer provided and used to evaluate temperature of PHF (Potentially Hazardous Foods)",
    "3300": "3300 - Potential food contamination prevented during delivery, preparation, storage, display",
    "1400": "1400 - Raw meats below and away from RTE (Ready to Eat) food",
    "0500": "0500 - Proper barriers used to prevent bare hand contact with ready to eat foods",
    "2500": "2500 - Toxic substances properly identified, stored, used.",
  }

  return (codeMapping[code] || truncatedViolationDescription)
}
const codeToEmoji = (code: string): string => {
  switch (code) {
    case "BLUE": return "🔵";
    case "RED": return "🔴";
    default: return code;
  }
}

const SeattleEstablishment: IInspectionInfo = {
  async near(lng: number, lat: number, search?: string): Promise<Establishment[]> {
    const establishments = await axios.get<LocationIndexEntry[]>("https://data.kingcounty.gov/resource/f29f-zza5.json?$group=Business_ID,inspection_business_name,longitude,latitude&$select=Business_ID,inspection_business_name,longitude,latitude&$limit=50000")

    const establishmentsWithDistance = establishments.data.flatMap<Establishment>(e => {
      const distance = haversine({lat: e.latitude, lng: e.longitude}, {lat, lng})
      if (isNaN(distance)) {
        return []
      } else {
        return {distance, id: e.Business_ID, dba: e.inspection_business_name}
      }
    })

    const sortedEstablishments = establishmentsWithDistance.sort((a, b) => a.distance - b.distance);

    if (search) {
      return sortedEstablishments.filter((e) => e.dba && e.dba.toLowerCase().includes(search.toLowerCase())).slice(0, 20)
    } else {
      return sortedEstablishments.slice(0, 20)
    }
  },

  async detail(id: string): Promise<EstablishmentDetail> {
    const detailsData = await fetchDetails(id);
    const aggViolations = (violations: EstablishmentInspectionResult[]) => {
      return violations.flatMap(violation => {
        if (violation.violation_type && violation.violation_description) {
          return [{
            code: codeToEmoji(violation.violation_type),
            description: expandViolationDescription(violation.violation_description),
          }];
        } else {
          return [];
        }
      });
    };
    const aggInspections = (details: EstablishmentInspectionResult[]) => {
      const inspectionViolations = details.reduce((objectsByKeyValue, obj) => {
        const key = obj.inspection_date + obj.inspection_type; 
        objectsByKeyValue.set(key, (objectsByKeyValue.get(key) || []).concat(obj));

        return objectsByKeyValue;
      }, (new Map<string, EstablishmentInspectionResult[]>()));

      return Array.from(inspectionViolations.values()).map(
        groupedViolations => {
          return {
            score: groupedViolations[0].inspection_score,
            action: groupedViolations[0].inspection_closed_business ? "Closed by DOH" : "No action taken",
            date: groupedViolations[0].inspection_date,
            violations: aggViolations(groupedViolations),
          };
        }
      );
    };

    const gradeMapping: {[key: string]: string} = {
      "1": "Excellent",
      "2": "Good",
      "3": "Okay",
      "4": "Needs to Improve",
    }

    const latestGrade = (gradeMapping[(detailsData[0] && detailsData[0].grade)] || "Needs to Improve")

    const establishmentDetail = {
      dba: detailsData[0].inspection_business_name,
      address: [
        detailsData[0].address,
        detailsData[0].city,
        detailsData[0].zip_code,
        "WA"
      ].join(" "),
      latestGrade,
      inspections: aggInspections(detailsData).sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date)
      )
    };
    
    return establishmentDetail;
  },

  renderGrade(grade, score, action) {
    return <></>;
  }
}

export default SeattleEstablishment;