import type { HeadersFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { theme } from "../lib/styles";
import { METAOBJECT_DEFINITIONS, SETUP_SECTIONS, pluralize } from "../lib";
import { PageHeader, Card } from "../components/ui";

export default function GuidePage() {
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
        {Object.entries(METAOBJECT_DEFINITIONS).map(([type, def]) => {
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
                <button
                  style={{ ...theme.buttonSecondary, padding: "6px 12px", fontSize: "11px" }}
                  onClick={() => window.open(`shopify://admin/content/entries/${type}`, "_blank")}
                >
                  Abrir
                </button>
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
                  {def.fieldDefinitions.map((field) => (
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
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
