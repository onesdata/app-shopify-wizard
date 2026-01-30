// Preview Screens Gallery - Muestra todas las pantallas para screenshots
// Accesible en /preview/screens

import { useState } from "react";
import { theme } from "../lib/styles";
import { SETUP_SECTIONS, METAOBJECT_DEFINITIONS, pluralize } from "../lib";
import { PageHeader, Card, EmptyState, MetaobjectCard, FieldDisplay, Alert } from "../components/ui";

// 3 states: empty (no definition), no-data (definition exists, no entries), configured (has data)
type ScreenState = "empty" | "no-data" | "configured";

// Mock data generators
const mockFieldValue = (key: string): string => {
  const values: Record<string, string> = {
    provider: "judgeme",
    api_key: "sk_live_xxxxxxxxxxxxx",
    shop_domain: "mi-tienda.myshopify.com",
    enabled: "true",
    free_shipping_threshold: "50.00",
    free_shipping_message: "Envío gratis en pedidos +50€",
    standard_days_min: "3",
    standard_days_max: "5",
    express_days_min: "1",
    express_days_max: "2",
    return_days: "30",
    return_policy_summary: "30 días para devoluciones sin coste",
    show_estimated_delivery: "true",
    apple_pay_enabled: "true",
    google_pay_enabled: "true",
    credit_card_enabled: "true",
    paypal_enabled: "true",
    klarna_enabled: "false",
    sync_mode: "both",
    max_favorites: "100",
    show_share: "true",
    popup_title: "¡Suscríbete!",
    popup_message: "Recibe ofertas exclusivas",
    discount_code: "WELCOME10",
    delay_seconds: "5",
    ios_bundle_id: "com.miapp.store",
    android_package: "com.miapp.store",
    shortio_domain: "link.mitienda.com",
  };
  return values[key] || "Valor configurado";
};

const createMockConfig = (type: string) => ({
  id: `gid://shopify/Metaobject/${type}`,
  handle: type,
  fields: METAOBJECT_DEFINITIONS[type]?.fieldDefinitions.map(f => ({
    key: f.key,
    value: mockFieldValue(f.key),
  })) || [],
});

