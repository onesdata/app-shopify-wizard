import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { theme } from "../lib/styles";
import { PageHeader, Card, EmptyState, Alert, FieldDisplay } from "../components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const sectionData = await services.useCases.getSectionData.execute("deep_link_config");

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
    const result = await services.useCases.createDefinition.execute("deep_link_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Deep Link Config creada" };
  }

  if (actionType === "create_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "deep_link_config",
      fields: [
        { key: "ios_bundle_id", value: "com.yourcompany.app" },
        { key: "android_package", value: "com.yourcompany.app" },
        { key: "shortio_domain", value: "link.yourstore.com" },
        { key: "password_reset_prefix", value: "https://link.yourstore.com/reset" },
        { key: "email_verify_prefix", value: "https://link.yourstore.com/verify" },
        { key: "fallback_url", value: "https://yourstore.myshopify.com" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de deep links creada" };
  }

  return { error: "Unknown action" };
};

export default function DeepLinksPage() {
  const { exists, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (key: string) => config?.fields?.find((f: any) => f.key === key)?.value;

  return (
    <div style={theme.page}>
      <PageHeader
        icon="🔗"
        title="Deep Links"
        description="Enlaces para recuperación de contraseña y verificación"
        badge={exists ? { label: config ? "Configurado" : "Sin datos", type: config ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="🔗"
          title="Configurar Deep Links"
          description="Permite que los usuarios abran la app desde emails de recuperación de contraseña y enlaces compartidos."
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
                Deep Link Config
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
                  onClick={() => window.open("shopify://admin/content/entries/deep_link_config", "_blank")}
                >
                  {config ? "Editar" : "Abrir"}
                </button>
              </div>
            </div>
          </Card>

          {config && (
            <>
              {/* Short.io Configuration */}
              <Card style={{ marginTop: "16px", background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}>
                    S
                  </div>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Short.io</h3>
                    <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Servicio de enlaces cortos</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FieldDisplay label="Short.io Domain" value={getFieldValue("shortio_domain")} />
                  <FieldDisplay label="API Key" value={getFieldValue("shortio_api_key")} masked />
                </div>
              </Card>

              {/* Platform Configuration */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "24px" }}>🍎</span>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>iOS</h3>
                      <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Apple App Store</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <FieldDisplay label="App ID" value={getFieldValue("ios_app_id")} />
                    <FieldDisplay label="Bundle ID" value={getFieldValue("ios_bundle_id")} />
                  </div>
                </Card>

                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "24px" }}>🤖</span>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Android</h3>
                      <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Google Play Store</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <FieldDisplay label="Package Name" value={getFieldValue("android_package")} />
                    <FieldDisplay label="SHA256" value={getFieldValue("android_sha256")} masked />
                  </div>
                </Card>
              </div>

              {/* Link Prefixes */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Prefijos de Enlaces
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  <div style={{ padding: "14px", background: "#e8f5e8", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span>🔐</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#2d5a2d" }}>Password Reset</span>
                    </div>
                    <code style={{ fontSize: "11px", color: "#5a9a5a", wordBreak: "break-all" }}>
                      {getFieldValue("password_reset_prefix") || "No configurado"}
                    </code>
                  </div>
                  <div style={{ padding: "14px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span>✉️</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af" }}>Email Verify</span>
                    </div>
                    <code style={{ fontSize: "11px", color: "#3b82f6", wordBreak: "break-all" }}>
                      {getFieldValue("email_verify_prefix") || "No configurado"}
                    </code>
                  </div>
                  <div style={{ padding: "14px", background: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span>🌐</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#9a3412" }}>Fallback URL</span>
                    </div>
                    <code style={{ fontSize: "11px", color: "#d97706", wordBreak: "break-all" }}>
                      {getFieldValue("fallback_url") || "No configurado"}
                    </code>
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
