import { Button } from "@/components/ui/button";
import { EncounterRetrieve } from "@/types/encounter";
import { FC } from "react";
import { GlobalStoreProvider } from "@/hooks/use-global-store";
import { Link } from "raviger";
import { PatientRetrieve } from "@/types/patient";
import SastSubmissionCard from "./sast-submission-card";
import { SASTSubmissionListItem } from "@/types/sast_submission";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export type EncounterTabProps = {
  encounter: EncounterRetrieve;
  patient: PatientRetrieve;
};

const SastSubmissionEncounterTab: FC<EncounterTabProps> = ({
  encounter,
  patient,
}) => {
  const facilityId = encounter?.facility?.id;

  const { data: hospital, isLoading: isHospitalLoading } = useQuery({
    queryKey: ["sast-hospital", facilityId],
    queryFn: () => apis.sastHospital.get(facilityId),
    enabled: !!facilityId,
    retry: false,
  });

  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => apis.currentUser.get(),
    retry: false,
  });

  const { data: sastUsers, isLoading: isSastUsersLoading } = useQuery({
    queryKey: ["sast-users", hospital?.id, currentUser?.id],
    queryFn: () =>
      apis.sastUser.list({
        hospital: hospital?.id,
        user: currentUser?.id,
      }),
    enabled: !!hospital?.id && !!currentUser?.id,
  });

  const isValidating =
    isHospitalLoading ||
    isCurrentUserLoading ||
    (!!hospital?.id && !!currentUser?.id && isSastUsersLoading);

  const hasHospital = !!hospital;
  const hasSastUser = (sastUsers?.count ?? 0) > 0;
  const isAllowed = hasHospital && hasSastUser;

  const { data: submissions } = useQuery({
    queryKey: ["sast-submissions", encounter?.id],
    queryFn: () =>
      apis.sastSubmission.list({
        encounter: encounter?.id,
      }),
    enabled: !!encounter?.id && isAllowed,
  });

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-8 text-gray-500">
          Checking SAST availability...
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto rounded-lg border border-gray-200 bg-white p-6 text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              SAST Submissions Unavailable
            </h1>
            <p className="text-sm text-gray-500">
              {!hasHospital
                ? "This facility is not mapped to a SAST hospital."
                : "You do not have a SAST user configured for this hospital."}
            </p>
          </div>
          {facilityId && (
            <Link href={`/facility/${facilityId}/settings/general`}>
              <Button>Configure SAST Settings</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <GlobalStoreProvider
      initialStore={{
        encounter,
        patient,
      }}
    >
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              SAST Submissions
            </h1>
            <p className="text-sm text-gray-500">
              {submissions?.count ?? 0} submission(s) found for this encounter.
            </p>
          </div>
          <Link href="sast-submissions/new">
            <Button>Create SAST Submission</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {submissions?.count === 0 && (
            <div className="text-center py-8 text-gray-500">
              No SAST submissions found for this encounter.
            </div>
          )}

          {submissions?.results?.map((submission: SASTSubmissionListItem) => (
            <SastSubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      </div>
    </GlobalStoreProvider>
  );
};

export default SastSubmissionEncounterTab;
