# Metaobjects Definitions

Documentación detallada de los metaobjects que la app móvil necesita para funcionar.

## 🏠 Home Section Metaobjects

### 1. `home_banner`

Banners rotativos en la parte superior del home.

```graphql
mutation CreateHomeBannerDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Home Banner"
    type: "home_banner"
    fieldDefinitions: [
      { name: "Title", key: "title", type: "single_line_text_field", required: true }
      { name: "Subtitle", key: "subtitle", type: "single_line_text_field" }
      { name: "Image", key: "image", type: "file_reference", required: true }
      { name: "Image Mobile", key: "image_mobile", type: "file_reference" }
      { name: "Link URL", key: "link_url", type: "url" }
      { name: "Link Type", key: "link_type", type: "single_line_text_field" }  # collection, product, external
      { name: "Active", key: "active", type: "boolean" }
      { name: "Order", key: "order", type: "number_integer" }
      { name: "Start Date", key: "start_date", type: "date" }
      { name: "End Date", key: "end_date", type: "date" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

**Uso en la app:**
- Carrusel principal en HomePagejn
- Filtrar por `active: true` y fechas vigentes
- Ordenar por `order`

---

### 2. `home_featured_collection`

Colecciones destacadas que aparecen en home.

```graphql
mutation CreateFeaturedCollectionDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Featured Collection"
    type: "home_featured_collection"
    fieldDefinitions: [
      { name: "Collection", key: "collection", type: "collection_reference", required: true }
      { name: "Display Title", key: "display_title", type: "single_line_text_field" }
      { name: "Subtitle", key: "subtitle", type: "single_line_text_field" }
      { name: "Background Image", key: "background_image", type: "file_reference" }
      { name: "Products to Show", key: "products_count", type: "number_integer" }
      { name: "Order", key: "order", type: "number_integer" }
      { name: "Active", key: "active", type: "boolean" }
      { name: "Layout Type", key: "layout_type", type: "single_line_text_field" }  # horizontal, grid, carousel
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

---

### 3. `home_category_grid`

Grid de categorías navegables.

```graphql
mutation CreateCategoryGridDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Category Grid"
    type: "home_category_grid"
    fieldDefinitions: [
      { name: "Title", key: "title", type: "single_line_text_field" }
      { name: "Categories", key: "categories", type: "list.collection_reference" }
      { name: "Layout", key: "layout", type: "single_line_text_field" }  # 2x2, 3x2, carousel
      { name: "Order", key: "order", type: "number_integer" }
      { name: "Active", key: "active", type: "boolean" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

---

## 📄 Content Metaobjects

### 4. `faq_item`

Preguntas frecuentes.

```graphql
mutation CreateFaqDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "FAQ Item"
    type: "faq_item"
    fieldDefinitions: [
      { name: "Question", key: "question", type: "single_line_text_field", required: true }
      { name: "Answer", key: "answer", type: "multi_line_text_field", required: true }
      { name: "Category", key: "category", type: "single_line_text_field" }  # shipping, returns, payment, etc.
      { name: "Order", key: "order", type: "number_integer" }
      { name: "Active", key: "active", type: "boolean" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

---

### 5. `contact_info`

Información de contacto (singleton).

```graphql
mutation CreateContactInfoDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Contact Info"
    type: "contact_info"
    fieldDefinitions: [
      { name: "Phone", key: "phone", type: "single_line_text_field" }
      { name: "Email", key: "email", type: "single_line_text_field" }
      { name: "WhatsApp", key: "whatsapp", type: "single_line_text_field" }
      { name: "Address", key: "address", type: "multi_line_text_field" }
      { name: "Working Hours", key: "working_hours", type: "multi_line_text_field" }
      { name: "Map URL", key: "map_url", type: "url" }
      { name: "Social Instagram", key: "social_instagram", type: "url" }
      { name: "Social Facebook", key: "social_facebook", type: "url" }
      { name: "Social TikTok", key: "social_tiktok", type: "url" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

---

## 📍 Store Locations

### 6. `store_location`

Tiendas físicas (complementa Shopify Locations).

```graphql
mutation CreateStoreLocationDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Store Location"
    type: "store_location"
    fieldDefinitions: [
      { name: "Name", key: "name", type: "single_line_text_field", required: true }
      { name: "Address", key: "address", type: "multi_line_text_field", required: true }
      { name: "City", key: "city", type: "single_line_text_field" }
      { name: "Province", key: "province", type: "single_line_text_field" }
      { name: "Postal Code", key: "postal_code", type: "single_line_text_field" }
      { name: "Country", key: "country", type: "single_line_text_field" }
      { name: "Phone", key: "phone", type: "single_line_text_field" }
      { name: "Latitude", key: "latitude", type: "number_decimal" }
      { name: "Longitude", key: "longitude", type: "number_decimal" }
      { name: "Image", key: "image", type: "file_reference" }
      { name: "Working Hours", key: "working_hours", type: "json" }
      { name: "Services", key: "services", type: "list.single_line_text_field" }
      { name: "Active", key: "active", type: "boolean" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

---

## ⭐ Reviews Integration

### 7. `reviews_config`

Configuración de integración con Judge.me.

```graphql
mutation CreateReviewsConfigDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Reviews Config"
    type: "reviews_config"
    fieldDefinitions: [
      { name: "Provider", key: "provider", type: "single_line_text_field" }  # judgeme, yotpo, stamped
      { name: "API Key", key: "api_key", type: "single_line_text_field" }
      { name: "Shop Domain", key: "shop_domain", type: "single_line_text_field" }
      { name: "Enabled", key: "enabled", type: "boolean" }
    ]
    access: { storefront: PUBLIC_READ }  # Cuidado: API key visible
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

> ⚠️ **Nota de seguridad**: Considerar si el API key debe estar en metaobjects públicos o manejarse de otra forma.

---

## 📱 App Config

### 8. `app_config`

Configuración general de la app.

```graphql
mutation CreateAppConfigDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "App Config"
    type: "app_config"
    fieldDefinitions: [
      { name: "App Name", key: "app_name", type: "single_line_text_field" }
      { name: "Primary Color", key: "primary_color", type: "single_line_text_field" }
      { name: "Secondary Color", key: "secondary_color", type: "single_line_text_field" }
      { name: "Logo", key: "logo", type: "file_reference" }
      { name: "Splash Image", key: "splash_image", type: "file_reference" }
      { name: "Maintenance Mode", key: "maintenance_mode", type: "boolean" }
      { name: "Maintenance Message", key: "maintenance_message", type: "multi_line_text_field" }
      { name: "Min App Version iOS", key: "min_version_ios", type: "single_line_text_field" }
      { name: "Min App Version Android", key: "min_version_android", type: "single_line_text_field" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type }
    userErrors { field message }
  }
}
```

---

## 🔍 Queries para la App Móvil

### Obtener toda la configuración de Home

```graphql
query GetHomeConfig {
  # Banners
  homeBanners: metaobjects(type: "home_banner", first: 10) {
    nodes {
      id
      title: field(key: "title") { value }
      subtitle: field(key: "subtitle") { value }
      image: field(key: "image") { reference { ... on MediaImage { image { url } } } }
      linkUrl: field(key: "link_url") { value }
      order: field(key: "order") { value }
      active: field(key: "active") { value }
    }
  }

  # Featured Collections
  featuredCollections: metaobjects(type: "home_featured_collection", first: 10) {
    nodes {
      id
      displayTitle: field(key: "display_title") { value }
      collection: field(key: "collection") {
        reference {
          ... on Collection {
            id
            title
            handle
            products(first: 8) { nodes { id title } }
          }
        }
      }
      order: field(key: "order") { value }
    }
  }
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear todas las definiciones de metaobjects
- [ ] Crear entradas de ejemplo para testing
- [ ] Verificar acceso desde Storefront API
- [ ] Actualizar queries en la app Flutter
- [ ] Documentar proceso para nuevos clientes
