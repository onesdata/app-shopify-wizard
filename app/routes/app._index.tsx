import type { HeadersFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, Link, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { getFieldValue } from "../domain/entities";
import { METAOBJECT_DEFINITIONS } from "../lib/metaobjects/definitions";
import { theme } from "../lib/styles";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const dashboardData = await services.useCases.getDashboardData.execute();
  return dashboardData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const actionType = formData.get("action");
    const services = createServiceContainer(admin);

    if (actionType === "create_app_config") {
      const defResult = await services.useCases.createDefinition.execute("app_config");
      if (!defResult.success && !defResult.error?.includes("already been taken")) {
        return { success: false, error: defResult.error };
      }

      const definition = METAOBJECT_DEFINITIONS.app_config;
      const fields = definition.fieldDefinitions.map((field) => {
        let defaultValue = "";
        if (field.key === "app_name") defaultValue = "Mi App";
        if (field.key === "primary_color") defaultValue = "#6366f1";
        if (field.key === "secondary_color") defaultValue = "#8b5cf6";
        if (field.key === "min_version_ios") defaultValue = "1.0.0";
        if (field.key === "min_version_android") defaultValue = "1.0.0";
        if (field.key === "maintenance_mode") defaultValue = "false";
        return { key: field.key, value: defaultValue };
      });

      const createResult = await services.useCases.createMetaobject.execute({
        type: "app_config",
        handle: "app-config",
        fields,
      });

      if (!createResult.success) {
        return { success: false, error: createResult.error };
      }
      return { success: true, message: "Configuración de app creada correctamente" };
    }
    return { success: false, error: "Acción desconocida" };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, error: error?.message || "Error desconocido" };
  }
};

