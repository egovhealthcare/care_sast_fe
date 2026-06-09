import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  SastFormCheckboxField,
  SastFormSelectField,
  SastFormTextField,
} from "./sast-submission-field";
import {
  CreateSastSubmissionFormValues,
  SAST_AGE_TIME_CHOICES,
  SAST_MARITAL_STATUS_CHOICES,
} from "./schema";

interface SastSubmissionPatientSectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionPatientSection({
  form,
}: SastSubmissionPatientSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <UserIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Patient details</h3>
          <p className="text-sm text-muted-foreground">
            Demographics and contact information for the patient.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormTextField
            form={form}
            name="payload.patient_name"
            label="Patient name"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.patient_ip_no"
            label="Patient IP number"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.prt_pa_id"
            label="PRT PA ID (Aadhaar)"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.age"
            label="Age"
            type="number"
            required
          />
          <SastFormSelectField
            form={form}
            name="payload.age_time"
            label="Age unit"
            required
            options={SAST_AGE_TIME_CHOICES}
          />
          <SastFormTextField
            form={form}
            name="payload.dob"
            label="Date of birth"
            type="date"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.gender"
            label="Gender"
            required
          />
          <SastFormSelectField
            form={form}
            name="payload.marital_status"
            label="Marital status"
            required
            options={SAST_MARITAL_STATUS_CHOICES}
          />
          <SastFormCheckboxField
            form={form}
            name="payload.is_child"
            label="Is child"
          />
          <SastFormTextField
            form={form}
            name="payload.mobile"
            label="Mobile"
            required
          />
          <SastFormTextField form={form} name="payload.email" label="Email" />
          <SastFormTextField
            form={form}
            name="payload.doa"
            label="Date of admission"
            type="date"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.date_reporting_nwh"
            label="Date reporting NWH"
            type="date"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
}
