import { computePatientAge, toIsoDateOnly } from "@/lib/patient-age";
import { AbhaNumber } from "@/types/abha_number";
import { OrganizationParent, OrganizationRead } from "@/types/base";
import { EncounterClass, EncounterRetrieve } from "@/types/encounter";
import { PatientRetrieve } from "@/types/patient";
import { format } from "date-fns";

import {
  CreateSastSubmissionFormValues,
  SastSubmissionPayloadPrefill,
} from "./schema";
import {
  getDistrict,
  getTaluk,
  resolveDistrictName,
  resolveStateName,
  resolveTalukName,
} from "./geo";

const IP_OP_BY_ENCOUNTER_CLASS: Partial<Record<EncounterClass, string>> = {
  imp: "IP",
  amb: "OP",
  emer: "OP",
  obsenc: "OP",
  vr: "OP",
  hh: "OP",
};

/** Map CARE patient gender to the SAST gateway choices. */
function mapGender(
  gender: PatientRetrieve["gender"]
): SastSubmissionPayloadPrefill["gender"] {
  switch (gender) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    case "non_binary":
    case "transgender":
      return "Others";
    default:
      return "";
  }
}

function toTenDigitMobile(phoneNumber?: string): string {
  const digits = (phoneNumber ?? "").replace(/\D/g, "");
  return digits.slice(-10);
}

function isOrganizationRead(
  value: OrganizationRead | Record<string, never>
): value is OrganizationRead {
  return "id" in value && "name" in value;
}

function isOrganizationParent(
  value: OrganizationParent | Record<string, never>
): value is OrganizationParent {
  return "id" in value && "level_cache" in value;
}

type GeoOrgNode = {
  name: string;
  level_cache: number;
  metadata: Record<string, unknown>;
};

/** Walk from patient's geo_organization up through parents. */
function collectGeoOrganizationChain(
  geo: OrganizationRead | Record<string, never>
): GeoOrgNode[] {
  if (!isOrganizationRead(geo)) {
    return [];
  }

  const chain: GeoOrgNode[] = [];
  let current: OrganizationRead | OrganizationParent | undefined = geo;

  while (current && "level_cache" in current) {
    chain.push({
      name: current.name,
      level_cache: current.level_cache,
      metadata: current.metadata ?? {},
    });

    const parent: OrganizationParent | Record<string, never> =
      current.parent;
    if (!isOrganizationParent(parent)) {
      break;
    }
    current = parent;
  }

  return chain;
}

function geoNodeAtLevel(
  chain: GeoOrgNode[],
  level: number
): GeoOrgNode | undefined {
  return chain.find((node) => node.level_cache === level);
}

function metadataCode(
  node: GeoOrgNode | undefined,
  ...keys: string[]
): string {
  if (!node) {
    return "";
  }
  for (const key of keys) {
    const value = node.metadata[key];
    if (typeof value === "string") {
      return value;
    }
  }
  return "";
}

/** level_cache 0 = state, 1 = district, 2 = taluk; deeper levels = village/locality. */
function resolveGeoFromOrganization(
  geo: OrganizationRead | Record<string, never>
) {
  const chain = collectGeoOrganizationChain(geo);
  const state = geoNodeAtLevel(chain, 0);
  const district = geoNodeAtLevel(chain, 1);
  const taluk = geoNodeAtLevel(chain, 2);
  const village =
    geoNodeAtLevel(chain, 3) ??
    (chain[0] && chain[0].level_cache > 2 ? chain[0] : undefined);

  return {
    stateName: state?.name ?? "",
    districtName: district?.name ?? "",
    talukName: taluk?.name ?? "",
    districtCode: metadataCode(district, "code", "district_code"),
    talukCode: metadataCode(taluk, "code", "taluk_code"),
    villageName: village?.name ?? "",
  };
}