export default function Dashboard() {
  const { setupStatus, appConfig, stats } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [filter, setFilter] = useState<"all" | "complete" | "empty" | "pending">("all");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSteps, setShowSteps] = useState(true);

  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.message) {
      shopify.toast.show(fetcher.data.message);
    }
    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopify]);

  // Filter sections
  const filteredSections = setupStatus.filter((section) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!section.title.toLowerCase().includes(query) && !section.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filter === "complete") return section.isComplete;
    if (filter === "empty") return !section.isComplete && section.progress > 0;
    if (filter === "pending") return section.progress === 0;
    return true;
  });

  // Get sections for "Pasos" card
  const incompleteSections = setupStatus.filter(s => !s.isComplete);
  const nextSection = incompleteSections[0];
  const upcomingSections = incompleteSections.slice(1, 3);

  // Counts for filter tabs
  const completeCount = setupStatus.filter(s => s.isComplete).length;
  const emptyCount = setupStatus.filter(s => !s.isComplete && s.progress > 0).length;
  const pendingCount = setupStatus.filter(s => s.progress === 0).length;

  return (
    <div style={theme.page}>
      {/* ===== HEADER CARD - Configuración ===== */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <h1 style={theme.title}>Configuración</h1>
          <span style={theme.percentageDisplay}>{stats.percentage}%</span>
        </div>

        {/* Thin progress bar */}
        <div style={{ height: "6px", background: "#e8e8e8", borderRadius: "3px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${stats.percentage}%`,
            background: "#6b9b37",
            borderRadius: "3px",
            transition: "width 0.5s ease",
          }} />
        </div>

        {/* Segmented progress bar */}
        <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{
            ...theme.progressSegment,
            flex: stats.complete || 0.5,
            background: "#6b9b37",
          }}>
            <span style={theme.progressNumber}>{stats.complete}</span>
            <span style={theme.progressLabel}>COMPLETOS</span>
          </div>
          <div style={{
            ...theme.progressSegment,
            flex: stats.empty || 0.5,
            background: "#e07b24",
          }}>
            <span style={theme.progressNumber}>{stats.empty}</span>
            <span style={theme.progressLabel}>SIN DATOS</span>
          </div>
          <div style={{
            ...theme.progressSegment,
            flex: stats.missing || 0.5,
            background: "#b5b5b5",
          }}>
            <span style={theme.progressNumber}>{stats.missing}</span>
            <span style={theme.progressLabel}>PENDIENTES</span>
          </div>
        </div>
      </div>

      {/* ===== PASOS CARD ===== */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={theme.sectionTitle}>Pasos</h2>
          <button
            onClick={() => setShowSteps(!showSteps)}
            style={theme.toggleButton}
          >
            <span>{completeCount}/{setupStatus.length}</span>
            <span style={{ fontSize: "12px", color: "#999" }}>{showSteps ? "▲" : "▼"}</span>
          </button>
        </div>

        {showSteps && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: nextSection ? "1fr 2fr" : "1fr", gap: "24px" }}>
              {/* Siguiente sección */}
              {nextSection && (
                <div>
                  <p style={theme.label}>Siguiente sección</p>
                  <div style={{
                    ...theme.cardCompact,
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100% - 32px)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={theme.iconWrapper}>{nextSection.icon}</span>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                          {nextSection.title}
                        </h3>
                      </div>
                      <span style={theme.badge(nextSection.progress > 0 ? "percent" : "pending")}>
                        {nextSection.progress} %
                      </span>
                    </div>

                    <p style={{ fontSize: "14px", color: "#666", margin: "0 0 16px", lineHeight: 1.5 }}>
                      {nextSection.description}
                    </p>

                    <div style={theme.progressBar}>
                      <div style={theme.progressFill(nextSection.progress)} />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px", flex: 1 }}>
                      {nextSection.metaobjects.map((mo) => (
                        <span key={mo.type} style={theme.tag(mo.hasData)}>
                          {mo.hasData && <span style={{ color: "#5a9a5a" }}>✓</span>}
                          {mo.name}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: "16px", textAlign: "right" }}>
                      <Link to={nextSection.route} style={{ ...theme.configureLink, fontSize: "13px" }}>
                        Configurar <span style={{ fontSize: "14px" }}>›</span>
                      </Link>
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
                          <span style={{ ...theme.iconWrapper, width: "28px", height: "28px", fontSize: "14px" }}>
                            {section.icon}
                          </span>
                          <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                            {section.title}
                          </h4>
                        </div>

                        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px", lineHeight: 1.5 }}>
                          {section.description}
                        </p>

                        <div style={{ ...theme.progressBar, marginTop: "8px" }}>
                          <div style={theme.progressFill(section.progress)} />
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                          {section.metaobjects.slice(0, 2).map((mo) => (
                            <span key={mo.type} style={{ ...theme.tag(mo.hasData), fontSize: "12px", padding: "4px 10px" }}>
                              {mo.name}
                            </span>
                          ))}
                        </div>

                        <div style={{ marginTop: "14px", textAlign: "right" }}>
                          <Link to={section.route} style={{ ...theme.configureLink, fontSize: "13px" }}>
                            Configurar <span style={{ fontSize: "14px" }}>›</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                onClick={() => {
                  setShowSteps(false);
                  setFilter("all");
                  setTimeout(() => {
                    document.getElementById("secciones-card")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                style={theme.viewAllLink}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                Ver todas →
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===== SECCIONES CARD ===== */}
      <div id="secciones-card" style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={theme.sectionTitle}>Secciones</h2>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...theme.input, width: "200px" }}
            onFocus={(e) => Object.assign(e.target.style, theme.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#e8e8e8", boxShadow: "none" })}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", marginBottom: "0" }}>
          {[
            { key: "all", label: "Todas", count: setupStatus.length },
            { key: "complete", label: "Completas", count: completeCount },
            { key: "empty", label: "Sin datos", count: emptyCount },
            { key: "pending", label: "Pendientes", count: pendingCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              style={theme.filterTab(filter === tab.key)}
            >
              {tab.label}
              <span style={theme.filterCount}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Sections list */}
        <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
          {filteredSections.map((section, index) => (
            <div key={section.id}>
              <div
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                style={{
                  ...theme.sectionRow(expandedSection === section.id),
                  borderTop: index === 0 ? "none" : undefined,
                }}
                onMouseEnter={(e) => {
                  if (expandedSection !== section.id) {
                    e.currentTarget.style.background = "#fafafa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (expandedSection !== section.id) {
                    e.currentTarget.style.background = "#ffffff";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <span style={theme.iconWrapper}>{section.icon}</span>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                      {section.title}
                    </span>
                    <span style={{ fontSize: "13px", color: "#666", marginLeft: "12px" }}>
                      {section.description}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={theme.badge(
                    section.isComplete ? "success" : section.progress > 0 ? "percent" : "pending"
                  )}>
                    {section.isComplete ? "Completo" : section.progress > 0 ? `${section.progress} %` : "Pendiente"}
                  </span>
                  <span style={theme.chevron(expandedSection === section.id)}>▼</span>
                </div>
              </div>

              {/* Expanded content */}
              {expandedSection === section.id && (
                <div style={theme.expandedContent}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {section.metaobjects.map((mo) => (
                      <span key={mo.type} style={theme.tag(mo.hasData)}>
                        {mo.hasData && <span style={{ color: "#5a9a5a", marginRight: "4px" }}>✓</span>}
                        {mo.name}
                      </span>
                    ))}
                  </div>
                  <Link to={section.route} style={{
                    ...theme.button,
                    display: "inline-flex",
                    textDecoration: "none",
                  }}>
                    Configurar ›
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== APP CONFIG - Only if not configured ===== */}
      {!appConfig && (
        <div style={{ ...theme.card, textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙️</div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>
            Configuración de App
          </h3>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 24px" }}>
            Crea la configuración básica de tu app para comenzar.
          </p>
          <fetcher.Form method="post">
            <input type="hidden" name="action" value="create_app_config" />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...theme.button,
                ...theme.buttonSuccess,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "wait" : "pointer",
              }}
            >
              {isLoading ? "Creando..." : "Crear Configuración"}
            </button>
          </fetcher.Form>
        </div>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
