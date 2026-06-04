export type SASTSubmissionStatus =
  | "pending"
  | "submitted"
  | "failed"
  | "completed";

export interface SASTSubmissionPayload {
  hosp_code: string;
  patient_name: string;
  age: number;
  age_time: string;
  dob: string;
  gender: string;
  family_head_name: string;
  payer_zone: string;
  family_type: string;
  family_card_type: string;
  family_card_no: string;
  caste: string;
  relation_with_head: string;
  card_issue_date?: string | null;
  date_reporting_nwh: string;
  marital_status: string;
  is_child?: boolean | null;
  mobile: string;
  email?: string | null;
  prt_pa_id: string;
  patient_ip_no: string;
  address: string;
  patient_village: string;
  patient_taluk: string;
  patient_district: string;
  patient_state: string;
  patient_country: string;
  pincode: string;
  insurance_code?: string | null;
  referral_type: string;
  date_of_referral?: string | null;
  referral_id?: string | null;
  referral_remarks?: string | null;
  upload_file1: string;
  upload_file2: string;
  upload_file1_remarks?: string | null;
  upload_file2_remarks?: string | null;
  upload_file1_filetype: string;
  upload_file2_filetype: string;
  smart_card_verified_by?: string | null;
  department?: string | null;
  designation?: string | null;
  uid_number?: string | null;
  kgid?: string | null;
  photo: string;
  family_head_dob?: string | null;
  national_identity_type?: string | null;
  national_identity_no?: string | null;
  doa: string;
  accident_victim?: string | null;
  is_aadhaar_verified?: string | null;
  mode_of_verify?: string | null;
  acid_victim?: string | null;
  abha_id?: string | null;
  abha_address?: string | null;
  ip_op?: string | null;
  ben_fetch_card_type?: string | null;
  ors_id?: string | null;
  ors_ref_from_hosp?: string | null;
  district_code: string;
  district_name: string;
  taluk_code: string;
  taluk_name: string;
  is_dengue?: string | null;
  nhm_id?: string | null;
  scan_type?: string | null;
  kfd?: string | null;
  kutumba_family_id?: string | null;
  mobile_verified_flag?: string | null;
  kutumba_caste_e?: string | null;
  parent_name?: string | null;
  parent_age?: number | null;
  parent_dob?: string | null;
  parent_gender?: string | null;
  parent_age_time?: string | null;
  vrn?: string | null;
  masked_aadhaar?: string | null;
}

export interface SASTSubmissionCreateRequest {
  facility: string;
  patient: string;
  encounter: string;
  tpa_code: string;
  health_scheme: string;
  payload: SASTSubmissionPayload;
}

export interface SASTSubmissionListParams {
  facility?: string;
  patient?: string;
  encounter?: string;
  status?: SASTSubmissionStatus;
  limit?: number;
  offset?: number;
}

export interface SASTSubmissionListItem {
  id: string;
  facility: string;
  patient: string;
  encounter: string;
  tpa_code: string;
  health_scheme: string;
  status: SASTSubmissionStatus;
  hmis_id: string | null;
  ab_ark_id: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  created_date: string | null;
  modified_date: string | null;
  version: number;
}

interface SASTSubmissionCallbackResponse {
  hmis_id: string;
  ab_ark_id: string;
  hosp_code: string;
  patient_name: string;
  age: number;
  age_time: string;
  dob: string;
  gender: string | null;
}

export interface SASTSubmissionRetrieve extends SASTSubmissionListItem {
  payload: SASTSubmissionPayload | null;
  errors: string[] | null;
  response: SASTSubmissionCallbackResponse | null;
}

