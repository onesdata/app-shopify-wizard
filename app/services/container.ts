// Service Container - Dependency Injection for Use Cases

import { createMetaobjectRepository } from "../data";
import {
  GetDashboardDataUseCase,
  CreateDefinitionUseCase,
  GetSectionDataUseCase,
  CreateMetaobjectUseCase,
  UpdateMetaobjectUseCase,
  DeleteMetaobjectUseCase,
  GetCollectionsUseCase,
  GetLocationsUseCase,
  type MetaobjectRepository,
} from "../domain";
import { METAOBJECT_DEFINITIONS, SETUP_SECTIONS } from "../lib/metaobjects/definitions";

// Type for Shopify Admin client
type AdminClient = {
  graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response>;
};

// Service container that provides all use cases
export interface ServiceContainer {
  repository: MetaobjectRepository;
  useCases: {
    getDashboardData: GetDashboardDataUseCase;
    createDefinition: CreateDefinitionUseCase;
    getSectionData: GetSectionDataUseCase;
    createMetaobject: CreateMetaobjectUseCase;
    updateMetaobject: UpdateMetaobjectUseCase;
    deleteMetaobject: DeleteMetaobjectUseCase;
    getCollections: GetCollectionsUseCase;
    getLocations: GetLocationsUseCase;
  };
  definitions: typeof METAOBJECT_DEFINITIONS;
  sections: typeof SETUP_SECTIONS;
}

// Factory function to create service container
export function createServiceContainer(admin: AdminClient): ServiceContainer {
  const repository = createMetaobjectRepository(admin);

  return {
    repository,
    useCases: {
      getDashboardData: new GetDashboardDataUseCase(repository, METAOBJECT_DEFINITIONS, SETUP_SECTIONS),
      createDefinition: new CreateDefinitionUseCase(repository, METAOBJECT_DEFINITIONS),
      getSectionData: new GetSectionDataUseCase(repository, METAOBJECT_DEFINITIONS),
      createMetaobject: new CreateMetaobjectUseCase(repository),
      updateMetaobject: new UpdateMetaobjectUseCase(repository),
      deleteMetaobject: new DeleteMetaobjectUseCase(repository),
      getCollections: new GetCollectionsUseCase(repository),
      getLocations: new GetLocationsUseCase(repository),
    },
    definitions: METAOBJECT_DEFINITIONS,
    sections: SETUP_SECTIONS,
  };
}

// Helper to get definition by type
export function getDefinition(type: string) {
  return METAOBJECT_DEFINITIONS[type];
}
