# Guía de Integración Flutter - Shopify Metaobjects
## Clean Architecture

## Índice

1. [Estructura del Proyecto](#1-estructura-del-proyecto)
2. [Domain Layer](#2-domain-layer)
3. [Data Layer](#3-data-layer)
4. [Presentation Layer](#4-presentation-layer)
5. [Dependency Injection](#5-dependency-injection)
6. [Implementación por Feature](#6-implementación-por-feature)
7. [Checklist de Integración](#7-checklist-de-integración)

---

## 1. Estructura del Proyecto

```
lib/
├── core/
│   ├── error/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   ├── network/
│   │   └── graphql_client.dart
│   ├── usecases/
│   │   └── usecase.dart
│   └── utils/
│       ├── constants.dart
│       └── extensions.dart
│
├── features/
│   ├── app_config/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── app_config.dart
│   │   │   ├── repositories/
│   │   │   │   └── app_config_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_app_config.dart
│   │   │       └── check_maintenance_mode.dart
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   └── app_config_model.dart
│   │   │   ├── datasources/
│   │   │   │   ├── app_config_remote_datasource.dart
│   │   │   │   └── app_config_local_datasource.dart
│   │   │   └── repositories/
│   │   │       └── app_config_repository_impl.dart
│   │   └── presentation/
│   │       ├── bloc/
│   │       │   ├── app_config_bloc.dart
│   │       │   ├── app_config_event.dart
│   │       │   └── app_config_state.dart
│   │       └── pages/
│   │           └── maintenance_page.dart
│   │
│   ├── home/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── home_banner.dart
│   │   │   │   └── featured_collection.dart
│   │   │   ├── repositories/
│   │   │   │   └── home_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_banners.dart
│   │   │       └── get_featured_collections.dart
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   ├── home_banner_model.dart
│   │   │   │   └── featured_collection_model.dart
│   │   │   ├── datasources/
│   │   │   │   └── home_remote_datasource.dart
│   │   │   └── repositories/
│   │   │       └── home_repository_impl.dart
│   │   └── presentation/
│   │       ├── bloc/
│   │       │   └── home_bloc.dart
│   │       ├── widgets/
│   │       │   ├── banner_carousel.dart
│   │       │   └── featured_collection_widget.dart
│   │       └── pages/
│   │           └── home_page.dart
│   │
│   ├── stores/
│   ├── content/
│   ├── checkout/
│   ├── legal/
│   ├── newsletter/
│   ├── notifications/
│   ├── deep_links/
│   ├── favorites/
│   └── reviews/
│
├── injection_container.dart
└── main.dart
```

### Dependencias (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5

  # Dependency Injection
  get_it: ^7.6.4
  injectable: ^2.3.2

  # Network
  graphql_flutter: ^5.1.0

  # Functional Programming
  dartz: ^0.10.1

  # Local Storage
  shared_preferences: ^2.2.0
  hive: ^2.2.3
  hive_flutter: ^1.1.0

  # Utils
  cached_network_image: ^3.3.0
  url_launcher: ^6.2.0

dev_dependencies:
  injectable_generator: ^2.4.1
  build_runner: ^2.4.6
  hive_generator: ^2.0.1
  mockito: ^5.4.3
  bloc_test: ^9.1.5
```

---

## 2. Domain Layer

### Core - Base Classes

```dart
// lib/core/error/failures.dart

import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;

  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Error del servidor']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Error de caché']);
}

class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'Sin conexión a internet']);
}

class NotFoundFailure extends Failure {
  const NotFoundFailure([super.message = 'Recurso no encontrado']);
}
```

```dart
// lib/core/error/exceptions.dart

class ServerException implements Exception {
  final String message;
  const ServerException([this.message = 'Error del servidor']);
}

class CacheException implements Exception {
  final String message;
  const CacheException([this.message = 'Error de caché']);
}

class NotFoundException implements Exception {
  final String message;
  const NotFoundException([this.message = 'No encontrado']);
}
```

```dart
// lib/core/usecases/usecase.dart

import 'package:dartz/dartz.dart';
import '../error/failures.dart';

abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

class NoParams {
  const NoParams();
}
```

### Entities

```dart
// lib/features/app_config/domain/entities/app_config.dart

import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class AppConfig extends Equatable {
  final String appName;
  final Color primaryColor;
  final Color secondaryColor;
  final String? logoUrl;
  final String? splashImageUrl;
  final bool maintenanceMode;
  final String? maintenanceMessage;
  final String minVersionIos;
  final String minVersionAndroid;

  const AppConfig({
    required this.appName,
    required this.primaryColor,
    required this.secondaryColor,
    this.logoUrl,
    this.splashImageUrl,
    required this.maintenanceMode,
    this.maintenanceMessage,
    required this.minVersionIos,
    required this.minVersionAndroid,
  });

  @override
  List<Object?> get props => [
    appName, primaryColor, secondaryColor, logoUrl, splashImageUrl,
    maintenanceMode, maintenanceMessage, minVersionIos, minVersionAndroid,
  ];
}
```

```dart
// lib/features/home/domain/entities/home_banner.dart

import 'package:equatable/equatable.dart';

class HomeBanner extends Equatable {
  final String id;
  final String title;
  final String? subtitle;
  final String? imageUrl;
  final String? imageMobileUrl;
  final String? linkUrl;
  final BannerLinkType linkType;
  final int order;
  final DateTime? startDate;
  final DateTime? endDate;

  const HomeBanner({
    required this.id,
    required this.title,
    this.subtitle,
    this.imageUrl,
    this.imageMobileUrl,
    this.linkUrl,
    required this.linkType,
    required this.order,
    this.startDate,
    this.endDate,
  });

  bool get isVisible {
    final now = DateTime.now();
    if (startDate != null && now.isBefore(startDate!)) return false;
    if (endDate != null && now.isAfter(endDate!)) return false;
    return true;
  }

  String get effectiveImageUrl => imageMobileUrl ?? imageUrl ?? '';

  @override
  List<Object?> get props => [id, title, subtitle, imageUrl, imageMobileUrl, linkUrl, linkType, order];
}

enum BannerLinkType { product, collection, page, external, none }
```

```dart
// lib/features/home/domain/entities/featured_collection.dart

import 'package:equatable/equatable.dart';

class FeaturedCollection extends Equatable {
  final String id;
  final String? collectionId;
  final String? collectionHandle;
  final String title;
  final String? subtitle;
  final String? imageUrl;
  final String? backgroundImageUrl;
  final int productsCount;
  final int order;
  final CollectionLayoutType layoutType;

  const FeaturedCollection({
    required this.id,
    this.collectionId,
    this.collectionHandle,
    required this.title,
    this.subtitle,
    this.imageUrl,
    this.backgroundImageUrl,
    required this.productsCount,
    required this.order,
    required this.layoutType,
  });

  @override
  List<Object?> get props => [id, collectionId, title, order];
}

enum CollectionLayoutType { grid, carousel, featured }
```

```dart
// lib/features/stores/domain/entities/store_location.dart

import 'package:equatable/equatable.dart';

class StoreLocation extends Equatable {
  final String id;
  final String name;
  final String address;
  final String? city;
  final String? province;
  final String? postalCode;
  final String? country;
  final String? phone;
  final double? latitude;
  final double? longitude;
  final String? imageUrl;
  final Map<String, dynamic>? workingHours;
  final List<String> services;

  const StoreLocation({
    required this.id,
    required this.name,
    required this.address,
    this.city,
    this.province,
    this.postalCode,
    this.country,
    this.phone,
    this.latitude,
    this.longitude,
    this.imageUrl,
    this.workingHours,
    required this.services,
  });

  String get fullAddress {
    return [address, city, province, postalCode, country]
        .where((p) => p != null && p.isNotEmpty)
        .join(', ');
  }

  bool get hasCoordinates => latitude != null && longitude != null;

  @override
  List<Object?> get props => [id, name, address];
}
```

```dart
// lib/features/content/domain/entities/faq_item.dart

import 'package:equatable/equatable.dart';

class FaqItem extends Equatable {
  final String id;
  final String question;
  final String answer;
  final String? category;
  final int order;

  const FaqItem({
    required this.id,
    required this.question,
    required this.answer,
    this.category,
    required this.order,
  });

  @override
  List<Object?> get props => [id, question, answer, category, order];
}
```

```dart
// lib/features/content/domain/entities/contact_info.dart

import 'package:equatable/equatable.dart';

class ContactInfo extends Equatable {
  final String? phone;
  final String? email;
  final String? whatsapp;
  final String? address;
  final String? workingHours;
  final String? mapUrl;
  final String? socialInstagram;
  final String? socialFacebook;
  final String? socialTiktok;

  const ContactInfo({
    this.phone,
    this.email,
    this.whatsapp,
    this.address,
    this.workingHours,
    this.mapUrl,
    this.socialInstagram,
    this.socialFacebook,
    this.socialTiktok,
  });

  String get whatsappUrl => 'https://wa.me/${whatsapp?.replaceAll(RegExp(r'[^0-9]'), '')}';
  String get phoneUrl => 'tel:$phone';
  String get emailUrl => 'mailto:$email';

  @override
  List<Object?> get props => [phone, email, whatsapp, address];
}
```

```dart
// lib/features/checkout/domain/entities/payment_config.dart

import 'package:equatable/equatable.dart';

class PaymentConfig extends Equatable {
  final bool applePayEnabled;
  final bool googlePayEnabled;
  final bool creditCardEnabled;
  final bool paypalEnabled;
  final bool klarnaEnabled;
  final bool codEnabled;
  final bool bankTransferEnabled;
  final String? stripePublicKey;
  final String? paypalClientId;
  final String? paymentInstructions;

  const PaymentConfig({
    required this.applePayEnabled,
    required this.googlePayEnabled,
    required this.creditCardEnabled,
    required this.paypalEnabled,
    required this.klarnaEnabled,
    required this.codEnabled,
    required this.bankTransferEnabled,
    this.stripePublicKey,
    this.paypalClientId,
    this.paymentInstructions,
  });

  List<PaymentMethod> get enabledMethods {
    final methods = <PaymentMethod>[];
    if (creditCardEnabled) methods.add(PaymentMethod.creditCard);
    if (applePayEnabled) methods.add(PaymentMethod.applePay);
    if (googlePayEnabled) methods.add(PaymentMethod.googlePay);
    if (paypalEnabled) methods.add(PaymentMethod.paypal);
    if (klarnaEnabled) methods.add(PaymentMethod.klarna);
    if (codEnabled) methods.add(PaymentMethod.cod);
    if (bankTransferEnabled) methods.add(PaymentMethod.bankTransfer);
    return methods;
  }

  @override
  List<Object?> get props => [applePayEnabled, googlePayEnabled, creditCardEnabled];
}

enum PaymentMethod { creditCard, applePay, googlePay, paypal, klarna, cod, bankTransfer }
```

```dart
// lib/features/checkout/domain/entities/shipping_config.dart

import 'package:equatable/equatable.dart';

class ShippingConfig extends Equatable {
  final double? freeShippingThreshold;
  final String? freeShippingMessage;
  final int? standardDaysMin;
  final int? standardDaysMax;
  final int? expressDaysMin;
  final int? expressDaysMax;
  final int? returnDays;
  final String? returnPolicySummary;
  final String? shippingInfo;
  final String? trackOrderUrl;
  final bool showEstimatedDelivery;

  const ShippingConfig({
    this.freeShippingThreshold,
    this.freeShippingMessage,
    this.standardDaysMin,
    this.standardDaysMax,
    this.expressDaysMin,
    this.expressDaysMax,
    this.returnDays,
    this.returnPolicySummary,
    this.shippingInfo,
    this.trackOrderUrl,
    required this.showEstimatedDelivery,
  });

  String get standardDeliveryText {
    if (standardDaysMin == null || standardDaysMax == null) return '';
    if (standardDaysMin == standardDaysMax) return '$standardDaysMin días';
    return '$standardDaysMin-$standardDaysMax días';
  }

  double amountForFreeShipping(double cartTotal) {
    if (freeShippingThreshold == null) return 0;
    return (freeShippingThreshold! - cartTotal).clamp(0, double.infinity);
  }

  @override
  List<Object?> get props => [freeShippingThreshold, standardDaysMin, returnDays];
}
```

```dart
// lib/features/legal/domain/entities/legal_policy.dart

import 'package:equatable/equatable.dart';

class LegalPolicy extends Equatable {
  final String id;
  final PolicyType type;
  final String title;
  final String content;
  final String? version;
  final DateTime? lastUpdated;
  final bool requiredRegistration;
  final bool requiredCheckout;

  const LegalPolicy({
    required this.id,
    required this.type,
    required this.title,
    required this.content,
    this.version,
    this.lastUpdated,
    required this.requiredRegistration,
    required this.requiredCheckout,
  });

  @override
  List<Object?> get props => [id, type, title];
}

enum PolicyType { privacy, terms, cookies, returns, shipping }
```

```dart
// lib/features/reviews/domain/entities/review.dart

import 'package:equatable/equatable.dart';

class ProductReview extends Equatable {
  final String id;
  final String author;
  final double rating;
  final String title;
  final String body;
  final DateTime createdAt;
  final bool verified;

  const ProductReview({
    required this.id,
    required this.author,
    required this.rating,
    required this.title,
    required this.body,
    required this.createdAt,
    required this.verified,
  });

  @override
  List<Object?> get props => [id, author, rating];
}
```

### Repository Contracts (Abstractions)

```dart
// lib/features/app_config/domain/repositories/app_config_repository.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/app_config.dart';

abstract class AppConfigRepository {
  Future<Either<Failure, AppConfig>> getAppConfig();
  Future<Either<Failure, bool>> isMaintenanceMode();
  Future<Either<Failure, bool>> isVersionValid(String currentVersion);
}
```

```dart
// lib/features/home/domain/repositories/home_repository.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/home_banner.dart';
import '../entities/featured_collection.dart';

abstract class HomeRepository {
  Future<Either<Failure, List<HomeBanner>>> getBanners();
  Future<Either<Failure, List<FeaturedCollection>>> getFeaturedCollections();
}
```

```dart
// lib/features/stores/domain/repositories/store_repository.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/store_location.dart';

abstract class StoreRepository {
  Future<Either<Failure, List<StoreLocation>>> getStores();
  Future<Either<Failure, List<StoreLocation>>> getNearbyStores(double lat, double lng, double radiusKm);
}
```

```dart
// lib/features/content/domain/repositories/content_repository.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/faq_item.dart';
import '../entities/contact_info.dart';

abstract class ContentRepository {
  Future<Either<Failure, List<FaqItem>>> getFaqs();
  Future<Either<Failure, ContactInfo>> getContactInfo();
}
```

```dart
// lib/features/reviews/domain/repositories/reviews_repository.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/review.dart';

abstract class ReviewsRepository {
  Future<Either<Failure, List<ProductReview>>> getProductReviews(String productId);
  Future<Either<Failure, double>> getProductRating(String productId);
}
```

### Use Cases

```dart
// lib/features/app_config/domain/usecases/get_app_config.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/app_config.dart';
import '../repositories/app_config_repository.dart';

class GetAppConfig implements UseCase<AppConfig, NoParams> {
  final AppConfigRepository repository;

  GetAppConfig(this.repository);

  @override
  Future<Either<Failure, AppConfig>> call(NoParams params) {
    return repository.getAppConfig();
  }
}
```

```dart
// lib/features/app_config/domain/usecases/check_app_status.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/app_config_repository.dart';

class CheckAppStatus implements UseCase<AppStatus, CheckAppStatusParams> {
  final AppConfigRepository repository;

  CheckAppStatus(this.repository);

  @override
  Future<Either<Failure, AppStatus>> call(CheckAppStatusParams params) async {
    // Check maintenance mode
    final maintenanceResult = await repository.isMaintenanceMode();

    return maintenanceResult.fold(
      (failure) => Left(failure),
      (isInMaintenance) async {
        if (isInMaintenance) {
          return const Right(AppStatus.maintenance);
        }

        // Check version
        final versionResult = await repository.isVersionValid(params.currentVersion);

        return versionResult.fold(
          (failure) => Left(failure),
          (isValid) => Right(isValid ? AppStatus.ready : AppStatus.updateRequired),
        );
      },
    );
  }
}

class CheckAppStatusParams {
  final String currentVersion;
  const CheckAppStatusParams(this.currentVersion);
}

enum AppStatus { ready, maintenance, updateRequired }
```

```dart
// lib/features/home/domain/usecases/get_banners.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/home_banner.dart';
import '../repositories/home_repository.dart';

class GetBanners implements UseCase<List<HomeBanner>, NoParams> {
  final HomeRepository repository;

  GetBanners(this.repository);

  @override
  Future<Either<Failure, List<HomeBanner>>> call(NoParams params) async {
    final result = await repository.getBanners();

    return result.map((banners) {
      return banners
          .where((b) => b.isVisible)
          .toList()
        ..sort((a, b) => a.order.compareTo(b.order));
    });
  }
}
```

```dart
// lib/features/home/domain/usecases/get_featured_collections.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/featured_collection.dart';
import '../repositories/home_repository.dart';

class GetFeaturedCollections implements UseCase<List<FeaturedCollection>, NoParams> {
  final HomeRepository repository;

  GetFeaturedCollections(this.repository);

  @override
  Future<Either<Failure, List<FeaturedCollection>>> call(NoParams params) async {
    final result = await repository.getFeaturedCollections();

    return result.map((collections) {
      return collections..sort((a, b) => a.order.compareTo(b.order));
    });
  }
}
```

```dart
// lib/features/stores/domain/usecases/get_stores.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/store_location.dart';
import '../repositories/store_repository.dart';

class GetStores implements UseCase<List<StoreLocation>, NoParams> {
  final StoreRepository repository;

  GetStores(this.repository);

  @override
  Future<Either<Failure, List<StoreLocation>>> call(NoParams params) {
    return repository.getStores();
  }
}
```

```dart
// lib/features/stores/domain/usecases/get_nearby_stores.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/store_location.dart';
import '../repositories/store_repository.dart';

class GetNearbyStores implements UseCase<List<StoreLocation>, NearbyStoresParams> {
  final StoreRepository repository;

  GetNearbyStores(this.repository);

  @override
  Future<Either<Failure, List<StoreLocation>>> call(NearbyStoresParams params) {
    return repository.getNearbyStores(params.latitude, params.longitude, params.radiusKm);
  }
}

class NearbyStoresParams {
  final double latitude;
  final double longitude;
  final double radiusKm;

  const NearbyStoresParams({
    required this.latitude,
    required this.longitude,
    this.radiusKm = 50,
  });
}
```

```dart
// lib/features/content/domain/usecases/get_faqs.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/faq_item.dart';
import '../repositories/content_repository.dart';

class GetFaqs implements UseCase<List<FaqItem>, NoParams> {
  final ContentRepository repository;

  GetFaqs(this.repository);

  @override
  Future<Either<Failure, List<FaqItem>>> call(NoParams params) async {
    final result = await repository.getFaqs();

    return result.map((faqs) {
      return faqs..sort((a, b) => a.order.compareTo(b.order));
    });
  }
}
```

```dart
// lib/features/content/domain/usecases/get_faqs_by_category.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/faq_item.dart';
import '../repositories/content_repository.dart';

class GetFaqsByCategory implements UseCase<Map<String, List<FaqItem>>, NoParams> {
  final ContentRepository repository;

  GetFaqsByCategory(this.repository);

  @override
  Future<Either<Failure, Map<String, List<FaqItem>>>> call(NoParams params) async {
    final result = await repository.getFaqs();

    return result.map((faqs) {
      final grouped = <String, List<FaqItem>>{};

      for (final faq in faqs..sort((a, b) => a.order.compareTo(b.order))) {
        final category = faq.category ?? 'General';
        grouped.putIfAbsent(category, () => []).add(faq);
      }

      return grouped;
    });
  }
}
```

---

## 3. Data Layer

### Models (DTOs)

```dart
// lib/features/app_config/data/models/app_config_model.dart

import 'package:flutter/material.dart';
import '../../domain/entities/app_config.dart';

class AppConfigModel extends AppConfig {
  const AppConfigModel({
    required super.appName,
    required super.primaryColor,
    required super.secondaryColor,
    super.logoUrl,
    super.splashImageUrl,
    required super.maintenanceMode,
    super.maintenanceMessage,
    required super.minVersionIos,
    required super.minVersionAndroid,
  });

  factory AppConfigModel.fromMetaobject(Map<String, dynamic> json) {
    final fields = _parseFields(json['fields'] as List);

    return AppConfigModel(
      appName: fields['app_name'] ?? 'Mi App',
      primaryColor: _hexToColor(fields['primary_color'] ?? '#000000'),
      secondaryColor: _hexToColor(fields['secondary_color'] ?? '#FFFFFF'),
      logoUrl: _getImageUrl(json['fields'], 'logo'),
      splashImageUrl: _getImageUrl(json['fields'], 'splash_image'),
      maintenanceMode: fields['maintenance_mode'] == 'true',
      maintenanceMessage: fields['maintenance_message'],
      minVersionIos: fields['min_version_ios'] ?? '1.0.0',
      minVersionAndroid: fields['min_version_android'] ?? '1.0.0',
    );
  }

  factory AppConfigModel.fromCache(Map<String, dynamic> json) {
    return AppConfigModel(
      appName: json['appName'],
      primaryColor: Color(json['primaryColor']),
      secondaryColor: Color(json['secondaryColor']),
      logoUrl: json['logoUrl'],
      splashImageUrl: json['splashImageUrl'],
      maintenanceMode: json['maintenanceMode'],
      maintenanceMessage: json['maintenanceMessage'],
      minVersionIos: json['minVersionIos'],
      minVersionAndroid: json['minVersionAndroid'],
    );
  }

  Map<String, dynamic> toCache() {
    return {
      'appName': appName,
      'primaryColor': primaryColor.value,
      'secondaryColor': secondaryColor.value,
      'logoUrl': logoUrl,
      'splashImageUrl': splashImageUrl,
      'maintenanceMode': maintenanceMode,
      'maintenanceMessage': maintenanceMessage,
      'minVersionIos': minVersionIos,
      'minVersionAndroid': minVersionAndroid,
    };
  }

  static Map<String, String?> _parseFields(List fields) {
    final map = <String, String?>{};
    for (final field in fields) {
      map[field['key']] = field['value'];
    }
    return map;
  }

  static String? _getImageUrl(List fields, String key) {
    final field = fields.firstWhere(
      (f) => f['key'] == key,
      orElse: () => null,
    );
    return field?['reference']?['image']?['url'];
  }

  static Color _hexToColor(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) hex = 'FF$hex';
    return Color(int.parse(hex, radix: 16));
  }
}
```

```dart
// lib/features/home/data/models/home_banner_model.dart

