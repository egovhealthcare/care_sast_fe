import { OrganizationRead, TagConfigRead } from "./base";
import { RetrieveUser } from "./user";

export type Gender = "male" | "female" | "non_binary" | "transgender";

export type BloodGroup =
  | "A_negative"
  | "A_positive"
  | "B_negative"
  | "B_positive"
  | "AB_negative"
  | "AB_positive"
  | "O_negative"
  | "O_positive"
  | "unknown";

export type PatientIdentifierUse =
  | "usual"
  | "official"
  | "temp"
  | "secondary"
  | "old";

export type PatientIdentifierStatus = "draft" | "active" | "inactive";

export interface PatientIdentifierRetrieveConfig {
  retrieve_with_dob: boolean;
  retrieve_with_year_of_birth: boolean;
  retrieve_with_otp: boolean;
  retrieve_partial_search: boolean;
}

export interface IdentifierConfig {
  use: PatientIdentifierUse;
  description: string;
  system: string;
  required: boolean;
  unique: boolean;
  regex: string;
  display: string;
  retrieve_config: PatientIdentifierRetrieveConfig;
  default_value: string | null;
  auto_maintained: boolean;
}

export interface PatientIdentifierConfig {
  id: string;
  config: IdentifierConfig;
  status: PatientIdentifierStatus;
  version: number;
}

export interface PatientIdentifierEntry {
  config: PatientIdentifierConfig;
  value: string;
}

export interface PatientRetrieve {
  id: string;
  name: string;
  gender: Gender;
  phone_number: string;
  emergency_phone_number: string | null;
  address: string | null;
  permanent_address: string | null;
  pincode: number | null;
  deceased_datetime: string | null;
  blood_group: BloodGroup | null;
  date_of_birth: string | null;
  year_of_birth: number | null;
  geo_organization: OrganizationRead | Record<string, never>;
  instance_identifiers: PatientIdentifierEntry[];
  facility_identifiers: PatientIdentifierEntry[];
  instance_tags: TagConfigRead[];
  facility_tags: TagConfigRead[];
  extensions: Record<string, unknown>;
  permissions: string[];
  created_date: string;
  modified_date: string;
  created_by: RetrieveUser | null;
  updated_by: RetrieveUser | null;
  version: number;
}

export interface PatientRetrieveParams {
  facility?: string;
}

/** Shallow patient shape embedded in list/token responses */
export interface PatientList {
  id: string;
  name: string;
  gender: Gender;
  phone_number: string;
  date_of_birth: string | null;
  year_of_birth: number | null;
}
