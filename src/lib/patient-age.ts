import { SAST_AGE_TIME_CHOICES } from "@/components/create-sast-submission-page/schema";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function toIsoDateOnly(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

export function computePatientAge(
  dateOfBirth: string | null | undefined,
  yearOfBirth: number | null | undefined
): { age: number; age_time: (typeof SAST_AGE_TIME_CHOICES)[number] } {
  if (dateOfBirth) {
    const birth = new Date(dateOfBirth);
    if (!Number.isNaN(birth.getTime())) {
      const now = new Date();
      const years = differenceInYears(now, birth);
      if (years >= 1) {
        return { age: years, age_time: "Years" };
      }
      const months = differenceInMonths(now, birth);
      if (months >= 1) {
        return { age: months, age_time: "Months" };
      }
      return {
        age: Math.max(differenceInDays(now, birth), 0),
        age_time: "Days",
      };
    }
  }

  if (yearOfBirth) {
    return {
      age: Math.max(new Date().getFullYear() - yearOfBirth, 0),
      age_time: "Years",
    };
  }

  return { age: 0, age_time: "Years" };
}
