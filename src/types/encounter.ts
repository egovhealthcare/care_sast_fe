import { Coding, Period, TagConfigRead } from "./base";
import { FacilityBareMinimum } from "./facility";
import { PatientList, PatientRetrieve } from "./patient";
import { RetrieveUser } from "./user";

export type EncounterStatus =
  | "planned"
  | "in_progress"
  | "on_hold"
  | "discharged"
  | "completed"
  | "cancelled"
  | "discontinued"
  | "entered_in_error"
  | "unknown";

export type EncounterClass =
  | "imp"
  | "amb"
  | "obsenc"
  | "emer"
  | "vr"
  | "hh";

export type EncounterPriority =
  | "ASAP"
  | "callback_results"
  | "callback_for_scheduling"
  | "elective"
  | "emergency"
  | "preop"
  | "as_needed"
  | "routine"
  | "rush_reporting"
  | "stat"
  | "timing_critical"
  | "use_as_directed"
  | "urgent";

export type AdmitSource =
  | "hosp_trans"
  | "emd"
  | "outp"
  | "born"
  | "gp"
  | "mp"
  | "nursing"
  | "psych"
  | "rehab"
  | "other";

export type DischargeDisposition =
  | "home"
  | "alt_home"
  | "other_hcf"
  | "hosp"
  | "long"
  | "aadvice"
  | "exp"
  | "psy"
  | "rehab"
  | "snf"
  | "oth";

export type DietPreference =
  | "vegetarian"
  | "dairy_free"
  | "nut_free"
  | "gluten_free"
  | "vegan"
  | "halal"
  | "kosher"
  | "none";

export interface Hospitalization {
  re_admission: boolean | null;
  admit_source: AdmitSource | null;
  discharge_disposition: DischargeDisposition | null;
  diet_preference: DietPreference | null;
}

export interface HistoryEntry {
  status: string;
  moved_at: string;
}

export interface StatusHistory {
  history: HistoryEntry[];
}

export interface EncounterClassHistory {
  history: HistoryEntry[];
}

export type FacilityOrganizationType =
  | "dept"
  | "team"
  | "root"
  | "role"
  | "other";

export interface FacilityOrganizationRead {
  id: string;
  active: boolean;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  org_type: FacilityOrganizationType;
  parent: Record<string, unknown> | string | null;
  system_generated: boolean;
  level_cache: number;
  has_children: boolean;
  created_by: RetrieveUser | null;
  updated_by: RetrieveUser | null;
  version: number;
}

export type LocationStatus = "active" | "inactive" | "unknown";

export type LocationOperationalStatus = "C" | "H" | "O" | "U" | "K" | "I";

export type LocationMode = "instance" | "kind";

export type LocationForm =
  | "si"
  | "bu"
  | "wi"
  | "wa"
  | "lvl"
  | "co"
  | "ro"
  | "bd"
  | "ve"
  | "ho"
  | "ca"
  | "rd"
  | "area"
  | "jdn"
  | "vi";

export type LocationAvailabilityStatus = "available" | "reserved";

export type LocationEncounterStatus =
  | "planned"
  | "active"
  | "reserved"
  | "completed";

export interface FacilityLocationMinimal {
  id: string;
  status: LocationStatus;
  operational_status: LocationOperationalStatus;
  name: string;
  description: string;
  location_type: Coding | null;
  form: LocationForm;
  sort_index: number | null;
  parent: FacilityLocationMinimal | Record<string, never>;
  mode: string;
  has_children: boolean;
  system_availability_status: string;
  version: number;
}

export interface EncounterList {
  id: string;
  status: EncounterStatus;
  encounter_class: EncounterClass;
  patient: PatientList;
  facility: FacilityBareMinimum;
}

export interface FacilityLocationList extends FacilityLocationMinimal {
  current_encounter: EncounterList | null;
}

export interface FacilityLocationEncounterWithLocation {
  id: string;
  encounter: string;
  start_datetime: string;
  end_datetime: string | null;
  status: LocationEncounterStatus;
  location: FacilityLocationList;
  version: number;
}

export interface CareTeamMember {
  member: RetrieveUser;
  role: Coding;
}

export type BookingStatus =
  | "proposed"
  | "pending"
  | "booked"
  | "arrived"
  | "fulfilled"
  | "cancelled"
  | "noshow"
  | "entered_in_error"
  | "checked_in"
  | "waitlist"
  | "in_consultation"
  | "rescheduled";

export type SchedulableResourceType =
  | "practitioner"
  | "location"
  | "healthcare_service";

export interface TokenSlot {
  id: string;
  availability: {
    name: string;
    tokens_per_slot: number;
    id: string;
    schedule: { name: string; id: string };
  };
  start_datetime: string;
  end_datetime: string;
  allocated: number;
  version: number;
}

export type HealthcareServiceInternalType =
  | "pharmacy"
  | "lab"
  | "scheduling"
  | "store";

export interface HealthcareServiceRead {
  id: string;
  service_type: Coding | null;
  internal_type: HealthcareServiceInternalType | null;
  name: string;
  styling_metadata: Record<string, unknown>;
  extra_details: string;
  version: number;
}

export interface TokenRead {
  id: string;
  category: Record<string, unknown>;
  sub_queue: Record<string, unknown>;
  note: string;
  patient: PatientList;
  number: number;
  status: string;
  queue: Record<string, unknown>;
  version: number;
}

export interface TokenBookingRead {
  id: string;
  token_slot: TokenSlot;
  booked_on: string;
  booked_by: RetrieveUser;
  status: BookingStatus | string;
  note: string;
  resource_type: SchedulableResourceType;
  resource:
    | RetrieveUser
    | HealthcareServiceRead
    | FacilityLocationList
    | Record<string, never>;
  facility: FacilityBareMinimum;
  created_by: RetrieveUser | null;
  updated_by: RetrieveUser | null;
  created_date: string;
  modified_date: string;
  token: TokenRead | null;
  tags: TagConfigRead[];
  charge_item: Record<string, unknown> | null;
  patient: PatientRetrieve;
  version: number;
}

export interface EncounterRetrieve {
  id: string;
  status: EncounterStatus;
  encounter_class: EncounterClass;
  period: Period;
  hospitalization: Hospitalization | Record<string, never>;
  priority: EncounterPriority;
  external_identifier: string | null;
  discharge_summary_advice: string | null;
  status_history: StatusHistory;
  encounter_class_history: EncounterClassHistory;
  patient: PatientRetrieve;
  facility: FacilityBareMinimum;
  appointment: TokenBookingRead | Record<string, never>;
  organizations: FacilityOrganizationRead[];
  current_location: FacilityLocationMinimal | null;
  location_history: FacilityLocationEncounterWithLocation[];
  care_team: CareTeamMember[];
  tags: TagConfigRead[];
  extensions: Record<string, unknown>;
  permissions: string[];
  created_date: string;
  modified_date: string;
  created_by: RetrieveUser | Record<string, never>;
  updated_by: RetrieveUser | Record<string, never>;
  version: number;
}
