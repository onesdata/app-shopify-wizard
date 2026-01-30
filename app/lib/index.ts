// Main exports for the Setup Wizard library

export * from "./metaobjects/definitions";
export * from "./graphql/metaobjects";

/**
 * Pluraliza una palabra en español según la cantidad
 * @param count - Número de elementos
 * @param singular - Forma singular (ej: "entrada")
 * @param plural - Forma plural (ej: "entradas")
 * @returns String formateado con número y palabra correcta
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
