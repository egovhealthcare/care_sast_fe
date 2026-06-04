import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { SastFormTextField } from "./sast-submission-field";
import { CreateSastSubmissionFormValues } from "./schema";

interface SastSubmissionAdditionalSectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionAdditionalSection({
  form,
}: SastSubmissionAdditionalSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Additional details</h3>
          <p className="text-sm text-muted-foreground">
            Optional verification, ABHA, and parent fields.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optional fields</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormTextField
            form={form}
            name="payload.smart_card_verified_by"
            label="Smart card verified by"
          />
          <SastFormTextField
            form={form}
            name="payload.department"
            label="Department"
          />
          <SastFormTextField
            form={form}
            name="payload.designation"
            label="Designation"
          />
          <SastFormTextField
            form={form}
            name="payload.uid_number"
            label="UID number"
          />
          <SastFormTextField form={form} name="payload.kgid" label="KGID" />
          <SastFormTextField
            form={form}
            name="payload.accident_victim"
            label="Accident victim"
          />
          <SastFormTextField
            form={form}
            name="payload.is_aadhaar_verified"
            label="Is Aadhaar verified"
          />
          <SastFormTextField
            form={form}
            name="payload.mode_of_verify"
            label="Mode of verify"
          />
          <SastFormTextField
            form={form}
            name="payload.acid_victim"
            label="Acid victim"
          />
          <SastFormTextField form={form} name="payload.abha_id" label="ABHA ID" />
          <SastFormTextField
            form={form}
            name="payload.abha_address"
            label="ABHA address"
          />
          <SastFormTextField form={form} name="payload.ip_op" label="IP/OP" />
          <SastFormTextField
            form={form}
            name="payload.ben_fetch_card_type"
            label="Ben fetch card type"
          />
          <SastFormTextField form={form} name="payload.ors_id" label="ORS ID" />
          <SastFormTextField
            form={form}
            name="payload.ors_ref_from_hosp"
            label="ORS ref from hospital"
          />
          <SastFormTextField
            form={form}
            name="payload.is_dengue"
            label="Is dengue"
          />
          <SastFormTextField form={form} name="payload.nhm_id" label="NHM ID" />
          <SastFormTextField
            form={form}
            name="payload.scan_type"
            label="Scan type"
          />
          <SastFormTextField form={form} name="payload.kfd" label="KFD" />
          <SastFormTextField
            form={form}
            name="payload.kutumba_family_id"
            label="Kutumba family ID"
          />
          <SastFormTextField
            form={form}
            name="payload.mobile_verified_flag"
            label="Mobile verified flag"
          />
          <SastFormTextField
            form={form}
            name="payload.kutumba_caste_e"
            label="Kutumba caste"
          />
          <SastFormTextField
            form={form}
            name="payload.parent_name"
            label="Parent name"
          />
          <SastFormTextField
            form={form}
            name="payload.parent_age"
            label="Parent age"
            type="number"
          />
          <SastFormTextField
            form={form}
            name="payload.parent_dob"
            label="Parent DOB"
            type="date"
          />
          <SastFormTextField
            form={form}
            name="payload.parent_gender"
            label="Parent gender"
          />
          <SastFormTextField
            form={form}
            name="payload.parent_age_time"
            label="Parent age time"
          />
          <SastFormTextField form={form} name="payload.vrn" label="VRN" />
        </CardContent>
      </Card>
    </div>
  );
}