function mapPatientPayload(
  patient: PatientRetrieve,
  encounter: EncounterRetrieve,
  abhaNumber?: AbhaNumber
): SastSubmissionPayloadPrefill {
  const { age, age_time } = computePatientAge(
    patient.date_of_birth,
    patient.year_of_birth
  );
  const geo = patient.geo_organization;
  const geoLevels = resolveGeoFromOrganization(geo);
  const today = format(new Date(), "yyyy-MM-dd");

  // Canonicalise geo names so they match the dropdown dataset, and prefer
  // dataset codes (gateway TALUKID / district code) when available.
  const stateName = resolveStateName(
    abhaNumber?.state || geoLevels.stateName
  );
  const districtName = resolveDistrictName(
    stateName,
    abhaNumber?.district || geoLevels.districtName
  );
  const talukName = resolveTalukName(
    stateName,
    districtName,
    geoLevels.talukName
  );
  const districtCode =
    getDistrict(stateName, districtName)?.code || geoLevels.districtCode;
  const talukCode =
    getTaluk(stateName, districtName, talukName)?.id || geoLevels.talukCode;

  return {
    patient_name: patient.name,
    age,
    age_time,
    dob: toIsoDateOnly(patient.date_of_birth),
    gender: mapGender(patient.gender),
    mobile: toTenDigitMobile(patient.phone_number),
    email: abhaNumber?.email ?? "",
    address: patient.address ?? patient.permanent_address ?? "",
    pincode: patient.pincode != null ? String(patient.pincode) : "",
    patient_country: "India",
    patient_state: stateName,
    patient_district: districtName,
    patient_village: geoLevels.villageName,
    patient_taluk: talukName,
    district_name: districtName,
    district_code: districtCode,
    taluk_name: talukName,
    taluk_code: talukCode,
    doa: toIsoDateOnly(encounter.period.start) || today,
    date_reporting_nwh: today,
    patient_ip_no:
      encounter.external_identifier ?? encounter.id ?? patient.id,
    prt_pa_id: "",
    ip_op: IP_OP_BY_ENCOUNTER_CLASS[encounter.encounter_class] ?? "",
    abha_id: abhaNumber?.health_id ?? abhaNumber?.abha_number ?? "",
    abha_address: abhaNumber?.health_id ?? "",
    family_head_name: "",
    payer_zone: "",
    family_type: "",
    family_card_type: "",
    family_card_no: "",
    caste: "",
    relation_with_head: "",
    marital_status: "",
    referral_type: "",
  };
}

export function buildSastSubmissionFormDefaults(
  facilityId: string,
  patientId: string,
  encounterId: string,
  encounter: EncounterRetrieve,
  options?: {
    abhaNumber?: AbhaNumber;
  }
): CreateSastSubmissionFormValues {
  const patient = encounter.patient;

  return {
    facility: facilityId,
    patient: patientId,
    encounter: encounterId,
    tpa_code: "",
    health_scheme: "",
    payload: mapPatientPayload(
      patient,
      encounter,
      options?.abhaNumber
    ) as CreateSastSubmissionFormValues["payload"],
  };
}

export function mergeAbhaIntoPayload(
  payload: CreateSastSubmissionFormValues["payload"],
  abhaNumber: AbhaNumber
): CreateSastSubmissionFormValues["payload"] {
  const patient_state = resolveStateName(
    payload.patient_state || abhaNumber.state || ""
  );
  const patient_district = resolveDistrictName(
    patient_state,
    payload.patient_district || abhaNumber.district || ""
  );

  return {
    ...payload,
    email: payload.email || abhaNumber.email || "",
    abha_id: abhaNumber.health_id || abhaNumber.abha_number || payload.abha_id,
    abha_address: abhaNumber.health_id || payload.abha_address,
    patient_state,
    patient_district,
    district_name: patient_district || payload.district_name,
    pincode: payload.pincode || (abhaNumber.pincode ?? ""),
    address: payload.address || abhaNumber.address || "",
  };
}
