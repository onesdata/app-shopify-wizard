// Domain Entities - Pure business objects without framework dependencies

export interface MetaobjectField {
  key: string;
  value: string | null;
  reference?: {
    id?: string;
    handle?: string;
    title?: string;
    image?: { url: string };
  } | null;
  references?: { nodes: Array<{ id: string }> };
}

export interface Metaobject {
  id: string;
  handle: string;
  type: string;
  fields: MetaobjectField[];
}

export interface MetaobjectDefinition {
  id: string;
  name: string;
  type: string;
  fieldDefinitions: Array<{
    key: string;
    name: string;
    type: { name: string };
    required: boolean;
  }>;
}

export interface FieldDefinitionInput {
  name: string;
  key: string;
  type: string;
  required?: boolean;
  description?: string | null;
}

export interface MetaobjectDefinitionConfig {
  name: string;
  type: string;
  description?: string;
  fieldDefinitions: FieldDefinitionInput[];
}

export interface Shop {
  name: string;
  email: string;
  primaryDomain: {
    url: string;
    host: string;
  };
  myshopifyDomain: string;
}

export interface SetupSection {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  metaobjects: string[];
}

export interface MetaobjectStatus {
  type: string;
  name: string;
  exists: boolean;
  hasData: boolean;
}

export interface SectionStatus {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  metaobjects: MetaobjectStatus[];
  isComplete: boolean;
  progress: number;
}

export interface ValidationStats {
  complete: number;
  empty: number;
  missing: number;
  total: number;
  percentage: number;
}

// Helper to extract field value from metaobject
export function getFieldValue(metaobject: Metaobject | null, key: string): string | null {
  if (!metaobject) return null;
  const field = metaobject.fields.find((f) => f.key === key);
  return field?.value ?? null;
}

export function getFieldBoolean(metaobject: Metaobject | null, key: string): boolean {
  return getFieldValue(metaobject, key) === "true";
}

export function getFieldNumber(metaobject: Metaobject | null, key: string): number | null {
  const value = getFieldValue(metaobject, key);
  if (value === null) return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
}

export function getFieldReference(metaobject: Metaobject | null, key: string) {
  if (!metaobject) return null;
  const field = metaobject.fields.find((f) => f.key === key);
  return field?.reference ?? null;
}
