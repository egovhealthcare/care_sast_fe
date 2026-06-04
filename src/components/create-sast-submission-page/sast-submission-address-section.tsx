import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { SastFormTextField } from "./sast-submission-field";
import { CreateSastSubmissionFormValues } from "./schema";

interface SastSubmissionAddressSectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionAddressSection({
  form,
}: SastSubmissionAddressSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MapPinIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Address & location</h3>
          <p className="text-sm text-muted-foreground">
            Patient address and administrative location codes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormTextField
            form={form}
            name="payload.address"
            label="Address"
            required
            placeholder="Full address"
          />
          <SastFormTextField
            form={form}
            name="payload.patient_village"
            label="Village"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.patient_taluk"
            label="Taluk"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.patient_district"
            label="District"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.patient_state"
            label="State"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.patient_country"
            label="Country"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.pincode"
            label="Pincode"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.district_code"
            label="District code"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.district_name"
            label="District name"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.taluk_code"
            label="Taluk code"
            required
          />
          <SastFormTextField
            form={form}
            name="payload.taluk_name"
            label="Taluk name"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
}
