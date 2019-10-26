import axios from "axios";
import haversine from "haversine-distance";
import {Establishment, EstablishmentDetail, IInspectionInfo} from "./IInspectionInfo";
import React from "react";

type LocationIndexEntry = {
  dba: string,
  longitude: number,
  latitude: number,
  camis: string,
}

type EstablishmentInspectionResult = {
  critical_flag: string,
  building: string,
  score: string,
  violation_description: string,
  violation_code: string,
  record_date: string,
  camis: string,
  phone: string,
  zipcode: string,
  boro: string,
  dba: string,
  inspection_date: string,
  cuisine_description: string,
  street: string,
  inspection_type: string,
  action: string,
  grade?: string,
}

const fetchDetails = async (camis: string) => {
  const response = await axios.get<EstablishmentInspectionResult[]>(
    "https://data.cityofnewyork.us/resource/9w7m-hzhe.json",
    { params: { camis } }
  );
  return response.data;
};

type NYCEstablishment = Establishment

const NYCEstablishment: IInspectionInfo = {
  async near(lng: number, lat: number, search?: string): Promise<Establishment[]> {
    const establishments = await axios.get<LocationIndexEntry[]>(`https://storage.googleapis.com/filth-finder/index.json`);

    const establishmentsWithDistance = establishments.data.flatMap<Establishment>(e => {
      const distance = haversine({lat: e.latitude, lng: e.longitude}, {lat, lng})
      if (isNaN(distance)) {
        return []
      } else {
        return {distance, id: e.camis, dba: e.dba}
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
    const aggInspections = (details: EstablishmentInspectionResult[]) => {
      const inspectionViolations = details.reduce((objectsByKeyValue, obj) => {
        const key = obj.inspection_date + obj.inspection_type; 
        objectsByKeyValue.set(key, (objectsByKeyValue.get(key) || []).concat(obj));

        return objectsByKeyValue;
      }, (new Map<string, EstablishmentInspectionResult[]>()));

      return Array.from(inspectionViolations.values()).map(
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

    const aggedInspections = aggInspections(detailsData).sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date)
    )

    const latestGradedInspection = aggedInspections.find((x) => x.grade)
    const latestGrade = (latestGradedInspection && latestGradedInspection.grade)

    const establishmentDetail = {
      dba: detailsData[0].dba,
      address: [
        detailsData[0].building,
        detailsData[0].street,
        detailsData[0].boro,
        "NY",
        detailsData[0].zipcode
      ].join(" "),
      latestGrade,
      inspections: aggedInspections
    };
    
    return establishmentDetail;
  },

  renderGrade(grade, score, action) {
    if (action && action.includes("Closed")) {
      return (
        <span role="img" aria-label="Establishment closed">
          - &#x1F922;
        </span>
      );
    } else {
      if (grade && grade !== "Z") {
        return <>- {grade}</>
      } else if (score){
        return <span role="img" aria-label="Grade pending">- &#x23F3;</span>;
      } else {
        return <></>
      }
    }
  }
}

export default NYCEstablishment;