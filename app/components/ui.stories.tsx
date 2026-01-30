import type { Meta, StoryObj } from "@storybook/react";
import {
  PageHeader,
  Card,
  EmptyState,
  MetaobjectCard,
  FieldDisplay,
  Alert,
  DataItem,
} from "./ui";

// Simple decorator wrapper (components don't need router context)
const withRouter = (Story: any) => (
  <div style={{ background: "#f5f5f5", padding: "24px", minHeight: "100vh" }}>
    <Story />
  </div>
);

// ==================== PAGE HEADER ====================

const pageHeaderMeta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  decorators: [withRouter],
  tags: ["autodocs"],
};

export default pageHeaderMeta;

type PageHeaderStory = StoryObj<typeof PageHeader>;

export const Default: PageHeaderStory = {
  args: {
    title: "Home Setup",
    description: "Banners, colecciones destacadas y categorías",
    icon: "🏠",
  },
};

export const WithSuccessBadge: PageHeaderStory = {
  args: {
    title: "Métodos de Pago",
    description: "Métodos de pago disponibles en la app",
    icon: "💳",
    badge: { label: "Configurado", type: "success" },
  },
};

export const WithWarningBadge: PageHeaderStory = {
  args: {
    title: "Envíos",
    description: "Tiempos de entrega y devoluciones",
    icon: "📦",
    badge: { label: "Sin datos", type: "warning" },
  },
};

export const WithPendingBadge: PageHeaderStory = {
  args: {
    title: "Reviews",
    description: "Integración con proveedores de reseñas",
    icon: "⭐",
    badge: { label: "Pendiente", type: "pending" },
  },
};

// ==================== CARD ====================

export const CardStory: StoryObj<typeof Card> = {
  render: () => (
    <Card>
      <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 8px" }}>
        Card Title
      </h2>
      <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
        This is a basic card component with some content inside.
      </p>
    </Card>
  ),
  decorators: [withRouter],
};

// ==================== EMPTY STATE ====================

export const EmptyStateDefault: StoryObj<typeof EmptyState> = {
  render: () => (
    <EmptyState
      icon="📦"
      title="No hay datos"
      description="Aún no has configurado esta sección. Haz clic en el botón para comenzar."
      action={{
        label: "Crear Definición",
        onClick: () => alert("Crear!"),
      }}
    />
  ),
  decorators: [withRouter],
};

export const EmptyStateLoading: StoryObj<typeof EmptyState> = {
  render: () => (
    <EmptyState
      icon="⏳"
      title="Configurar Pagos"
      description="Define los métodos de pago disponibles en tu app."
      action={{
        label: "Crear Definición",
        loadingLabel: "Creando...",
        onClick: () => {},
        loading: true,
      }}
    />
  ),
  decorators: [withRouter],
};

// ==================== METAOBJECT CARD ====================

export const MetaobjectCardNotCreated: StoryObj<typeof MetaobjectCard> = {
  render: () => (
    <div style={{ maxWidth: "400px" }}>
      <MetaobjectCard
        icon="🖼️"
        name="Home Banner"
        description="Banners rotativos para la página principal"
        exists={false}
        count={0}
        items={[]}
        type="home_banner"
        onCreateDefinition={() => alert("Create definition")}
        onManage={() => {}}
        onCreateNew={() => {}}
      />
    </div>
  ),
  decorators: [withRouter],
};

export const MetaobjectCardEmpty: StoryObj<typeof MetaobjectCard> = {
  render: () => (
    <div style={{ maxWidth: "400px" }}>
      <MetaobjectCard
        icon="⭐"
        name="Featured Collection"
        description="Colección destacada en el home"
        exists={true}
        count={0}
        items={[]}
        type="home_featured_collection"
        onCreateDefinition={() => {}}
        onManage={() => alert("Manage")}
        onCreateNew={() => alert("Create new")}
      />
    </div>
  ),
  decorators: [withRouter],
};

export const MetaobjectCardWithData: StoryObj<typeof MetaobjectCard> = {
  render: () => (
    <div style={{ maxWidth: "400px" }}>
      <MetaobjectCard
        icon="📱"
        name="Category Grid"
        description="Grid de categorías en el home"
        exists={true}
        count={5}
        items={[
          { id: "1", handle: "categoria-1" },
          { id: "2", handle: "categoria-2" },
          { id: "3", handle: "categoria-3" },
          { id: "4", handle: "categoria-4" },
          { id: "5", handle: "categoria-5" },
        ]}
        type="home_category_grid"
        onCreateDefinition={() => {}}
        onManage={() => alert("Manage")}
        onCreateNew={() => alert("Create new")}
      />
    </div>
  ),
  decorators: [withRouter],
};

// ==================== FIELD DISPLAY ====================

export const FieldDisplayDefault: StoryObj<typeof FieldDisplay> = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", maxWidth: "800px" }}>
      <FieldDisplay label="API Key" value="sk_live_xxxxxxxxxxxx" />
      <FieldDisplay label="Shop Domain" value="mi-tienda.myshopify.com" />
      <FieldDisplay label="Stripe Key" value="pk_live_xxxxxxx" masked />
      <FieldDisplay label="No configurado" value={null} />
    </div>
  ),
  decorators: [withRouter],
};

// ==================== ALERT ====================

export const AlertSuccess: StoryObj<typeof Alert> = {
  render: () => (
    <Alert type="success">Configuración guardada correctamente.</Alert>
  ),
  decorators: [withRouter],
};

export const AlertWarning: StoryObj<typeof Alert> = {
  render: () => (
    <Alert type="warning">Algunos campos no están configurados.</Alert>
  ),
  decorators: [withRouter],
};

export const AlertError: StoryObj<typeof Alert> = {
  render: () => (
    <Alert type="error">Error al guardar la configuración. Por favor, inténtalo de nuevo.</Alert>
  ),
  decorators: [withRouter],
};

export const AlertInfo: StoryObj<typeof Alert> = {
  render: () => (
    <Alert type="info">Los cambios se aplicarán en la próxima sincronización.</Alert>
  ),
  decorators: [withRouter],
};

// ==================== DATA ITEM ====================

export const DataItemDefault: StoryObj<typeof DataItem> = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
      <DataItem icon="🍎" label="Apple Pay" value="Método de pago digital" status="active" />
      <DataItem icon="🤖" label="Google Pay" value="Método de pago digital" status="active" />
      <DataItem icon="💵" label="Contrareembolso" value="Pago en efectivo" status="inactive" />
    </div>
  ),
  decorators: [withRouter],
};

// ==================== COMBINED EXAMPLES ====================

export const FullPageExample: StoryObj = {
  render: () => (
    <div>
      <PageHeader
        icon="💳"
        title="Métodos de Pago"
        description="Métodos de pago disponibles en la app"
        badge={{ label: "Configurado", type: "success" }}
      />

      <Alert type="info">Última actualización: hace 5 minutos</Alert>

      <Card>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
          Payment Config
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          <FieldDisplay label="Stripe Public Key" value="pk_live_xxxxxxx" masked />
          <FieldDisplay label="PayPal Client ID" value="AxxxxxxxxxxxxxxB" masked />
        </div>
      </Card>

      <Card style={{ marginTop: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 16px" }}>
          Métodos Activos
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <DataItem icon="🍎" label="Apple Pay" value="Digital wallet" status="active" />
          <DataItem icon="💳" label="Tarjeta" value="Visa, Mastercard, Amex" status="active" />
        </div>
      </Card>
    </div>
  ),
  decorators: [withRouter],
};
