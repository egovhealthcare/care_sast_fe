import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  SastFormSelectField,
  SastFormTextField,
} from "./sast-submission-field";
import {
  CreateSastSubmissionFormValues,
  SAST_CASTE_CHOICES,
  SAST_FAMILY_TYPE_CHOICES,
} from "./schema";
import { getPayerZones } from "./geo";

interface SastSubmissionFamilySectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionFamilySection({
  form,
}: SastSubmissionFamilySectionProps) {
  const selectedState = form.watch("payload.patient_state");
  const payerZoneOptions = getPayerZones(selectedState);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <UsersIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Family & card</h3>
          <p className="text-sm text-muted-foreground">
            Family head and scheme card details.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormTextField
            form={form}
            name="payload.family_head_name"
            label="Family head name"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.relation_with_head"
            label="Relation with head"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.family_head_dob"
            label="Family head DOB"
            type="date"
          />
          <SastFormSelectField
            form={form}
            name="payload.payer_zone"
            label="Payer zone"
            required
            options={payerZoneOptions}
            placeholder={
              selectedState ? "Select payer zone" : "Select a state first"
            }
            disabled={!selectedState}
          />
          <SastFormSelectField
            form={form}
            name="payload.family_type"
            label="Family type"
            required
            options={SAST_FAMILY_TYPE_CHOICES}
          />
          <SastFormTextField
            form={form}
            name="payload.family_card_type"
            label="Family card type"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.family_card_no"
            label="Family card number"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.card_issue_date"
            label="Card issue date"
            type="date"
          />
          <SastFormSelectField
            form={form}
            name="payload.caste"
            label="Caste"
            required
            options={SAST_CASTE_CHOICES}
          />
          <SastFormTextField
            form={form}
            name="payload.national_identity_type"
            label="National identity type"
          />
          <SastFormTextField
            form={form}
            name="payload.national_identity_no"
            label="National identity number"
          />
          <SastFormTextField
            form={form}
            name="payload.masked_aadhaar"
            label="Masked Aadhaar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
