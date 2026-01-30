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

  const notificationData = await services.useCases.getSectionData.execute("notification_config");
  const webhookData = await services.useCases.getSectionData.execute("webhook_config");

  return {
    notificationExists: notificationData.definitionExists,
    webhookExists: webhookData.definitionExists,
    notificationConfig: notificationData.entries[0] || null,
    webhookConfig: webhookData.entries[0] || null,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "create_notification_definition") {
    const result = await services.useCases.createDefinition.execute("notification_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Notification Config creada" };
  }

  if (actionType === "create_webhook_definition") {
    const result = await services.useCases.createDefinition.execute("webhook_config");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Webhook Config creada" };
  }

  if (actionType === "create_notification_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "notification_config",
      fields: [
        { key: "enabled", value: "true" },
        { key: "notify_order_created", value: "true" },
        { key: "notify_order_shipped", value: "true" },
        { key: "notify_order_delivered", value: "true" },
        { key: "notify_order_cancelled", value: "true" },
        { key: "notify_refund", value: "true" },
        { key: "notify_payment_failed", value: "true" },
        { key: "notify_abandoned_cart", value: "true" },
        { key: "abandoned_cart_delay", value: "24" },
        { key: "notify_promo", value: "true" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de notificaciones creada" };
  }

  if (actionType === "create_webhook_template") {
    const result = await services.useCases.createMetaobject.execute({
      type: "webhook_config",
      fields: [
        { key: "webhook_url", value: "https://your-backend.com/webhooks/shopify" },
        { key: "order_create", value: "true" },
        { key: "order_update", value: "true" },
        { key: "order_fulfilled", value: "true" },
        { key: "order_cancelled", value: "true" },
        { key: "refund_create", value: "true" },
        { key: "customer_create", value: "true" },
        { key: "customer_update", value: "true" },
        { key: "product_update", value: "false" },
        { key: "inventory_update", value: "false" },
      ],
    });
    if (!result.success) return { error: result.error };
    return { success: true, message: "Configuración de webhooks creada" };
  }

  return { error: "Unknown action" };
};

export default function NotificationsPage() {
  const { notificationExists, webhookExists, notificationConfig, webhookConfig } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const getFieldValue = (obj: any, key: string) => obj?.fields?.find((f: any) => f.key === key)?.value;

  const notificationTypes = [
    { key: "notify_order_created", icon: "🛒", label: "Pedido Creado" },
    { key: "notify_order_shipped", icon: "📦", label: "Pedido Enviado" },
    { key: "notify_order_delivered", icon: "✅", label: "Entregado" },
    { key: "notify_order_cancelled", icon: "❌", label: "Cancelado" },
    { key: "notify_refund", icon: "💰", label: "Reembolso" },
    { key: "notify_payment_failed", icon: "⚠️", label: "Pago Fallido" },
    { key: "notify_abandoned_cart", icon: "🛒", label: "Carrito Abandonado" },
    { key: "notify_promo", icon: "🎉", label: "Promociones" },
  ];

  const webhookTypes = [
    { key: "order_create", label: "Order Create" },
    { key: "order_update", label: "Order Update" },
    { key: "order_fulfilled", label: "Order Fulfilled" },
    { key: "order_cancelled", label: "Order Cancelled" },
    { key: "refund_create", label: "Refund Create" },
    { key: "customer_create", label: "Customer Create" },
    { key: "customer_update", label: "Customer Update" },
    { key: "product_update", label: "Product Update" },
    { key: "inventory_update", label: "Inventory Update" },
  ];

  return (
    <div style={theme.page}>
      <PageHeader
        icon="🔔"
        title="Notificaciones"
        description="Push notifications y webhooks"
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {/* Push Notifications Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          📱 Push Notifications
        </h2>

        {!notificationExists ? (
          <EmptyState
            icon="📱"
            title="Configurar Push Notifications"
            description="Notifica a tus usuarios sobre el estado de sus pedidos."
            action={{
              label: "Crear Definición",
              loadingLabel: "Creando...",
              onClick: () => fetcher.submit({ action: "create_notification_definition" }, { method: "POST" }),
              loading: loadingAction === "create_notification_definition",
            }}
          />
        ) : (
          <>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Notification Config</h3>
                  <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>
                    {notificationConfig ? "Configurado" : "Sin configuración"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {!notificationConfig && (
                    <button
                      style={{ ...theme.button, ...theme.buttonSuccess }}
                      onClick={() => fetcher.submit({ action: "create_notification_template" }, { method: "POST" })}
                      disabled={loadingAction !== null}
                    >
                      {loadingAction === "create_notification_template" ? "Creando..." : "Crear Plantilla"}
                    </button>
                  )}
                  <button
                    style={theme.buttonSecondary}
                    onClick={() => window.open("shopify://admin/content/entries/notification_config", "_blank")}
                  >
                    {notificationConfig ? "Editar" : "Abrir"}
                  </button>
                </div>
              </div>
            </Card>

            {notificationConfig && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginTop: "16px" }}>
                {notificationTypes.map((notif) => {
                  const enabled = getFieldValue(notificationConfig, notif.key) === "true";
                  return (
                    <div key={notif.key} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#fff",
                      border: "1px solid #e8e8e8",
                      borderRadius: "10px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{notif.icon}</span>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a1a1a" }}>{notif.label}</span>
                      </div>
                      <span style={theme.badge(enabled ? "success" : "pending")}>
                        {enabled ? "Sí" : "No"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Webhooks Section */}
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          🔗 Webhooks
        </h2>

        {!webhookExists ? (
          <EmptyState
            icon="🔗"
            title="Configurar Webhooks"
            description="Recibe eventos en tiempo real de Shopify en tu backend."
            action={{
              label: "Crear Definición",
              loadingLabel: "Creando...",
              onClick: () => fetcher.submit({ action: "create_webhook_definition" }, { method: "POST" }),
              loading: loadingAction === "create_webhook_definition",
            }}
          />
        ) : (
          <>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Webhook Config</h3>
                  <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>
                    {webhookConfig ? "Configurado" : "Sin configuración"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {!webhookConfig && (
                    <button
                      style={{ ...theme.button, ...theme.buttonSuccess }}
                      onClick={() => fetcher.submit({ action: "create_webhook_template" }, { method: "POST" })}
                      disabled={loadingAction !== null}
                    >
                      {loadingAction === "create_webhook_template" ? "Creando..." : "Crear Plantilla"}
                    </button>
                  )}
                  <button
                    style={theme.buttonSecondary}
                    onClick={() => window.open("shopify://admin/content/entries/webhook_config", "_blank")}
                  >
                    {webhookConfig ? "Editar" : "Abrir"}
                  </button>
                </div>
              </div>
            </Card>

            {webhookConfig && (
              <>
                <Card style={{ marginTop: "16px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>🌐 Endpoint</h4>
                  <code style={{
                    display: "block",
                    padding: "12px 16px",
                    background: "#fafafa",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#666",
                    wordBreak: "break-all",
                  }}>
                    {getFieldValue(webhookConfig, "webhook_url") || "No configurado"}
                  </code>
                </Card>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                  {webhookTypes.map((webhook) => {
                    const enabled = getFieldValue(webhookConfig, webhook.key) === "true";
                    return (
                      <span key={webhook.key} style={theme.tag(enabled)}>
                        {enabled && "✓ "}{webhook.label}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
