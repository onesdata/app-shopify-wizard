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
  const sectionData = await services.useCases.getSectionData.execute("reviews_config");

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
    const result = await services.useCases.createDefinition.execute("reviews_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Reviews creada" };
  }

  if (actionType === "create_config") {
    const result = await services.useCases.createMetaobject.execute({
      type: "reviews_config",
      handle: "reviews-config",
      fields: [
        { key: "provider", value: (formData.get("provider") as string) || "judgeme" },
        { key: "api_key", value: (formData.get("api_key") as string) || "" },
        { key: "shop_domain", value: (formData.get("shop_domain") as string) || "" },
        { key: "enabled", value: formData.get("enabled") === "true" ? "true" : "false" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de Reviews creada" };
  }

  return { error: "Unknown action" };
};

export default function ReviewsPage() {
  const { exists, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (key: string) => config?.fields?.find((f: any) => f.key === key)?.value || "";

  const providers = [
    { value: "judgeme", name: "Judge.me", color: "#5a9a5a" },
    { value: "yotpo", name: "Yotpo", color: "#3b82f6" },
    { value: "stamped", name: "Stamped.io", color: "#8b5cf6" },
    { value: "loox", name: "Loox", color: "#d97706" },
  ];

  return (
    <div style={theme.page}>
      <PageHeader
        icon="⭐"
        title="Reviews"
        description="Integración con proveedores de reseñas"
        badge={exists ? { label: config ? "Configurado" : "Sin datos", type: config ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="⭐"
          title="Configurar Reviews"
          description="Integra Judge.me, Yotpo u otros proveedores para mostrar reseñas de productos."
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
                Reviews Config
              </h2>
              <button
                style={theme.buttonSecondary}
                onClick={() => window.open("shopify://admin/content/entries/reviews_config", "_blank")}
              >
                {config ? "Editar" : "Abrir"}
              </button>
            </div>
          </Card>

          {config ? (
            <>
              {/* Current Config Display */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Configuración Actual
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      Proveedor
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>
                      {providers.find(p => p.value === getFieldValue("provider"))?.name || getFieldValue("provider")}
                    </p>
                  </div>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      Estado
                    </p>
                    <span style={theme.badge(getFieldValue("enabled") === "true" ? "success" : "pending")}>
                      {getFieldValue("enabled") === "true" ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </div>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      API Key
                    </p>
                    <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0, fontFamily: "monospace" }}>
                      {getFieldValue("api_key") ? "••••" + getFieldValue("api_key").slice(-4) : "No configurada"}
                    </p>
                  </div>
                  <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                    <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>
                      Shop Domain
                    </p>
                    <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>
                      {getFieldValue("shop_domain") || "No configurado"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Providers Grid */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Proveedores Soportados
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  {providers.map((p) => {
                    const isSelected = getFieldValue("provider") === p.value;
                    return (
                      <div key={p.value} style={{
                        padding: "16px",
                        borderRadius: "10px",
                        background: isSelected ? "#e8f5e8" : "#fafafa",
                        border: isSelected ? "2px solid #5a9a5a" : "1px solid #e8e8e8",
                        textAlign: "center",
                      }}>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 4px" }}>{p.name}</p>
                        {isSelected && <span style={theme.badge("success")}>Activo</span>}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          ) : (
            /* Create Form */
            <Card style={{ marginTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 20px" }}>
                Configurar Reviews
              </h3>
              <fetcher.Form method="post" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input type="hidden" name="action" value="create_config" />

                <div>
                  <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "6px" }}>Proveedor</label>
                  <select name="provider" style={theme.input} defaultValue="judgeme">
                    {providers.map((p) => (
                      <option key={p.value} value={p.value}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "6px" }}>API Key</label>
                  <input type="text" name="api_key" style={theme.input} placeholder="Tu API key del proveedor" />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "6px" }}>Shop Domain</label>
                  <input type="text" name="shop_domain" style={theme.input} placeholder="tu-tienda.myshopify.com" />
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="checkbox" name="enabled" value="true" defaultChecked style={{ width: "18px", height: "18px" }} />
                  <span style={{ fontSize: "14px", color: "#1a1a1a" }}>Habilitar Reviews</span>
                </label>

                <button
                  type="submit"
                  style={{ ...theme.button, ...theme.buttonSuccess, marginTop: "8px" }}
                  disabled={loadingAction !== null}
                >
                  {loadingAction === "create_config" ? "Creando..." : "Crear Configuración"}
                </button>
              </fetcher.Form>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
