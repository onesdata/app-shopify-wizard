# Shopify Setup Wizard - Documentación Técnica

## Información General

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | Shopify Setup Wizard |
| **Tipo** | Aplicación Embebida Shopify |
| **Framework** | React Router 7 + TypeScript |
| **Base de Datos** | Prisma + SQLite |
| **API Version** | Shopify Admin API October 2025 |
| **Distribución** | App Store |

---

## Descripción del Proyecto

Shopify Setup Wizard es una aplicación embebida de Shopify diseñada para configurar y gestionar los metaobjetos necesarios para una aplicación móvil de e-commerce. La aplicación proporciona una interfaz visual para crear, editar y validar todas las configuraciones que la app móvil necesita para funcionar correctamente.

### Problema que Resuelve

Las aplicaciones móviles de e-commerce requieren configuraciones específicas (banners, FAQs, tiendas físicas, configuración de pagos, etc.) que normalmente están dispersas en diferentes sistemas. Esta aplicación centraliza toda esa configuración en metaobjetos de Shopify, permitiendo:

- Gestión centralizada de contenido
- Validación visual del estado de configuración
- Acceso via Storefront API desde la app móvil
- Consistencia entre tienda web y app móvil

---

## Arquitectura del Sistema

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - React Router 7 (File-based routing)                  │
│  - Shopify App Bridge React                             │
│  - Dark Theme UI Components                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Node.js)                      │
│  - React Router Server Functions                        │
│  - Shopify App Package                                  │
│  - GraphQL Admin API Client                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Shopify Platform                       │
│  - Admin GraphQL API                                    │
│  - Metaobject Definitions                               │
│  - Metaobject Entries                                   │
│  - OAuth Authentication                                 │
└─────────────────────────────────────────────────────────┘
```

### Estructura de Carpetas

```
shopify-setup-wizard/
├── app/
│   ├── routes/                    # Rutas de la aplicación
│   │   ├── app.tsx               # Layout principal
│   │   ├── app._index.tsx        # Dashboard
│   │   ├── app.home-setup.tsx    # Configuración Home
│   │   ├── app.content.tsx       # FAQs y Contacto
│   │   ├── app.stores.tsx        # Tiendas físicas
│   │   ├── app.payments.tsx      # Configuración pagos
│   │   ├── app.shipping.tsx      # Envíos y devoluciones
│   │   ├── app.legal.tsx         # Políticas legales
│   │   ├── app.newsletter.tsx    # Newsletter
│   │   ├── app.notifications.tsx # Notificaciones push
│   │   ├── app.deep-links.tsx    # Deep links
│   │   ├── app.favorites.tsx     # Favoritos/Wishlist
│   │   ├── app.reviews.tsx       # Reseñas
│   │   ├── app.guide.tsx         # Guía de referencia
│   │   ├── auth.login/           # Autenticación
│   │   └── webhooks.*/           # Webhooks
│   ├── lib/
│   │   ├── graphql/
│   │   │   └── metaobjects.ts    # Queries y mutations GraphQL
│   │   ├── metaobjects/
│   │   │   └── definitions.ts    # Definiciones de metaobjetos
│   │   └── styles.ts             # Sistema de estilos
│   ├── shopify.server.ts         # Configuración Shopify
│   └── db.server.ts              # Cliente Prisma
├── prisma/
│   └── schema.prisma             # Esquema de base de datos
└── shopify.app.toml              # Configuración de la app
```

---

## Metaobjetos Definidos

La aplicación gestiona **16 tipos de metaobjetos** organizados en **11 secciones**:

### 1. Home Setup
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `home_banner` | Banners rotativos del home | Múltiple |
| `home_featured_collection` | Colecciones destacadas | Múltiple |
| `home_category_grid` | Grid de categorías navegables | Múltiple |

### 2. Contenido
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `faq_item` | Preguntas frecuentes | Múltiple |
| `contact_info` | Información de contacto global | Singleton |

### 3. Tiendas
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `store_location` | Ubicaciones de tiendas físicas | Múltiple |

### 4. Pagos
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `payment_config` | Configuración de métodos de pago | Singleton |

### 5. Envíos
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `shipping_config` | Configuración de envíos y devoluciones | Singleton |

### 6. Legal
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `legal_policy` | Políticas legales (privacidad, términos, etc.) | Múltiple |

### 7. Notificaciones
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `notification_config` | Configuración de push notifications | Singleton |
| `webhook_config` | Configuración de webhooks | Singleton |

### 8. Newsletter
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `newsletter_config` | Configuración de email marketing | Singleton |

### 9. Favoritos
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `favorites_config` | Configuración de wishlist | Singleton |

### 10. Deep Links
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `deep_link_config` | Configuración de deep links (Short.io) | Singleton |

### 11. Reviews
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `reviews_config` | Integración con proveedores de reseñas | Singleton |

### 12. App Config (Global)
| Metaobjeto | Descripción | Tipo |
|------------|-------------|------|
| `app_config` | Configuración general de la app móvil | Singleton |

---

## Detalle de Campos por Metaobjeto

### home_banner
```
| Campo         | Tipo              | Requerido | Descripción                    |
|---------------|-------------------|-----------|--------------------------------|
| title         | single_line_text  | Sí        | Título del banner              |
| subtitle      | single_line_text  | No        | Subtítulo                      |
| image         | file_reference    | No        | Imagen desktop                 |
| image_mobile  | file_reference    | No        | Imagen móvil                   |
| link_url      | url               | No        | URL de destino                 |
| link_type     | single_line_text  | No        | Tipo: product/collection/page  |
| active        | boolean           | No        | Estado activo                  |
| order         | number_integer    | No        | Orden de visualización         |
| start_date    | date_time         | No        | Fecha inicio                   |
| end_date      | date_time         | No        | Fecha fin                      |
```

### home_featured_collection
```
| Campo            | Tipo                   | Requerido | Descripción              |
|------------------|------------------------|-----------|--------------------------|
| collection       | collection_reference   | No        | Referencia a colección   |
| display_title    | single_line_text       | No        | Título personalizado     |
| subtitle         | single_line_text       | No        | Subtítulo                |
| background_image | file_reference         | No        | Imagen de fondo          |
| products_count   | number_integer         | No        | Productos a mostrar      |
| order            | number_integer         | No        | Orden                    |
| active           | boolean                | No        | Estado activo            |
| layout_type      | single_line_text       | No        | grid/carousel/featured   |
```

### app_config
```
| Campo               | Tipo              | Requerido | Descripción                |
|---------------------|-------------------|-----------|----------------------------|
| app_name            | single_line_text  | No        | Nombre de la app           |
| primary_color       | single_line_text  | No        | Color primario (hex)       |
| secondary_color     | single_line_text  | No        | Color secundario (hex)     |
| logo                | file_reference    | No        | Logo de la app             |
| splash_image        | file_reference    | No        | Imagen de splash           |
| maintenance_mode    | boolean           | No        | Modo mantenimiento         |
| maintenance_message | multi_line_text   | No        | Mensaje de mantenimiento   |
| min_version_ios     | single_line_text  | No        | Versión mínima iOS         |
| min_version_android | single_line_text  | No        | Versión mínima Android     |
```

### store_location
```
| Campo         | Tipo              | Requerido | Descripción              |
|---------------|-------------------|-----------|--------------------------|
| name          | single_line_text  | Sí        | Nombre de la tienda      |
| address       | single_line_text  | Sí        | Dirección                |
| city          | single_line_text  | No        | Ciudad                   |
| province      | single_line_text  | No        | Provincia                |
| postal_code   | single_line_text  | No        | Código postal            |
| country       | single_line_text  | No        | País                     |
| phone         | single_line_text  | No        | Teléfono                 |
| latitude      | single_line_text  | No        | Latitud                  |
| longitude     | single_line_text  | No        | Longitud                 |
| image         | file_reference    | No        | Imagen de la tienda      |
| working_hours | json              | No        | Horarios (JSON)          |
| services      | list.single_line  | No        | Servicios disponibles    |
| active        | boolean           | No        | Estado activo            |
```

### payment_config
```
| Campo               | Tipo              | Requerido | Descripción              |
|---------------------|-------------------|-----------|--------------------------|
| apple_pay_enabled   | boolean           | No        | Apple Pay activo         |
| google_pay_enabled  | boolean           | No        | Google Pay activo        |
| credit_card_enabled | boolean           | No        | Tarjeta activo           |
| paypal_enabled      | boolean           | No        | PayPal activo            |
| klarna_enabled      | boolean           | No        | Klarna activo            |
| cod_enabled         | boolean           | No        | Contrareembolso activo   |
| bank_transfer       | boolean           | No        | Transferencia activo     |
| stripe_public_key   | single_line_text  | No        | Stripe public key        |
| paypal_client_id    | single_line_text  | No        | PayPal client ID         |
| payment_instructions| multi_line_text   | No        | Instrucciones de pago    |
```

### notification_config
```
| Campo                    | Tipo              | Requerido | Descripción                |
|--------------------------|-------------------|-----------|----------------------------|
| enabled                  | boolean           | No        | Notificaciones activas     |
| firebase_server_key      | single_line_text  | No        | Firebase server key        |
| notify_order_created     | boolean           | No        | Notificar pedido creado    |
| notify_order_shipped     | boolean           | No        | Notificar pedido enviado   |
| notify_order_delivered   | boolean           | No        | Notificar entregado        |
| notify_order_cancelled   | boolean           | No        | Notificar cancelado        |
| notify_refund            | boolean           | No        | Notificar reembolso        |
| notify_payment_failed    | boolean           | No        | Notificar pago fallido     |
| notify_abandoned_cart    | boolean           | No        | Notificar carrito          |
| abandoned_cart_delay     | number_integer    | No        | Delay carrito (minutos)    |
| notify_promo             | boolean           | No        | Notificar promociones      |
```

### deep_link_config
```
| Campo                | Tipo              | Requerido | Descripción              |
|----------------------|-------------------|-----------|--------------------------|
| ios_app_id           | single_line_text  | No        | iOS App ID               |
| ios_bundle_id        | single_line_text  | No        | iOS Bundle ID            |
| android_package      | single_line_text  | No        | Android package name     |
| android_sha256       | single_line_text  | No        | Android SHA256           |
| shortio_domain       | single_line_text  | No        | Dominio Short.io         |
| shortio_api_key      | single_line_text  | No        | API Key Short.io         |
| password_reset_prefix| single_line_text  | No        | Prefijo reset password   |
| email_verify_prefix  | single_line_text  | No        | Prefijo verificación     |
| fallback_url         | url               | No        | URL fallback             |
```

---

## Operaciones GraphQL

### Queries

#### GET_METAOBJECT_DEFINITIONS
```graphql
query GetMetaobjectDefinitions {
  metaobjectDefinitions(first: 50) {
    nodes {
      id
      name
      type
      fieldDefinitions {
        key
        name
        type { name }
        required
      }
    }
  }
}
```

#### GET_METAOBJECTS_BY_TYPE
```graphql
query GetMetaobjectsByType($type: String!, $first: Int!) {
  metaobjects(type: $type, first: $first) {
    nodes {
      id
      handle
      type
      fields {
        key
        value
        reference { ... }
        references(first: 10) { ... }
      }
    }
  }
}
```

#### GET_SHOP_INFO
```graphql
query GetShopInfo {
  shop {
    name
    email
    primaryDomain { url host }
    myshopifyDomain
  }
}
```

### Mutations

#### CREATE_METAOBJECT_DEFINITION
```graphql
mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { id type name }
    userErrors { field message }
  }
}
```

#### CREATE_METAOBJECT
```graphql
mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
  metaobjectCreate(metaobject: $metaobject) {
    metaobject { id handle type }
    userErrors { field message }
  }
}
```

#### UPDATE_METAOBJECT
```graphql
mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
  metaobjectUpdate(id: $id, metaobject: $metaobject) {
    metaobject { id handle }
    userErrors { field message }
  }
}
```

#### DELETE_METAOBJECT
```graphql
mutation DeleteMetaobject($id: ID!) {
  metaobjectDelete(id: $id) {
    deletedId
    userErrors { field message }
  }
}
```

---

## Flujo de Trabajo de Usuario

### 1. Dashboard (Vista Principal)
```
┌─────────────────────────────────────────────────────────┐
│  Header con Progreso General                            │
│  [████████████████░░░░░░░░] 75% Completado              │
├─────────────────────────────────────────────────────────┤
│  Stats: ✓ 12 Completos | ○ 3 Sin Datos | ✗ 1 Faltante  │
├─────────────────────────────────────────────────────────┤
│  Preview App Config (colores, versiones, mantenimiento) │
├─────────────────────────────────────────────────────────┤
│  Grid de Secciones                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │Home     │ │Contenido│ │Tiendas  │ │Pagos    │       │
│  │100%     │ │50%      │ │0%       │ │100%     │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 2. Flujo de Configuración por Sección
```
1. Usuario accede a sección (ej: Home Setup)
           │
           ▼
2. Sistema verifica si existen las definiciones
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
[No existe]   [Existe]
    │             │
    ▼             ▼
3a. Muestra    3b. Carga datos
    botón          existentes
    "Crear"        │
    │              ▼
    ▼          4. Muestra formulario
4a. Crea           de edición
    definición     │
    │              ▼
    ▼          5. Usuario edita
5a. Muestra        y guarda
    formulario     │
    vacío          ▼
    │          6. Sistema actualiza
    ▼              metaobjeto
6a. Usuario
    crea datos
```

