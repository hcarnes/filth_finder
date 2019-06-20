export type Establishment = {
  id: string,
  dba: string,
  distance: number,
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

export type EstablishmentDetail = {
  dba: string;
  address: string;
  latestGrade?: string,
  inspections: InspectionResult[]
}

export interface IInspectionInfo {
  near(lng: number, lat: number, search?: string): Promise<Establishment[]>,
  detail(id: string): Promise<EstablishmentDetail>,
  renderGrade(grade: string | undefined, score: string, action: string): JSX.Element
}