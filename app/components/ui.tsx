import { Link } from "react-router";
import { theme } from "../lib/styles";
import { pluralize } from "../lib";

// ============ PAGE LAYOUT ============

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: string;
  badge?: { label: string; type: "success" | "warning" | "pending" };
}

export function PageHeader({ title, description, icon, badge }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Link to="/app" style={{
        color: "#666",
        textDecoration: "none",
        fontSize: "13px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        marginBottom: "12px",
      }}>
        ← Dashboard
      </Link>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {icon && <span style={{ fontSize: "28px" }}>{icon}</span>}
          <div>
            <h1 style={theme.title}>{title}</h1>
            <p style={{ ...theme.subtitle, marginTop: "4px" }}>{description}</p>
          </div>
        </div>
        {badge && <span style={theme.badge(badge.type)}>{badge.label}</span>}
      </div>
    </div>
  );
}

// ============ CARDS ============

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return <div style={{ ...theme.card, ...style }}>{children}</div>;
}

// ============ EMPTY STATE ============

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    loadingLabel?: string;
    onClick: () => void;
    loading?: boolean;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>{icon}</div>
      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "14px", color: "#666", margin: "0 0 24px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
        {description}
      </p>
      {action && (
        <button
          style={{
            ...theme.button,
            ...theme.buttonSuccess,
            opacity: action.loading ? 0.7 : 1,
            cursor: action.loading ? "wait" : "pointer",
          }}
          onClick={action.onClick}
          disabled={action.loading}
        >
          {action.loading ? (action.loadingLabel || "Cargando...") : action.label}
        </button>
      )}
    </Card>
  );
}

// ============ METAOBJECT CARD ============

interface MetaobjectCardProps {
  icon: string;
  name: string;
  description: string;
  exists: boolean;
  count?: number;
  items?: { id: string; handle?: string }[];
  onCreateDefinition: () => void;
  onManage: () => void;
  onCreateNew: () => void;
  loading?: boolean;
  loadingType?: string;
  type: string;
}

export function MetaobjectCard({
  icon, name, description, exists, count = 0, items = [],
  onCreateDefinition, onManage, onCreateNew, loading, loadingType, type
}: MetaobjectCardProps) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ fontSize: "32px" }}>{icon}</span>
        <span style={theme.badge(exists ? (count > 0 ? "success" : "warning") : "pending")}>
          {exists ? (count > 0 ? pluralize(count, "entrada", "entradas") : "Sin datos") : "No creado"}
        </span>
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px" }}>{name}</h3>
      <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px" }}>{description}</p>

      {!exists ? (
        <button
          style={theme.button}
          onClick={onCreateDefinition}
          disabled={loading}
        >
          {loading && loadingType === type ? "Creando..." : "Crear Definición"}
        </button>
      ) : (
        <>
          {items.length > 0 && (
            <div style={{
              background: "#f8f8f8",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              border: "1px solid #f0f0f0"
            }}>
              {items.slice(0, 3).map((item) => (
                <p key={item.id} style={{ fontSize: "13px", color: "#666", margin: "4px 0" }}>
                  • {item.handle || item.id.split("/").pop()}
                </p>
              ))}
              {items.length > 3 && (
                <p style={{ fontSize: "12px", color: "#999", margin: "8px 0 0" }}>
                  ... y {items.length - 3} más
                </p>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px" }}>
            <button style={theme.buttonSecondary} onClick={onManage}>
              Gestionar
            </button>
            <button style={theme.buttonSecondary} onClick={onCreateNew}>
              + Nueva
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

// ============ CONFIG SECTION ============

interface ConfigSectionProps {
  title: string;
  exists: boolean;
  configured: boolean;
  onCreateDefinition: () => void;
  onCreateTemplate: () => void;
  onManage: () => void;
  loading?: boolean;
  loadingAction?: string | null;
  children?: React.ReactNode;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ConfigSection({
  title, exists, configured, onCreateDefinition, onCreateTemplate, onManage,
  loading, loadingAction, children, emptyIcon = "⚙️", emptyTitle, emptyDescription
}: ConfigSectionProps) {
  if (!exists) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle || `Configurar ${title}`}
        description={emptyDescription || `Crea la configuración de ${title.toLowerCase()} para tu app.`}
        action={{
          label: "Crear Definición",
          loadingLabel: "Creando...",
          onClick: onCreateDefinition,
          loading: loading && loadingAction === "create_definition",
        }}
      />
    );
  }

  return (
    <>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>{title}</h2>
              <span style={theme.badge(configured ? "success" : "warning")}>
                {configured ? "Configurado" : "Sin datos"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {!configured && (
              <button
                style={{ ...theme.button, ...theme.buttonSuccess }}
                onClick={onCreateTemplate}
                disabled={loading}
              >
                {loading && loadingAction === "create_template" ? "Creando..." : "Crear Plantilla"}
              </button>
            )}
            <button style={theme.buttonSecondary} onClick={onManage}>
              {configured ? "Editar" : "Abrir"}
            </button>
          </div>
        </div>
      </Card>
      {configured && children}
    </>
  );
}

// ============ DATA GRID ============

interface DataItemProps {
  icon?: string;
  label: string;
  value: string | React.ReactNode;
  status?: "active" | "inactive";
}

export function DataItem({ icon, label, value, status }: DataItemProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      background: "#fff",
      border: "1px solid #e8e8e8",
      borderRadius: "10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {icon && <span style={{ fontSize: "20px" }}>{icon}</span>}
        <div>
          <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>{label}</p>
          {typeof value === "string" ? (
            <p style={{ fontSize: "13px", color: "#666", margin: "2px 0 0" }}>{value}</p>
          ) : value}
        </div>
      </div>
      {status !== undefined && (
        <span style={theme.badge(status === "active" ? "success" : "pending")}>
          {status === "active" ? "Activo" : "Inactivo"}
        </span>
      )}
    </div>
  );
}

// ============ FIELD DISPLAY ============

interface FieldDisplayProps {
  label: string;
  value?: string | null;
  masked?: boolean;
}

export function FieldDisplay({ label, value, masked }: FieldDisplayProps) {
  const displayValue = !value ? "No configurado" : masked ? `****${value.slice(-4)}` : value;

  return (
    <div style={{
      padding: "14px 16px",
      background: "#fafafa",
      border: "1px solid #f0f0f0",
      borderRadius: "8px",
    }}>
      <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 4px" }}>
        {label}
      </p>
      <p style={{ fontSize: "14px", color: value ? "#1a1a1a" : "#999", margin: 0 }}>
        {displayValue}
      </p>
    </div>
  );
}

// ============ ALERT ============

interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

export function Alert({ type, children }: AlertProps) {
  return <div style={theme.alert(type)}>{children}</div>;
}

// ============ ACTION BUTTONS ============

interface ActionButtonsProps {
  onManage: () => void;
  onSettings?: () => void;
  manageLabel?: string;
  settingsLabel?: string;
}

export function ActionButtons({ onManage, onSettings, manageLabel = "Gestionar", settingsLabel }: ActionButtonsProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
      <button style={theme.buttonSecondary} onClick={onManage}>
        {manageLabel}
      </button>
      {onSettings && settingsLabel && (
        <button style={theme.buttonSecondary} onClick={onSettings}>
          {settingsLabel}
        </button>
      )}
    </div>
  );
}
