import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { theme } from "../lib/styles";
import { PageHeader, Card, EmptyState, Alert } from "../components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const sectionData = await services.useCases.getSectionData.execute("newsletter_config");

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
    const result = await services.useCases.createDefinition.execute("newsletter_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Newsletter Config creada" };
  }

  if (actionType === "create_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "newsletter_config",
      fields: [
        { key: "enabled", value: "true" },
        { key: "provider", value: "shopify" },
        { key: "popup_title", value: "¡Suscríbete!" },
        { key: "popup_message", value: "Recibe ofertas exclusivas y novedades." },
        { key: "discount_code", value: "WELCOME10" },
        { key: "show_on_home", value: "true" },
        { key: "show_on_checkout", value: "false" },
        { key: "delay_seconds", value: "5" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de newsletter creada" };
  }

  return { error: "Unknown action" };
};

export default function NewsletterPage() {
  const { exists, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (key: string) => config?.fields?.find((f: any) => f.key === key)?.value;

  const providers = [
    { id: "shopify", name: "Shopify", icon: "🛍️" },
    { id: "klaviyo", name: "Klaviyo", icon: "📧" },
    { id: "mailchimp", name: "Mailchimp", icon: "🐵" },
  ];

  return (
    <div style={theme.page}>
      <PageHeader
        icon="📧"
        title="Newsletter"
        description="Popups de suscripción y email marketing"
        badge={exists ? { label: config ? "Configurado" : "Sin datos", type: config ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="📧"
          title="Configurar Newsletter"
          description="Captura emails con popups personalizados y conecta con tu proveedor de email marketing."
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
                Newsletter Config
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
                  onClick={() => window.open("shopify://admin/content/entries/newsletter_config", "_blank")}
                >
                  {config ? "Editar" : "Abrir"}
                </button>
              </div>
            </div>
          </Card>

          {config && (
            <>
              {/* Status Overview */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "16px" }}>
                <Card style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                    {getFieldValue("enabled") === "true" ? "✅" : "❌"}
                  </div>
                  <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>
                    {getFieldValue("enabled") === "true" ? "Habilitado" : "Deshabilitado"}
                  </p>
                </Card>
                <Card style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                    {providers.find(p => p.id === getFieldValue("provider"))?.icon || "📧"}
                  </div>
                  <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>
                    {providers.find(p => p.id === getFieldValue("provider"))?.name || "Shopify"}
                  </p>
                </Card>
                <Card style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏠</div>
                  <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>
                    Home: {getFieldValue("show_on_home") === "true" ? "Sí" : "No"}
                  </p>
                </Card>
                <Card style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏱️</div>
                  <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>
                    Delay: {getFieldValue("delay_seconds") || "0"}s
                  </p>
                </Card>
              </div>

              {/* Popup Preview */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Preview del Popup
                </h3>
                <div style={{
                  background: "#fafafa",
                  borderRadius: "12px",
                  padding: "32px",
                  maxWidth: "360px",
                  margin: "0 auto",
                  textAlign: "center",
                  border: "1px solid #e8e8e8",
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📧</div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>
                    {getFieldValue("popup_title") || "¡Suscríbete!"}
                  </h4>
                  <p style={{ fontSize: "14px", color: "#666", margin: "0 0 16px", lineHeight: 1.5 }}>
                    {getFieldValue("popup_message") || "Recibe ofertas exclusivas..."}
                  </p>
                  <div style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    marginBottom: "12px",
                    border: "1px solid #e0e0e0",
                  }}>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      disabled
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#999",
                        width: "100%",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <button style={{ ...theme.button, width: "100%" }}>
                    Suscribirme
                  </button>
                  {getFieldValue("discount_code") && (
                    <p style={{ color: "#5a9a5a", fontSize: "13px", marginTop: "12px" }}>
                      🎁 Código: <strong>{getFieldValue("discount_code")}</strong>
                    </p>
                  )}
                </div>
              </Card>

              {/* Providers */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Proveedores Disponibles
                </h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  {providers.map((provider) => {
                    const isSelected = getFieldValue("provider") === provider.id;
                    return (
                      <div
                        key={provider.id}
                        style={{
                          flex: 1,
                          padding: "16px",
                          borderRadius: "10px",
                          border: isSelected ? "2px solid #5a9a5a" : "1px solid #e8e8e8",
                          background: isSelected ? "#e8f5e8" : "#fff",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "28px" }}>{provider.icon}</span>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "8px 0 0" }}>
                          {provider.name}
                        </p>
                        {isSelected && <span style={theme.badge("success")}>Activo</span>}
                      </div>
                    );
                  })}
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
