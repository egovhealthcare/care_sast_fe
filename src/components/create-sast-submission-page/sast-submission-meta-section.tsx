import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { SastFormTextField } from "./sast-submission-field";
import { CreateSastSubmissionFormValues } from "./schema";

interface SastSubmissionMetaSectionProps {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
}

export function SastSubmissionMetaSection({
  form,
}: SastSubmissionMetaSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileTextIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Submission details</h3>
          <p className="text-sm text-muted-foreground">
            TPA and health scheme for this SAST submission.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheme & TPA</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SastFormTextField
            form={form}
            name="tpa_code"
            label="TPA code"
            required
          />
          <SastFormTextField
            form={form}
            name="health_scheme"
            label="Health scheme"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
}