import '../../domain/entities/home_banner.dart';

class HomeBannerModel extends HomeBanner {
  const HomeBannerModel({
    required super.id,
    required super.title,
    super.subtitle,
    super.imageUrl,
    super.imageMobileUrl,
    super.linkUrl,
    required super.linkType,
    required super.order,
    super.startDate,
    super.endDate,
  });

  factory HomeBannerModel.fromMetaobject(Map<String, dynamic> json) {
    final fields = _parseFields(json['fields'] as List);

    return HomeBannerModel(
      id: json['id'] ?? '',
      title: fields['title'] ?? '',
      subtitle: fields['subtitle'],
      imageUrl: _getImageUrl(json['fields'], 'image'),
      imageMobileUrl: _getImageUrl(json['fields'], 'image_mobile'),
      linkUrl: fields['link_url'],
      linkType: _parseLinkType(fields['link_type']),
      order: int.tryParse(fields['order'] ?? '0') ?? 0,
      startDate: fields['start_date'] != null ? DateTime.tryParse(fields['start_date']!) : null,
      endDate: fields['end_date'] != null ? DateTime.tryParse(fields['end_date']!) : null,
    );
  }

  static Map<String, String?> _parseFields(List fields) {
    final map = <String, String?>{};
    for (final field in fields) {
      map[field['key']] = field['value'];
    }
    return map;
  }

