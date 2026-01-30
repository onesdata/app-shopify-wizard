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
  const sectionData = await services.useCases.getSectionData.execute("shipping_config");

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
    const result = await services.useCases.createDefinition.execute("shipping_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Shipping Config creada" };
  }

  if (actionType === "create_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "shipping_config",
      handle: "shipping-config",
      fields: [
        { key: "free_shipping_threshold", value: "50.00" },
        { key: "free_shipping_message", value: "Envío gratis en pedidos superiores a 50€" },
        { key: "standard_days_min", value: "3" },
        { key: "standard_days_max", value: "5" },
        { key: "express_days_min", value: "1" },
        { key: "express_days_max", value: "2" },
        { key: "return_days", value: "30" },
        { key: "return_policy_summary", value: "Dispones de 30 días para devolver tu pedido sin coste adicional." },
        { key: "shipping_info", value: "Realizamos envíos a toda España peninsular." },
        { key: "show_estimated_delivery", value: "true" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de envíos creada" };
  }

  return { error: "Unknown action" };
};

export default function ShippingPage() {
  const { exists, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (key: string) => config?.fields?.find((f: any) => f.key === key)?.value;

  return (
    <div style={theme.page}>
      <PageHeader
        icon="📦"
        title="Envíos & Devoluciones"
        description="Tiempos de entrega y política de devoluciones"
        badge={exists ? { label: config ? "Configurado" : "Sin datos", type: config ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="📦"
          title="Configurar Envíos y Devoluciones"
          description="Define tiempos de envío, umbral de envío gratis y política de devoluciones."
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
                Shipping Config
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
                  onClick={() => window.open("shopify://admin/content/entries/shipping_config", "_blank")}
                >
                  {config ? "Editar" : "Abrir"}
                </button>
              </div>
            </div>
          </Card>

          {config && (
            <>
              {/* Free Shipping Banner */}
              <Card style={{ background: "#e8f5e8", border: "1px solid #5a9a5a" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "36px" }}>🚚</span>
                  <div>
                    <p style={{ color: "#2d5a2d", fontSize: "18px", fontWeight: "600", margin: "0 0 4px" }}>
                      Envío Gratis desde {getFieldValue("free_shipping_threshold")}€
                    </p>
                    <p style={{ color: "#2d5a2d", fontSize: "14px", margin: 0 }}>
                      {getFieldValue("free_shipping_message")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Shipping Times */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                <Card>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>📬 Envío Estándar</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "32px", fontWeight: "600", color: "#1a1a1a" }}>
                      {getFieldValue("standard_days_min")}-{getFieldValue("standard_days_max")}
                    </span>
                    <span style={{ color: "#666", fontSize: "14px" }}>días laborables</span>
                  </div>
                </Card>
                <Card>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>⚡ Envío Express</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "32px", fontWeight: "600", color: "#1a1a1a" }}>
                      {getFieldValue("express_days_min")}-{getFieldValue("express_days_max")}
                    </span>
                    <span style={{ color: "#666", fontSize: "14px" }}>días laborables</span>
                  </div>
                </Card>
              </div>

              {/* Returns */}
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>↩️ Política de Devoluciones</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#e8f5e8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#5a9a5a",
                  }}>
                    {getFieldValue("return_days")}
                  </div>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 2px" }}>Días para devolver</p>
                    <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Devolución gratuita</p>
                  </div>
                </div>
                {getFieldValue("return_policy_summary") && (
                  <p style={{ fontSize: "14px", color: "#666", margin: 0, padding: "12px", background: "#fafafa", borderRadius: "8px" }}>
                    {getFieldValue("return_policy_summary")}
                  </p>
                )}
              </Card>

              {/* Show estimated delivery */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                <span style={theme.badge(getFieldValue("show_estimated_delivery") === "true" ? "success" : "pending")}>
                  {getFieldValue("show_estimated_delivery") === "true" ? "Activo" : "Inactivo"}
                </span>
                <span style={{ fontSize: "14px", color: "#666" }}>Mostrar fecha estimada de entrega</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
