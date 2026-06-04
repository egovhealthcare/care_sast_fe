import {
  CreateFileRequest,
  CreateFileResponse,
  FileUploadModel,
} from "@/types/file_upload";
import { queryString, request } from "./request";

import { AbhaNumber } from "@/types/abha_number";
import { Coding } from "@/types/base";
import { EncounterRetrieve } from "@/types/encounter";
import { PatientRetrieve, PatientRetrieveParams } from "@/types/patient";
import { HealthFacility } from "@/types/health_facility";
import { PaginatedResponse } from "./types";
import {
  SASTSubmissionCreateRequest,
  SASTSubmissionListItem,
  SASTSubmissionListParams,
  SASTSubmissionRetrieve,
} from "@/types/sast_submission";
import {
  SASTHospitalCreateRequest,
  SASTHospitalRetrieve,
  SASTHospitalUpdateRequest,
} from "@/types/sast_hospital";
import {
  SASTUserCreateRequest,
  SASTUserListParams,
  SASTUserRetrieve,
  SASTUserUpdateRequest,
} from "@/types/sast_user";
import { RetrieveUser, User } from "@/types/user";

export const apis = {
  file: {
    createUpload: async (body: CreateFileRequest) => {
      return await request<CreateFileResponse>("/api/v1/files/", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    markUploadCompleted: async (id: string) => {
      return await request<FileUploadModel>(
        `/api/v1/files/${id}/mark_upload_completed/`,
        {
          method: "POST",
        }
      );
    },

    get: async (id: string) => {
      return await request<FileUploadModel>(`/api/v1/files/${id}/`);
    },
  },

  patient: {
    get: async (id: string, query?: PatientRetrieveParams) => {
      return await request<PatientRetrieve>(
        `/api/v1/patient/${id}/` + queryString(query)
      );
    },
  },

  encounter: {
    get: async (id: string) => {
      return await request<EncounterRetrieve>(`/api/v1/encounter/${id}/`);
    },
  },

  abhaNumber: {
    get: async (patientId: string) => {
      return await request<AbhaNumber>(`/api/abdm/abha_number/${patientId}/`);
    },
  },

  healthFacility: {
    get: async (facilityId: string) => {
      return await request<HealthFacility>(
        `/api/abdm/health_facility/${facilityId}/`
      );
    },
  },

  valueset: {
    expand: async (
      system: string,
      body?: {
        search?: string;
        count?: number;
      }
    ) => {
      return await request<{ results: Coding[] }>(
        `/api/v1/valueset/${system}/expand/`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
    },
  },

  user: {
    facilityUsers: async (
      facilityId: string,
      query?: {
        limit?: string;
        offset?: string;
        search_text?: string;
      }
    ) => {
      return await request<PaginatedResponse<User>>(
        `/api/v1/facility/${facilityId}/users/` + queryString(query),
        {
          method: "GET",
        }
      );
    },
  },

  currentUser: {
    get: async () => {
      return await request<RetrieveUser>("/api/v1/users/getcurrentuser/");
    },
  },

  sastSubmission: {
    list: async (query?: SASTSubmissionListParams) => {
      return await request<PaginatedResponse<SASTSubmissionListItem>>(
        "/api/care_sast/submission/" +
          queryString(
            query as Record<string, string | number | boolean> | undefined
          )
      );
    },

    get: async (id: string) => {
      return await request<SASTSubmissionRetrieve>(
        `/api/care_sast/submission/${id}/`
      );
    },

    create: async (body: SASTSubmissionCreateRequest) => {
      return await request<SASTSubmissionRetrieve>(
        "/api/care_sast/submission/",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
    },
  },

  sastHospital: {
    get: async (id: string) => {
      return await request<SASTHospitalRetrieve>(
        `/api/care_sast/hospital/${id}/`
      );
    },

    create: async (body: SASTHospitalCreateRequest) => {
      return await request<SASTHospitalRetrieve>("/api/care_sast/hospital/", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    update: async (id: string, body: SASTHospitalUpdateRequest) => {
      return await request<SASTHospitalRetrieve>(
        `/api/care_sast/hospital/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      );
    },
  },

  sastUser: {
    list: async (query?: SASTUserListParams) => {
      return await request<PaginatedResponse<SASTUserRetrieve>>(
        "/api/care_sast/user/" +
          queryString(
            query as Record<string, string | number | boolean> | undefined
          )
      );
    },

    create: async (body: SASTUserCreateRequest) => {
      return await request<SASTUserRetrieve>("/api/care_sast/user/", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    update: async (id: string, body: SASTUserUpdateRequest) => {
      return await request<SASTUserRetrieve>(`/api/care_sast/user/${id}/`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },

    delete: async (id: string) => {
      return await request<void>(`/api/care_sast/user/${id}/`, {
        method: "DELETE",
      });
    },
  },
};
