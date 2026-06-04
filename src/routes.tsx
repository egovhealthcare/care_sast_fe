import CreateSastSubmissionPage from "./components/create-sast-submission-page";

const routes = {
  "/facility/:facilityId/patient/:patientId/encounter/:encounterId/sast-submissions/new":
    ({
      facilityId,
      patientId,
      encounterId,
    }: {
      facilityId: string;
      patientId: string;
      encounterId: string;
    }) => (
      <CreateSastSubmissionPage
        facilityId={facilityId}
        patientId={patientId}
        encounterId={encounterId}
      />
    ),
};

export default routes;
