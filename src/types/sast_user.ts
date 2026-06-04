export interface SASTUserCreateRequest {
  hospital: string;
  user: string;
  user_id: string;
  password: string;
}

export interface SASTUserUpdateRequest {
  user_id: string;
  password: string;
}

export interface SASTUserListParams {
  hospital?: string;
  user?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}

export interface SASTUserRetrieve {
  id: string;
  user_id: string;
  hospital: string;
  user: string;
  created_date: string;
  modified_date: string;
}
