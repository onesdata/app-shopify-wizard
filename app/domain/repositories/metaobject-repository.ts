// Domain Repository Interface - Contract for data access

import type {
  Metaobject,
  MetaobjectDefinition,
  MetaobjectDefinitionConfig,
  Shop,
} from "../entities";

export interface CreateMetaobjectInput {
  type: string;
  handle?: string;
  fields: Array<{ key: string; value: string }>;
}

export interface UpdateMetaobjectInput {
  fields: Array<{ key: string; value: string }>;
}

export interface MetaobjectRepository {
  // Definitions
  getDefinitions(): Promise<MetaobjectDefinition[]>;
  getDefinitionByType(type: string): Promise<MetaobjectDefinition | null>;
  createDefinition(config: MetaobjectDefinitionConfig): Promise<{ success: boolean; error?: string }>;

  // Metaobjects
  getByType(type: string, first?: number): Promise<Metaobject[]>;
  getFirstByType(type: string): Promise<Metaobject | null>;
  create(input: CreateMetaobjectInput): Promise<{ success: boolean; metaobject?: Metaobject; error?: string }>;
  update(id: string, input: UpdateMetaobjectInput): Promise<{ success: boolean; error?: string }>;
  delete(id: string): Promise<{ success: boolean; error?: string }>;

  // Shop
  getShopInfo(): Promise<Shop>;

  // Collections (for references)
  getCollections(): Promise<Array<{ id: string; title: string; handle: string; productsCount: number }>>;

  // Locations (for references)
  getLocations(): Promise<Array<{ id: string; name: string; address: { formatted: string[] } }>>;
}
