import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { theme } from "../lib/styles";
import { pluralize } from "../lib";
import { PageHeader, Card, EmptyState, Alert } from "../components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const sectionData = await services.useCases.getSectionData.execute("legal_policy");

  return {
    exists: sectionData.definitionExists,
    policies: sectionData.entries,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "create_definition") {
    const result = await services.useCases.createDefinition.execute("legal_policy");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Legal Policy creada" };
  }

  if (actionType === "create_sample_policies") {
    const samplePolicies = [
      { type: "privacy", title: "Política de Privacidad", required_registration: "true", required_checkout: "false" },
      { type: "terms", title: "Términos y Condiciones", required_registration: "true", required_checkout: "true" },
      { type: "cookies", title: "Política de Cookies", required_registration: "false", required_checkout: "false" },
      { type: "returns", title: "Política de Devoluciones", required_registration: "false", required_checkout: "true" },
    ];

    const createRichText = (text: string) => JSON.stringify({
      type: "root",
      children: [{ type: "paragraph", children: [{ type: "text", value: text }] }]
    });

    for (const policy of samplePolicies) {
      await services.useCases.createMetaobject.execute({
        type: "legal_policy",
        fields: [
          { key: "type", value: policy.type },
          { key: "title", value: policy.title },
          { key: "content", value: createRichText(`Contenido de ${policy.title}. Edita este texto desde Shopify.`) },
          { key: "version", value: "1.0" },
          { key: "required_registration", value: policy.required_registration },
          { key: "required_checkout", value: policy.required_checkout },
          { key: "active", value: "true" },
        ],
      });
    }
    return { success: true, message: "Políticas de ejemplo creadas" };
  }

  return { error: "Unknown action" };
};

export default function LegalPage() {
  const { exists, policies } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  const policyTypes = [
    { type: "privacy", icon: "🔒", label: "Privacidad" },
    { type: "terms", icon: "📋", label: "Términos" },
    { type: "cookies", icon: "🍪", label: "Cookies" },
    { type: "returns", icon: "↩️", label: "Devoluciones" },
  ];

  return (
    <div style={theme.page}>
      <PageHeader
        icon="📜"
        title="Legal & Políticas"
        description="Políticas legales de la app"
        badge={exists ? { label: pluralize(policies.length, "política", "políticas"), type: policies.length > 0 ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="📜"
          title="Configurar Políticas Legales"
          description="Crea las políticas de privacidad, términos y condiciones para tu app."
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
                Políticas Legales
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/legal_policy/new", "_blank")}
                >
                  + Nueva
                </button>
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/legal_policy", "_blank")}
                >
                  Gestionar
                </button>
              </div>
            </div>
          </Card>

          {policies.length === 0 && (
            <Card style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "#666", margin: "0 0 16px" }}>No hay políticas creadas aún.</p>
              <button
                style={{ ...theme.button, ...theme.buttonSuccess }}
                onClick={() => fetcher.submit({ action: "create_sample_policies" }, { method: "POST" })}
                disabled={loadingAction !== null}
              >
                {loadingAction === "create_sample_policies" ? "Creando..." : "Crear Políticas de Ejemplo"}
              </button>
            </Card>
          )}

          {policies.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginTop: "16px" }}>
              {policies.map((policy: any) => {
                const type = policy.fields?.find((f: any) => f.key === "type")?.value;
                const title = policy.fields?.find((f: any) => f.key === "title")?.value;
                const active = policy.fields?.find((f: any) => f.key === "active")?.value;
                const reqReg = policy.fields?.find((f: any) => f.key === "required_registration")?.value;
                const reqCheck = policy.fields?.find((f: any) => f.key === "required_checkout")?.value;
                const policyInfo = policyTypes.find((p) => p.type === type);

                return (
                  <Card key={policy.id} style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "28px" }}>{policyInfo?.icon || "📄"}</span>
                      <span style={theme.badge(active === "true" ? "success" : "pending")}>
                        {active === "true" ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px" }}>{title}</h3>
                    <p style={{ fontSize: "12px", color: "#666", margin: "0 0 12px" }}>Tipo: {type}</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {reqReg === "true" && <span style={theme.tag(true)}>📝 Registro</span>}
                      {reqCheck === "true" && <span style={theme.tag(true)}>🛒 Checkout</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Policy types reference */}
          <Card style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>
              Tipos de Políticas
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {policyTypes.map((p) => (
                <span key={p.type} style={theme.tag(false)}>
                  {p.icon} {p.label}
                </span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
