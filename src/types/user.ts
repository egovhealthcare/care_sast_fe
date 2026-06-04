/** Facility user list / file upload audit shape */
export type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  last_login: string;
  profile_picture_url?: string;
  user_type: "staff" | "admin";
  gender: "male" | "female" | "other";
  username: string;
};

/** Full user shape from patient/encounter retrieve APIs */
export interface RetrieveUser {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  prefix: string | null;
  suffix: string | null;
  last_login: string;
  profile_picture_url: string;
  gender: string;
  username: string;
  mfa_enabled: boolean;
  deleted: boolean;
  role_orgs: Record<string, unknown>;
  version: number;
}