  static String? _getImageUrl(List fields, String key) {
    final field = fields.firstWhere((f) => f['key'] == key, orElse: () => null);
    return field?['reference']?['image']?['url'];
  }

  static BannerLinkType _parseLinkType(String? type) {
    switch (type) {
      case 'product': return BannerLinkType.product;
      case 'collection': return BannerLinkType.collection;
      case 'page': return BannerLinkType.page;
      case 'external': return BannerLinkType.external;
      default: return BannerLinkType.none;
    }
  }
}
```

```dart
// lib/features/home/data/models/featured_collection_model.dart

import '../../domain/entities/featured_collection.dart';

class FeaturedCollectionModel extends FeaturedCollection {
  const FeaturedCollectionModel({
    required super.id,
    super.collectionId,
    super.collectionHandle,
    required super.title,
    super.subtitle,
    super.imageUrl,
    super.backgroundImageUrl,
    required super.productsCount,
    required super.order,
    required super.layoutType,
  });

  factory FeaturedCollectionModel.fromMetaobject(Map<String, dynamic> json) {
    final fields = _parseFields(json['fields'] as List);
    final collectionRef = _getCollectionRef(json['fields']);

    return FeaturedCollectionModel(
      id: json['id'] ?? '',
      collectionId: collectionRef?['id'],
      collectionHandle: collectionRef?['handle'],
      title: fields['display_title'] ?? collectionRef?['title'] ?? '',
      subtitle: fields['subtitle'],
      imageUrl: collectionRef?['image']?['url'],
      backgroundImageUrl: _getImageUrl(json['fields'], 'background_image'),
      productsCount: int.tryParse(fields['products_count'] ?? '4') ?? 4,
      order: int.tryParse(fields['order'] ?? '0') ?? 0,
      layoutType: _parseLayoutType(fields['layout_type']),
    );
  }

