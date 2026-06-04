import { useMutation, useQueryClient } from "@tanstack/react-query";

import { APIError } from "@/apis/request";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { GlobalStoreProvider } from "@/hooks/use-global-store";
import { EMRErrorResponse } from "@/types/error";
import { FC } from "react";
import { Separator } from "../ui/separator";
import { apis } from "@/apis";
import { toast } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "raviger";
import { zodResolver } from "@hookform/resolvers/zod";

import { mapFormToCreateRequest } from "./map-form-to-request";
import { SastSubmissionAdditionalSection } from "./sast-submission-additional-section";
import { SastSubmissionAddressSection } from "./sast-submission-address-section";
import { SastSubmissionFamilySection } from "./sast-submission-family-section";
import { SastSubmissionMetaSection } from "./sast-submission-meta-section";
import { SastSubmissionPatientSection } from "./sast-submission-patient-section";
import { SastSubmissionReferralDocumentsSection } from "./sast-submission-referral-documents-section";
import {
  CreateSastSubmissionFormValues,
  createSastSubmissionFormSchema,
} from "./schema";

export type CreateSastSubmissionPageProps = {
  facilityId: string;
  patientId: string;
  encounterId: string;
};

const CreateSastSubmissionPage: FC<CreateSastSubmissionPageProps> = ({
  facilityId,
  patientId,
  encounterId,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<CreateSastSubmissionFormValues>({
    resolver: zodResolver(createSastSubmissionFormSchema),
    defaultValues: {
      facility: facilityId,
      patient: patientId,
      encounter: encounterId,
      tpa_code: "",
      health_scheme: "",
      payload: {
        hosp_code: "",
        patient_name: "",
        age: 0,
        age_time: "Years",
        dob: "",
        gender: "",
        family_head_name: "",
        payer_zone: "",
        family_type: "",
        family_card_type: "",
        family_card_no: "",
        caste: "",
        relation_with_head: "",
        date_reporting_nwh: "",
        marital_status: "",
        mobile: "",
        prt_pa_id: "",
        patient_ip_no: "",
        address: "",
        patient_village: "",
        patient_taluk: "",
        patient_district: "",
        patient_state: "",
        patient_country: "",
        pincode: "",
        referral_type: "",
        doa: "",
        district_code: "",
        district_name: "",
        taluk_code: "",
        taluk_name: "",
      },
    },
  });

  const { mutate: createSubmission, isPending } = useMutation({
    mutationFn: apis.sastSubmission.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sast-submissions", encounterId],
      });

      if (data.status === "submitted") {
        toast.success("SAST submission submitted successfully");
      } else if (data.status === "failed") {
        const errorMessage =
          data.errors?.join(", ") ||
          "Gateway rejected the submission. Check details on the encounter tab.";
        toast.error(errorMessage);
      } else {
        toast.success("SAST submission created");
      }

      navigate(
        `/facility/${facilityId}/patient/${patientId}/encounter/${encounterId}/sast-submissions`
      );
    },
    onError: (error) => {
      if (error instanceof APIError && error.status === 400) {
        const data = error.data as EMRErrorResponse;
        const messages = data.errors?.map((e) =>
          "loc" in e ? `${e.loc.join(".")}: ${e.msg}` : e.msg
        );
        toast.error(messages?.join("\n") || error.message);
        return;
      }
      toast.error(error.message || "Failed to create SAST submission");
    },
  });

  async function onSubmit(values: CreateSastSubmissionFormValues) {
    try {
      const body = await mapFormToCreateRequest(values);
      createSubmission(body);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to prepare submission"
      );
    }
  }

  return (
    <GlobalStoreProvider
      initialStore={{
        encounterId,
        patientId,
        facilityId,
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Create SAST Submission</h3>
            <p className="text-sm text-muted-foreground">
              Submit patient details to the SAST HMIS gateway.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigate(
                `/facility/${facilityId}/patient/${patientId}/encounter/${encounterId}/sast-submissions`
              );
            }}
          >
            Back to Encounter
          </Button>
        </div>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SastSubmissionMetaSection form={form} />
            <Separator />
            <SastSubmissionPatientSection form={form} />
            <Separator />
            <SastSubmissionFamilySection form={form} />
            <Separator />
            <SastSubmissionAddressSection form={form} />
            <Separator />
            <SastSubmissionReferralDocumentsSection form={form} />
            <Separator />
            <SastSubmissionAdditionalSection form={form} />
            <Separator />

            <Button
              className="w-full"
              size="lg"
              type="submit"
              loading={isPending}
            >
              Create SAST Submission
            </Button>
          </form>
        </Form>
      </div>
    </GlobalStoreProvider>
  );
};

export default CreateSastSubmissionPage;
