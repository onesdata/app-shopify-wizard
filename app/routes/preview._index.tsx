// Preview Dashboard - Sin autenticación Shopify
// Para screenshots y testing visual

import { useState } from "react";
import { Link } from "react-router";
import { theme } from "../lib/styles";
import { SETUP_SECTIONS, pluralize } from "../lib";

// Mock data para simular diferentes estados
const MOCK_STATS = {
  empty: { percentage: 0, complete: 0, empty: 0, missing: 17 },
  partial: { percentage: 35, complete: 4, empty: 3, missing: 10 },
  complete: { percentage: 100, complete: 17, empty: 0, missing: 0 },
};

const MOCK_SECTIONS = SETUP_SECTIONS.map((section, i) => ({
  ...section,
  isComplete: i < 2,
  progress: i < 2 ? 100 : i < 5 ? 50 : 0,
  metaobjects: section.metaobjects.map((type, j) => ({
    type,
    name: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    hasData: i < 2 || j === 0,
  })),
}));

export default function PreviewDashboard() {
  const [dataState, setDataState] = useState<"empty" | "partial" | "complete">("partial");
  const [filter, setFilter] = useState<"all" | "complete" | "empty" | "pending">("all");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  const stats = MOCK_STATS[dataState];
  const setupStatus = dataState === "empty"
    ? MOCK_SECTIONS.map(s => ({ ...s, isComplete: false, progress: 0, metaobjects: s.metaobjects.map(m => ({ ...m, hasData: false })) }))
    : dataState === "complete"
    ? MOCK_SECTIONS.map(s => ({ ...s, isComplete: true, progress: 100, metaobjects: s.metaobjects.map(m => ({ ...m, hasData: true })) }))
    : MOCK_SECTIONS;

  const filteredSections = setupStatus.filter((section) => {
    if (filter === "complete") return section.isComplete;
    if (filter === "empty") return !section.isComplete && section.progress > 0;
    if (filter === "pending") return section.progress === 0;
    return true;
  });

  const incompleteSections = setupStatus.filter(s => !s.isComplete);
  const nextSection = incompleteSections[0];
  const upcomingSections = incompleteSections.slice(1, 3);

  const completeCount = setupStatus.filter(s => s.isComplete).length;
  const emptyCount = setupStatus.filter(s => !s.isComplete && s.progress > 0).length;
  const pendingCount = setupStatus.filter(s => s.progress === 0).length;

  return (
    <div style={theme.page}>
      {/* State Switcher for Testing */}
      <div style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        background: "#1a1a1a",
        padding: "12px 16px",
        borderRadius: "10px",
        display: "flex",
        gap: "8px",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        <span style={{ color: "#fff", fontSize: "12px", marginRight: "8px" }}>Estado:</span>
        {(["empty", "partial", "complete"] as const).map((state) => (
          <button
            key={state}
            onClick={() => setDataState(state)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: dataState === state ? "#5a9a5a" : "#333",
              color: "#fff",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {state === "empty" ? "Vacío" : state === "partial" ? "Parcial" : "Completo"}
          </button>
        ))}
        <Link to="/preview/screens" style={{
          padding: "6px 12px",
          borderRadius: "6px",
          background: "#3b82f6",
          color: "#fff",
          fontSize: "12px",
          textDecoration: "none",
          marginLeft: "8px",
        }}>
          Ver Todas →
        </Link>
      </div>

      {/* Header Card */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <h1 style={theme.title}>Configuración</h1>
          <span style={theme.percentageDisplay}>{stats.percentage}%</span>
        </div>

        <div style={{ height: "6px", background: "#e8e8e8", borderRadius: "3px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${stats.percentage}%`,
            background: "#6b9b37",
            borderRadius: "3px",
            transition: "width 0.5s ease",
          }} />
        </div>

        <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ ...theme.progressSegment, flex: stats.complete || 0.5, background: "#6b9b37" }}>
            <span style={theme.progressNumber}>{stats.complete}</span>
            <span style={theme.progressLabel}>COMPLETOS</span>
          </div>
          <div style={{ ...theme.progressSegment, flex: stats.empty || 0.5, background: "#e07b24" }}>
            <span style={theme.progressNumber}>{stats.empty}</span>
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
          <button onClick={() => setShowSteps(!showSteps)} style={theme.toggleButton}>
            <span>{completeCount}/{setupStatus.length}</span>
            <span style={{ fontSize: "12px", color: "#999" }}>{showSteps ? "▲" : "▼"}</span>
          </button>
        </div>

        {showSteps && nextSection && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
              <div>
                <p style={theme.label}>Siguiente sección</p>
                <div style={{ ...theme.cardCompact, display: "flex", flexDirection: "column", height: "calc(100% - 32px)" }}>
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
                    <Link to={`/preview${nextSection.route.replace("/app", "")}`} style={{ ...theme.configureLink, fontSize: "13px" }}>
                      Configurar <span style={{ fontSize: "14px" }}>›</span>
                    </Link>
                  </div>
                </div>
              </div>

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

                        <div style={{ marginTop: "14px", textAlign: "right" }}>
                          <Link to={`/preview${section.route.replace("/app", "")}`} style={{ ...theme.configureLink, fontSize: "13px" }}>
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
              <button onClick={() => setShowSteps(false)} style={theme.viewAllLink}>
                Ver todas →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Secciones Card */}
      <div style={theme.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={theme.sectionTitle}>Secciones</h2>
          <input
            type="text"
            placeholder="Buscar..."
            style={{ ...theme.input, width: "200px" }}
          />
        </div>

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

        <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
          {filteredSections.map((section, index) => (
            <div key={section.id}>
              <div
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                style={{
                  ...theme.sectionRow(expandedSection === section.id),
                  borderTop: index === 0 ? "none" : undefined,
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
                  <Link to={`/preview${section.route.replace("/app", "")}`} style={{
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

      {/* Info Banner */}
      <div style={{
        marginTop: "16px",
        padding: "16px 20px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <span style={{ fontSize: "20px" }}>ℹ️</span>
        <p style={{ margin: 0, color: "#1e40af", fontSize: "13px" }}>
          <strong>Modo Preview:</strong> Esta vista usa datos simulados. La app real funciona embebida en Shopify Admin.
        </p>
      </div>
    </div>
  );
}
