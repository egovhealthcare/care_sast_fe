import { Button } from "@/components/ui/button";
import { Encounter } from "@/types/encounter";
import { FC } from "react";
import { GlobalStoreProvider } from "@/hooks/use-global-store";
import { Link } from "raviger";
import { Patient } from "@/types/patient";
import SastSubmissionCard from "./sast-submission-card";
import { SASTSubmissionListItem } from "@/types/sast_submission";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export type EncounterTabProps = {
  encounter: Encounter;
  patient: Patient;
};

const SastSubmissionEncounterTab: FC<EncounterTabProps> = ({
  encounter,
  patient,
}) => {
  const { data: submissions } = useQuery({
    queryKey: ["sast-submissions", encounter?.id],
    queryFn: () =>
      apis.sastSubmission.list({
        encounter: encounter?.id,
      }),
    enabled: !!encounter?.id,
  });

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
