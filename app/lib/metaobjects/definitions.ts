// Metaobject definitions for the mobile app setup

export interface MetaobjectFieldDefinition {
  name: string;
  key: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface MetaobjectDefinition {
  name: string;
  type: string;
  description?: string;
  fieldDefinitions: MetaobjectFieldDefinition[];
}

export const METAOBJECT_DEFINITIONS: Record<string, MetaobjectDefinition> = {
  home_banner: {
    name: "Home Banner",
    type: "home_banner",
    description: "Banners rotativos en la parte superior del home",
    fieldDefinitions: [
      { name: "Title", key: "title", type: "single_line_text_field", required: true },
      { name: "Subtitle", key: "subtitle", type: "single_line_text_field" },
      { name: "Image", key: "image", type: "file_reference", required: true },
      { name: "Image Mobile", key: "image_mobile", type: "file_reference" },
      { name: "Link URL", key: "link_url", type: "url" },
      { name: "Link Type", key: "link_type", type: "single_line_text_field", description: "collection, product, external" },
      { name: "Active", key: "active", type: "boolean" },
      { name: "Order", key: "order", type: "number_integer" },
      { name: "Start Date", key: "start_date", type: "date" },
      { name: "End Date", key: "end_date", type: "date" },
    ],
  },

  home_featured_collection: {
    name: "Featured Collection",
    type: "home_featured_collection",
    description: "Colecciones destacadas que aparecen en home",
    fieldDefinitions: [
      { name: "Collection", key: "collection", type: "collection_reference", required: true },
      { name: "Display Title", key: "display_title", type: "single_line_text_field" },
      { name: "Subtitle", key: "subtitle", type: "single_line_text_field" },
      { name: "Background Image", key: "background_image", type: "file_reference" },
      { name: "Products to Show", key: "products_count", type: "number_integer" },
      { name: "Order", key: "order", type: "number_integer" },
      { name: "Active", key: "active", type: "boolean" },
      { name: "Layout Type", key: "layout_type", type: "single_line_text_field", description: "horizontal, grid, carousel" },
    ],
  },

  home_category_grid: {
    name: "Category Grid",
    type: "home_category_grid",
    description: "Grid de categorías navegables",
    fieldDefinitions: [
      { name: "Title", key: "title", type: "single_line_text_field" },
      { name: "Categories", key: "categories", type: "list.collection_reference" },
      { name: "Layout", key: "layout", type: "single_line_text_field", description: "2x2, 3x2, carousel" },
      { name: "Order", key: "order", type: "number_integer" },
      { name: "Active", key: "active", type: "boolean" },
    ],
  },

  faq_item: {
    name: "FAQ Item",
    type: "faq_item",
    description: "Preguntas frecuentes",
    fieldDefinitions: [
      { name: "Question", key: "question", type: "single_line_text_field", required: true },
      { name: "Answer", key: "answer", type: "multi_line_text_field", required: true },
      { name: "Category", key: "category", type: "single_line_text_field", description: "shipping, returns, payment, etc." },
      { name: "Order", key: "order", type: "number_integer" },
      { name: "Active", key: "active", type: "boolean" },
    ],
  },

  contact_info: {
    name: "Contact Info",
    type: "contact_info",
    description: "Información de contacto (singleton)",
    fieldDefinitions: [
      { name: "Phone", key: "phone", type: "single_line_text_field" },
      { name: "Email", key: "email", type: "single_line_text_field" },
      { name: "WhatsApp", key: "whatsapp", type: "single_line_text_field" },
      { name: "Address", key: "address", type: "multi_line_text_field" },
      { name: "Working Hours", key: "working_hours", type: "multi_line_text_field" },
      { name: "Map URL", key: "map_url", type: "url" },
      { name: "Social Instagram", key: "social_instagram", type: "url" },
      { name: "Social Facebook", key: "social_facebook", type: "url" },
      { name: "Social TikTok", key: "social_tiktok", type: "url" },
    ],
  },

  store_location: {
    name: "Store Location",
    type: "store_location",
    description: "Tiendas físicas",
    fieldDefinitions: [
      { name: "Name", key: "name", type: "single_line_text_field", required: true },
      { name: "Address", key: "address", type: "multi_line_text_field", required: true },
      { name: "City", key: "city", type: "single_line_text_field" },
      { name: "Province", key: "province", type: "single_line_text_field" },
      { name: "Postal Code", key: "postal_code", type: "single_line_text_field" },
      { name: "Country", key: "country", type: "single_line_text_field" },
      { name: "Phone", key: "phone", type: "single_line_text_field" },
      { name: "Latitude", key: "latitude", type: "number_decimal" },
      { name: "Longitude", key: "longitude", type: "number_decimal" },
      { name: "Image", key: "image", type: "file_reference" },
      { name: "Working Hours", key: "working_hours", type: "json" },
      { name: "Services", key: "services", type: "list.single_line_text_field" },
      { name: "Active", key: "active", type: "boolean" },
    ],
  },

  reviews_config: {
    name: "Reviews Config",
    type: "reviews_config",
    description: "Configuración de integración con Judge.me",
    fieldDefinitions: [
      { name: "Provider", key: "provider", type: "single_line_text_field", description: "judgeme, yotpo, stamped" },
      { name: "API Key", key: "api_key", type: "single_line_text_field" },
      { name: "Shop Domain", key: "shop_domain", type: "single_line_text_field" },
      { name: "Enabled", key: "enabled", type: "boolean" },
    ],
  },

  app_config: {
    name: "App Config",
    type: "app_config",
    description: "Configuración general de la app móvil",
    fieldDefinitions: [
      { name: "App Name", key: "app_name", type: "single_line_text_field" },
      { name: "Primary Color", key: "primary_color", type: "single_line_text_field" },
      { name: "Secondary Color", key: "secondary_color", type: "single_line_text_field" },
      { name: "Logo", key: "logo", type: "file_reference" },
      { name: "Splash Image", key: "splash_image", type: "file_reference" },
      { name: "Maintenance Mode", key: "maintenance_mode", type: "boolean" },
      { name: "Maintenance Message", key: "maintenance_message", type: "multi_line_text_field" },
      { name: "Min App Version iOS", key: "min_version_ios", type: "single_line_text_field" },
      { name: "Min App Version Android", key: "min_version_android", type: "single_line_text_field" },
    ],
  },

  // ========== NUEVOS METAOBJECTS ==========

  legal_policy: {
    name: "Legal Policy",
    type: "legal_policy",
    description: "Políticas legales (privacidad, términos, cookies)",
    fieldDefinitions: [
      { name: "Type", key: "type", type: "single_line_text_field", required: true, description: "privacy, terms, cookies, returns, shipping" },
      { name: "Title", key: "title", type: "single_line_text_field", required: true },
      { name: "Content", key: "content", type: "rich_text_field", required: true },
      { name: "Version", key: "version", type: "single_line_text_field" },
      { name: "Last Updated", key: "last_updated", type: "date" },
      { name: "Required for Registration", key: "required_registration", type: "boolean" },
      { name: "Required for Checkout", key: "required_checkout", type: "boolean" },
      { name: "Active", key: "active", type: "boolean" },
    ],
  },

  newsletter_config: {
    name: "Newsletter Config",
    type: "newsletter_config",
    description: "Configuración de newsletter y suscripciones",
    fieldDefinitions: [
      { name: "Enabled", key: "enabled", type: "boolean" },
      { name: "Provider", key: "provider", type: "single_line_text_field", description: "klaviyo, mailchimp, shopify" },
      { name: "API Key", key: "api_key", type: "single_line_text_field" },
      { name: "List ID", key: "list_id", type: "single_line_text_field" },
      { name: "Popup Title", key: "popup_title", type: "single_line_text_field" },
      { name: "Popup Message", key: "popup_message", type: "multi_line_text_field" },
      { name: "Popup Image", key: "popup_image", type: "file_reference" },
      { name: "Discount Code", key: "discount_code", type: "single_line_text_field" },
      { name: "Show on Home", key: "show_on_home", type: "boolean" },
      { name: "Show on Checkout", key: "show_on_checkout", type: "boolean" },
      { name: "Delay Seconds", key: "delay_seconds", type: "number_integer" },
    ],
  },

  notification_config: {
    name: "Notification Config",
    type: "notification_config",
    description: "Configuración de notificaciones push",
    fieldDefinitions: [
      { name: "Enabled", key: "enabled", type: "boolean" },
      { name: "Firebase Server Key", key: "firebase_server_key", type: "single_line_text_field" },
      { name: "Order Created", key: "notify_order_created", type: "boolean" },
      { name: "Order Shipped", key: "notify_order_shipped", type: "boolean" },
      { name: "Order Delivered", key: "notify_order_delivered", type: "boolean" },
      { name: "Order Cancelled", key: "notify_order_cancelled", type: "boolean" },
      { name: "Refund Processed", key: "notify_refund", type: "boolean" },
      { name: "Payment Failed", key: "notify_payment_failed", type: "boolean" },
      { name: "Abandoned Cart", key: "notify_abandoned_cart", type: "boolean" },
      { name: "Abandoned Cart Delay (hours)", key: "abandoned_cart_delay", type: "number_integer" },
      { name: "Promo Notifications", key: "notify_promo", type: "boolean" },
    ],
  },

  deep_link_config: {
    name: "Deep Link Config",
    type: "deep_link_config",
    description: "Configuración de deep links con Short.io",
    fieldDefinitions: [
      { name: "iOS App ID", key: "ios_app_id", type: "single_line_text_field" },
      { name: "iOS Bundle ID", key: "ios_bundle_id", type: "single_line_text_field" },
      { name: "Android Package", key: "android_package", type: "single_line_text_field" },
      { name: "Android SHA256", key: "android_sha256", type: "single_line_text_field" },
      { name: "Short.io Domain", key: "shortio_domain", type: "single_line_text_field", description: "Tu dominio de Short.io" },
      { name: "Short.io API Key", key: "shortio_api_key", type: "single_line_text_field" },
      { name: "Password Reset URL Prefix", key: "password_reset_prefix", type: "single_line_text_field" },
      { name: "Email Verification URL Prefix", key: "email_verify_prefix", type: "single_line_text_field" },
      { name: "Fallback Web URL", key: "fallback_url", type: "url" },
    ],
  },

  webhook_config: {
    name: "Webhook Config",
    type: "webhook_config",
    description: "Configuración de webhooks para la app",
    fieldDefinitions: [
      { name: "Webhook URL", key: "webhook_url", type: "url", required: true },
      { name: "Secret Key", key: "secret_key", type: "single_line_text_field" },
      { name: "Order Create", key: "order_create", type: "boolean" },
      { name: "Order Update", key: "order_update", type: "boolean" },
      { name: "Order Fulfilled", key: "order_fulfilled", type: "boolean" },
      { name: "Order Cancelled", key: "order_cancelled", type: "boolean" },
      { name: "Refund Create", key: "refund_create", type: "boolean" },
      { name: "Customer Create", key: "customer_create", type: "boolean" },
      { name: "Customer Update", key: "customer_update", type: "boolean" },
      { name: "Product Update", key: "product_update", type: "boolean" },
      { name: "Inventory Update", key: "inventory_update", type: "boolean" },
    ],
  },

  favorites_config: {
    name: "Favorites Config",
    type: "favorites_config",
    description: "Configuración de favoritos/wishlist",
    fieldDefinitions: [
      { name: "Sync Mode", key: "sync_mode", type: "single_line_text_field", description: "local, metafield, both" },
      { name: "Customer Metafield Namespace", key: "metafield_namespace", type: "single_line_text_field" },
      { name: "Customer Metafield Key", key: "metafield_key", type: "single_line_text_field" },
      { name: "Show Share Button", key: "show_share", type: "boolean" },
      { name: "Max Favorites", key: "max_favorites", type: "number_integer" },
      { name: "Enable Collections", key: "enable_collections", type: "boolean" },
    ],
  },

  payment_config: {
    name: "Payment Config",
    type: "payment_config",
    description: "Configuración de métodos de pago en la app",
    fieldDefinitions: [
      { name: "Apple Pay Enabled", key: "apple_pay_enabled", type: "boolean" },
      { name: "Google Pay Enabled", key: "google_pay_enabled", type: "boolean" },
      { name: "Credit Card Enabled", key: "credit_card_enabled", type: "boolean" },
      { name: "PayPal Enabled", key: "paypal_enabled", type: "boolean" },
      { name: "Klarna Enabled", key: "klarna_enabled", type: "boolean" },
      { name: "Cash on Delivery", key: "cod_enabled", type: "boolean" },
      { name: "Bank Transfer", key: "bank_transfer_enabled", type: "boolean" },
      { name: "Stripe Public Key", key: "stripe_public_key", type: "single_line_text_field" },
      { name: "PayPal Client ID", key: "paypal_client_id", type: "single_line_text_field" },
      { name: "Payment Instructions", key: "payment_instructions", type: "multi_line_text_field" },
    ],
  },

  shipping_config: {
    name: "Shipping Config",
    type: "shipping_config",
    description: "Configuración de envíos y devoluciones",
    fieldDefinitions: [
      { name: "Free Shipping Threshold", key: "free_shipping_threshold", type: "number_decimal" },
      { name: "Free Shipping Message", key: "free_shipping_message", type: "single_line_text_field" },
      { name: "Standard Shipping Days Min", key: "standard_days_min", type: "number_integer" },
      { name: "Standard Shipping Days Max", key: "standard_days_max", type: "number_integer" },
      { name: "Express Shipping Days Min", key: "express_days_min", type: "number_integer" },
      { name: "Express Shipping Days Max", key: "express_days_max", type: "number_integer" },
      { name: "Return Days Limit", key: "return_days", type: "number_integer" },
      { name: "Return Policy Summary", key: "return_policy_summary", type: "multi_line_text_field" },
      { name: "Shipping Info Text", key: "shipping_info", type: "multi_line_text_field" },
      { name: "Track Order URL", key: "track_order_url", type: "url" },
      { name: "Show Estimated Delivery", key: "show_estimated_delivery", type: "boolean" },
    ],
  },
};

export const SETUP_SECTIONS = [
  {
    id: "home",
    title: "Home Setup",
    description: "Configura banners, colecciones destacadas y grid de categorías",
    metaobjects: ["home_banner", "home_featured_collection", "home_category_grid"],
    route: "/app/home-setup",
    icon: "🏠",
  },
  {
    id: "content",
    title: "Contenido",
    description: "FAQs e información de contacto",
    metaobjects: ["faq_item", "contact_info"],
    route: "/app/content",
    icon: "📝",
  },
  {
    id: "stores",
    title: "Tiendas Físicas",
    description: "Configura las ubicaciones de tiendas físicas",
    metaobjects: ["store_location"],
    route: "/app/stores",
    icon: "🏪",
  },
  {
    id: "payments",
    title: "Métodos de Pago",
    description: "Configura los métodos de pago disponibles",
    metaobjects: ["payment_config"],
    route: "/app/payments",
    icon: "💳",
  },
  {
    id: "shipping",
    title: "Envíos & Devoluciones",
    description: "Tiempos de entrega, envío gratis y política de devoluciones",
    metaobjects: ["shipping_config"],
    route: "/app/shipping",
    icon: "📦",
  },
  {
    id: "legal",
    title: "Legal & Políticas",
    description: "Políticas de privacidad, términos y condiciones",
    metaobjects: ["legal_policy"],
    route: "/app/legal",
    icon: "📜",
  },
  {
    id: "notifications",
    title: "Notificaciones",
    description: "Push notifications y webhooks de pedidos",
    metaobjects: ["notification_config", "webhook_config"],
    route: "/app/notifications",
    icon: "🔔",
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Suscripciones y popups de email marketing",
    metaobjects: ["newsletter_config"],
    route: "/app/newsletter",
    icon: "📧",
  },
  {
    id: "favorites",
    title: "Favoritos",
    description: "Configuración de wishlist y sincronización",
    metaobjects: ["favorites_config"],
    route: "/app/favorites",
    icon: "❤️",
  },
  {
    id: "deep-links",
    title: "Deep Links",
    description: "Dynamic links para recuperar contraseña y más",
    metaobjects: ["deep_link_config"],
    route: "/app/deep-links",
    icon: "🔗",
  },
  {
    id: "reviews",
    title: "Reviews",
    description: "Integración con Judge.me u otros proveedores",
    metaobjects: ["reviews_config"],
    route: "/app/reviews",
    icon: "⭐",
  },
];
