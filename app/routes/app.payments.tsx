import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { METAOBJECT_DEFINITIONS } from "../lib/metaobjects/definitions";
import { theme } from "../lib/styles";
import { PageHeader, Card, EmptyState, Alert, FieldDisplay } from "../components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const sectionData = await services.useCases.getSectionData.execute("payment_config");

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
    const result = await services.useCases.createDefinition.execute("payment_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Payment Config creada" };
  }

  if (actionType === "create_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "payment_config",
      handle: "payment-config",
      fields: [
        { key: "apple_pay_enabled", value: "true" },
        { key: "google_pay_enabled", value: "true" },
        { key: "credit_card_enabled", value: "true" },
        { key: "paypal_enabled", value: "true" },
        { key: "klarna_enabled", value: "false" },
        { key: "cod_enabled", value: "false" },
        { key: "bank_transfer_enabled", value: "false" },
        { key: "payment_instructions", value: "Todos los pagos se procesan de forma segura." },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de pagos creada" };
  }

  return { error: "Unknown action" };
};

export default function PaymentsPage() {
  const { exists, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (key: string) => config?.fields?.find((f: any) => f.key === key)?.value;

  const paymentMethods = [
    { key: "apple_pay_enabled", icon: "🍎", name: "Apple Pay" },
    { key: "google_pay_enabled", icon: "🤖", name: "Google Pay" },
    { key: "credit_card_enabled", icon: "💳", name: "Tarjeta" },
    { key: "paypal_enabled", icon: "🅿️", name: "PayPal" },
    { key: "klarna_enabled", icon: "🔷", name: "Klarna" },
    { key: "cod_enabled", icon: "💵", name: "Contrareembolso" },
    { key: "bank_transfer_enabled", icon: "🏦", name: "Transferencia" },
  ];

  return (
    <div style={theme.page}>
      <PageHeader
        icon="💳"
        title="Métodos de Pago"
        description="Métodos de pago disponibles en la app"
        badge={exists ? { label: config ? "Configurado" : "Sin datos", type: config ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="💳"
          title="Configurar Métodos de Pago"
          description="Define qué métodos de pago estarán disponibles en tu app móvil."
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
                Payment Config
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
                  onClick={() => window.open("shopify://admin/content/entries/payment_config", "_blank")}
                >
                  {config ? "Editar" : "Abrir"}
                </button>
              </div>
            </div>
          </Card>

          {config && (
            <>
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Métodos Habilitados
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                  {paymentMethods.map((method) => {
                    const enabled = getFieldValue(method.key) === "true";
                    return (
                      <div key={method.key} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "#fafafa",
                        border: "1px solid #f0f0f0",
                        borderRadius: "10px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }}>{method.icon}</span>
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>{method.name}</span>
                        </div>
                        <span style={theme.badge(enabled ? "success" : "pending")}>
                          {enabled ? "Sí" : "No"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
                  Credenciales
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FieldDisplay label="Stripe Public Key" value={getFieldValue("stripe_public_key")} masked />
                  <FieldDisplay label="PayPal Client ID" value={getFieldValue("paypal_client_id")} masked />
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
