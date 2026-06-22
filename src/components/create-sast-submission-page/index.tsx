import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { APIError } from "@/apis/request";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { GlobalStoreProvider } from "@/hooks/use-global-store";
import { EMRErrorResponse } from "@/types/error";
import { FC, useEffect, useRef } from "react";
import { Separator } from "../ui/separator";
import { apis } from "@/apis";
import { toast } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "raviger";
import { zodResolver } from "@hookform/resolvers/zod";

import { mapFormToCreateRequest } from "./map-form-to-request";
import {
  buildSastSubmissionFormDefaults,
  mergeAbhaIntoPayload,
} from "./build-form-prefill";
import { SastSubmissionAdditionalSection } from "./sast-submission-additional-section";
import { SastSubmissionAddressSection } from "./sast-submission-address-section";
import { SastSubmissionDebugSection } from "./sast-submission-debug-section";
import { SastSubmissionFamilySection } from "./sast-submission-family-section";
import { SastSubmissionMetaSection } from "./sast-submission-meta-section";
import { SastSubmissionPatientSection } from "./sast-submission-patient-section";
import { SastSubmissionReferralDocumentsSection } from "./sast-submission-referral-documents-section";
import {
  CreateSastSubmissionFormValues,
  SastSubmissionPayloadPrefill,
  createSastSubmissionFormSchema,
} from "./schema";

export type CreateSastSubmissionPageProps = {
  facilityId: string;
  patientId: string;
  encounterId: string;
};

const emptyPayload: SastSubmissionPayloadPrefill = {
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
  patient_country: "India",
  pincode: "",
  referral_type: "",
  doa: "",
  district_code: "",
  district_name: "",
  taluk_code: "",
  taluk_name: "",
};

const CreateSastSubmissionPage: FC<CreateSastSubmissionPageProps> = ({
  facilityId,
  patientId,
  encounterId,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPrefilledEncounter = useRef(false);
  const hasMergedAbha = useRef(false);

  const form = useForm<CreateSastSubmissionFormValues>({
    resolver: zodResolver(createSastSubmissionFormSchema),
    defaultValues: {
      facility: facilityId,
      patient: patientId,
      encounter: encounterId,
      tpa_code: "",
      health_scheme: "",
      payload: emptyPayload as CreateSastSubmissionFormValues["payload"],
    },
  });

  const { data: encounter, isLoading: isEncounterLoading } = useQuery({
    queryKey: ["encounter", encounterId],
    queryFn: () => apis.encounter.get(encounterId),
    enabled: !!encounterId,
  });

  const { data: abhaNumber } = useQuery({
    queryKey: ["abhaNumber", patientId],
    queryFn: () => apis.abhaNumber.get(patientId),
    enabled: !!patientId,
    retry: false,
  });

  useEffect(() => {
    if (!encounter || hasPrefilledEncounter.current) {
      return;
    }

    hasPrefilledEncounter.current = true;
    form.reset(
      buildSastSubmissionFormDefaults(
        facilityId,
        patientId,
        encounterId,
        encounter,
        { abhaNumber }
      )
    );
  }, [encounter, abhaNumber, facilityId, patientId, encounterId, form]);

  useEffect(() => {
    if (!abhaNumber || hasMergedAbha.current || !hasPrefilledEncounter.current) {
      return;
    }

    hasMergedAbha.current = true;
    const payload = form.getValues("payload");
    form.setValue("payload", mergeAbhaIntoPayload(payload, abhaNumber));
  }, [abhaNumber, form]);

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
        `/facility/${facilityId}/patient/${patientId}/encounter/${encounterId}/sastSubmissions`
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
                `/facility/${facilityId}/patient/${patientId}/encounter/${encounterId}/sastSubmissions`
              );
            }}
          >
            Back to Encounter
          </Button>
        </div>
        <Separator />

        {isEncounterLoading && (
          <p className="text-sm text-muted-foreground">
            Loading patient and encounter details…
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SastSubmissionDebugSection facilityId={facilityId} />
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
              disabled={isEncounterLoading}
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
