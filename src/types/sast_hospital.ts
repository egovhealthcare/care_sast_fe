export interface SASTHospitalCreateRequest {
  code: string;
  facility: string;
}

export interface SASTHospitalUpdateRequest {
  code: string;
}

export interface SASTHospitalListParams {
  code?: string;
  facility?: string;
}

export interface SASTHospitalRetrieve {
  id: string;
  code: string;
  facility: string;
  created_date: string;
  modified_date: string;
}