  static Map<String, String?> _parseFields(List fields) {
    final map = <String, String?>{};
    for (final field in fields) {
      map[field['key']] = field['value'];
    }
    return map;
  }

  static Map<String, dynamic>? _getCollectionRef(List fields) {
    final field = fields.firstWhere((f) => f['key'] == 'collection', orElse: () => null);
    return field?['reference'];
  }

  static String? _getImageUrl(List fields, String key) {
    final field = fields.firstWhere((f) => f['key'] == key, orElse: () => null);
    return field?['reference']?['image']?['url'];
  }

  static CollectionLayoutType _parseLayoutType(String? type) {
    switch (type) {
      case 'carousel': return CollectionLayoutType.carousel;
      case 'featured': return CollectionLayoutType.featured;
      default: return CollectionLayoutType.grid;
    }
  }
}
```

```dart
// lib/features/stores/data/models/store_location_model.dart

import 'dart:convert';
import '../../domain/entities/store_location.dart';

class StoreLocationModel extends StoreLocation {
  const StoreLocationModel({
    required super.id,
    required super.name,
    required super.address,
    super.city,
    super.province,
    super.postalCode,
    super.country,
    super.phone,
    super.latitude,
    super.longitude,
    super.imageUrl,
    super.workingHours,
    required super.services,
  });

