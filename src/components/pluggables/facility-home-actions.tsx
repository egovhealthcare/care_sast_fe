import { FC } from "react";
import { FacilityRetrieve } from "@/types/facility";
import ManageSastHospital from "@/components/manage-sast-hospital";

type FacilityHomeActionsProps = {
  facility: FacilityRetrieve;
  className?: string;
};

const FacilityHomeActions: FC<FacilityHomeActionsProps> = ({
  facility,
  className,
}) => {
  return <ManageSastHospital facility={facility} className={className} />;
};

export default FacilityHomeActions;
