export type Coding = {
  system?: string | null;
  version?: string | null;
  code: string;
  display?: string | null;
};

export type Period = {
  start?: string | null;
  end?: string | null;
};

export type CodableConcept = {
  coding?: Coding[];
  text?: string;
};

export type Quantity = {
  value: number;
  unit?: Coding;
  code?: Coding;
};

export type OrganizationType = "team" | "govt" | "role" | "product_supplier";

export interface OrganizationParent {
  id: string;
  name: string;
  description: string;
  org_type: OrganizationType;
  metadata: Record<string, unknown>;
  parent: OrganizationParent | Record<string, never>;
  level_cache: number;
  cache_expiry: string;
}

export interface OrganizationRead {
  id: string;
  active: boolean;
  org_type: OrganizationType;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  level_cache: number;
  system_generated: boolean;
  has_children: boolean;
  parent: OrganizationParent | Record<string, never>;
  version: number;
}

export type TagCategory =
  | "diet"
  | "drug"
  | "lab"
  | "admin"
  | "contact"
  | "clinical"
  | "behavioral"
  | "research"
  | "advance_directive"
  | "safety";

export type TagStatus = "active" | "archived";

export interface TagConfigMetadata {
  color: string | null;
  icon: string | null;
}

export interface TagConfigRead {
  id: string;
  display: string;
  category: TagCategory;
  description: string | null;
  priority: number;
  status: TagStatus;
  metadata: TagConfigMetadata | null;
  level_cache: number;
  system_generated: boolean;
  has_children: boolean;
  parent: TagConfigRead | Record<string, never> | null;
  resource: string;
  facility: { id: string; name: string } | null;
  version: number;
}