  factory StoreLocationModel.fromMetaobject(Map<String, dynamic> json) {
    final fields = _parseFields(json['fields'] as List);

    Map<String, dynamic>? workingHours;
    if (fields['working_hours'] != null) {
      try {
        workingHours = jsonDecode(fields['working_hours']!);
      } catch (_) {}
    }

    List<String> services = [];
    if (fields['services'] != null) {
      try {
        services = List<String>.from(jsonDecode(fields['services']!));
      } catch (_) {}
    }

    return StoreLocationModel(
      id: json['id'] ?? '',
      name: fields['name'] ?? '',
      address: fields['address'] ?? '',
      city: fields['city'],
      province: fields['province'],
      postalCode: fields['postal_code'],
      country: fields['country'],
      phone: fields['phone'],
      latitude: double.tryParse(fields['latitude'] ?? ''),
      longitude: double.tryParse(fields['longitude'] ?? ''),
      imageUrl: _getImageUrl(json['fields'], 'image'),
      workingHours: workingHours,
      services: services,
    );
  }

  static Map<String, String?> _parseFields(List fields) {
    final map = <String, String?>{};
    for (final field in fields) {
      map[field['key']] = field['value'];
    }
    return map;
  }

  static String? _getImageUrl(List fields, String key) {
    final field = fields.firstWhere((f) => f['key'] == key, orElse: () => null);
    return field?['reference']?['image']?['url'];
  }
}
```

```dart
// lib/features/content/data/models/faq_item_model.dart

import '../../domain/entities/faq_item.dart';

class FaqItemModel extends FaqItem {
  const FaqItemModel({
    required super.id,
    required super.question,
    required super.answer,
    super.category,
    required super.order,
  });

  factory FaqItemModel.fromMetaobject(Map<String, dynamic> json) {
    final fields = _parseFields(json['fields'] as List);

    return FaqItemModel(
      id: json['id'] ?? '',
      question: fields['question'] ?? '',
      answer: fields['answer'] ?? '',
      category: fields['category'],
      order: int.tryParse(fields['order'] ?? '0') ?? 0,
    );
  }

  static Map<String, String?> _parseFields(List fields) {
    final map = <String, String?>{};
    for (final field in fields) {
      map[field['key']] = field['value'];
    }
    return map;
  }
}
```

### Data Sources

```dart
// lib/features/app_config/data/datasources/app_config_remote_datasource.dart

import 'package:graphql_flutter/graphql_flutter.dart';
import '../../../../core/error/exceptions.dart';
import '../models/app_config_model.dart';

abstract class AppConfigRemoteDataSource {
  Future<AppConfigModel> getAppConfig();
}

class AppConfigRemoteDataSourceImpl implements AppConfigRemoteDataSource {
  final GraphQLClient client;

  AppConfigRemoteDataSourceImpl(this.client);

  static const String _query = '''
    query GetAppConfig {
      metaobjects(type: "app_config", first: 1) {
        nodes {
          id
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
  ''';

  @override
  Future<AppConfigModel> getAppConfig() async {
    final result = await client.query(QueryOptions(document: gql(_query)));

    if (result.hasException) {
      throw ServerException(result.exception.toString());
    }

    final nodes = result.data?['metaobjects']?['nodes'] as List?;
    if (nodes == null || nodes.isEmpty) {
      throw const NotFoundException('App config not found');
    }

    return AppConfigModel.fromMetaobject(nodes.first);
  }
}
```

```dart
// lib/features/app_config/data/datasources/app_config_local_datasource.dart

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/error/exceptions.dart';
import '../models/app_config_model.dart';

abstract class AppConfigLocalDataSource {
  Future<AppConfigModel> getLastAppConfig();
  Future<void> cacheAppConfig(AppConfigModel config);
}

class AppConfigLocalDataSourceImpl implements AppConfigLocalDataSource {
  final SharedPreferences sharedPreferences;

  static const _cacheKey = 'CACHED_APP_CONFIG';
  static const _cacheTimestampKey = 'CACHED_APP_CONFIG_TIMESTAMP';
  static const _cacheDuration = Duration(hours: 24);

  AppConfigLocalDataSourceImpl(this.sharedPreferences);

  @override
  Future<AppConfigModel> getLastAppConfig() async {
    final jsonString = sharedPreferences.getString(_cacheKey);
    final timestamp = sharedPreferences.getInt(_cacheTimestampKey);

    if (jsonString == null || timestamp == null) {
      throw const CacheException('No cached app config');
    }

    final cachedAt = DateTime.fromMillisecondsSinceEpoch(timestamp);
    if (DateTime.now().difference(cachedAt) > _cacheDuration) {
      throw const CacheException('Cache expired');
    }

    return AppConfigModel.fromCache(jsonDecode(jsonString));
  }

  @override
  Future<void> cacheAppConfig(AppConfigModel config) async {
    await sharedPreferences.setString(_cacheKey, jsonEncode(config.toCache()));
    await sharedPreferences.setInt(_cacheTimestampKey, DateTime.now().millisecondsSinceEpoch);
  }
}
```

```dart
// lib/features/home/data/datasources/home_remote_datasource.dart

import 'package:graphql_flutter/graphql_flutter.dart';
import '../../../../core/error/exceptions.dart';
import '../models/home_banner_model.dart';
import '../models/featured_collection_model.dart';

abstract class HomeRemoteDataSource {
  Future<List<HomeBannerModel>> getBanners();
  Future<List<FeaturedCollectionModel>> getFeaturedCollections();
}

class HomeRemoteDataSourceImpl implements HomeRemoteDataSource {
  final GraphQLClient client;

  HomeRemoteDataSourceImpl(this.client);

  static const String _bannersQuery = '''
    query GetHomeBanners {
      metaobjects(type: "home_banner", first: 10) {
        nodes {
          id
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
  ''';

  static const String _collectionsQuery = '''
    query GetFeaturedCollections {
      metaobjects(type: "home_featured_collection", first: 10) {
        nodes {
          id
          handle
          fields {
            key
            value
            reference {
              ... on Collection {
                id
                handle
                title
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
  ''';

  @override
  Future<List<HomeBannerModel>> getBanners() async {
    final result = await client.query(QueryOptions(document: gql(_bannersQuery)));

    if (result.hasException) {
      throw ServerException(result.exception.toString());
    }

    final nodes = result.data?['metaobjects']?['nodes'] as List? ?? [];
    return nodes
        .map((node) => HomeBannerModel.fromMetaobject(node))
        .where((b) => _isActive(node))
        .toList();
  }

  @override
  Future<List<FeaturedCollectionModel>> getFeaturedCollections() async {
    final result = await client.query(QueryOptions(document: gql(_collectionsQuery)));

    if (result.hasException) {
      throw ServerException(result.exception.toString());
    }

    final nodes = result.data?['metaobjects']?['nodes'] as List? ?? [];
    return nodes
        .map((node) => FeaturedCollectionModel.fromMetaobject(node))
        .where((c) => _isActive(node))
        .toList();
  }

