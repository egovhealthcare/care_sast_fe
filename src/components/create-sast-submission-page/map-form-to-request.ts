import {
  fileToBase64,
  getFileTypeFromFile,
  nullIfEmpty,
} from "@/lib/file-to-base64";
import { SASTSubmissionCreateRequest } from "@/types/sast_submission";

import { CreateSastSubmissionFormValues } from "./schema";

export async function mapFormToCreateRequest(
  values: CreateSastSubmissionFormValues
): Promise<SASTSubmissionCreateRequest> {
  const {
    upload_file1_file,
    upload_file2_file,
    photo_file,
    ...payloadFields
  } = values.payload;

  const [upload_file1, upload_file2, photo] = await Promise.all([
    fileToBase64(upload_file1_file),
    fileToBase64(upload_file2_file),
    fileToBase64(photo_file),
  ]);

  return {
    facility: values.facility,
    patient: values.patient,
    encounter: values.encounter,
    tpa_code: values.tpa_code,
    health_scheme: values.health_scheme,
    payload: {
      ...payloadFields,
      upload_file1,
      upload_file2,
      upload_file1_filetype: getFileTypeFromFile(upload_file1_file),
      upload_file2_filetype: getFileTypeFromFile(upload_file2_file),
      photo,
      card_issue_date: nullIfEmpty(payloadFields.card_issue_date),
      email: nullIfEmpty(payloadFields.email),
      insurance_code: nullIfEmpty(payloadFields.insurance_code),
      date_of_referral: nullIfEmpty(payloadFields.date_of_referral),
      referral_id: nullIfEmpty(payloadFields.referral_id),
      referral_remarks: nullIfEmpty(payloadFields.referral_remarks),
      upload_file1_remarks: nullIfEmpty(payloadFields.upload_file1_remarks),
      upload_file2_remarks: nullIfEmpty(payloadFields.upload_file2_remarks),
      smart_card_verified_by: nullIfEmpty(
        payloadFields.smart_card_verified_by
      ),
      department: nullIfEmpty(payloadFields.department),
      designation: nullIfEmpty(payloadFields.designation),
      uid_number: nullIfEmpty(payloadFields.uid_number),
      kgid: nullIfEmpty(payloadFields.kgid),
      family_head_dob: nullIfEmpty(payloadFields.family_head_dob),
      national_identity_type: nullIfEmpty(
        payloadFields.national_identity_type
      ),
      national_identity_no: nullIfEmpty(payloadFields.national_identity_no),
      accident_victim: nullIfEmpty(payloadFields.accident_victim),
      is_aadhaar_verified: nullIfEmpty(payloadFields.is_aadhaar_verified),
      mode_of_verify: nullIfEmpty(payloadFields.mode_of_verify),
      acid_victim: nullIfEmpty(payloadFields.acid_victim),
      abha_id: nullIfEmpty(payloadFields.abha_id),
      abha_address: nullIfEmpty(payloadFields.abha_address),
      ip_op: nullIfEmpty(payloadFields.ip_op),
      ben_fetch_card_type: nullIfEmpty(payloadFields.ben_fetch_card_type),
      ors_id: nullIfEmpty(payloadFields.ors_id),
      ors_ref_from_hosp: nullIfEmpty(payloadFields.ors_ref_from_hosp),
      is_dengue: nullIfEmpty(payloadFields.is_dengue),
      nhm_id: nullIfEmpty(payloadFields.nhm_id),
      scan_type: nullIfEmpty(payloadFields.scan_type),
      kfd: nullIfEmpty(payloadFields.kfd),
      kutumba_family_id: nullIfEmpty(payloadFields.kutumba_family_id),
      mobile_verified_flag: nullIfEmpty(payloadFields.mobile_verified_flag),
      kutumba_caste_e: nullIfEmpty(payloadFields.kutumba_caste_e),
      parent_name: nullIfEmpty(payloadFields.parent_name),
      parent_dob: nullIfEmpty(payloadFields.parent_dob),
      parent_gender: nullIfEmpty(payloadFields.parent_gender),
      parent_age_time: nullIfEmpty(payloadFields.parent_age_time),
      vrn: nullIfEmpty(payloadFields.vrn),
      masked_aadhaar: nullIfEmpty(payloadFields.masked_aadhaar),
    },
  };
}
