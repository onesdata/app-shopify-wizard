// Data Layer - Repository Implementation

import type {
  MetaobjectRepository,
  CreateMetaobjectInput,
  UpdateMetaobjectInput,
} from "../../domain/repositories/metaobject-repository";
import type {
  Metaobject,
  MetaobjectDefinition,
  MetaobjectDefinitionConfig,
  Shop,
} from "../../domain/entities";
import {
  GET_METAOBJECT_DEFINITIONS,
  GET_METAOBJECTS_BY_TYPE,
  CREATE_METAOBJECT_DEFINITION,
  CREATE_METAOBJECT,
  UPDATE_METAOBJECT,
  DELETE_METAOBJECT,
  GET_SHOP_INFO,
  GET_COLLECTIONS,
  GET_LOCATIONS,
} from "../datasources/shopify-graphql-datasource";

// Type for Shopify Admin GraphQL client
type AdminGraphQL = {
  graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response>;
};

export class ShopifyMetaobjectRepository implements MetaobjectRepository {
  constructor(private admin: AdminGraphQL) {}

  // ============================================
  // Definitions
  // ============================================

  async getDefinitions(): Promise<MetaobjectDefinition[]> {
    const response = await this.admin.graphql(GET_METAOBJECT_DEFINITIONS);
    const data = await response.json();
    return data.data?.metaobjectDefinitions?.nodes || [];
  }

  async getDefinitionByType(type: string): Promise<MetaobjectDefinition | null> {
    const definitions = await this.getDefinitions();
    return definitions.find((d) => d.type === type) || null;
  }

  async createDefinition(
    config: MetaobjectDefinitionConfig
  ): Promise<{ success: boolean; error?: string }> {
    const response = await this.admin.graphql(CREATE_METAOBJECT_DEFINITION, {
      variables: {
        definition: {
          name: config.name,
          type: config.type,
          fieldDefinitions: config.fieldDefinitions.map((field) => ({
            name: field.name,
            key: field.key,
            type: field.type,
            required: field.required || false,
            description: field.description || null,
          })),
          access: { storefront: "PUBLIC_READ" },
        },
      },
    });

    const result = await response.json();
    const userErrors = result.data?.metaobjectDefinitionCreate?.userErrors;

    if (userErrors?.length > 0) {
      return { success: false, error: userErrors[0].message };
    }

    return { success: true };
  }

  // ============================================
  // Metaobjects
  // ============================================

  async getByType(type: string, first: number = 50): Promise<Metaobject[]> {
    try {
      const response = await this.admin.graphql(GET_METAOBJECTS_BY_TYPE, {
        variables: { type, first },
      });
      const data = await response.json();
      return data.data?.metaobjects?.nodes || [];
    } catch (error: any) {
      // Only catch errors related to the metaobject type not existing
      // Let other errors (auth, network, etc.) bubble up
      const errorMessage = error?.message || "";
      const graphQLErrors = error?.graphQLErrors || [];

      // Check if this is a "type not found" error
      const isTypeNotFound = graphQLErrors.some((e: any) =>
        e?.message?.includes("does not exist") ||
        e?.message?.includes("not found")
      ) || errorMessage.includes("does not exist");

      if (isTypeNotFound) {
        return [];
      }

      // For other errors, rethrow to be handled upstream
      throw error;
    }
  }

  async getFirstByType(type: string): Promise<Metaobject | null> {
    const entries = await this.getByType(type, 1);
    return entries[0] || null;
  }

  async create(
    input: CreateMetaobjectInput
  ): Promise<{ success: boolean; metaobject?: Metaobject; error?: string }> {
    const response = await this.admin.graphql(CREATE_METAOBJECT, {
      variables: {
        metaobject: {
          type: input.type,
          handle: input.handle,
          fields: input.fields,
        },
      },
    });

    const result = await response.json();
    const userErrors = result.data?.metaobjectCreate?.userErrors;

    if (userErrors?.length > 0) {
      return { success: false, error: userErrors[0].message };
    }

    return {
      success: true,
      metaobject: result.data?.metaobjectCreate?.metaobject,
    };
  }

  async update(
    id: string,
    input: UpdateMetaobjectInput
  ): Promise<{ success: boolean; error?: string }> {
    const response = await this.admin.graphql(UPDATE_METAOBJECT, {
      variables: {
        id,
        metaobject: {
          fields: input.fields,
        },
      },
    });

    const result = await response.json();
    const userErrors = result.data?.metaobjectUpdate?.userErrors;

    if (userErrors?.length > 0) {
      return { success: false, error: userErrors[0].message };
    }

    return { success: true };
  }

  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.admin.graphql(DELETE_METAOBJECT, {
      variables: { id },
    });

    const result = await response.json();
    const userErrors = result.data?.metaobjectDelete?.userErrors;

    if (userErrors?.length > 0) {
      return { success: false, error: userErrors[0].message };
    }

    return { success: true };
  }

  // ============================================
  // Shop
  // ============================================

  async getShopInfo(): Promise<Shop> {
    const response = await this.admin.graphql(GET_SHOP_INFO);
    const data = await response.json();
    return data.data?.shop || { name: "", email: "", primaryDomain: null, myshopifyDomain: "" };
  }

  // ============================================
  // Collections
  // ============================================

  async getCollections(): Promise<
    Array<{ id: string; title: string; handle: string; productsCount: number }>
  > {
    const response = await this.admin.graphql(GET_COLLECTIONS);
    const data = await response.json();
    const nodes = data.data?.collections?.nodes || [];
    // Transform productsCount from { count: number } to number
    return nodes.map((node: any) => ({
      ...node,
      productsCount: node.productsCount?.count || 0,
    }));
  }

  // ============================================
  // Locations
  // ============================================

  async getLocations(): Promise<
    Array<{ id: string; name: string; address: { formatted: string[] } }>
  > {
    const response = await this.admin.graphql(GET_LOCATIONS);
    const data = await response.json();
    return data.data?.locations?.nodes || [];
  }
}

// Factory function to create repository from Shopify admin client
export function createMetaobjectRepository(admin: AdminGraphQL): MetaobjectRepository {
  return new ShopifyMetaobjectRepository(admin);
}
