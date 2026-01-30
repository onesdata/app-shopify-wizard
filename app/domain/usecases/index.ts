// Domain Use Cases - Business logic operations

import type { MetaobjectRepository } from "../repositories/metaobject-repository";
import type {
  Metaobject,
  MetaobjectDefinitionConfig,
  SectionStatus,
  ValidationStats,
  SetupSection,
} from "../entities";

// ============================================
// Get Dashboard Data Use Case
// ============================================

export interface DashboardData {
  shop: { name: string; email: string } | null;
  setupStatus: SectionStatus[];
  appConfig: Metaobject | null;
  appConfigDefinitionExists: boolean;
  stats: ValidationStats;
}

export class GetDashboardDataUseCase {
  constructor(
    private repository: MetaobjectRepository,
    private definitions: Record<string, MetaobjectDefinitionConfig>,
    private sections: SetupSection[]
  ) {}

  async execute(): Promise<DashboardData> {
    // Run initial queries in parallel
    const [shop, existingDefinitions] = await Promise.all([
      this.repository.getShopInfo(),
      this.repository.getDefinitions(),
    ]);

    const existingTypes = new Set(existingDefinitions.map((d) => d.type));

    // Check for entries in ALL metaobject types in PARALLEL
    const allTypes = Object.keys(this.definitions);
    const typesToCheck = allTypes.filter((type) => existingTypes.has(type));

    const entryPromises = typesToCheck.map(async (type) => {
      const entries = await this.repository.getByType(type, 1);
      return {
        type,
        count: entries.length,
        data: entries[0] || null,
      };
    });

    const entryResults = await Promise.all(entryPromises);

    const entryCounts: Record<string, number> = {};
    let appConfig: Metaobject | null = null;

    for (const result of entryResults) {
      entryCounts[result.type] = result.count;
      if (result.type === "app_config" && result.data) {
        appConfig = result.data;
      }
    }

    // Calculate setup status for each section
    const setupStatus: SectionStatus[] = this.sections.map((section) => {
      const metaobjectsStatus = section.metaobjects.map((type) => ({
        type,
        name: this.definitions[type]?.name || type,
        exists: existingTypes.has(type),
        hasData: (entryCounts[type] || 0) > 0,
      }));

      const completedCount = metaobjectsStatus.filter((m) => m.hasData).length;
      const progress = Math.round((completedCount / metaobjectsStatus.length) * 100);

      return {
        id: section.id,
        title: section.title,
        description: section.description,
        route: section.route,
        icon: section.icon,
        metaobjects: metaobjectsStatus,
        isComplete: metaobjectsStatus.every((m) => m.hasData),
        progress,
      };
    });

    // Calculate validation stats
    const complete = allTypes.filter((type) => (entryCounts[type] || 0) > 0).length;
    const empty = allTypes.filter(
      (type) => existingTypes.has(type) && (entryCounts[type] || 0) === 0
    ).length;
    const missing = allTypes.filter((type) => !existingTypes.has(type)).length;
    const total = allTypes.length;

    // Percentage: complete = 100%, empty = 50%, missing = 0%
    const score = complete + empty * 0.5;
    const percentage = Math.round((score / total) * 100);

    return {
      shop: shop ? { name: shop.name, email: shop.email } : null,
      setupStatus,
      appConfig,
      appConfigDefinitionExists: existingTypes.has("app_config"),
      stats: { complete, empty, missing, total, percentage },
    };
  }
}

// ============================================
// Create Metaobject Definition Use Case
// ============================================

export class CreateDefinitionUseCase {
  constructor(
    private repository: MetaobjectRepository,
    private definitions: Record<string, MetaobjectDefinitionConfig>
  ) {}

  async execute(type: string): Promise<{ success: boolean; error?: string }> {
    const config = this.definitions[type];
    if (!config) {
      return { success: false, error: `Definition not found for type: ${type}` };
    }
    return this.repository.createDefinition(config);
  }
}

// ============================================
// Get Section Data Use Case
// ============================================

export interface SectionData {
  definitionExists: boolean;
  entries: Metaobject[];
  definition: MetaobjectDefinitionConfig;
}

export class GetSectionDataUseCase {
  constructor(
    private repository: MetaobjectRepository,
    private definitions: Record<string, MetaobjectDefinitionConfig>
  ) {}

  async execute(type: string): Promise<SectionData> {
    const existingDefinitions = await this.repository.getDefinitions();
    const existingTypes = new Set(existingDefinitions.map((d) => d.type));

    const definitionExists = existingTypes.has(type);
    let entries: Metaobject[] = [];

    if (definitionExists) {
      entries = await this.repository.getByType(type, 50);
    }

    return {
      definitionExists,
      entries,
      definition: this.definitions[type],
    };
  }

  async executeMultiple(types: string[]): Promise<Record<string, SectionData>> {
    const existingDefinitions = await this.repository.getDefinitions();
    const existingTypes = new Set(existingDefinitions.map((d) => d.type));

    const results: Record<string, SectionData> = {};

    // Load all types in parallel
    await Promise.all(
      types.map(async (type) => {
        const definitionExists = existingTypes.has(type);
        let entries: Metaobject[] = [];

        if (definitionExists) {
          entries = await this.repository.getByType(type, 50);
        }

        results[type] = {
          definitionExists,
          entries,
          definition: this.definitions[type],
        };
      })
    );

    return results;
  }
}

// ============================================
// Create Metaobject Use Case
// ============================================

export interface CreateMetaobjectParams {
  type: string;
  handle?: string;
  fields: Array<{ key: string; value: string }>;
}

export class CreateMetaobjectUseCase {
  constructor(private repository: MetaobjectRepository) {}

  async execute(
    params: CreateMetaobjectParams
  ): Promise<{ success: boolean; metaobject?: Metaobject; error?: string }> {
    return this.repository.create(params);
  }
}

// ============================================
// Update Metaobject Use Case
// ============================================

export interface UpdateMetaobjectParams {
  fields: Array<{ key: string; value: string }>;
}

export class UpdateMetaobjectUseCase {
  constructor(private repository: MetaobjectRepository) {}

  async execute(
    id: string,
    params: UpdateMetaobjectParams
  ): Promise<{ success: boolean; error?: string }> {
    return this.repository.update(id, { fields: params.fields });
  }
}

// ============================================
// Delete Metaobject Use Case
// ============================================

export class DeleteMetaobjectUseCase {
  constructor(private repository: MetaobjectRepository) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    return this.repository.delete(id);
  }
}

// ============================================
// Get Collections Use Case
// ============================================

export class GetCollectionsUseCase {
  constructor(private repository: MetaobjectRepository) {}

  async execute() {
    return this.repository.getCollections();
  }
}

// ============================================
// Get Locations Use Case
// ============================================

export class GetLocationsUseCase {
  constructor(private repository: MetaobjectRepository) {}

  async execute() {
    return this.repository.getLocations();
  }
}
