# CLAUDE.md - Shopify Mobile App Integration Guide

## Project Overview

This Flutter mobile app integrates with a Shopify store using **Metaobjects** as the primary configuration system. All app configurations, content, and settings are stored in Shopify Metaobjects and accessed via the **Storefront API**.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Flutter Mobile App                     │
│  - BLoC/Provider for state management                   │
│  - GraphQL client for Storefront API                    │
│  - Local storage for caching                            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Shopify Storefront API                   │
│  - Metaobjects (configurations)                         │
│  - Products, Collections                                │
│  - Customer authentication                              │
│  - Checkout                                             │
└─────────────────────────────────────────────────────────┘
```

## Metaobject Types Reference

The Shopify Setup Wizard creates the following metaobject types. Use these exact type names when querying.

### Configuration Metaobjects (Singletons)

| Type | Purpose | Query First |
|------|---------|-------------|
| `app_config` | General app settings, colors, versions | 1 |
| `contact_info` | Global contact information | 1 |
| `payment_config` | Payment methods configuration | 1 |
| `shipping_config` | Shipping and returns settings | 1 |
| `newsletter_config` | Email marketing settings | 1 |
| `notification_config` | Push notification settings | 1 |
| `deep_link_config` | Deep linking configuration | 1 |
| `favorites_config` | Wishlist/favorites settings | 1 |
| `reviews_config` | Reviews provider integration | 1 |
| `webhook_config` | Webhook endpoints (backend use) | 1 |

### Content Metaobjects (Multiple Entries)

| Type | Purpose | Query First |
|------|---------|-------------|
| `home_banner` | Home screen rotating banners | 10 |
| `home_featured_collection` | Featured collections on home | 10 |
| `home_category_grid` | Category navigation grids | 5 |
| `faq_item` | FAQ entries | 50 |
| `store_location` | Physical store locations | 20 |
| `legal_policy` | Legal policies (privacy, terms) | 5 |

---

## GraphQL Queries

### Base Query Structure

```graphql
query GetMetaobjects($type: String!, $first: Int!) {
  metaobjects(type: $type, first: $first) {
    nodes {
      id
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
          ... on Collection {
            id
            handle
            title
            image {
              url
            }
          }
          ... on Product {
            id
            handle
            title
          }
        }
      }
    }
  }
}
```

### App Configuration Query

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

**Expected Fields:**
- `app_name` (string) - App display name
- `primary_color` (string) - Hex color code (e.g., "#FF5722")
- `secondary_color` (string) - Hex color code
- `logo` (file_reference) - App logo image
- `splash_image` (file_reference) - Splash screen image
- `maintenance_mode` (boolean) - "true" or "false"
- `maintenance_message` (string) - Message to show during maintenance
- `min_version_ios` (string) - Minimum iOS version (e.g., "1.2.0")
- `min_version_android` (string) - Minimum Android version

### Home Banners Query

```graphql
query GetHomeBanners {
  metaobjects(type: "home_banner", first: 10) {
    nodes {
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image { url width height }
          }
        }
      }
    }
  }
}
```

**Expected Fields:**
- `title` (string) - Banner title
- `subtitle` (string) - Banner subtitle
- `image` (file_reference) - Desktop/tablet image
- `image_mobile` (file_reference) - Mobile-optimized image
- `link_url` (url) - Destination URL
- `link_type` (string) - "product", "collection", "page", "external"
- `active` (boolean) - "true" or "false"
- `order` (integer) - Display order
- `start_date` (datetime) - Start showing from
- `end_date` (datetime) - Stop showing after

### Featured Collections Query

```graphql
query GetFeaturedCollections {
  metaobjects(type: "home_featured_collection", first: 10) {
    nodes {
      fields {
        key
        value
        reference {
          ... on Collection {
            id
            handle
            title
            productsCount
            image { url }
          }
          ... on MediaImage {
            image { url }
          }
        }
      }
    }
  }
}
```

**Expected Fields:**
- `collection` (collection_reference) - Reference to Shopify collection
- `display_title` (string) - Override title (optional)
- `subtitle` (string) - Subtitle text
- `background_image` (file_reference) - Custom background
- `products_count` (integer) - Number of products to show
- `order` (integer) - Display order
- `active` (boolean)
- `layout_type` (string) - "grid", "carousel", "featured"

### Store Locations Query

```graphql
query GetStoreLocations {
  metaobjects(type: "store_location", first: 20) {
    nodes {
      handle
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

**Expected Fields:**
- `name` (string, required) - Store name
- `address` (string, required) - Full address
- `city` (string) - City
- `province` (string) - Province/State
- `postal_code` (string) - Postal/ZIP code
- `country` (string) - Country
- `phone` (string) - Contact phone
- `latitude` (string) - GPS latitude
- `longitude` (string) - GPS longitude
- `image` (file_reference) - Store photo
- `working_hours` (json) - Opening hours JSON
- `services` (list) - Available services
- `active` (boolean)

### FAQs Query

```graphql
query GetFAQs {
  metaobjects(type: "faq_item", first: 50) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `question` (string, required) - FAQ question
- `answer` (string, required) - FAQ answer (may contain HTML)
- `category` (string) - Category grouping
- `order` (integer) - Display order
- `active` (boolean)

### Contact Info Query

```graphql
query GetContactInfo {
  metaobjects(type: "contact_info", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `phone` (string) - Main phone number
- `email` (string) - Contact email
- `whatsapp` (string) - WhatsApp number
- `address` (string) - Physical address
- `working_hours` (string) - Text description of hours
- `map_url` (url) - Google Maps URL
- `social_instagram` (string) - Instagram handle
- `social_facebook` (string) - Facebook page
- `social_tiktok` (string) - TikTok handle

### Payment Config Query

```graphql
query GetPaymentConfig {
  metaobjects(type: "payment_config", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `apple_pay_enabled` (boolean)
- `google_pay_enabled` (boolean)
- `credit_card_enabled` (boolean)
- `paypal_enabled` (boolean)
- `klarna_enabled` (boolean)
- `cod_enabled` (boolean) - Cash on delivery
- `bank_transfer_enabled` (boolean)
- `stripe_public_key` (string) - For Stripe integration
- `paypal_client_id` (string) - For PayPal integration
- `payment_instructions` (string) - Instructions text

### Shipping Config Query

```graphql
query GetShippingConfig {
  metaobjects(type: "shipping_config", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `free_shipping_threshold` (string) - Amount for free shipping
- `free_shipping_message` (string) - Promotional message
- `standard_days_min` (integer) - Min delivery days
- `standard_days_max` (integer) - Max delivery days
- `express_days_min` (integer)
- `express_days_max` (integer)
- `return_days` (integer) - Return policy days
- `return_policy_summary` (string) - Brief policy text
- `shipping_info` (string) - Detailed shipping info
- `track_order_url` (url) - Tracking URL template
- `show_estimated_delivery` (boolean)

### Legal Policies Query

```graphql
query GetLegalPolicies {
  metaobjects(type: "legal_policy", first: 5) {
    nodes {
      handle
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `type` (string, required) - "privacy", "terms", "cookies", "returns", "shipping"
- `title` (string, required) - Policy title
- `content` (rich_text, required) - Full policy content (HTML)
- `version` (string) - Version number
- `last_updated` (date) - Last update date
- `required_registration` (boolean) - Must accept on registration
- `required_checkout` (boolean) - Must accept on checkout
- `active` (boolean)

### Newsletter Config Query

```graphql
query GetNewsletterConfig {
  metaobjects(type: "newsletter_config", first: 1) {
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

**Expected Fields:**
- `enabled` (boolean) - Newsletter feature enabled
- `provider` (string) - "klaviyo", "mailchimp", "shopify"
- `api_key` (string) - Provider API key
- `list_id` (string) - Mailing list ID
- `popup_title` (string) - Popup title
- `popup_message` (string) - Popup message
- `popup_image` (file_reference) - Popup image
- `discount_code` (string) - Discount for signup
- `show_on_home` (boolean) - Show popup on home
- `show_on_checkout` (boolean) - Show at checkout
- `delay_seconds` (integer) - Popup delay

### Notification Config Query

```graphql
query GetNotificationConfig {
  metaobjects(type: "notification_config", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `enabled` (boolean) - Push notifications enabled
- `firebase_server_key` (string) - Firebase key (do NOT expose in app)
- `notify_order_created` (boolean)
- `notify_order_shipped` (boolean)
- `notify_order_delivered` (boolean)
- `notify_order_cancelled` (boolean)
- `notify_refund` (boolean)
- `notify_payment_failed` (boolean)
- `notify_abandoned_cart` (boolean)
- `abandoned_cart_delay` (integer) - Minutes before notification
- `notify_promo` (boolean) - Promotional notifications

### Deep Link Config Query

```graphql
query GetDeepLinkConfig {
  metaobjects(type: "deep_link_config", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `ios_app_id` (string) - iOS App Store ID
- `ios_bundle_id` (string) - iOS bundle identifier
- `android_package` (string) - Android package name
- `android_sha256` (string) - Android SHA256 fingerprint
- `shortio_domain` (string) - Short.io custom domain
- `shortio_api_key` (string) - Short.io API key
- `password_reset_prefix` (string) - URL prefix for password reset
- `email_verify_prefix` (string) - URL prefix for email verification
- `fallback_url` (url) - Fallback for non-app users

### Favorites Config Query

```graphql
query GetFavoritesConfig {
  metaobjects(type: "favorites_config", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `sync_mode` (string) - "local", "metafield", "both"
- `metafield_namespace` (string) - Namespace for customer metafield
- `metafield_key` (string) - Key for customer metafield
- `show_share` (boolean) - Allow sharing favorites
- `max_favorites` (integer) - Maximum items allowed
- `enable_collections` (boolean) - Allow favoriting collections

### Reviews Config Query

```graphql
query GetReviewsConfig {
  metaobjects(type: "reviews_config", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**Expected Fields:**
- `provider` (string) - "judgeme", "yotpo", "stamped", "loox"
- `api_key` (string) - Provider API key
- `shop_domain` (string) - Shopify domain for API calls
- `enabled` (boolean) - Reviews feature enabled

---

## Implementation Patterns

### 1. Metaobject Data Model

```dart
class MetaobjectField {
  final String key;
  final String? value;
  final dynamic reference;

  MetaobjectField({required this.key, this.value, this.reference});

  factory MetaobjectField.fromJson(Map<String, dynamic> json) {
    return MetaobjectField(
      key: json['key'],
      value: json['value'],
      reference: json['reference'],
    );
  }
}

class Metaobject {
  final String id;
  final String handle;
  final List<MetaobjectField> fields;

  Metaobject({required this.id, required this.handle, required this.fields});

  String? getFieldValue(String key) {
    return fields.firstWhere((f) => f.key == key, orElse: () => MetaobjectField(key: key)).value;
  }

  bool getBoolField(String key) {
    return getFieldValue(key) == 'true';
  }

  int? getIntField(String key) {
    final value = getFieldValue(key);
    return value != null ? int.tryParse(value) : null;
  }

  String? getImageUrl(String key) {
    final field = fields.firstWhere((f) => f.key == key, orElse: () => MetaobjectField(key: key));
    return field.reference?['image']?['url'];
  }
}
```

### 2. App Config Service

```dart
class AppConfigService {
  final GraphQLClient _client;
  AppConfig? _cachedConfig;

  Future<AppConfig> getAppConfig() async {
    if (_cachedConfig != null) return _cachedConfig!;

    final result = await _client.query(
      QueryOptions(document: gql(getAppConfigQuery)),
    );

    final nodes = result.data?['metaobjects']?['nodes'] as List?;
    if (nodes == null || nodes.isEmpty) {
      throw Exception('App config not found');
    }

    _cachedConfig = AppConfig.fromMetaobject(nodes.first);
    return _cachedConfig!;
  }

  Future<bool> checkMaintenanceMode() async {
    final config = await getAppConfig();
    return config.maintenanceMode;
  }

  Future<bool> checkVersionCompatibility(String currentVersion) async {
    final config = await getAppConfig();
    final minVersion = Platform.isIOS
        ? config.minVersionIos
        : config.minVersionAndroid;
    return _isVersionCompatible(currentVersion, minVersion);
  }
}
```

### 3. Home Screen Data Loading

```dart
class HomeRepository {
  Future<HomeData> loadHomeData() async {
    // Load all home data in parallel
    final results = await Future.wait([
      _loadBanners(),
      _loadFeaturedCollections(),
      _loadCategoryGrids(),
    ]);

    return HomeData(
      banners: results[0] as List<HomeBanner>,
      featuredCollections: results[1] as List<FeaturedCollection>,
      categoryGrids: results[2] as List<CategoryGrid>,
    );
  }

  Future<List<HomeBanner>> _loadBanners() async {
    final result = await _client.query(
      QueryOptions(document: gql(getHomeBannersQuery)),
    );

    final nodes = result.data?['metaobjects']?['nodes'] as List? ?? [];
    return nodes
        .map((n) => HomeBanner.fromMetaobject(n))
        .where((b) => b.active && _isWithinDateRange(b))
        .toList()
      ..sort((a, b) => a.order.compareTo(b.order));
  }
}
```

### 4. Filtering Active Items

```dart
extension MetaobjectFiltering on List<Metaobject> {
  List<Metaobject> activeOnly() {
    return where((m) => m.getBoolField('active')).toList();
  }

  List<Metaobject> sortedByOrder() {
    return [...this]..sort((a, b) {
      final orderA = a.getIntField('order') ?? 999;
      final orderB = b.getIntField('order') ?? 999;
      return orderA.compareTo(orderB);
    });
  }

  List<Metaobject> withinDateRange() {
    final now = DateTime.now();
    return where((m) {
      final startStr = m.getFieldValue('start_date');
      final endStr = m.getFieldValue('end_date');

      if (startStr != null) {
        final start = DateTime.parse(startStr);
        if (now.isBefore(start)) return false;
      }

      if (endStr != null) {
        final end = DateTime.parse(endStr);
        if (now.isAfter(end)) return false;
      }

      return true;
    }).toList();
  }
}
```

### 5. Caching Strategy

```dart
class MetaobjectCache {
  final Map<String, CacheEntry> _cache = {};

  // Cache durations by type
  static const _cacheDurations = {
    'app_config': Duration(hours: 24),
    'home_banner': Duration(minutes: 30),
    'faq_item': Duration(hours: 12),
    'store_location': Duration(hours: 24),
    'contact_info': Duration(hours: 24),
  };

  Future<List<Metaobject>> getOrFetch(
    String type,
    Future<List<Metaobject>> Function() fetcher,
  ) async {
    final cached = _cache[type];
    if (cached != null && !cached.isExpired) {
      return cached.data;
    }

    final data = await fetcher();
    _cache[type] = CacheEntry(
      data: data,
      duration: _cacheDurations[type] ?? Duration(hours: 1),
    );
    return data;
  }

  void invalidate(String type) {
    _cache.remove(type);
  }

  void invalidateAll() {
    _cache.clear();
  }
}
```

### 6. Deep Link Handler

```dart
class DeepLinkService {
  DeepLinkConfig? _config;

  Future<void> initialize() async {
    _config = await _loadDeepLinkConfig();

    // Setup app links
    AppLinks().uriLinkStream.listen(_handleDeepLink);
  }

  void _handleDeepLink(Uri uri) {
    final path = uri.path;

    // Handle password reset
    if (path.startsWith(_config?.passwordResetPrefix ?? '/reset')) {
      final token = uri.queryParameters['token'];
      Navigator.pushNamed(context, '/reset-password', arguments: token);
      return;
    }

    // Handle email verification
    if (path.startsWith(_config?.emailVerifyPrefix ?? '/verify')) {
      final token = uri.queryParameters['token'];
      _verifyEmail(token);
      return;
    }

    // Handle product links
    if (path.startsWith('/products/')) {
      final handle = path.split('/').last;
      Navigator.pushNamed(context, '/product', arguments: handle);
      return;
    }

    // Handle collection links
    if (path.startsWith('/collections/')) {
      final handle = path.split('/').last;
      Navigator.pushNamed(context, '/collection', arguments: handle);
      return;
    }
  }
}
```

### 7. Reviews Integration

```dart
class ReviewsService {
  ReviewsConfig? _config;

  Future<List<Review>> getProductReviews(String productId) async {
    final config = await _getConfig();
    if (!config.enabled) return [];

    switch (config.provider) {
      case 'judgeme':
        return _fetchJudgeMeReviews(productId, config);
      case 'yotpo':
        return _fetchYotpoReviews(productId, config);
      case 'stamped':
        return _fetchStampedReviews(productId, config);
      default:
        return [];
    }
  }

  Future<List<Review>> _fetchJudgeMeReviews(String productId, ReviewsConfig config) async {
    final response = await http.get(
      Uri.parse('https://judge.me/api/v1/reviews'),
      headers: {
        'Authorization': 'Bearer ${config.apiKey}',
        'Shop-Domain': config.shopDomain,
      },
    );
    // Parse and return reviews
  }
}
```

---

## Error Handling

### Metaobject Not Found

```dart
Future<T?> safeLoadMetaobject<T>(
  String type,
  T Function(Map<String, dynamic>) parser,
) async {
  try {
    final result = await _client.query(
      QueryOptions(document: gql(_buildQuery(type))),
    );

    final nodes = result.data?['metaobjects']?['nodes'] as List?;
    if (nodes == null || nodes.isEmpty) {
      // Log missing metaobject for monitoring
      analytics.logEvent('metaobject_not_found', {'type': type});
      return null;
    }

    return parser(nodes.first);
  } catch (e) {
    // Log error but don't crash
    analytics.logError('metaobject_load_failed', {'type': type, 'error': e});
    return null;
  }
}
```

### Graceful Degradation

```dart
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<HomeData>(
      future: homeRepository.loadHomeData(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          // Show cached data if available
          final cached = homeRepository.getCachedData();
          if (cached != null) {
            return _buildHomeContent(cached);
          }
          return ErrorWidget(onRetry: () => setState(() {}));
        }

        if (!snapshot.hasData) {
          return LoadingWidget();
        }

        return _buildHomeContent(snapshot.data!);
      },
    );
  }
}
```

---

## Testing

### Mock Metaobject Data

```dart
class MockMetaobjectRepository implements MetaobjectRepository {
  @override
  Future<List<Metaobject>> getByType(String type, {int first = 10}) async {
    switch (type) {
      case 'app_config':
        return [_mockAppConfig()];
      case 'home_banner':
        return _mockBanners();
      default:
        return [];
    }
  }

  Metaobject _mockAppConfig() {
    return Metaobject(
      id: 'mock-app-config',
      handle: 'app-config',
      fields: [
        MetaobjectField(key: 'app_name', value: 'Test App'),
        MetaobjectField(key: 'primary_color', value: '#FF5722'),
        MetaobjectField(key: 'maintenance_mode', value: 'false'),
        MetaobjectField(key: 'min_version_ios', value: '1.0.0'),
        MetaobjectField(key: 'min_version_android', value: '1.0.0'),
      ],
    );
  }
}
```

---

## Best Practices

1. **Always check `active` field** - Filter out inactive items before displaying
2. **Respect `order` field** - Sort items by order for consistent display
3. **Handle missing data gracefully** - Metaobjects may not exist yet
4. **Cache aggressively** - Metaobject data changes infrequently
5. **Use parallel loading** - Load multiple metaobject types simultaneously
6. **Validate date ranges** - Check `start_date` and `end_date` for time-sensitive content
7. **Don't expose API keys** - Never include sensitive keys like `firebase_server_key` in client code
8. **Handle boolean strings** - Shopify returns booleans as "true"/"false" strings

---

## Shopify Admin Access

For debugging, metaobjects can be viewed/edited directly in Shopify Admin:
- URL pattern: `https://admin.shopify.com/store/{store}/content/entries/{metaobject_type}`
- Example: `https://admin.shopify.com/store/mystore/content/entries/app_config`

---

## Related Documentation

- [Shopify Storefront API - Metaobjects](https://shopify.dev/docs/api/storefront/latest/objects/Metaobject)
- [GraphQL Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Shopify Setup Wizard Documentation](../CONFLUENCE_DOCUMENTATION.md)