### 3. Estados de Validación
| Estado | Color | Significado |
|--------|-------|-------------|
| ✓ Completo | Verde | Definición existe y tiene datos |
| ○ Sin Datos | Amarillo | Definición existe pero sin entradas |
| ✗ Faltante | Rojo | Definición no creada |

---

## Permisos de API Requeridos

```toml
[access_scopes]
scopes = """
  read_products,
  read_content,
  write_content,
  read_metaobjects,
  write_metaobjects,
  read_metaobject_definitions,
  write_metaobject_definitions,
  read_locations,
  read_files,
  write_files
"""
```

---

## Webhooks Configurados

| Webhook | Acción |
|---------|--------|
| `app/uninstalled` | Elimina todas las sesiones de la tienda |
| `app/scopes_update` | Actualiza los permisos en la sesión |

---

## Sistema de Estilos

La aplicación utiliza un tema oscuro consistente (`darkTheme`):

### Colores Principales
- **Fondo página**: `#f5f5f5`
- **Fondo cards**: `rgba(20, 20, 20, 0.95)`
- **Texto primario**: `#ffffff`
- **Texto secundario**: `#888888`
- **Éxito**: `#10b981` / `#22c55e`
- **Advertencia**: `#f59e0b`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

### Componentes de Estilos
```typescript
darkTheme = {
  page,           // Contenedor de página
  card,           // Tarjeta contenedora
  header,         // Cabecera de página
  title,          // Título principal
  subtitle,       // Subtítulo
  button,         // Botón primario
  buttonSecondary,// Botón secundario
  buttonSuccess,  // Botón éxito
  buttonDanger,   // Botón peligro
  input,          // Campo de entrada
  select,         // Selector
  badge(type),    // Etiqueta de estado
  alert(type),    // Alerta
  progressBar,    // Barra de progreso
  grid,           // Grid de cards
  // ... más componentes
}
```

