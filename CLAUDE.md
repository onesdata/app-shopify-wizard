# CLAUDE.md - Shopify Setup Wizard

## Project Overview

Shopify Setup Wizard is an embedded Shopify app built with React Router 7 and TypeScript. It manages metaobject definitions and entries that configure a mobile e-commerce application.

## Tech Stack

- **Framework**: React Router 7 (file-based routing)
- **Language**: TypeScript
- **UI**: Custom dark theme (inline styles)
- **Database**: Prisma + SQLite (for session storage)
- **API**: Shopify Admin GraphQL API (October 2025)
- **Auth**: Shopify OAuth via @shopify/shopify-app-remix

## Project Structure

```
app/
├── routes/
│   ├── app.tsx                 # Main layout with navigation
│   ├── app._index.tsx          # Dashboard (home)
│   ├── app.{section}.tsx       # Section pages
│   ├── app.guide.tsx           # Reference guide
│   ├── auth.login/             # Authentication
│   └── webhooks.*/             # Webhook handlers
├── lib/
│   ├── graphql/metaobjects.ts  # GraphQL queries/mutations
│   ├── metaobjects/definitions.ts  # Metaobject schemas
│   └── styles.ts               # Dark theme styles
├── shopify.server.ts           # Shopify app config
└── db.server.ts                # Prisma client
```

## Key Files

### app/lib/metaobjects/definitions.ts
Contains all metaobject type definitions in `METAOBJECT_DEFINITIONS` and section organization in `SETUP_SECTIONS`.

### app/lib/graphql/metaobjects.ts
GraphQL operations:
- `GET_METAOBJECT_DEFINITIONS` - List all definitions
- `GET_METAOBJECTS_BY_TYPE` - Get entries by type
- `CREATE_METAOBJECT_DEFINITION` - Create new type
- `CREATE_METAOBJECT` - Create entry
- `UPDATE_METAOBJECT` - Update entry
- `DELETE_METAOBJECT` - Delete entry
- `GET_SHOP_INFO` - Shop details
- `GET_COLLECTIONS` - For collection references

### app/lib/styles.ts
Exports `darkTheme` object with all UI styles and `onesticLogo` SVG.

## Route Pattern

Each section route follows this pattern:

```typescript
// app/routes/app.{section}.tsx

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { authenticate } from "../shopify.server";
import { darkTheme } from "../lib/styles";
import { METAOBJECT_DEFINITIONS } from "../lib/metaobjects/definitions";
import { /* GraphQL imports */ } from "../lib/graphql/metaobjects";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // 1. Check if metaobject definition exists
  const definitionsResponse = await admin.graphql(GET_METAOBJECT_DEFINITIONS);
  const definitionsData = await definitionsResponse.json();
  const existingTypes = new Set(
    definitionsData.data?.metaobjectDefinitions?.nodes?.map((d: any) => d.type) || []
  );

  const definitionExists = existingTypes.has("type_name");

  // 2. Load data if definition exists
  let data = null;
  if (definitionExists) {
    const response = await admin.graphql(GET_METAOBJECTS_BY_TYPE, {
      variables: { type: "type_name", first: 10 },
    });
    const result = await response.json();
    data = result.data?.metaobjects?.nodes || [];
  }

  return {
    definitionExists,
    data,
    definition: METAOBJECT_DEFINITIONS.type_name,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "create_definition") {
    const definition = METAOBJECT_DEFINITIONS["type_name"];
    const response = await admin.graphql(CREATE_METAOBJECT_DEFINITION, {
      variables: {
        definition: {
          name: definition.name,
          type: definition.type,
          fieldDefinitions: definition.fieldDefinitions.map((field) => ({
            name: field.name,
            key: field.key,
            type: field.type,
            required: field.required || false,
            description: field.description || null,
          })),
          access: { storefront: "PUBLIC_READ" },
        },
      },
    });
    const result = await response.json();
    if (result.data?.metaobjectDefinitionCreate?.userErrors?.length > 0) {
      return { error: result.data.metaobjectDefinitionCreate.userErrors[0].message };
    }
    return { success: true, message: "Definición creada" };
  }

  if (actionType === "create") {
    // Create metaobject entry
  }

  if (actionType === "update") {
    // Update metaobject entry
  }

  if (actionType === "delete") {
    // Delete metaobject entry
  }

  return { error: "Unknown action" };
};

export default function SectionPage() {
  const { definitionExists, data, definition } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;

  if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);

  if (!definitionExists) {
    return (
      <div style={darkTheme.page}>
        {/* Show create definition button */}
      </div>
    );
  }

  return (
    <div style={darkTheme.page}>
      {/* Show data and forms */}
    </div>
  );
}
```

## Adding a New Metaobject Type

### 1. Define the metaobject in `definitions.ts`

```typescript
export const METAOBJECT_DEFINITIONS: Record<string, MetaobjectDefinition> = {
  // ... existing definitions

  new_type: {
    name: "Display Name",
    type: "new_type",
    description: "Description for developers",
    fieldDefinitions: [
      {
        name: "Field Display Name",
        key: "field_key",
        type: "single_line_text", // See field types below
        required: true,
        description: "Help text",
      },
      // ... more fields
    ],
  },
};
```

