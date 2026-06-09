import { KARNATAKA } from "./karnataka";
import type { District, GeoState, Taluk } from "./types";

export type { District, GeoState, Taluk };

/**
 * Registry of supported states. To add a completely new state, create a new
 * data file (mirroring `karnataka.ts`) exporting a `GeoState`, then register it
 * in this array. To add a district or taluk, edit the relevant state file.
 */
export const GEO_STATES: GeoState[] = [KARNATAKA];

export const STATE_NAMES: string[] = GEO_STATES.map((state) => state.name);

export function getState(stateName: string): GeoState | undefined {
  return GEO_STATES.find((state) => state.name === stateName);
}

export function getDistricts(stateName: string): District[] {
  return getState(stateName)?.districts ?? [];
}

export function getDistrictNames(stateName: string): string[] {
  return getDistricts(stateName).map((district) => district.name);
}

export function getDistrict(
  stateName: string,
  districtName: string
): District | undefined {
  return getDistricts(stateName).find(
    (district) => district.name === districtName
  );
}

export function getTaluks(stateName: string, districtName: string): Taluk[] {
  return getDistrict(stateName, districtName)?.taluks ?? [];
}

export function getTalukNames(
  stateName: string,
  districtName: string
): string[] {
  return getTaluks(stateName, districtName).map((taluk) => taluk.name);
}

export function getTaluk(
  stateName: string,
  districtName: string,
  talukName: string
): Taluk | undefined {
  return getTaluks(stateName, districtName).find(
    (taluk) => taluk.name === talukName
  );
}

export function getPayerZones(stateName: string): string[] {
  return getState(stateName)?.payerZones ?? [];
}

function normalize(value: string): string {
  return value.trim().toUpperCase();
}

/**
 * Resolve an arbitrary (case-insensitive) state name to its canonical dataset
 * value. Returns the original input when no match exists, so unknown states are
 * preserved instead of dropped.
 */
export function resolveStateName(input: string): string {
  if (!input) {
    return "";
  }
  const match = GEO_STATES.find(
    (state) => normalize(state.name) === normalize(input)
  );
  return match?.name ?? input;
}

export function resolveDistrictName(
  stateName: string,
  input: string
): string {
  if (!input) {
    return "";
  }
  const match = getDistricts(stateName).find(
    (district) => normalize(district.name) === normalize(input)
  );
  return match?.name ?? input;
}

export function resolveTalukName(
  stateName: string,
  districtName: string,
  input: string
): string {
  if (!input) {
    return "";
  }
  const match = getTaluks(stateName, districtName).find(
    (taluk) => normalize(taluk.name) === normalize(input)
  );
  return match?.name ?? input;
}