  bool _isActive(Map<String, dynamic> node) {
    final fields = node['fields'] as List;
    final activeField = fields.firstWhere(
      (f) => f['key'] == 'active',
      orElse: () => {'value': 'true'},
    );
    return activeField['value'] == 'true';
  }
}
```

### Repository Implementations

```dart
// lib/features/app_config/data/repositories/app_config_repository_impl.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/app_config.dart';
import '../../domain/repositories/app_config_repository.dart';
import '../datasources/app_config_local_datasource.dart';
import '../datasources/app_config_remote_datasource.dart';

class AppConfigRepositoryImpl implements AppConfigRepository {
  final AppConfigRemoteDataSource remoteDataSource;
  final AppConfigLocalDataSource localDataSource;

  AppConfigRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, AppConfig>> getAppConfig() async {
    try {
      // Try remote first
      final remoteConfig = await remoteDataSource.getAppConfig();
      await localDataSource.cacheAppConfig(remoteConfig);
      return Right(remoteConfig);
    } on ServerException {
      // Fallback to cache
      try {
        final localConfig = await localDataSource.getLastAppConfig();
        return Right(localConfig);
      } on CacheException {
        return const Left(ServerFailure('No se pudo obtener la configuración'));
      }
    } on NotFoundException {
      return const Left(NotFoundFailure('Configuración no encontrada'));
    }
  }

  @override
  Future<Either<Failure, bool>> isMaintenanceMode() async {
    final result = await getAppConfig();
    return result.map((config) => config.maintenanceMode);
  }

  @override
  Future<Either<Failure, bool>> isVersionValid(String currentVersion) async {
    final result = await getAppConfig();
    return result.map((config) {
      // Simple version comparison
      return _compareVersions(currentVersion, config.minVersionIos) >= 0;
    });
  }

  int _compareVersions(String v1, String v2) {
    final parts1 = v1.split('.').map(int.parse).toList();
    final parts2 = v2.split('.').map(int.parse).toList();

    for (var i = 0; i < 3; i++) {
      final p1 = i < parts1.length ? parts1[i] : 0;
      final p2 = i < parts2.length ? parts2[i] : 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }
}
```

```dart
// lib/features/home/data/repositories/home_repository_impl.dart

import 'package:dartz/dartz.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/home_banner.dart';
import '../../domain/entities/featured_collection.dart';
import '../../domain/repositories/home_repository.dart';
import '../datasources/home_remote_datasource.dart';

class HomeRepositoryImpl implements HomeRepository {
  final HomeRemoteDataSource remoteDataSource;

  HomeRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<HomeBanner>>> getBanners() async {
    try {
      final banners = await remoteDataSource.getBanners();
      return Right(banners);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, List<FeaturedCollection>>> getFeaturedCollections() async {
    try {
      final collections = await remoteDataSource.getFeaturedCollections();
      return Right(collections);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }
}
```

---

## 4. Presentation Layer

### BLoCs

```dart
// lib/features/app_config/presentation/bloc/app_config_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/app_config.dart';
import '../../domain/usecases/get_app_config.dart';
import '../../domain/usecases/check_app_status.dart';

// Events
abstract class AppConfigEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadAppConfig extends AppConfigEvent {}

class CheckAppStatusEvent extends AppConfigEvent {
  final String currentVersion;
  CheckAppStatusEvent(this.currentVersion);

  @override
  List<Object?> get props => [currentVersion];
}

// States
abstract class AppConfigState extends Equatable {
  @override
  List<Object?> get props => [];
}

class AppConfigInitial extends AppConfigState {}

class AppConfigLoading extends AppConfigState {}

class AppConfigLoaded extends AppConfigState {
  final AppConfig config;
  final AppStatus status;

  AppConfigLoaded({required this.config, required this.status});

  @override
  List<Object?> get props => [config, status];
}

class AppConfigError extends AppConfigState {
  final String message;
  AppConfigError(this.message);

  @override
  List<Object?> get props => [message];
}

// BLoC
class AppConfigBloc extends Bloc<AppConfigEvent, AppConfigState> {
  final GetAppConfig getAppConfig;
  final CheckAppStatus checkAppStatus;

  AppConfigBloc({
    required this.getAppConfig,
    required this.checkAppStatus,
  }) : super(AppConfigInitial()) {
    on<LoadAppConfig>(_onLoadAppConfig);
    on<CheckAppStatusEvent>(_onCheckAppStatus);
  }

  Future<void> _onLoadAppConfig(
    LoadAppConfig event,
    Emitter<AppConfigState> emit,
  ) async {
    emit(AppConfigLoading());

    final result = await getAppConfig(const NoParams());

    result.fold(
      (failure) => emit(AppConfigError(failure.message)),
      (config) => emit(AppConfigLoaded(config: config, status: AppStatus.ready)),
    );
  }

  Future<void> _onCheckAppStatus(
    CheckAppStatusEvent event,
    Emitter<AppConfigState> emit,
  ) async {
    emit(AppConfigLoading());

    final configResult = await getAppConfig(const NoParams());

    await configResult.fold(
      (failure) async => emit(AppConfigError(failure.message)),
      (config) async {
        final statusResult = await checkAppStatus(
          CheckAppStatusParams(event.currentVersion),
        );

        statusResult.fold(
          (failure) => emit(AppConfigError(failure.message)),
          (status) => emit(AppConfigLoaded(config: config, status: status)),
        );
      },
    );
  }
}
```

```dart
// lib/features/home/presentation/bloc/home_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/home_banner.dart';
import '../../domain/entities/featured_collection.dart';
import '../../domain/usecases/get_banners.dart';
import '../../domain/usecases/get_featured_collections.dart';

// Events
abstract class HomeEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadHomeData extends HomeEvent {}

class RefreshHomeData extends HomeEvent {}

// States
abstract class HomeState extends Equatable {
  @override
  List<Object?> get props => [];
}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeLoaded extends HomeState {
  final List<HomeBanner> banners;
  final List<FeaturedCollection> featuredCollections;

  HomeLoaded({
    required this.banners,
    required this.featuredCollections,
  });

  @override
  List<Object?> get props => [banners, featuredCollections];
}

class HomeError extends HomeState {
  final String message;
  HomeError(this.message);

  @override
  List<Object?> get props => [message];
}

// BLoC
class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final GetBanners getBanners;
  final GetFeaturedCollections getFeaturedCollections;

  HomeBloc({
    required this.getBanners,
    required this.getFeaturedCollections,
  }) : super(HomeInitial()) {
    on<LoadHomeData>(_onLoadHomeData);
    on<RefreshHomeData>(_onRefreshHomeData);
  }

  Future<void> _onLoadHomeData(
    LoadHomeData event,
    Emitter<HomeState> emit,
  ) async {
    emit(HomeLoading());
    await _loadData(emit);
  }

  Future<void> _onRefreshHomeData(
    RefreshHomeData event,
    Emitter<HomeState> emit,
  ) async {
    await _loadData(emit);
  }

  Future<void> _loadData(Emitter<HomeState> emit) async {
    // Load in parallel
    final results = await Future.wait([
      getBanners(const NoParams()),
      getFeaturedCollections(const NoParams()),
    ]);

    final bannersResult = results[0] as Either<Failure, List<HomeBanner>>;
    final collectionsResult = results[1] as Either<Failure, List<FeaturedCollection>>;

    // Check for errors
    if (bannersResult.isLeft() || collectionsResult.isLeft()) {
      emit(HomeError('Error al cargar los datos'));
      return;
    }

    emit(HomeLoaded(
      banners: bannersResult.getOrElse(() => []),
      featuredCollections: collectionsResult.getOrElse(() => []),
    ));
  }
}
```

```dart
// lib/features/stores/presentation/bloc/stores_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/store_location.dart';
import '../../domain/usecases/get_stores.dart';
import '../../domain/usecases/get_nearby_stores.dart';

// Events
abstract class StoresEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadStores extends StoresEvent {}

class LoadNearbyStores extends StoresEvent {
  final double latitude;
  final double longitude;

  LoadNearbyStores({required this.latitude, required this.longitude});

  @override
  List<Object?> get props => [latitude, longitude];
}

// States
abstract class StoresState extends Equatable {
  @override
  List<Object?> get props => [];
}

class StoresInitial extends StoresState {}

class StoresLoading extends StoresState {}

class StoresLoaded extends StoresState {
  final List<StoreLocation> stores;
  final bool isNearby;

  StoresLoaded({required this.stores, this.isNearby = false});

  @override
  List<Object?> get props => [stores, isNearby];
}

class StoresError extends StoresState {
  final String message;
  StoresError(this.message);

  @override
  List<Object?> get props => [message];
}

// BLoC
class StoresBloc extends Bloc<StoresEvent, StoresState> {
  final GetStores getStores;
  final GetNearbyStores getNearbyStores;

  StoresBloc({
    required this.getStores,
    required this.getNearbyStores,
  }) : super(StoresInitial()) {
    on<LoadStores>(_onLoadStores);
    on<LoadNearbyStores>(_onLoadNearbyStores);
  }

  Future<void> _onLoadStores(
    LoadStores event,
    Emitter<StoresState> emit,
  ) async {
    emit(StoresLoading());

    final result = await getStores(const NoParams());

    result.fold(
      (failure) => emit(StoresError(failure.message)),
      (stores) => emit(StoresLoaded(stores: stores)),
    );
  }

  Future<void> _onLoadNearbyStores(
    LoadNearbyStores event,
    Emitter<StoresState> emit,
  ) async {
    emit(StoresLoading());

    final result = await getNearbyStores(NearbyStoresParams(
      latitude: event.latitude,
      longitude: event.longitude,
    ));

    result.fold(
      (failure) => emit(StoresError(failure.message)),
      (stores) => emit(StoresLoaded(stores: stores, isNearby: true)),
    );
  }
}
```

### Pages

```dart
// lib/features/home/presentation/pages/home_page.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/home_bloc.dart';
import '../widgets/banner_carousel.dart';
import '../widgets/featured_collection_widget.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is HomeError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(state.message),
                ElevatedButton(
                  onPressed: () => context.read<HomeBloc>().add(LoadHomeData()),
                  child: const Text('Reintentar'),
                ),
              ],
            ),
          );
        }

        if (state is HomeLoaded) {
          return RefreshIndicator(
            onRefresh: () async {
              context.read<HomeBloc>().add(RefreshHomeData());
            },
            child: ListView(
              children: [
                if (state.banners.isNotEmpty)
                  BannerCarousel(banners: state.banners),

                ...state.featuredCollections.map(
                  (collection) => FeaturedCollectionWidget(collection: collection),
                ),
              ],
            ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }
}
```

```dart
// lib/features/stores/presentation/pages/stores_page.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/stores_bloc.dart';
import '../widgets/store_card.dart';

class StoresPage extends StatelessWidget {
  const StoresPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tiendas')),
      body: BlocBuilder<StoresBloc, StoresState>(
        builder: (context, state) {
          if (state is StoresLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is StoresError) {
            return Center(child: Text(state.message));
          }

          if (state is StoresLoaded) {
            if (state.stores.isEmpty) {
              return const Center(child: Text('No hay tiendas disponibles'));
            }

            return ListView.builder(
              itemCount: state.stores.length,
              itemBuilder: (context, index) {
                return StoreCard(store: state.stores[index]);
              },
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
```

### Widgets

```dart
// lib/features/home/presentation/widgets/banner_carousel.dart

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../domain/entities/home_banner.dart';

class BannerCarousel extends StatelessWidget {
  final List<HomeBanner> banners;

  const BannerCarousel({super.key, required this.banners});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 200,
      child: PageView.builder(
        itemCount: banners.length,
        itemBuilder: (context, index) {
          return _BannerItem(banner: banners[index]);
        },
      ),
    );
  }
}

class _BannerItem extends StatelessWidget {
  final HomeBanner banner;

  const _BannerItem({required this.banner});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _handleTap(context),
      child: Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
            imageUrl: banner.effectiveImageUrl,
            fit: BoxFit.cover,
            placeholder: (_, __) => Container(color: Colors.grey[300]),
            errorWidget: (_, __, ___) => Container(color: Colors.grey[300]),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.transparent, Colors.black.withOpacity(0.6)],
              ),
            ),
          ),
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  banner.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (banner.subtitle != null)
                  Text(
                    banner.subtitle!,
                    style: const TextStyle(color: Colors.white70),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _handleTap(BuildContext context) {
    if (banner.linkUrl == null) return;

    switch (banner.linkType) {
      case BannerLinkType.product:
        Navigator.pushNamed(context, '/product', arguments: banner.linkUrl);
        break;
      case BannerLinkType.collection:
        Navigator.pushNamed(context, '/collection', arguments: banner.linkUrl);
        break;
      case BannerLinkType.external:
        launchUrl(Uri.parse(banner.linkUrl!));
        break;
      default:
        break;
    }
  }
}
```

```dart
// lib/features/stores/presentation/widgets/store_card.dart

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../domain/entities/store_location.dart';

class StoreCard extends StatelessWidget {
  final StoreLocation store;

  const StoreCard({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (store.imageUrl != null)
            CachedNetworkImage(
              imageUrl: store.imageUrl!,
              height: 150,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  store.name,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Text(store.fullAddress),
                if (store.phone != null) ...[
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () => launchUrl(Uri.parse('tel:${store.phone}')),
                    child: Text(
                      store.phone!,
                      style: TextStyle(color: Theme.of(context).primaryColor),
                    ),
                  ),
                ],
                if (store.hasCoordinates) ...[
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => _openMaps(),
                    icon: const Icon(Icons.directions),
                    label: const Text('Cómo llegar'),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _openMaps() {
    final url = 'https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}';
    launchUrl(Uri.parse(url));
  }
}
```

---

## 5. Dependency Injection

```dart
// lib/injection_container.dart

import 'package:get_it/get_it.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

final sl = GetIt.instance;

Future<void> init() async {
  //! External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);

  final graphQLClient = _createGraphQLClient();
  sl.registerLazySingleton(() => graphQLClient);

  //! Features - App Config
  // Bloc
  sl.registerFactory(() => AppConfigBloc(
    getAppConfig: sl(),
    checkAppStatus: sl(),
  ));

  // Use cases
  sl.registerLazySingleton(() => GetAppConfig(sl()));
  sl.registerLazySingleton(() => CheckAppStatus(sl()));

  // Repository
  sl.registerLazySingleton<AppConfigRepository>(() => AppConfigRepositoryImpl(
    remoteDataSource: sl(),
    localDataSource: sl(),
  ));

  // Data sources
  sl.registerLazySingleton<AppConfigRemoteDataSource>(
    () => AppConfigRemoteDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<AppConfigLocalDataSource>(
    () => AppConfigLocalDataSourceImpl(sl()),
  );

  //! Features - Home
  // Bloc
  sl.registerFactory(() => HomeBloc(
    getBanners: sl(),
    getFeaturedCollections: sl(),
  ));

  // Use cases
  sl.registerLazySingleton(() => GetBanners(sl()));
  sl.registerLazySingleton(() => GetFeaturedCollections(sl()));

  // Repository
  sl.registerLazySingleton<HomeRepository>(() => HomeRepositoryImpl(
    remoteDataSource: sl(),
  ));

  // Data sources
  sl.registerLazySingleton<HomeRemoteDataSource>(
    () => HomeRemoteDataSourceImpl(sl()),
  );

  //! Features - Stores
  // Bloc
  sl.registerFactory(() => StoresBloc(
    getStores: sl(),
    getNearbyStores: sl(),
  ));

  // Use cases
  sl.registerLazySingleton(() => GetStores(sl()));
  sl.registerLazySingleton(() => GetNearbyStores(sl()));

  // Repository
  sl.registerLazySingleton<StoreRepository>(() => StoreRepositoryImpl(
    remoteDataSource: sl(),
  ));

  // Data sources
  sl.registerLazySingleton<StoreRemoteDataSource>(
    () => StoreRemoteDataSourceImpl(sl()),
  );

  // ... More features
}

GraphQLClient _createGraphQLClient() {
  const storefrontUrl = 'https://TU_TIENDA.myshopify.com/api/2024-01/graphql.json';
  const storefrontToken = 'TU_STOREFRONT_ACCESS_TOKEN';

  final httpLink = HttpLink(
    storefrontUrl,
    defaultHeaders: {
      'X-Shopify-Storefront-Access-Token': storefrontToken,
      'Content-Type': 'application/json',
    },
  );

  return GraphQLClient(
    link: httpLink,
    cache: GraphQLCache(store: InMemoryStore()),
  );
}
```

```dart
// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => di.sl<AppConfigBloc>()..add(LoadAppConfig())),
        BlocProvider(create: (_) => di.sl<HomeBloc>()),
        BlocProvider(create: (_) => di.sl<StoresBloc>()),
      ],
      child: BlocBuilder<AppConfigBloc, AppConfigState>(
        builder: (context, state) {
          if (state is AppConfigLoaded) {
            return MaterialApp(
              title: state.config.appName,
              theme: ThemeData(
                primaryColor: state.config.primaryColor,
                colorScheme: ColorScheme.fromSeed(
                  seedColor: state.config.primaryColor,
                ),
              ),
              home: _buildHome(state),
            );
          }

          return const MaterialApp(
            home: Scaffold(
              body: Center(child: CircularProgressIndicator()),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHome(AppConfigLoaded state) {
    switch (state.status) {
      case AppStatus.maintenance:
        return MaintenancePage(message: state.config.maintenanceMessage);
      case AppStatus.updateRequired:
        return const UpdateRequiredPage();
      case AppStatus.ready:
        return const HomePage();
    }
  }
}
```

---

## 6. Implementación por Feature

### Resumen de Features

| Feature | Entities | Use Cases | BLoC |
|---------|----------|-----------|------|
| app_config | AppConfig | GetAppConfig, CheckAppStatus | AppConfigBloc |
| home | HomeBanner, FeaturedCollection | GetBanners, GetFeaturedCollections | HomeBloc |
| stores | StoreLocation | GetStores, GetNearbyStores | StoresBloc |
| content | FaqItem, ContactInfo | GetFaqs, GetFaqsByCategory, GetContactInfo | ContentBloc |
| checkout | PaymentConfig, ShippingConfig | GetPaymentConfig, GetShippingConfig | CheckoutConfigBloc |
| legal | LegalPolicy | GetLegalPolicies, GetPolicyByType | LegalBloc |
| newsletter | NewsletterConfig | GetNewsletterConfig, SubscribeToNewsletter | NewsletterBloc |
| notifications | NotificationConfig | GetNotificationConfig | NotificationsBloc |
| deep_links | DeepLinkConfig | GetDeepLinkConfig | DeepLinksBloc |
| favorites | FavoritesConfig | GetFavoritesConfig | FavoritesBloc |
| reviews | ReviewsConfig, ProductReview | GetReviewsConfig, GetProductReviews | ReviewsBloc |

---

## 7. Checklist de Integración

### Core
- [ ] Configurar failures y exceptions
- [ ] Crear base class UseCase
- [ ] Configurar GraphQL client
- [ ] Configurar dependency injection (GetIt)

### Por cada Feature
- [ ] **Domain**
  - [ ] Crear Entity (equatable)
  - [ ] Crear Repository abstract
  - [ ] Crear Use Case(s)
- [ ] **Data**
  - [ ] Crear Model (extends Entity)
  - [ ] Crear Remote DataSource
  - [ ] Crear Local DataSource (si aplica cache)
  - [ ] Implementar Repository
- [ ] **Presentation**
  - [ ] Crear BLoC (events, states)
  - [ ] Crear Page
  - [ ] Crear Widgets
- [ ] **DI**
  - [ ] Registrar en injection_container.dart

### Testing
- [ ] Unit tests para Use Cases
- [ ] Unit tests para Repositories
- [ ] Unit tests para BLoCs (bloc_test)
- [ ] Widget tests para Pages

---

## Principios Clean Architecture Aplicados

1. **Dependency Rule**: Las capas internas no conocen las externas
2. **Entities**: Objetos de negocio puros sin dependencias
3. **Use Cases**: Lógica de negocio encapsulada
4. **Interface Adapters**: Repositories convierten datos externos a entities
5. **Frameworks**: GraphQL, SharedPreferences son detalles de implementación
6. **Dependency Inversion**: Repository interfaces en Domain, implementations en Data
