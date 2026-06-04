export type FacilityRetrieve = {
  id: string;
  name?: string;
  version?: number;
  [key: string]: unknown;
};

export interface FacilityBareMinimum {
  id: string;
  name: string;
  version: number;
}
