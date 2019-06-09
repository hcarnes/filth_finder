import axios from "axios";
import haversine from "haversine-distance";
import {Establishment, EstablishmentDetail, IInspectionInfo} from "./IInspectionInfo";

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
  grade: string,
  inspection_date: string,
  latitude: string,
  name:string,
  phone:string,
  zip_code: string,
  inspection_score: string,
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

const fetchDetails = async (Business_ID: string) => {
  const response = await axios.get<EstablishmentInspectionResult[]>(
    "https://data.kingcounty.gov/resource/f29f-zza5.json",
    { params: { Business_ID } }
  );
  return response.data;
};

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
            code: violation.violation_type,
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
            score: groupedViolations[0].inspection_score,
            action: groupedViolations[0].inspection_closed_business ? "Closed by DOH" : "No action taken",
            date: groupedViolations[0].inspection_date,
            violations: aggViolations(groupedViolations),
          };
        }
      );
    };

    const establishmentDetail = {
      dba: detailsData[0].inspection_business_name,
      address: [
        detailsData[0].address,
        detailsData[0].city,
        detailsData[0].zip_code,
        "WA"
      ].join(" "),
      inspections: aggInspections(detailsData).sort(
        (a, b) => Date.parse(a.date) - Date.parse(b.date)
      )
    };
    
    return establishmentDetail;
  }
}

export default SeattleEstablishment;