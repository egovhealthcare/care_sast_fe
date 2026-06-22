import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BugIcon } from "lucide-react";
import { FC } from "react";

import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apis } from "@/apis";
import { isSastDebugEnabled } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface SastSubmissionDebugSectionProps {
  facilityId: string;
}

const NOT_CONFIGURED = "Not configured";
// The gateway password is never returned by the API; show a non-secret mask.
const MASKED_PASSWORD = "********";

function DebugField({ label, value }: { label: string; value: string }) {
  return (
    <FormItem className="space-y-1.5">
      <FormLabel>{label}</FormLabel>
      <Input value={value} disabled readOnly />
    </FormItem>
  );
}

export const SastSubmissionDebugSection: FC<SastSubmissionDebugSectionProps> = ({
  facilityId,
}) => {
  const isDebug = isSastDebugEnabled();

  const { data: hospital } = useQuery({
    queryKey: ["sast-hospital", facilityId],
    queryFn: () => apis.sastHospital.get(facilityId),
    enabled: isDebug && !!facilityId,
    retry: false,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => apis.currentUser.get(),
    enabled: isDebug,
    retry: false,
  });

  const { data: sastUsers } = useQuery({
    queryKey: ["sast-users", hospital?.id, currentUser?.id],
    queryFn: () =>
      apis.sastUser.list({
        hospital: hospital?.id,
        user: currentUser?.id,
      }),
    enabled: isDebug && !!hospital?.id && !!currentUser?.id,
    retry: false,
  });

  if (!isDebug) {
    return null;
  }

  const hospitalCode = hospital?.code || NOT_CONFIGURED;
  const sastUser = sastUsers?.results?.[0];
  const userId = sastUser?.user_id || NOT_CONFIGURED;
  const userPassword = sastUser ? MASKED_PASSWORD : NOT_CONFIGURED;

  return (
    <Card className="border-dashed border-amber-300 bg-amber-50/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <BugIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle>Debug: gateway credentials</CardTitle>
            <p className="text-sm text-muted-foreground">
              Auto-filled server-side at submission. Read-only, shown because
              debug mode is enabled.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DebugField label="Hospital Code" value={hospitalCode} />
        <DebugField label="UserId" value={userId} />
        <DebugField label="UserPassword" value={userPassword} />
      </CardContent>
    </Card>
  );
};