export default function PreviewScreens() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [state, setState] = useState<ScreenState>("configured");

  const screens = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "home-setup", name: "Home Setup", icon: "🏠" },
    { id: "content", name: "Contenido", icon: "📝" },
    { id: "payments", name: "Pagos", icon: "💳" },
    { id: "shipping", name: "Envíos", icon: "📦" },
    { id: "stores", name: "Tiendas", icon: "🏪" },
    { id: "legal", name: "Legal", icon: "📜" },
    { id: "reviews", name: "Reviews", icon: "⭐" },
    { id: "favorites", name: "Favoritos", icon: "❤️" },
    { id: "newsletter", name: "Newsletter", icon: "📧" },
    { id: "notifications", name: "Notificaciones", icon: "🔔" },
    { id: "deep-links", name: "Deep Links", icon: "🔗" },
    { id: "guide", name: "Guía", icon: "📖" },
  ];

  // State logic: empty = no definition, no-data = definition but no entries, configured = has data

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1a1a1a" }}>
      {/* Sidebar */}
      <div style={{
        width: "280px",
        background: "#111",
        padding: "20px",
        borderRight: "1px solid #333",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: "auto",
      }}>
        <h1 style={{ color: "#fff", fontSize: "18px", margin: "0 0 8px" }}>📸 Screenshot Gallery</h1>
        <p style={{ color: "#666", fontSize: "12px", margin: "0 0 24px" }}>
          Todas las pantallas del Setup Wizard
        </p>

        {/* State Toggle */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#888", fontSize: "11px", textTransform: "uppercase", marginBottom: "8px" }}>Estado de datos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              onClick={() => setState("empty")}
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: state === "empty" ? "#9e9e9e" : "#333",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              🔴 Pendiente <span style={{ opacity: 0.7, fontSize: "10px" }}>(sin definición)</span>
            </button>
            <button
              onClick={() => setState("no-data")}
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: state === "no-data" ? "#e07b24" : "#333",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              🟠 Sin datos <span style={{ opacity: 0.7, fontSize: "10px" }}>(definición creada)</span>
            </button>
            <button
              onClick={() => setState("configured")}
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: state === "configured" ? "#5a9a5a" : "#333",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              🟢 Configurado <span style={{ opacity: 0.7, fontSize: "10px" }}>(con datos)</span>
            </button>
          </div>
        </div>

        {/* Screen List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                background: currentScreen === index ? "#333" : "transparent",
                color: currentScreen === index ? "#fff" : "#888",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>{screen.icon}</span>
              <span>{screen.name}</span>
            </button>
          ))}
        </div>

        {/* Export Info */}
        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: "#222",
          borderRadius: "8px",
        }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>
            💡 Usa el script de Playwright para exportar screenshots automáticamente.
          </p>
          <code style={{ color: "#5a9a5a", fontSize: "11px" }}>
            npm run screenshots
          </code>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: "280px", padding: "24px" }}>
        {/* Current Screen Preview */}
        <div style={{
          background: "#f5f5f5",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}>
          {/* Browser Header */}
          <div style={{
            background: "#e8e8e8",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
            </div>
            <div style={{
              flex: 1,
              background: "#fff",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              color: "#666",
              marginLeft: "16px",
            }}>
              shopify-setup-wizard.app / {screens[currentScreen].name.toLowerCase()}
            </div>
          </div>

          {/* Screen Content */}
          <div style={{ minHeight: "600px" }} id={`screen-${screens[currentScreen].id}`}>
            <ScreenRenderer screenId={screens[currentScreen].id} state={state} />
          </div>
        </div>

        {/* Screen Info */}
        <div style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: "20px", margin: "0 0 4px" }}>
              {screens[currentScreen].icon} {screens[currentScreen].name}
            </h2>
            <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
              /app/{screens[currentScreen].id} • Estado: {state === "empty" ? "Sin configurar" : "Configurado"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentScreen(Math.max(0, currentScreen - 1))}
              disabled={currentScreen === 0}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: currentScreen === 0 ? "#333" : "#444",
                color: currentScreen === 0 ? "#666" : "#fff",
                cursor: currentScreen === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={() => setCurrentScreen(Math.min(screens.length - 1, currentScreen + 1))}
              disabled={currentScreen === screens.length - 1}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: currentScreen === screens.length - 1 ? "#333" : "#5a9a5a",
                color: currentScreen === screens.length - 1 ? "#666" : "#fff",
                cursor: currentScreen === screens.length - 1 ? "not-allowed" : "pointer",
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Render individual screens
function ScreenRenderer({ screenId, state }: { screenId: string; state: ScreenState }) {
  // State meanings:
  // empty: Definition doesn't exist yet (show "Crear Definición" button)
  // no-data: Definition exists but no entries (show "Sin datos" + "Crear Ejemplos/Plantilla")
  // configured: Has data (show full configured view)

  const exists = state !== "empty"; // Definition exists if not empty
  const hasData = state === "configured"; // Has entries only if configured
  const config = hasData ? createMockConfig(screenId.replace("-", "_") + "_config") : null;

  // Common mock data - only populated when configured
  const mockItems = hasData ? [
    { id: "1", handle: "item-1", fields: [{ key: "name", value: "Item 1" }] },
    { id: "2", handle: "item-2", fields: [{ key: "name", value: "Item 2" }] },
  ] : [];

  switch (screenId) {
    case "dashboard":
      return <DashboardPreview state={state} />;

    case "home-setup":
      return (
        <div style={theme.page}>
          <PageHeader
            icon="🏠"
            title="Home Setup"
            description="Banners, colecciones destacadas y categorías"
            badge={
              !exists ? undefined :
              hasData ? { label: pluralize(6, "entrada", "entradas"), type: "success" } :
              { label: "Sin datos", type: "warning" }
            }
          />
          {!exists ? (
            // Estado: empty - Sin definiciones
            <Card style={{ textAlign: "center", padding: "32px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>
                Crear todas las definiciones
              </h3>
              <p style={{ fontSize: "13px", color: "#666", margin: "0 0 20px" }}>
                Crea los 3 metaobjects del Home de una vez
              </p>
              <button style={{ ...theme.button, ...theme.buttonSuccess }}>Crear Todas</button>
            </Card>
          ) : (
            // Estado: no-data o configured
            <div style={theme.grid}>
              {["home_banner", "home_featured_collection", "home_category_grid"].map((type, i) => (
                <MetaobjectCard
                  key={type}
                  icon={type === "home_banner" ? "🖼️" : type === "home_featured_collection" ? "⭐" : "📱"}
                  name={METAOBJECT_DEFINITIONS[type]?.name || type}
                  description={METAOBJECT_DEFINITIONS[type]?.description || ""}
                  exists={true}
                  count={hasData ? 2 : 0}
                  items={hasData ? mockItems : []}
                  type={type}
                  onCreateDefinition={() => {}}
                  onManage={() => {}}
                  onCreateNew={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      );

    case "payments":
      const paymentMethods = [
        { key: "apple_pay_enabled", icon: "🍎", name: "Apple Pay" },
        { key: "google_pay_enabled", icon: "🤖", name: "Google Pay" },
        { key: "credit_card_enabled", icon: "💳", name: "Tarjeta" },
        { key: "paypal_enabled", icon: "🅿️", name: "PayPal" },
      ];
      return (
        <div style={theme.page}>
          <PageHeader
            icon="💳"
            title="Métodos de Pago"
            description="Métodos de pago disponibles en la app"
            badge={
              !exists ? undefined :
              hasData ? { label: "Configurado", type: "success" } :
              { label: "Sin datos", type: "warning" }
            }
          />
          {!exists ? (
            // Estado: empty
            <EmptyState
              icon="💳"
              title="Configurar Métodos de Pago"
              description="Define qué métodos de pago estarán disponibles en tu app móvil."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Payment Config</h2>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {!hasData && (
                      <button style={{ ...theme.button, ...theme.buttonSuccess }}>Crear Plantilla</button>
                    )}
                    <button style={theme.buttonSecondary}>{hasData ? "Editar" : "Abrir"}</button>
                  </div>
                </div>
              </Card>
              {hasData && (
                <Card style={{ marginTop: "16px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>Métodos Habilitados</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                    {paymentMethods.map((method, i) => (
                      <div key={method.key} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "#fafafa",
                        borderRadius: "10px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }}>{method.icon}</span>
                          <span style={{ fontSize: "14px", fontWeight: "500" }}>{method.name}</span>
                        </div>
                        <span style={theme.badge(i < 3 ? "success" : "pending")}>{i < 3 ? "Sí" : "No"}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {!hasData && (
                <Card style={{ textAlign: "center", padding: "40px", marginTop: "16px" }}>
                  <p style={{ color: "#666", margin: "0 0 16px" }}>No hay configuración de pagos creada.</p>
                  <button style={{ ...theme.button, ...theme.buttonSuccess }}>Crear Plantilla</button>
                </Card>
              )}
            </>
          )}
        </div>
      );

    case "shipping":
      return (
        <div style={theme.page}>
          <PageHeader
            icon="📦"
            title="Envíos & Devoluciones"
            description="Tiempos de entrega y política de devoluciones"
            badge={exists ? { label: "Configurado", type: "success" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="📦"
              title="Configurar Envíos y Devoluciones"
              description="Define tiempos de envío, umbral de envío gratis y política de devoluciones."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Shipping Config</h2>
                  <button style={theme.buttonSecondary}>Editar</button>
                </div>
              </Card>
              <Card style={{ background: "#e8f5e8", border: "1px solid #5a9a5a" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "36px" }}>🚚</span>
                  <div>
                    <p style={{ color: "#2d5a2d", fontSize: "18px", fontWeight: "600", margin: "0 0 4px" }}>
                      Envío Gratis desde 50€
                    </p>
                    <p style={{ color: "#2d5a2d", fontSize: "14px", margin: 0 }}>
                      Envío gratis en pedidos superiores a 50€
                    </p>
                  </div>
                </div>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                <Card>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>📬 Envío Estándar</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "32px", fontWeight: "600", color: "#1a1a1a" }}>3-5</span>
                    <span style={{ color: "#666", fontSize: "14px" }}>días laborables</span>
                  </div>
                </Card>
                <Card>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>⚡ Envío Express</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "32px", fontWeight: "600", color: "#1a1a1a" }}>1-2</span>
                    <span style={{ color: "#666", fontSize: "14px" }}>días laborables</span>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      );

    case "reviews":
      return (
        <div style={theme.page}>
          <PageHeader
            icon="⭐"
            title="Reviews"
            description="Integración con proveedores de reseñas"
            badge={exists ? { label: "Configurado", type: "success" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="⭐"
              title="Configurar Reviews"
              description="Integra Judge.me, Yotpo u otros proveedores para mostrar reseñas de productos."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Reviews Config</h2>
                  <button style={theme.buttonSecondary}>Editar</button>
                </div>
              </Card>
              <Card style={{ marginTop: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>Proveedores Soportados</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  {[
                    { value: "judgeme", name: "Judge.me" },
                    { value: "yotpo", name: "Yotpo" },
                    { value: "stamped", name: "Stamped.io" },
                    { value: "loox", name: "Loox" },
                  ].map((p, i) => (
                    <div key={p.value} style={{
                      padding: "16px",
                      borderRadius: "10px",
                      background: i === 0 ? "#e8f5e8" : "#fafafa",
                      border: i === 0 ? "2px solid #5a9a5a" : "1px solid #e8e8e8",
                      textAlign: "center",
                    }}>
                      <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 4px" }}>{p.name}</p>
                      {i === 0 && <span style={theme.badge("success")}>Activo</span>}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      );

    case "content":
      const faqCategories = [
        { id: "shipping", icon: "🚚", label: "Envíos" },
        { id: "returns", icon: "↩️", label: "Devoluciones" },
        { id: "payment", icon: "💳", label: "Pagos" },
      ];
      const mockFaqs = hasData ? [
        { question: "¿Cuál es el tiempo de envío?", category: "shipping" },
        { question: "¿Cómo puedo devolver un producto?", category: "returns" },
        { question: "¿Qué métodos de pago aceptan?", category: "payment" },
      ] : [];
      const mockContactInfo = hasData ? {
        phone: "+34 900 000 000",
        email: "info@tutienda.com",
        whatsapp: "+34 600 000 000",
        address: "Calle Principal 123",
      } : null;
      return (
        <div style={theme.page}>
          <PageHeader
            icon="📝"
            title="Contenido"
            description="FAQs e información de contacto"
          />
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
                <span style={theme.badge(exists ? (mockFaqs.length > 0 ? "success" : "warning") : "pending")}>
                  {exists ? (mockFaqs.length > 0 ? pluralize(mockFaqs.length, "pregunta", "preguntas") : "Sin datos") : "No creado"}
                </span>
              </div>
              {!exists ? (
                <button style={theme.button}>Crear Definición</button>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <button style={theme.buttonSecondary}>Gestionar</button>
                    <button style={theme.buttonSecondary}>+ Nueva</button>
                  </div>
                  {mockFaqs.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {mockFaqs.map((faq, i) => {
                        const catInfo = faqCategories.find(c => c.id === faq.category);
                        return (
                          <div key={i} style={{ padding: "12px", background: "#fafafa", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0, flex: 1 }}>{faq.question}</p>
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
                <span style={theme.badge(exists ? (mockContactInfo ? "success" : "warning") : "pending")}>
                  {exists ? (mockContactInfo ? "Configurado" : "Sin datos") : "No creado"}
                </span>
              </div>
              {!exists ? (
                <button style={theme.button}>Crear Definición</button>
              ) : (
                <>
                  <button style={theme.buttonSecondary}>{mockContactInfo ? "Editar Contacto" : "Configurar"}</button>
                  {mockContactInfo && (
                    <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {Object.entries(mockContactInfo).map(([key, value]) => (
                        <div key={key} style={{ padding: "10px", background: "#fafafa", borderRadius: "6px" }}>
                          <p style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", margin: "0 0 2px" }}>{key}</p>
                          <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>{value}</p>
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

    case "stores":
      const mockStores = hasData ? [
        { name: "Tienda Principal", city: "Madrid", address: "Calle Gran Vía 123", phone: "+34 910 000 000", active: true },
        { name: "Tienda Barcelona", city: "Barcelona", address: "Paseo de Gracia 45", phone: "+34 930 000 000", active: true },
      ] : [];
      return (
        <div style={theme.page}>
          <PageHeader
            icon="🏪"
            title="Tiendas Físicas"
            description="Ubicaciones de tiendas físicas para la app"
            badge={exists ? { label: pluralize(mockStores.length, "tienda", "tiendas"), type: mockStores.length > 0 ? "success" : "warning" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="🏪"
              title="Configurar Tiendas Físicas"
              description="Añade ubicaciones físicas con horarios, servicios y coordenadas."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Store Locations</h2>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={theme.buttonSecondary}>+ Nueva</button>
                    <button style={theme.buttonSecondary}>Gestionar</button>
                  </div>
                </div>
              </Card>
              {mockStores.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
                  {mockStores.map((store, i) => (
                    <Card key={i} style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <span style={{ fontSize: "28px" }}>🏪</span>
                        <span style={theme.badge(store.active ? "success" : "pending")}>{store.active ? "Activa" : "Inactiva"}</span>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px" }}>{store.name}</h3>
                      <p style={{ fontSize: "13px", color: "#666", margin: "0 0 8px" }}>{store.city}</p>
                      <p style={{ fontSize: "12px", color: "#999", margin: "0 0 8px" }}>{store.address}</p>
                      <p style={{ fontSize: "12px", color: "#5a9a5a", margin: "0 0 12px" }}>📞 {store.phone}</p>
                      <button style={{ ...theme.buttonSecondary, width: "100%", padding: "8px" }}>Editar</button>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      );

    case "legal":
      const policyTypes = [
        { type: "privacy", icon: "🔒", label: "Privacidad" },
        { type: "terms", icon: "📋", label: "Términos" },
        { type: "cookies", icon: "🍪", label: "Cookies" },
        { type: "returns", icon: "↩️", label: "Devoluciones" },
      ];
      const mockPolicies = hasData ? [
        { type: "privacy", title: "Política de Privacidad", active: true, reqReg: true, reqCheck: false },
        { type: "terms", title: "Términos y Condiciones", active: true, reqReg: true, reqCheck: true },
        { type: "cookies", title: "Política de Cookies", active: true, reqReg: false, reqCheck: false },
        { type: "returns", title: "Política de Devoluciones", active: true, reqReg: false, reqCheck: true },
      ] : [];
      return (
        <div style={theme.page}>
          <PageHeader
            icon="📜"
            title="Legal & Políticas"
            description="Políticas legales de la app"
            badge={exists ? { label: pluralize(mockPolicies.length, "política", "políticas"), type: mockPolicies.length > 0 ? "success" : "warning" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="📜"
              title="Configurar Políticas Legales"
              description="Crea las políticas de privacidad, términos y condiciones para tu app."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Políticas Legales</h2>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={theme.buttonSecondary}>+ Nueva</button>
                    <button style={theme.buttonSecondary}>Gestionar</button>
                  </div>
                </div>
              </Card>
              {mockPolicies.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginTop: "16px" }}>
                  {mockPolicies.map((policy, i) => {
                    const policyInfo = policyTypes.find((p) => p.type === policy.type);
                    return (
                      <Card key={i} style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <span style={{ fontSize: "28px" }}>{policyInfo?.icon || "📄"}</span>
                          <span style={theme.badge(policy.active ? "success" : "pending")}>{policy.active ? "Activa" : "Inactiva"}</span>
                        </div>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px" }}>{policy.title}</h3>
                        <p style={{ fontSize: "12px", color: "#666", margin: "0 0 12px" }}>Tipo: {policy.type}</p>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {policy.reqReg && <span style={theme.tag(true)}>📝 Registro</span>}
                          {policy.reqCheck && <span style={theme.tag(true)}>🛒 Checkout</span>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
              <Card style={{ marginTop: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>Tipos de Políticas</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {policyTypes.map((p) => (
                    <span key={p.type} style={theme.tag(false)}>{p.icon} {p.label}</span>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      );

    case "favorites":
      const mockFavConfig = hasData ? {
        sync_mode: "both",
        max_favorites: "100",
        show_share: "true",
        metafield_namespace: "custom",
        metafield_key: "favorites",
      } : null;
      return (
        <div style={theme.page}>
          <PageHeader
            icon="❤️"
            title="Favoritos"
            description="Lista de deseos y sincronización"
            badge={exists ? { label: mockFavConfig ? "Configurado" : "Sin datos", type: mockFavConfig ? "success" : "warning" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="❤️"
              title="Configurar Favoritos"
              description="Permite a los usuarios guardar productos favoritos. Sin sesión se guarda localmente, con sesión se sincroniza con Shopify."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Favorites Config</h2>
                  <button style={theme.buttonSecondary}>{mockFavConfig ? "Editar" : "Abrir"}</button>
                </div>
              </Card>
              {mockFavConfig && (
                <>
                  <Card style={{ marginTop: "16px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>❤️ Cómo funciona</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ padding: "16px", background: "#fff", borderRadius: "10px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>👤</div>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 4px" }}>Sin Sesión</p>
                        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Guardado localmente en el dispositivo</p>
                      </div>
                      <div style={{ padding: "16px", background: "#fff", borderRadius: "10px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔄</div>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 4px" }}>Con Sesión</p>
                        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Sincronizado con Customer Metafields</p>
                      </div>
                    </div>
                  </Card>
                  <Card style={{ marginTop: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>Configuración Actual</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>Modo Sincronización</p>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#5a9a5a", margin: 0 }}>Local + Metafield</p>
                      </div>
                      <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>Máx. Favoritos</p>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>{mockFavConfig.max_favorites}</p>
                      </div>
                      <div style={{ padding: "14px", background: "#fafafa", borderRadius: "8px" }}>
                        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", margin: "0 0 4px" }}>Botón Compartir</p>
                        <span style={theme.badge("success")}>Activo</span>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      );

    case "newsletter":
      const providers = [
        { id: "shopify", name: "Shopify", icon: "🛍️" },
        { id: "klaviyo", name: "Klaviyo", icon: "📧" },
        { id: "mailchimp", name: "Mailchimp", icon: "🐵" },
      ];
      const mockNewsletterConfig = hasData ? {
        enabled: "true",
        provider: "shopify",
        popup_title: "¡Suscríbete!",
        popup_message: "Recibe ofertas exclusivas y novedades.",
        discount_code: "WELCOME10",
        show_on_home: "true",
        delay_seconds: "5",
      } : null;
      return (
        <div style={theme.page}>
          <PageHeader
            icon="📧"
            title="Newsletter"
            description="Popups de suscripción y email marketing"
            badge={exists ? { label: mockNewsletterConfig ? "Configurado" : "Sin datos", type: mockNewsletterConfig ? "success" : "warning" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="📧"
              title="Configurar Newsletter"
              description="Captura emails con popups personalizados y conecta con tu proveedor de email marketing."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Newsletter Config</h2>
                  <button style={theme.buttonSecondary}>{mockNewsletterConfig ? "Editar" : "Abrir"}</button>
                </div>
              </Card>
              {mockNewsletterConfig && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "16px" }}>
                    <Card style={{ textAlign: "center", padding: "20px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
                      <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>Habilitado</p>
                    </Card>
                    <Card style={{ textAlign: "center", padding: "20px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🛍️</div>
                      <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>Shopify</p>
                    </Card>
                    <Card style={{ textAlign: "center", padding: "20px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏠</div>
                      <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>Home: Sí</p>
                    </Card>
                    <Card style={{ textAlign: "center", padding: "20px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏱️</div>
                      <p style={{ fontSize: "13px", color: "#1a1a1a", margin: 0 }}>Delay: 5s</p>
                    </Card>
                  </div>
                  <Card style={{ marginTop: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>Preview del Popup</h3>
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
                      <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>{mockNewsletterConfig.popup_title}</h4>
                      <p style={{ fontSize: "14px", color: "#666", margin: "0 0 16px", lineHeight: 1.5 }}>{mockNewsletterConfig.popup_message}</p>
                      <div style={{ background: "#fff", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", border: "1px solid #e0e0e0" }}>
                        <input type="email" placeholder="tu@email.com" disabled style={{ background: "transparent", border: "none", color: "#999", width: "100%", fontSize: "14px", outline: "none" }} />
                      </div>
                      <button style={{ ...theme.button, width: "100%" }}>Suscribirme</button>
                      <p style={{ color: "#5a9a5a", fontSize: "13px", marginTop: "12px" }}>🎁 Código: <strong>{mockNewsletterConfig.discount_code}</strong></p>
                    </div>
                  </Card>
                  <Card style={{ marginTop: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>Proveedores Disponibles</h3>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {providers.map((provider) => {
                        const isSelected = mockNewsletterConfig.provider === provider.id;
                        return (
                          <div key={provider.id} style={{
                            flex: 1,
                            padding: "16px",
                            borderRadius: "10px",
                            border: isSelected ? "2px solid #5a9a5a" : "1px solid #e8e8e8",
                            background: isSelected ? "#e8f5e8" : "#fff",
                            textAlign: "center",
                          }}>
                            <span style={{ fontSize: "28px" }}>{provider.icon}</span>
                            <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: "8px 0 0" }}>{provider.name}</p>
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

    case "notifications":
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
        { key: "customer_create", label: "Customer Create" },
        { key: "refund_create", label: "Refund Create" },
      ];
      const mockNotificationConfig = hasData ? true : null;
      const mockWebhookConfig = hasData ? { webhook_url: "https://your-backend.com/webhooks/shopify" } : null;
      return (
        <div style={theme.page}>
          <PageHeader
            icon="🔔"
            title="Notificaciones"
            description="Push notifications y webhooks"
          />
          {/* Push Notifications Section */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              📱 Push Notifications
            </h2>
            {!exists ? (
              <EmptyState
                icon="📱"
                title="Configurar Push Notifications"
                description="Notifica a tus usuarios sobre el estado de sus pedidos."
                action={{ label: "Crear Definición", onClick: () => {} }}
              />
            ) : (
              <>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Notification Config</h3>
                      <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>{mockNotificationConfig ? "Configurado" : "Sin configuración"}</p>
                    </div>
                    <button style={theme.buttonSecondary}>{mockNotificationConfig ? "Editar" : "Abrir"}</button>
                  </div>
                </Card>
                {mockNotificationConfig && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginTop: "16px" }}>
                    {notificationTypes.map((notif, i) => (
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
                        <span style={theme.badge(i < 6 ? "success" : "pending")}>{i < 6 ? "Sí" : "No"}</span>
                      </div>
                    ))}
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
            {!exists ? (
              <EmptyState
                icon="🔗"
                title="Configurar Webhooks"
                description="Recibe eventos en tiempo real de Shopify en tu backend."
                action={{ label: "Crear Definición", onClick: () => {} }}
              />
            ) : (
              <>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Webhook Config</h3>
                      <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>{mockWebhookConfig ? "Configurado" : "Sin configuración"}</p>
                    </div>
                    <button style={theme.buttonSecondary}>{mockWebhookConfig ? "Editar" : "Abrir"}</button>
                  </div>
                </Card>
                {mockWebhookConfig && (
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
                        {mockWebhookConfig.webhook_url}
                      </code>
                    </Card>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                      {webhookTypes.map((webhook, i) => (
                        <span key={webhook.key} style={theme.tag(i < 4)}>
                          {i < 4 && "✓ "}{webhook.label}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      );

    case "deep-links":
      const mockDeepLinkConfig = hasData ? {
        ios_bundle_id: "com.yourcompany.app",
        android_package: "com.yourcompany.app",
        shortio_domain: "link.yourstore.com",
        password_reset_prefix: "https://link.yourstore.com/reset",
        email_verify_prefix: "https://link.yourstore.com/verify",
        fallback_url: "https://yourstore.myshopify.com",
      } : null;
      return (
        <div style={theme.page}>
          <PageHeader
            icon="🔗"
            title="Deep Links"
            description="Enlaces para recuperación de contraseña y verificación"
            badge={exists ? { label: mockDeepLinkConfig ? "Configurado" : "Sin datos", type: mockDeepLinkConfig ? "success" : "warning" } : undefined}
          />
          {!exists ? (
            <EmptyState
              icon="🔗"
              title="Configurar Deep Links"
              description="Permite que los usuarios abran la app desde emails de recuperación de contraseña y enlaces compartidos."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Deep Link Config</h2>
                  <button style={theme.buttonSecondary}>{mockDeepLinkConfig ? "Editar" : "Abrir"}</button>
                </div>
              </Card>
              {mockDeepLinkConfig && (
                <>
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
                      <FieldDisplay label="Short.io Domain" value={mockDeepLinkConfig.shortio_domain} />
                      <FieldDisplay label="API Key" value="sk_xxxxxxxxxxxxx" masked />
                    </div>
                  </Card>
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
                        <FieldDisplay label="App ID" value="123456789" />
                        <FieldDisplay label="Bundle ID" value={mockDeepLinkConfig.ios_bundle_id} />
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
                        <FieldDisplay label="Package Name" value={mockDeepLinkConfig.android_package} />
                        <FieldDisplay label="SHA256" value="AB:CD:EF:12:34..." masked />
                      </div>
                    </Card>
                  </div>
                  <Card style={{ marginTop: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>Prefijos de Enlaces</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      <div style={{ padding: "14px", background: "#e8f5e8", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <span>🔐</span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "#2d5a2d" }}>Password Reset</span>
                        </div>
                        <code style={{ fontSize: "11px", color: "#5a9a5a", wordBreak: "break-all" }}>{mockDeepLinkConfig.password_reset_prefix}</code>
                      </div>
                      <div style={{ padding: "14px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <span>✉️</span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af" }}>Email Verify</span>
                        </div>
                        <code style={{ fontSize: "11px", color: "#3b82f6", wordBreak: "break-all" }}>{mockDeepLinkConfig.email_verify_prefix}</code>
                      </div>
                      <div style={{ padding: "14px", background: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <span>🌐</span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "#9a3412" }}>Fallback URL</span>
                        </div>
                        <code style={{ fontSize: "11px", color: "#d97706", wordBreak: "break-all" }}>{mockDeepLinkConfig.fallback_url}</code>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      );

    case "guide":
      const totalMetaobjects = Object.keys(METAOBJECT_DEFINITIONS).length;
      const totalFields = Object.values(METAOBJECT_DEFINITIONS).reduce(
        (acc, def) => acc + def.fieldDefinitions.length, 0
      );
      return (
        <div style={theme.page}>
          <PageHeader
            title="Guía de Campos"
            description="Referencia de todos los metaobjects y sus campos"
            badge={{ label: pluralize(totalMetaobjects, "metaobject", "metaobjects"), type: "success" }}
          />

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
            <Card style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a" }}>{totalMetaobjects}</div>
              <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>Metaobjects</div>
            </Card>
            <Card style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a" }}>{totalFields}</div>
              <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>Campos</div>
            </Card>
            <Card style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a" }}>{SETUP_SECTIONS.length}</div>
              <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>Secciones</div>
            </Card>
          </div>

          {/* Field Definitions Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {Object.entries(METAOBJECT_DEFINITIONS).slice(0, 6).map(([type, def]) => {
              const section = SETUP_SECTIONS.find(s => s.metaobjects.includes(type));
              return (
                <Card key={type} style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px" }}>{section?.icon || "📦"}</span>
                      <div>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>{def.name}</h3>
                        <code style={{ fontSize: "11px", color: "#666" }}>{type}</code>
                      </div>
                    </div>
                    <button style={{ ...theme.buttonSecondary, padding: "6px 12px", fontSize: "11px" }}>Abrir</button>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: "#fafafa" }}>
                        <th style={{ padding: "8px", textAlign: "left", color: "#666", fontWeight: "500" }}>Campo</th>
                        <th style={{ padding: "8px", textAlign: "left", color: "#666", fontWeight: "500" }}>Tipo</th>
                        <th style={{ padding: "8px", textAlign: "center", color: "#666", fontWeight: "500", width: "30px" }}>*</th>
                      </tr>
                    </thead>
                    <tbody>
                      {def.fieldDefinitions.slice(0, 4).map((field) => (
                        <tr key={field.key} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "8px", color: "#1a1a1a" }}>{field.name}</td>
                          <td style={{ padding: "8px", color: "#666", fontFamily: "monospace", fontSize: "10px" }}>
                            {field.type
                              .replace("single_line_text_field", "text")
                              .replace("multi_line_text_field", "multitext")
                              .replace("number_integer", "int")
                              .replace("number_decimal", "decimal")
                              .replace("collection_reference", "collection")
                              .replace("file_reference", "file")
                              .replace("rich_text_field", "rich")
                              .replace("list.single_line_text_field", "list")
                              .replace("list.collection_reference", "list")}
                          </td>
                          <td style={{ padding: "8px", textAlign: "center" }}>
                            {field.required
                              ? <span style={{ color: "#dc2626", fontWeight: "600" }}>●</span>
                              : <span style={{ color: "#e0e0e0" }}>○</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              );
            })}
          </div>

          {/* Type Reference */}
          <Card style={{ marginTop: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>Tipos de Campo</h3>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { label: "Texto", types: "text, multitext, rich" },
                { label: "Números", types: "int, decimal" },
                { label: "Referencias", types: "collection, product, file" },
                { label: "Otros", types: "boolean, date, url, json" },
              ].map((group) => (
                <div key={group.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#1a1a1a", fontWeight: "500" }}>{group.label}:</span>
                  <code style={{ fontSize: "11px", color: "#666", background: "#f5f5f5", padding: "4px 8px", borderRadius: "4px" }}>
                    {group.types}
                  </code>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );

    default:
      return (
        <div style={theme.page}>
          <PageHeader
            icon={SETUP_SECTIONS.find(s => s.route.includes(screenId))?.icon || "📦"}
            title={screenId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            description="Pantalla de configuración"
            badge={exists ? { label: "Configurado", type: "success" } : { label: "Pendiente", type: "pending" }}
          />
          {!exists ? (
            <EmptyState
              icon="⚙️"
              title={`Configurar ${screenId}`}
              description="Crea la definición para comenzar a configurar esta sección."
              action={{ label: "Crear Definición", onClick: () => {} }}
            />
          ) : (
            <Card>
              <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>
                Vista de configuración para {screenId}
              </p>
            </Card>
          )}
        </div>
      );
  }
}

// Dashboard Preview Component
function DashboardPreview({ state }: { state: ScreenState }) {
  // Different stats for each state
  const stats = state === "empty"
    ? { percentage: 0, complete: 0, noData: 0, missing: 17 }
    : state === "no-data"
    ? { percentage: 13, complete: 2, noData: 1, missing: 14 }
    : { percentage: 76, complete: 10, noData: 3, missing: 4 };

  // Mock sections data
  const mockSections = [
    { id: "home", icon: "🏠", title: "Home Setup", description: "Banners y colecciones", progress: state === "configured" ? 100 : state === "no-data" ? 0 : 0, isComplete: state === "configured", metaobjects: [{ name: "Home Banner", hasData: state === "configured" }, { name: "Featured Collection", hasData: state === "configured" }] },
    { id: "payments", icon: "💳", title: "Pagos", description: "Métodos de pago", progress: state === "configured" ? 100 : 0, isComplete: state === "configured", metaobjects: [{ name: "Payment Config", hasData: state === "configured" }] },
    { id: "shipping", icon: "📦", title: "Envíos", description: "Tiempos y devoluciones", progress: state === "configured" ? 100 : state === "no-data" ? 50 : 0, isComplete: state === "configured", metaobjects: [{ name: "Shipping Config", hasData: state === "configured" }] },
    { id: "content", icon: "📝", title: "Contenido", description: "FAQs y contacto", progress: state === "configured" ? 66 : 0, isComplete: false, metaobjects: [{ name: "FAQ Item", hasData: state === "configured" }, { name: "Contact Info", hasData: false }] },
    { id: "stores", icon: "🏪", title: "Tiendas", description: "Ubicaciones físicas", progress: 0, isComplete: false, metaobjects: [{ name: "Store Location", hasData: false }] },
    { id: "legal", icon: "📜", title: "Legal", description: "Políticas legales", progress: state === "configured" ? 100 : 0, isComplete: state === "configured", metaobjects: [{ name: "Legal Policy", hasData: state === "configured" }] },
  ];

  const incompleteSections = mockSections.filter(s => !s.isComplete);
  const nextSection = incompleteSections[0];
  const upcomingSections = incompleteSections.slice(1, 3);

  const showFullDashboard = state !== "empty";

  return (
    <div style={theme.page}>
      {/* Header Card */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <h1 style={theme.title}>Configuración</h1>
          <span style={theme.percentageDisplay}>{stats.percentage}%</span>
        </div>

        <div style={{ height: "6px", background: "#e8e8e8", borderRadius: "3px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${stats.percentage}%`, background: "#6b9b37", borderRadius: "3px" }} />
        </div>

        <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ ...theme.progressSegment, flex: stats.complete || 0.5, background: "#6b9b37" }}>
            <span style={theme.progressNumber}>{stats.complete}</span>
            <span style={theme.progressLabel}>COMPLETOS</span>
          </div>
          <div style={{ ...theme.progressSegment, flex: stats.noData || 0.5, background: "#e07b24" }}>
            <span style={theme.progressNumber}>{stats.noData}</span>
            <span style={theme.progressLabel}>SIN DATOS</span>
          </div>
          <div style={{ ...theme.progressSegment, flex: stats.missing || 0.5, background: "#b5b5b5" }}>
            <span style={theme.progressNumber}>{stats.missing}</span>
            <span style={theme.progressLabel}>PENDIENTES</span>
          </div>
        </div>
      </div>

      {/* Pasos Card */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={theme.sectionTitle}>Pasos</h2>
          <div style={theme.toggleButton}>
            <span>{stats.complete}/{mockSections.length}</span>
            <span style={{ fontSize: "12px", color: "#999" }}>▲</span>
          </div>
        </div>

        {!showFullDashboard ? (
          <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>
            Comienza creando las definiciones de metaobjects
          </p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: nextSection ? "1fr 2fr" : "1fr", gap: "24px" }}>
              {/* Siguiente sección */}
              {nextSection && (
                <div>
                  <p style={theme.label}>Siguiente sección</p>
                  <div style={{ ...theme.cardCompact, display: "flex", flexDirection: "column", height: "calc(100% - 32px)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={theme.iconWrapper}>{nextSection.icon}</span>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>{nextSection.title}</h3>
                      </div>
                      <span style={theme.badge(nextSection.progress > 0 ? "percent" : "pending")}>{nextSection.progress} %</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", margin: "0 0 16px", lineHeight: 1.5 }}>{nextSection.description}</p>
                    <div style={theme.progressBar}><div style={theme.progressFill(nextSection.progress)} /></div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px", flex: 1 }}>
                      {nextSection.metaobjects.map((mo, i) => (
                        <span key={i} style={theme.tag(mo.hasData)}>{mo.hasData && <span style={{ color: "#5a9a5a" }}>✓</span>}{mo.name}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: "16px", textAlign: "right" }}>
                      <span style={{ ...theme.configureLink, fontSize: "13px" }}>Configurar ›</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Próximas secciones */}
              {upcomingSections.length > 0 && (
                <div>
                  <p style={theme.label}>Próximas secciones</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                    {upcomingSections.map((section) => (
                      <div key={section.id} style={theme.cardCompact}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <span style={{ ...theme.iconWrapper, width: "28px", height: "28px", fontSize: "14px" }}>{section.icon}</span>
                          <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>{section.title}</h4>
                        </div>
                        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px", lineHeight: 1.5 }}>{section.description}</p>
                        <div style={{ ...theme.progressBar, marginTop: "8px" }}><div style={theme.progressFill(section.progress)} /></div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                          {section.metaobjects.slice(0, 2).map((mo, i) => (
                            <span key={i} style={{ ...theme.tag(mo.hasData), fontSize: "12px", padding: "4px 10px" }}>{mo.name}</span>
                          ))}
                        </div>
                        <div style={{ marginTop: "14px", textAlign: "right" }}>
                          <span style={{ ...theme.configureLink, fontSize: "13px" }}>Configurar ›</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <span style={theme.viewAllLink}>Ver todas →</span>
            </div>
          </>
        )}
      </div>

      {/* Secciones Card */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={theme.sectionTitle}>Secciones</h2>
          <input type="text" placeholder="Buscar..." style={{ ...theme.input, width: "200px" }} disabled />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", marginBottom: "0" }}>
          {[
            { key: "all", label: "Todas", count: mockSections.length },
            { key: "complete", label: "Completas", count: stats.complete },
            { key: "empty", label: "Sin datos", count: stats.noData },
            { key: "pending", label: "Pendientes", count: stats.missing },
          ].map((tab, i) => (
            <button key={tab.key} style={theme.filterTab(i === 0)}>
              {tab.label}<span style={theme.filterCount}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Sections list */}
        <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
          {mockSections.slice(0, 4).map((section, index) => (
            <div key={section.id}>
              <div style={{ ...theme.sectionRow(index === 0), borderTop: index === 0 ? "none" : undefined }}>
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <span style={theme.iconWrapper}>{section.icon}</span>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{section.title}</span>
                    <span style={{ fontSize: "13px", color: "#666", marginLeft: "12px" }}>{section.description}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={theme.badge(section.isComplete ? "success" : section.progress > 0 ? "percent" : "pending")}>
                    {section.isComplete ? "Completo" : section.progress > 0 ? `${section.progress} %` : "Pendiente"}
                  </span>
                  <span style={theme.chevron(index === 0)}>▼</span>
                </div>
              </div>
              {/* First row expanded */}
              {index === 0 && (
                <div style={theme.expandedContent}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {section.metaobjects.map((mo, i) => (
                      <span key={i} style={theme.tag(mo.hasData)}>
                        {mo.hasData && <span style={{ color: "#5a9a5a", marginRight: "4px" }}>✓</span>}{mo.name}
                      </span>
                    ))}
                  </div>
                  <button style={{ ...theme.button, display: "inline-flex" }}>Configurar ›</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* App Config Card - only for empty state */}
      {state === "empty" && (
        <div style={{ ...theme.card, textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙️</div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>Configuración de App</h3>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 24px" }}>Crea la configuración básica de tu app para comenzar.</p>
          <button style={{ ...theme.button, ...theme.buttonSuccess }}>Crear Configuración</button>
        </div>
      )}
    </div>
  );
}