---

## Guía de Desarrollo

### Añadir Nuevo Metaobjeto

1. **Definir en `definitions.ts`**:
```typescript
export const METAOBJECT_DEFINITIONS: Record<string, MetaobjectDefinition> = {
  // ... existing
  new_type: {
    name: "New Type Display Name",
    type: "new_type",
    description: "Description for developers",
    fieldDefinitions: [
      { name: "Field Name", key: "field_key", type: "single_line_text", required: true },
      // ... more fields
    ],
  },
};
```

2. **Añadir a `SETUP_SECTIONS`**:
```typescript
export const SETUP_SECTIONS = [
  // ... existing
  {
    id: "new-section",
    title: "New Section",
    description: "Section description",
    route: "/app/new-section",
    icon: "🆕",
    metaobjects: ["new_type"],
  },
];
```

3. **Crear ruta `app.new-section.tsx`** siguiendo el patrón existente.

### Patrón de Ruta Estándar

```typescript
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { authenticate } from "../shopify.server";
import { darkTheme } from "../lib/styles";
import { METAOBJECT_DEFINITIONS } from "../lib/metaobjects/definitions";
import { /* GraphQL imports */ } from "../lib/graphql/metaobjects";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // 1. Verificar si existe la definición
  // 2. Si existe, cargar datos
  // 3. Retornar estado

  return { definitionExists, data, definition };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("action");

  // Handle: create_definition, create, update, delete

  return { success: true, message: "..." };
};

export default function NewSectionPage() {
  const { definitionExists, data } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  // Render UI
}
```

