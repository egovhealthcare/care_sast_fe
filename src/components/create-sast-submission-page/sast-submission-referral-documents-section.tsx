import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaperclipIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  SastFormFileField,
  SastFormTextField,
} from "./sast-submission-field";
import { CreateSastSubmissionFormValues } from "./schema";

interface SastSubmissionReferralDocumentsSectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionReferralDocumentsSection({
  form,
}: SastSubmissionReferralDocumentsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <PaperclipIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Referral & documents</h3>
          <p className="text-sm text-muted-foreground">
            Referral details and required base64-encoded uploads.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormTextField
            form={form}
            name="payload.referral_type"
            label="Referral type"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.date_of_referral"
            label="Date of referral"
            type="date"
          />
          <SastFormTextField
            form={form}
            name="payload.referral_id"
            label="Referral ID"
          />
          <SastFormTextField
            form={form}
            name="payload.referral_remarks"
            label="Referral remarks"
          />
          <SastFormTextField
            form={form}
            name="payload.insurance_code"
            label="Insurance code"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploads</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormFileField
            form={form}
            name="payload.upload_file1_file"
            label="Upload file 1"
            required
          />
          <SastFormFileField
            form={form}
            name="payload.upload_file2_file"
            label="Upload file 2"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.upload_file1_remarks"
            label="Upload file 1 remarks"
          />
          <SastFormTextField
            form={form}
            name="payload.upload_file2_remarks"
            label="Upload file 2 remarks"
          />
          <SastFormFileField
            form={form}
            name="payload.photo_file"
            label="Photo"
            required
            accept="image/*"
          />
        </CardContent>
      </Card>
    </div>
  );
}
