import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { METAOBJECT_DEFINITIONS, pluralize } from "../lib";
import { theme } from "../lib/styles";
import { PageHeader, Card, Alert } from "../components/ui";

const CONTENT_METAOBJECTS = ["faq_item", "contact_info"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);

  const definitions = await services.repository.getDefinitions();
  const existingTypes = new Set(definitions.map((d) => d.type));

  const metaobjectsData: Record<string, any[]> = {};
  for (const type of CONTENT_METAOBJECTS) {
    if (existingTypes.has(type)) {
      metaobjectsData[type] = await services.repository.getByType(type);
    } else {
      metaobjectsData[type] = [];
    }
  }

  return {
    faqExists: existingTypes.has("faq_item"),
    contactExists: existingTypes.has("contact_info"),
    faqs: metaobjectsData["faq_item"] || [],
    contactInfo: metaobjectsData["contact_info"]?.[0] || null,
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
    if (!result.success) return { error: result.error };
    return { success: true, message: `Definición "${METAOBJECT_DEFINITIONS[type]?.name}" creada` };
  }

  if (actionType === "create_sample_faqs") {
    const sampleFaqs = [
      { question: "¿Cuál es el tiempo de envío?", answer: "El tiempo de envío estándar es de 3-5 días hábiles.", category: "shipping", order: "1", active: "true" },
      { question: "¿Cómo puedo devolver un producto?", answer: "Tienes 30 días para devolver cualquier producto.", category: "returns", order: "2", active: "true" },
      { question: "¿Qué métodos de pago aceptan?", answer: "Aceptamos tarjetas, PayPal, Apple Pay y Google Pay.", category: "payment", order: "3", active: "true" },
    ];

    const results = [];
    for (const faq of sampleFaqs) {
      const result = await services.useCases.createMetaobject.execute({
        type: "faq_item",
        fields: Object.entries(faq).map(([key, value]) => ({ key, value })),
      });
      results.push({ success: result.success });
    }

    return { success: true, message: `Se crearon ${results.filter(r => r.success).length} FAQs de ejemplo` };
  }

  if (actionType === "create_contact_info") {
    const result = await services.useCases.createMetaobject.execute({
      type: "contact_info",
      handle: "main-contact",
      fields: [
        { key: "phone", value: "+34 900 000 000" },
        { key: "email", value: "info@tutienda.com" },
        { key: "whatsapp", value: "+34 600 000 000" },
        { key: "address", value: "Calle Principal 123\n28001 Madrid" },
        { key: "working_hours", value: "Lunes a Viernes: 9:00 - 20:00" },
      ],
    });

    if (!result.success) return { error: result.error };
    return { success: true, message: "Información de contacto creada" };
  }

  return { error: "Unknown action" };
};

export default function ContentPage() {
  const { faqExists, contactExists, faqs, contactInfo } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;
  const loadingType = fetcher.state !== "idle" ? fetcher.formData?.get("type") : null;

  if (fetcher.data?.success) {
    shopify.toast.show(fetcher.data.message || "Completado");
  }

  const faqCategories = [
    { id: "shipping", icon: "🚚", label: "Envíos" },
    { id: "returns", icon: "↩️", label: "Devoluciones" },
    { id: "payment", icon: "💳", label: "Pagos" },
  ];

  return (
    <div style={theme.page}>
      <PageHeader
        icon="📝"
        title="Contenido"
        description="FAQs e información de contacto"
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* FAQs Section */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>❓</span>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>FAQs</h3>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Preguntas frecuentes</p>
              </div>
            </div>
            <span style={theme.badge(faqExists ? (faqs.length > 0 ? "success" : "warning") : "pending")}>
              {faqExists ? (faqs.length > 0 ? pluralize(faqs.length, "pregunta", "preguntas") : "Sin datos") : "No creado"}
            </span>
          </div>

          {!faqExists ? (
            <button
              style={theme.button}
              onClick={() => fetcher.submit({ action: "create_definition", type: "faq_item" }, { method: "POST" })}
              disabled={loadingAction !== null}
            >
              {loadingAction === "create_definition" && loadingType === "faq_item" ? "Creando..." : "Crear Definición"}
            </button>
          ) : (
            <>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/faq_item", "_blank")}
                >
                  Gestionar
                </button>
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/faq_item/new", "_blank")}
                >
                  + Nueva
                </button>
              </div>

              {faqs.length === 0 && (
                <div style={{ padding: "20px", background: "#fafafa", borderRadius: "10px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px" }}>Sin FAQs creadas</p>
                  <button
                    style={{ ...theme.button, ...theme.buttonSuccess }}
                    onClick={() => fetcher.submit({ action: "create_sample_faqs" }, { method: "POST" })}
                    disabled={loadingAction !== null}
                  >
                    {loadingAction === "create_sample_faqs" ? "Creando..." : "Crear Ejemplos"}
                  </button>
                </div>
              )}

              {faqs.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {faqs.slice(0, 4).map((faq: any) => {
                    const question = faq.fields?.find((f: any) => f.key === "question")?.value;
                    const category = faq.fields?.find((f: any) => f.key === "category")?.value;
                    const catInfo = faqCategories.find(c => c.id === category);
                    return (
                      <div key={faq.id} style={{ padding: "12px", background: "#fafafa", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0, flex: 1 }}>{question}</p>
                        {catInfo && <span style={{ fontSize: "12px", color: "#666" }}>{catInfo.icon}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Contact Info Section */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>📞</span>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Contacto</h3>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Información de contacto</p>
              </div>
            </div>
            <span style={theme.badge(contactExists ? (contactInfo ? "success" : "warning") : "pending")}>
              {contactExists ? (contactInfo ? "Configurado" : "Sin datos") : "No creado"}
            </span>
          </div>

          {!contactExists ? (
            <button
              style={theme.button}
              onClick={() => fetcher.submit({ action: "create_definition", type: "contact_info" }, { method: "POST" })}
              disabled={loadingAction !== null}
            >
              {loadingAction === "create_definition" && loadingType === "contact_info" ? "Creando..." : "Crear Definición"}
            </button>
          ) : (
            <>
              <button
                style={theme.buttonSecondary}
                onClick={() => window.open("shopify://admin/content/entries/contact_info", "_blank")}
              >
                {contactInfo ? "Editar Contacto" : "Configurar"}
              </button>

              {!contactInfo && (
                <div style={{ marginTop: "16px", padding: "20px", background: "#fafafa", borderRadius: "10px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px" }}>Sin información configurada</p>
                  <button
                    style={{ ...theme.button, ...theme.buttonSuccess }}
                    onClick={() => fetcher.submit({ action: "create_contact_info" }, { method: "POST" })}
                    disabled={loadingAction !== null}
                  >
                    {loadingAction === "create_contact_info" ? "Creando..." : "Crear Plantilla"}
                  </button>
                </div>
              )}

              {contactInfo && (
                <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {contactInfo.fields?.slice(0, 4).map((field: any) => (
                    <div key={field.key} style={{ padding: "10px", background: "#fafafa", borderRadius: "6px" }}>
                      <p style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", margin: "0 0 2px" }}>{field.key}</p>
                      <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {field.value || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
