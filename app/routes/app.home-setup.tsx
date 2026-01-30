import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { METAOBJECT_DEFINITIONS, pluralize } from "../lib";
import { theme } from "../lib/styles";
import { PageHeader, Card, MetaobjectCard, Alert } from "../components/ui";

const HOME_METAOBJECTS = ["home_banner", "home_featured_collection", "home_category_grid"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);

  const definitions = await services.repository.getDefinitions();
  const existingTypes = new Set(definitions.map((d) => d.type));

  const metaobjectsData: Record<string, any[]> = {};
  for (const type of HOME_METAOBJECTS) {
    if (existingTypes.has(type)) {
      metaobjectsData[type] = await services.repository.getByType(type);
    } else {
      metaobjectsData[type] = [];
    }
  }

  const collections = await services.useCases.getCollections.execute();

  return {
    definitions: HOME_METAOBJECTS.map((type) => ({
      type,
      name: METAOBJECT_DEFINITIONS[type]?.name || type,
      description: METAOBJECT_DEFINITIONS[type]?.description || "",
      exists: existingTypes.has(type),
      count: metaobjectsData[type]?.length || 0,
      items: metaobjectsData[type] || [],
    })),
    collections,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "create_definition") {
    const type = formData.get("type") as string;
    const result = await services.useCases.createDefinition.execute(type);
    if (!result.success) {
      return { error: result.error, type };
    }
    return { success: true, message: `Definición "${METAOBJECT_DEFINITIONS[type]?.name}" creada`, type };
  }

  if (actionType === "create_all_definitions") {
    const results = [];
    for (const type of HOME_METAOBJECTS) {
      const result = await services.useCases.createDefinition.execute(type);
      results.push({ type, success: result.success, error: result.error });
    }
    return { results, action: "create_all" };
  }

  return { error: "Unknown action" };
};

export default function HomeSetup() {
  const { definitions, collections } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;
  const loadingType = fetcher.state !== "idle" ? fetcher.formData?.get("type") as string : null;

  if (fetcher.data?.success) {
    shopify.toast.show(fetcher.data.message || "Completado");
  }

  const allCreated = definitions.every((d) => d.exists);
  const totalEntries = definitions.reduce((acc, d) => acc + d.count, 0);

  const metaobjectIcons: Record<string, string> = {
    home_banner: "🖼️",
    home_featured_collection: "⭐",
    home_category_grid: "📱",
  };

  return (
    <div style={theme.page}>
      <PageHeader
        icon="🏠"
        title="Home Setup"
        description="Banners, colecciones destacadas y categorías"
        badge={allCreated ? { label: pluralize(totalEntries, "entrada", "entradas"), type: totalEntries > 0 ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {fetcher.data?.results && (
        <Alert type="success">
          {fetcher.data.results.map((r: any) => (
            <div key={r.type}>
              {r.success ? "✓" : "✗"} {METAOBJECT_DEFINITIONS[r.type]?.name}
              {r.error && `: ${r.error}`}
            </div>
          ))}
        </Alert>
      )}

      {/* Quick create all button */}
      {!allCreated && (
        <Card style={{ textAlign: "center", padding: "32px", marginBottom: "20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>
            Crear todas las definiciones
          </h3>
          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 20px" }}>
            Crea los 3 metaobjects del Home de una vez
          </p>
          <button
            style={{ ...theme.button, ...theme.buttonSuccess }}
            onClick={() => fetcher.submit({ action: "create_all_definitions" }, { method: "POST" })}
            disabled={loadingAction !== null}
          >
            {loadingAction === "create_all_definitions" ? "Creando..." : "Crear Todas"}
          </button>
        </Card>
      )}

      {/* Metaobjects grid */}
      <div style={theme.grid}>
        {definitions.map((def) => (
          <MetaobjectCard
            key={def.type}
            icon={metaobjectIcons[def.type] || "📦"}
            name={def.name}
            description={def.description}
            exists={def.exists}
            count={def.count}
            items={def.items}
            type={def.type}
            loading={loadingAction !== null}
            loadingType={loadingType || undefined}
            onCreateDefinition={() => fetcher.submit({ action: "create_definition", type: def.type }, { method: "POST" })}
            onManage={() => window.open(`shopify://admin/content/entries/${def.type}`, "_blank")}
            onCreateNew={() => window.open(`shopify://admin/content/entries/${def.type}/new`, "_blank")}
          />
        ))}
      </div>

      {/* Collections summary */}
      {collections.length > 0 && (
        <Card style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
              📚 Colecciones Disponibles
            </h3>
            <span style={theme.badge("success")}>{pluralize(collections.length, "colección", "colecciones")}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {collections.slice(0, 8).map((col: any) => (
              <span key={col.id} style={theme.tag(true)}>
                {col.title}
              </span>
            ))}
            {collections.length > 8 && (
              <span style={theme.tag(false)}>+{collections.length - 8} más</span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
