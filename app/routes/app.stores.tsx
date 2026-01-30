import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect } from "react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { createServiceContainer } from "../services/container";
import { theme } from "../lib/styles";
import { pluralize } from "../lib";
import { PageHeader, Card, EmptyState, Alert } from "../components/ui";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);

  const sectionData = await services.useCases.getSectionData.execute("store_location");
  const shopifyLocations = await services.useCases.getLocations.execute();

  return {
    exists: sectionData.definitionExists,
    stores: sectionData.entries,
    shopifyLocations,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const services = createServiceContainer(admin);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "create_definition") {
    const result = await services.useCases.createDefinition.execute("store_location");
    if (!result.success) return { error: result.error };
    return { success: true, message: "Definición de Store Location creada" };
  }

  if (actionType === "import_location") {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const province = formData.get("province") as string;
    const country = formData.get("country") as string;
    const postalCode = formData.get("postalCode") as string;
    const phone = formData.get("phone") as string;

    const result = await services.useCases.createMetaobject.execute({
      type: "store_location",
      fields: [
        { key: "name", value: name },
        { key: "address", value: address },
        { key: "city", value: city || "" },
        { key: "province", value: province || "" },
        { key: "country", value: country || "" },
        { key: "postal_code", value: postalCode || "" },
        { key: "phone", value: phone || "" },
        { key: "active", value: "true" },
      ],
    });

    if (!result.success) return { error: result.error };
    return { success: true, message: `Tienda "${name}" importada` };
  }

  if (actionType === "create_sample_store") {
    const result = await services.useCases.createMetaobject.execute({
      type: "store_location",
      fields: [
        { key: "name", value: "Tienda Principal" },
        { key: "address", value: "Calle Gran Vía 123" },
        { key: "city", value: "Madrid" },
        { key: "province", value: "Madrid" },
        { key: "country", value: "España" },
        { key: "postal_code", value: "28013" },
        { key: "phone", value: "+34 910 000 000" },
        { key: "latitude", value: "40.4200" },
        { key: "longitude", value: "-3.7025" },
        { key: "active", value: "true" },
      ],
    });

    if (!result.success) return { error: result.error };
    return { success: true, message: "Tienda de ejemplo creada" };
  }

  return { error: "Unknown action" };
};

export default function StoresPage() {
  const { exists, stores, shopifyLocations } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const loadingAction = fetcher.state !== "idle" ? fetcher.formData?.get("action") : null;
  const loadingLocationName = fetcher.state !== "idle" ? fetcher.formData?.get("name") : null;

  useEffect(() => {
    if (fetcher.data?.success) shopify.toast.show(fetcher.data.message);
    if (fetcher.data?.error) shopify.toast.show(fetcher.data.error, { isError: true });
  }, [fetcher.data, shopify]);

  const handleImportLocation = (location: any) => {
    const addressParts = [location.address?.address1, location.address?.address2].filter(Boolean);
    const address = addressParts.length > 0 ? addressParts.join("\n") : location.name || "Dirección pendiente";

    fetcher.submit({
      action: "import_location",
      name: location.name || "Tienda sin nombre",
      address,
      city: location.address?.city || "",
      province: location.address?.province || "",
      country: location.address?.country || "",
      postalCode: location.address?.zip || "",
      phone: location.address?.phone || "",
    }, { method: "POST" });
  };

  // Filter out already imported locations
  const existingStoreNames = new Set(
    stores.map((store: any) =>
      store.fields?.find((f: any) => f.key === "name")?.value?.toLowerCase().trim()
    ).filter(Boolean)
  );
  const availableLocations = shopifyLocations.filter((location: any) =>
    !existingStoreNames.has(location.name?.toLowerCase().trim())
  );

  return (
    <div style={theme.page}>
      <PageHeader
        icon="🏪"
        title="Tiendas Físicas"
        description="Ubicaciones de tiendas físicas para la app"
        badge={exists ? { label: pluralize(stores.length, "tienda", "tiendas"), type: stores.length > 0 ? "success" : "warning" } : undefined}
      />

      {fetcher.data?.error && <Alert type="error">{fetcher.data.error}</Alert>}

      {!exists ? (
        <EmptyState
          icon="🏪"
          title="Configurar Tiendas Físicas"
          description="Añade ubicaciones físicas con horarios, servicios y coordenadas."
          action={{
            label: "Crear Definición",
            loadingLabel: "Creando...",
            onClick: () => fetcher.submit({ action: "create_definition" }, { method: "POST" }),
            loading: loadingAction === "create_definition",
          }}
        />
      ) : (
        <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                Store Locations
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/store_location/new", "_blank")}
                >
                  + Nueva
                </button>
                <button
                  style={theme.buttonSecondary}
                  onClick={() => window.open("shopify://admin/content/entries/store_location", "_blank")}
                >
                  Gestionar
                </button>
              </div>
            </div>
          </Card>

          {stores.length === 0 && (
            <Card style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "#666", margin: "0 0 16px" }}>No hay tiendas creadas aún.</p>
              <button
                style={{ ...theme.button, ...theme.buttonSuccess }}
                onClick={() => fetcher.submit({ action: "create_sample_store" }, { method: "POST" })}
                disabled={loadingAction !== null}
              >
                {loadingAction === "create_sample_store" ? "Creando..." : "Crear Tienda de Ejemplo"}
              </button>
            </Card>
          )}

          {stores.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
              {stores.map((store: any) => {
                const name = store.fields?.find((f: any) => f.key === "name")?.value;
                const city = store.fields?.find((f: any) => f.key === "city")?.value;
                const address = store.fields?.find((f: any) => f.key === "address")?.value;
                const active = store.fields?.find((f: any) => f.key === "active")?.value;
                const phone = store.fields?.find((f: any) => f.key === "phone")?.value;
                const storeId = store.id.split("/").pop();

                return (
                  <Card key={store.id} style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "28px" }}>🏪</span>
                      <span style={theme.badge(active === "true" ? "success" : "pending")}>
                        {active === "true" ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px" }}>{name}</h3>
                    <p style={{ fontSize: "13px", color: "#666", margin: "0 0 8px" }}>{city}</p>
                    {address && (
                      <p style={{ fontSize: "12px", color: "#999", margin: "0 0 8px" }}>
                        {address.substring(0, 50)}{address.length > 50 && "..."}
                      </p>
                    )}
                    {phone && <p style={{ fontSize: "12px", color: "#5a9a5a", margin: "0 0 12px" }}>📞 {phone}</p>}
                    <button
                      style={{ ...theme.buttonSecondary, width: "100%", padding: "8px" }}
                      onClick={() => window.open(`shopify://admin/content/entries/store_location/${storeId}`, "_blank")}
                    >
                      Editar
                    </button>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Import from Shopify Locations */}
          {availableLocations.length > 0 && (
            <Card style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px" }}>
                📍 Importar desde Shopify
              </h3>
              <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px" }}>
                Importa ubicaciones existentes de Shopify
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
                {availableLocations.map((location: any) => (
                  <div key={location.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "#fafafa",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                  }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>{location.name}</p>
                      <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0" }}>
                        {[location.address?.city, location.address?.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <button
                      style={{ ...theme.buttonSecondary, padding: "8px 14px", fontSize: "13px" }}
                      onClick={() => handleImportLocation(location)}
                      disabled={loadingAction !== null}
                    >
                      {loadingAction === "import_location" && loadingLocationName === location.name ? "..." : "Importar"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
