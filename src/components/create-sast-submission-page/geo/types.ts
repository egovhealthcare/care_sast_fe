export interface Taluk {
  /** Gateway TALUKID for this taluk. */
  id: string;
  name: string;
}

export interface District {
  name: string;
  /** Optional gateway district code, when available. */
  code?: string;
  taluks: Taluk[];
}

export interface GeoState {
  name: string;
  /** Payer zones available for this state. */
  payerZones: string[];
  districts: District[];
}
