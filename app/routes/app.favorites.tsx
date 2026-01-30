import type { HeadersFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { theme } from "../lib/styles";
import { createServiceContainer } from "../services/container";
import { PageHeader, Card, EmptyState, Alert } from "../components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const sectionData = await services.useCases.getSectionData.execute("favorites_config");

  return {
    exists: sectionData.definitionExists,
    config: sectionData.entries[0] || null,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "create_definition") {
    const result = await services.useCases.createDefinition.execute("favorites_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Favoritos creada" };
  }

  if (actionType === "create_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "favorites_config",
      handle: "favorites-config",
      fields: [
        { key: "sync_mode", value: "both" },
        { key: "metafield_namespace", value: "custom" },
        { key: "metafield_key", value: "favorites" },
        { key: "show_share", value: "true" },
        { key: "max_favorites", value: "100" },
        { key: "enable_collections", value: "false" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de Favoritos creada" };
  }

  return { error: "Unknown action" };
};

export default function FavoritesPage() {
  const { exists, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (key: string) => config?.fields?.find((f: any) => f.key === key)?.value || "";

  return (
    <div style={theme.page}>
      <PageHeader
        icon="❤️"
        title="Favoritos"
        description="Lista de deseos y sincronización"
        badge={exists ? { label: config ? "Configurado" : "Sin datos", type: config ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="❤️"
          title="Configurar Favoritos"
          description="Permite a los usuarios guardar productos favoritos. Sin sesión se guarda localmente, con sesión se sincroniza con Shopify."
          action={{
            label: "Crear Definición",
            loadingLabel: "Creando...",
            onClick: () => fetcher.submit({ action: "create_definition" }, { method: "POST" }),
            loading: loadingAction === "create_definition",
          }}
        />
      ) : (
        <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                Favorites Config
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {!config && (
                  <button
                    style={{ ...theme.button, ...theme.buttonSuccess }}
                    onClick={() => fetcher.submit({ action: "create_template" }, { method: "POST" })}
                    disabled={loadingAction !== null}
                  >
                    {loadingAction === "create_template" ? "Creando..." : "Crear Plantilla"}
                  </button>
                )}
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/favorites_config", "_blank")}
                >
                  {config ? "Editar" : "Abrir"}
                </button>
              </div>
            </div>
          </Card>

          {config && (
            <>
              {/* How it works */}
              <Card style={{ marginTop: "16px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  ❤️ Cómo funciona
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ padding: "16px", background: "#fff", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>👤</div>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 4px" }}>Sin Sesión</p>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      Guardado localmente en el dispositivo
                    </p>
                  </div>
                  <div style={{ padding: "16px", background: "#fff", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔄</div>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 4px" }}>Con Sesión</p>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      Sincronizado con Customer Metafields
                    </p>
                  </div>
                </div>
              </Card>

              {/* Current Config */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Configuración Actual
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      Modo Sincronización
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#5a9a5a", margin: 0 }}>
                      {getFieldValue("sync_mode") === "both" ? "Local + Metafield" : getFieldValue("sync_mode")}
                    </p>
                  </div>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      Máx. Favoritos
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>
                      {getFieldValue("max_favorites") || "100"}
                    </p>
                  </div>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      Botón Compartir
                    </p>
                    <span style={theme.badge(getFieldValue("show_share") === "true" ? "success" : "pending")}>
                      {getFieldValue("show_share") === "true" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "16px", padding: "12px", background: "#fafafa", borderRadius: "8px" }}>
                  <p style={{ fontSize: "11px", color: "#999", margin: "0 0 8px" }}>Metafield Configuration</p>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666" }}>Namespace: </span>
                      <code style={{ fontSize: "12px", color: "#1a1a1a", background: "#e8e8e8", padding: "2px 6px", borderRadius: "4px" }}>
                        {getFieldValue("metafield_namespace") || "custom"}
                      </code>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666" }}>Key: </span>
                      <code style={{ fontSize: "12px", color: "#1a1a1a", background: "#e8e8e8", padding: "2px 6px", borderRadius: "4px" }}>
                        {getFieldValue("metafield_key") || "favorites"}
                      </code>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