---

## Integración con App Móvil

La app móvil consume los metaobjetos via **Storefront API**:

```graphql
query GetAppConfig {
  metaobjects(type: "app_config", first: 1) {
    nodes {
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image { url }
          }
        }
      }
    }
  }
}
```

### Acceso Público
Todos los metaobjetos se crean con `access: { storefront: "PUBLIC_READ" }` para permitir lectura desde la Storefront API sin autenticación.

---

## Troubleshooting

### Error: "Metaobject definition already exists"
La definición ya fue creada. Ir a Shopify Admin > Content > Metaobjects para gestionar.

### Error: "Handle already taken"
El handle del metaobjeto ya existe. Usar un handle único o actualizar el existente.

### Dashboard carga lento
El dashboard hace múltiples queries en paralelo. Si persiste la lentitud, verificar la conexión o considerar caché.

### Campos no aparecen en la app móvil
Verificar que:
1. El metaobjeto tiene `storefront: PUBLIC_READ`
2. Los campos están poblados (no vacíos)
3. La query de Storefront incluye todos los campos necesarios

---

## Enlaces Útiles

- [Shopify Metaobjects Documentation](https://shopify.dev/docs/apps/custom-data/metaobjects)
- [Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Admin API Reference](https://shopify.dev/docs/api/admin-graphql)
- [React Router Documentation](https://reactrouter.com/)

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2025-01 | Versión inicial con 16 metaobjetos |

---

*Documento generado para el proyecto Shopify Setup Wizard - Onestic*
