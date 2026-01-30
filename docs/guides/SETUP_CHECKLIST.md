# Setup Checklist para Nuevos Clientes

Checklist manual de referencia para configurar una tienda Shopify nueva.

## 📋 Pre-requisitos

- [ ] Tienda Shopify activa (plan Basic o superior)
- [ ] Acceso de admin a la tienda
- [ ] Cuenta de Judge.me (si se usan reviews)
- [ ] Assets del cliente (logos, colores, imágenes)

---

## 1️⃣ Configuración Inicial de Shopify

### Tienda
- [ ] Verificar plan de Shopify (necesita al menos Basic)
- [ ] Configurar idioma principal (Español)
- [ ] Configurar moneda (EUR)
- [ ] Configurar zona horaria

### Productos
- [ ] Importar catálogo de productos
- [ ] Verificar imágenes de productos
- [ ] Configurar variantes si aplica
- [ ] Configurar precios y descuentos

### Colecciones
- [ ] Crear colecciones principales (categorías)
- [ ] Crear colección "Destacados"
- [ ] Crear colección "Novedades"
- [ ] Crear colección "Ofertas"
- [ ] Verificar reglas automáticas de colecciones

---

## 2️⃣ Metaobjects (Configuración de App)

### Home Banners
- [ ] Crear definición `home_banner`
- [ ] Añadir banners principales (mínimo 2-3)
- [ ] Configurar links de cada banner
- [ ] Verificar imágenes (1920x600 desktop, 750x400 mobile)

### Colecciones Destacadas
- [ ] Crear definición `home_featured_collection`
- [ ] Vincular colecciones existentes
- [ ] Configurar orden de aparición
- [ ] Configurar layout (horizontal/grid)

### FAQs
- [ ] Crear definición `faq_item`
- [ ] Añadir preguntas frecuentes por categoría:
  - [ ] Envíos
  - [ ] Devoluciones
  - [ ] Pagos
  - [ ] Cuenta
  - [ ] Productos

### Información de Contacto
- [ ] Crear definición `contact_info`
- [ ] Añadir datos de contacto:
  - [ ] Teléfono
  - [ ] Email
  - [ ] WhatsApp (si aplica)
  - [ ] Dirección
  - [ ] Horarios
  - [ ] Redes sociales

### Tiendas Físicas (si aplica)
- [ ] Crear definición `store_location`
- [ ] Añadir cada tienda con:
  - [ ] Nombre
  - [ ] Dirección completa
  - [ ] Coordenadas GPS
  - [ ] Horarios
  - [ ] Teléfono
  - [ ] Imagen

---

## 3️⃣ Integración Judge.me (Reviews)

- [ ] Instalar app Judge.me en Shopify
- [ ] Obtener API key de Judge.me
- [ ] Configurar widgets de reviews (si se usan en web)
- [ ] Verificar que las reviews se sincronizan
- [ ] Configurar emails de solicitud de review

### Datos necesarios para la app:
```
API Key: _______________
Shop Domain: _______________.myshopify.com
```

---

## 4️⃣ Configuración de App Móvil

### Firebase
- [ ] Crear proyecto en Firebase Console
- [ ] Configurar Firebase para iOS
  - [ ] Añadir `GoogleService-Info.plist`
  - [ ] Configurar Bundle ID
- [ ] Configurar Firebase para Android
  - [ ] Añadir `google-services.json`
  - [ ] Configurar Package Name
- [ ] Habilitar Firebase Cloud Messaging
- [ ] Habilitar Firebase Analytics
- [ ] Habilitar Firebase Crashlytics

### Push Notifications
- [ ] Configurar APNs para iOS
- [ ] Verificar FCM para Android
- [ ] Probar envío de notificación de prueba

### Deep Links
- [ ] Configurar dominio para deep links
- [ ] Configurar `assetlinks.json` (Android)
- [ ] Configurar `apple-app-site-association` (iOS)

---

## 5️⃣ Testing

### Funcionalidad Básica
- [ ] Login/Registro funciona
- [ ] Catálogo carga correctamente
- [ ] Búsqueda funciona
- [ ] Carrito funciona
- [ ] Checkout funciona
- [ ] Pedidos se crean correctamente

### Home
- [ ] Banners cargan y rotan
- [ ] Colecciones destacadas aparecen
- [ ] Links funcionan correctamente

### Contenido
- [ ] FAQs cargan correctamente
- [ ] Información de contacto aparece
- [ ] Tiendas físicas aparecen en mapa

### Reviews
- [ ] Reviews cargan en productos
- [ ] Puntuación promedio se muestra
- [ ] Usuario puede crear review

---

## 6️⃣ Go-Live

- [ ] Verificar todos los puntos anteriores
- [ ] Probar en dispositivos reales (iOS + Android)
- [ ] Verificar analytics funcionan
- [ ] Configurar alertas de Crashlytics
- [ ] Documentar cualquier configuración especial
- [ ] Entregar credenciales al cliente

---

## 📝 Notas del Setup

**Cliente:** _______________
**Fecha de setup:** _______________
**Responsable:** _______________

### Configuraciones especiales:
```
(Anotar aquí cualquier configuración particular de este cliente)
```

### Credenciales entregadas:
- [ ] Firebase Console
- [ ] Shopify Admin
- [ ] Judge.me Dashboard
- [ ] App Store Connect / Google Play Console
