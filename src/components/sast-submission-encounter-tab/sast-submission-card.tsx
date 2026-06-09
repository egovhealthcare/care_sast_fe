import {
  AlarmClockMinusIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FC, useMemo, useState } from "react";
import { cn, formatDate } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SASTSubmissionListItem } from "@/types/sast_submission";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";

interface SastSubmissionCardProps {
  submission: SASTSubmissionListItem;
}

const isDebugEnabled = (): boolean =>
  Boolean(
    (
      window as unknown as {
        __CARE_PLUGIN_RUNTIME__?: {
          meta?: {
            care_abdm_fe?: { config?: { debug?: boolean } };
          };
        };
      }
    ).__CARE_PLUGIN_RUNTIME__?.meta?.care_abdm_fe?.config?.debug,
  );

const DebugJsonSection: FC<{ title: string; data: unknown }> = ({
  title,
  data,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full items-center justify-between px-0 text-sm font-semibold text-gray-900 hover:bg-transparent"
        >
          {title}
          {open ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="mt-2 bg-gray-50 rounded-lg p-4 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
};

const SastSubmissionCard: FC<SastSubmissionCardProps> = ({ submission }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDebug = isDebugEnabled();

  const { data: details } = useQuery({
    queryKey: ["sast-submission", submission.id],
    queryFn: () => apis.sastSubmission.get(submission.id),
    enabled: isOpen,
  });

  const statusIcon = useMemo(() => {
    switch (submission.status) {
      case "completed":
      case "submitted":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <AlarmClockMinusIcon className="w-4 h-4 text-yellow-500" />;
    }
  }, [submission.status]);

  const statusColor = useMemo(() => {
    switch (submission.status) {
      case "completed":
      case "submitted":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  }, [submission.status]);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-col gap-3 bg-gray-50 border-t rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{submission.health_scheme}</CardTitle>
              <CardDescription>
                <p>Submission ID: #{submission.id}</p>
                <p>TPA: {submission.tpa_code}</p>
              </CardDescription>
            </div>
            <Badge
              className={cn("capitalize text-xs", {
                "bg-green-200 text-green-600":
                  submission.status === "submitted" ||
                  submission.status === "completed",
                "bg-red-200 text-red-600": submission.status === "failed",
                "bg-yellow-200 text-yellow-600":
                  submission.status === "pending",
              })}
            >
              {submission.status}
            </Badge>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {statusIcon}
              <span
                className={cn("capitalize font-medium text-sm", statusColor)}
              >
                {submission.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 text-right">
              {submission.hmis_id && (
                <div>HMIS ID: {submission.hmis_id}</div>
              )}
              {submission.ab_ark_id && (
                <div>AB Ark ID: {submission.ab_ark_id}</div>
              )}
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="mt-8 space-y-6">
              {details?.payload && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Patient snapshot
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                    <div>Name: {details.payload.patient_name}</div>
                    <div>Mobile: {details.payload.mobile}</div>
                    <div>DOA: {formatDate(details.payload.doa)}</div>
                  </div>
                </div>
              )}

              {details?.errors && details.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-3">
                    Errors
                  </h4>
                  <div className="bg-red-50 rounded-lg p-4 space-y-2">
                    {details.errors.map((error, index) => (
                      <div key={index} className="text-xs text-red-600">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isDebug && details?.callback_response && (
                <DebugJsonSection
                  title="Callback response"
                  data={details.callback_response}
                />
              )}

              {isDebug && details?.gateway_response && (
                <DebugJsonSection
                  title="Gateway response"
                  data={details.gateway_response}
                />
              )}

              {isDebug && details?.gateway_payload && (
                <DebugJsonSection
                  title="Gateway payload"
                  data={details.gateway_payload}
                />
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
        <CardFooter
          className={cn("flex justify-between p-4 pt-4", isOpen && "border-t")}
        >
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>Created: {formatDate(submission.created_date ?? undefined)}</span>
            </div>
            {submission.submitted_at && (
              <div className="flex items-center gap-1.5">
                <span>Submitted: {formatDate(submission.submitted_at)}</span>
              </div>
            )}
            {submission.completed_at && (
              <div className="flex items-center gap-1.5">
                {statusIcon}
                <span>Completed: {formatDate(submission.completed_at)}</span>
              </div>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </CardFooter>
      </Collapsible>
    </Card>
  );
};

export default SastSubmissionCard;
