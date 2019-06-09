import axios from "axios";
import haversine from "haversine-distance";

type LocationIndexEntry = {
  dba: string,
  longitude: number,
  latitude: number,
  camis: string,
}

type Establishment = LocationIndexEntry & {
  distance: number
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

type Violation = {
  code: string,
  description: string
}

type InspectionResult = {
  grade?: string;
  score: string;
  action: string;
  date: string;
  violations: Violation[]
}

type EstablishmentDetail = {
  dba: string;
  address: string;
  inspections: InspectionResult[]
}

interface IInspectionInfo {
  near(lng: number, lat: number, search?: string): Promise<Establishment[]>,
  detail(camis: string): Promise<EstablishmentDetail>
}

const fetchDetails = async (camis: string) => {
  const response = await axios.get<EstablishmentInspectionResult[]>(
    "https://data.cityofnewyork.us/resource/9w7m-hzhe.json",
    { params: { camis } }
  );
  return response.data;
};


const Establishment: IInspectionInfo = {
  async near(lng: number, lat: number, search?: string): Promise<Establishment[]> {
    const establishments = await axios.get<LocationIndexEntry[]>(`https://storage.googleapis.com/filth-finder/index.json`);

    const establishmentsWithDistance = establishments.data.flatMap<Establishment>(e => {
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
  },

  async detail(camis: string): Promise<EstablishmentDetail> {
    const detailsData = await fetchDetails(camis);
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
    
    return establishmentDetail;
  }
}

export default Establishment;