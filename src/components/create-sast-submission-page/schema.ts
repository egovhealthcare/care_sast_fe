import { z } from "zod";

export const SAST_AGE_TIME_CHOICES = ["Years", "Months", "Days"] as const;

const isoDateSchema = z
  .string()
  .min(1, "Required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

const optionalIsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
  .optional()
  .or(z.literal(""));

const optionalStringSchema = z.string().optional().or(z.literal(""));

export const sastSubmissionPayloadFormSchema = z.object({
  hosp_code: z.string().min(1, "Hospital code is required"),
  patient_name: z.string().min(1, "Patient name is required"),
  age: z.coerce.number().int().nonnegative("Age must be 0 or greater"),
  age_time: z.enum(SAST_AGE_TIME_CHOICES),
  dob: isoDateSchema,
  gender: z.string().min(1, "Gender is required"),
  family_head_name: z.string().min(1, "Family head name is required"),
  payer_zone: z.string().min(1, "Payer zone is required"),
  family_type: z.string().min(1, "Family type is required"),
  family_card_type: z.string().min(1, "Family card type is required"),
  family_card_no: z.string().min(1, "Family card number is required"),
  caste: z.string().min(1, "Caste is required"),
  relation_with_head: z.string().min(1, "Relation with head is required"),
  card_issue_date: optionalIsoDateSchema,
  date_reporting_nwh: isoDateSchema,
  marital_status: z.string().min(1, "Marital status is required"),
  is_child: z.boolean().optional().nullable(),
  mobile: z.string().min(1, "Mobile is required"),
  email: optionalStringSchema,
  prt_pa_id: z.string().min(1, "PRT PA ID is required"),
  patient_ip_no: z.string().min(1, "Patient IP number is required"),
  address: z.string().min(1, "Address is required"),
  patient_village: z.string().min(1, "Village is required"),
  patient_taluk: z.string().min(1, "Taluk is required"),
  patient_district: z.string().min(1, "District is required"),
  patient_state: z.string().min(1, "State is required"),
  patient_country: z.string().min(1, "Country is required"),
  pincode: z.string().min(1, "Pincode is required"),
  insurance_code: optionalStringSchema,
  referral_type: z.string().min(1, "Referral type is required"),
  date_of_referral: optionalIsoDateSchema,
  referral_id: optionalStringSchema,
  referral_remarks: optionalStringSchema,
  upload_file1_file: z.instanceof(File, { message: "Upload file 1 is required" }),
  upload_file2_file: z.instanceof(File, { message: "Upload file 2 is required" }),
  upload_file1_remarks: optionalStringSchema,
  upload_file2_remarks: optionalStringSchema,
  smart_card_verified_by: optionalStringSchema,
  department: optionalStringSchema,
  designation: optionalStringSchema,
  uid_number: optionalStringSchema,
  kgid: optionalStringSchema,
  photo_file: z.instanceof(File, { message: "Photo is required" }),
  family_head_dob: optionalIsoDateSchema,
  national_identity_type: optionalStringSchema,
  national_identity_no: optionalStringSchema,
  doa: isoDateSchema,
  accident_victim: optionalStringSchema,
  is_aadhaar_verified: optionalStringSchema,
  mode_of_verify: optionalStringSchema,
  acid_victim: optionalStringSchema,
  abha_id: optionalStringSchema,
  abha_address: optionalStringSchema,
  ip_op: optionalStringSchema,
  ben_fetch_card_type: optionalStringSchema,
  ors_id: optionalStringSchema,
  ors_ref_from_hosp: optionalStringSchema,
  district_code: z.string().min(1, "District code is required"),
  district_name: z.string().min(1, "District name is required"),
  taluk_code: z.string().min(1, "Taluk code is required"),
  taluk_name: z.string().min(1, "Taluk name is required"),
  is_dengue: optionalStringSchema,
  nhm_id: optionalStringSchema,
  scan_type: optionalStringSchema,
  kfd: optionalStringSchema,
  kutumba_family_id: optionalStringSchema,
  mobile_verified_flag: optionalStringSchema,
  kutumba_caste_e: optionalStringSchema,
  parent_name: optionalStringSchema,
  parent_age: z.coerce.number().int().nonnegative().optional().nullable(),
  parent_dob: optionalIsoDateSchema,
  parent_gender: optionalStringSchema,
  parent_age_time: optionalStringSchema,
  vrn: optionalStringSchema,
  masked_aadhaar: optionalStringSchema,
});

export const createSastSubmissionFormSchema = z.object({
  facility: z.string().uuid(),
  patient: z.string().uuid(),
  encounter: z.string().uuid(),
  tpa_code: z.string().min(1, "TPA code is required"),
  health_scheme: z.string().min(1, "Health scheme is required"),
  payload: sastSubmissionPayloadFormSchema,
});

export type CreateSastSubmissionFormValues = z.infer<
  typeof createSastSubmissionFormSchema
>;

export type SastSubmissionPayloadFormValues = z.infer<
  typeof sastSubmissionPayloadFormSchema
>;

/** Payload fields populated before file inputs are set */
export type SastSubmissionPayloadPrefill = Omit<
  SastSubmissionPayloadFormValues,
  "upload_file1_file" | "upload_file2_file" | "photo_file"
>;
