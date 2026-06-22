import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  SastFormSelectField,
  SastFormTextField,
} from "./sast-submission-field";
import { CreateSastSubmissionFormValues } from "./schema";
import {
  STATE_NAMES,
  getDistrict,
  getDistrictNames,
  getTaluk,
  getTalukNames,
} from "./geo";

interface SastSubmissionAddressSectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionAddressSection({
  form,
}: SastSubmissionAddressSectionProps) {
  const selectedState = form.watch("payload.patient_state");
  const selectedDistrict = form.watch("payload.patient_district");

  const districtOptions = getDistrictNames(selectedState);
  const talukOptions = getTalukNames(selectedState, selectedDistrict);

  const handleStateChange = () => {
    form.setValue("payload.patient_district", "");
    form.setValue("payload.district_name", "");
    form.setValue("payload.district_code", "");
    form.setValue("payload.patient_taluk", "");
    form.setValue("payload.taluk_name", "");
    form.setValue("payload.taluk_code", "");
  };

  const handleDistrictChange = (districtName: string) => {
    const district = getDistrict(selectedState, districtName);
    form.setValue("payload.district_name", districtName);
    form.setValue("payload.district_code", district?.code ?? "");
    form.setValue("payload.patient_taluk", "");
    form.setValue("payload.taluk_name", "");
    form.setValue("payload.taluk_code", "");
  };

  const handleTalukChange = (talukName: string) => {
    const taluk = getTaluk(selectedState, selectedDistrict, talukName);
    form.setValue("payload.taluk_name", talukName);
    form.setValue("payload.taluk_code", taluk?.id ?? "");
  };

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
          <SastFormSelectField
            form={form}
            name="payload.patient_state"
            label="State"
            required
            options={STATE_NAMES}
            placeholder="Select state"
            onSelect={handleStateChange}
          />
          <SastFormTextField
            form={form}
            name="payload.payer_zone"
            label="Payer zone"
            required
          />
          <SastFormSelectField
            form={form}
            name="payload.patient_district"
            label="District"
            required
            options={districtOptions}
            placeholder={selectedState ? "Select district" : "Select a state first"}
            disabled={!selectedState}
            onSelect={handleDistrictChange}
          />
          <SastFormSelectField
            form={form}
            name="payload.patient_taluk"
            label="Taluk"
            required
            options={talukOptions}
            placeholder={
              selectedDistrict ? "Select taluk" : "Select a district first"
            }
            disabled={!selectedDistrict}
            onSelect={handleTalukChange}
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
            name="payload.taluk_code"
            label="Taluk code"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
}