### 2. Add to a section in `SETUP_SECTIONS`

```typescript
export const SETUP_SECTIONS = [
  // ... existing sections

  {
    id: "new-section",
    title: "Section Title",
    description: "Section description",
    route: "/app/new-section",
    icon: "📦",
    metaobjects: ["new_type", "another_type"],
  },
];
```

### 3. Create route file `app/routes/app.new-section.tsx`

Follow the route pattern above.

### 4. Update navigation in `app/routes/app.tsx` (if needed)

```typescript
<s-app-nav>
  <s-link href="/app">Dashboard</s-link>
  <s-link href="/app/guide">Guía</s-link>
</s-app-nav>
```

## Field Types Reference

| Type | Description | Example |
|------|-------------|---------|
| `single_line_text` | Short text | Names, titles |
| `multi_line_text` | Long text | Descriptions |
| `rich_text_field` | HTML content | Policies, articles |
| `number_integer` | Whole number | Order, count |
| `number_decimal` | Decimal number | Prices, coordinates |
| `boolean` | True/false | Toggles, flags |
| `date` | Date only | Birthdays |
| `date_time` | Date and time | Scheduled events |
| `url` | URL validation | Links |
| `color` | Color picker | Brand colors |
| `json` | JSON object | Complex data |
| `file_reference` | Image/file | Logos, banners |
| `collection_reference` | Shopify collection | Featured collections |
| `product_reference` | Shopify product | Featured products |
| `list.single_line_text` | Array of strings | Tags, categories |

## UI Components (darkTheme)

### Containers
- `darkTheme.page` - Page wrapper
- `darkTheme.card` - Content card
- `darkTheme.header` - Page header section

### Text
- `darkTheme.title` - Main title (24px, white)
- `darkTheme.subtitle` - Subtitle (14px, gray)
- `darkTheme.cardTitle` - Card title (16px, white)
- `darkTheme.cardDesc` - Card description (13px, gray)
- `darkTheme.label` - Form label (11px, gray)
- `darkTheme.value` - Display value (14px, white)

### Buttons
- `darkTheme.button` - Primary button (white bg)
- `darkTheme.buttonSecondary` - Secondary (transparent, border)
- `darkTheme.buttonSuccess` - Success (green)
- `darkTheme.buttonDanger` - Danger (red)

### Forms
- `darkTheme.input` - Text input
- `darkTheme.select` - Select dropdown
- `darkTheme.checkbox` - Checkbox
- `darkTheme.textarea` - Textarea

### Layout
- `darkTheme.grid` - 2-column grid
- `darkTheme.grid3` - 3-column grid
- `darkTheme.grid4` - 4-column grid
- `darkTheme.flexBetween` - Space between
- `darkTheme.flexGap(n)` - Flex with gap
- `darkTheme.stack(n)` - Vertical stack

### Status
- `darkTheme.badge(type)` - Status badge (success/warning/error/info/default)
- `darkTheme.alert(type)` - Alert box
- `darkTheme.progressBar` - Progress container
- `darkTheme.progressFill(percent, isComplete)` - Progress fill

## Common Patterns

### Toast Notifications

```typescript
const shopify = useAppBridge();

if (fetcher.data?.success) {
  shopify.toast.show(fetcher.data.message);
}
```

### Loading States

```typescript
const loadingAction = fetcher.state !== "idle"
  ? fetcher.formData?.get("action")
  : null;

<button disabled={loadingAction !== null}>
  {loadingAction === "create" ? "Creating..." : "Create"}
</button>
```

### Get Field Value from Metaobject

```typescript
const getFieldValue = (key: string) =>
  data?.fields?.find((f: any) => f.key === key)?.value || "";
```

### Open Shopify Admin

```typescript
// Open metaobject entries in Shopify admin
onClick={() => window.open("shopify://admin/content/entries/type_name", "_blank")}

// Open Shopify settings
onClick={() => window.open("shopify://admin/settings/payments", "_blank")}
```

### Parallel GraphQL Calls

```typescript
const [result1, result2] = await Promise.all([
  admin.graphql(QUERY_1),
  admin.graphql(QUERY_2),
]);

const [data1, data2] = await Promise.all([
  result1.json(),
  result2.json(),
]);
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Shopify
npm run deploy

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

## Environment Variables

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_products,read_content,write_content,read_metaobjects,write_metaobjects,...
```

## Shopify CLI Commands

```bash
# Start app tunnel
shopify app dev

# Deploy app
shopify app deploy

# Open app in admin
shopify app open
```

## Debugging

### Check metaobject in Shopify Admin
Navigate to: Settings > Custom data > Metaobjects > {type_name}

### Check metaobject entries
Navigate to: Content > {Metaobject Name}

Or use URL: `shopify://admin/content/entries/{type_name}`

### GraphQL Explorer
Use Shopify's GraphiQL app or the Admin API GraphQL explorer.

## Important Notes

1. **All metaobjects use PUBLIC_READ access** for Storefront API consumption
2. **Singleton metaobjects** (app_config, contact_info, etc.) should only have 1 entry
3. **Handle uniqueness** - Each metaobject entry needs a unique handle
4. **Field types are immutable** - Once created, field types cannot be changed
5. **Deletion cascades** - Deleting a definition deletes all its entries
