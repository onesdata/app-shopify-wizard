// Shopify Setup Wizard - Clean Enterprise Theme
// Based on designer mockup - Professional, minimal, functional

export const theme = {
  // Colors
  colors: {
    background: "#f5f5f5",
    cardBg: "#ffffff",
    text: "#1a1a1a",
    textMuted: "#666666",
    textLight: "#999999",
    border: "#e8e8e8",
    borderLight: "#f0f0f0",

    // Status colors
    success: "#5a9a5a",
    successBg: "#e8f5e8",
    successLight: "#f0f8f0",

    warning: "#d97706",
    warningBg: "#fff7ed",

    pending: "#9e9e9e",
    pendingBg: "#f5f5f5",

    // Progress bar segments
    progressGreen: "#6b9b37",
    progressOrange: "#e07b24",
    progressGray: "#b5b5b5",
  },

  // Typography
  fonts: {
    base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Page container
  page: {
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Cards
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    border: "1px solid #f0f0f0",
  },

  cardCompact: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e8e8e8",
  },

  // Typography styles
  title: {
    fontSize: "24px",
    fontWeight: "600" as const,
    color: "#1a1a1a",
    margin: 0,
    letterSpacing: "-0.02em",
  },

  subtitle: {
    fontSize: "14px",
    color: "#666666",
    margin: 0,
    lineHeight: 1.5,
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600" as const,
    color: "#1a1a1a",
    margin: 0,
  },

  label: {
    fontSize: "12px",
    fontWeight: "500" as const,
    color: "#999999",
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    marginBottom: "12px",
  },

  // Progress bar segments
  progressSegment: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500" as const,
  },

  progressNumber: {
    fontSize: "18px",
    fontWeight: "700" as const,
    marginRight: "8px",
  },

  progressLabel: {
    fontSize: "12px",
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    opacity: 0.95,
  },

  // Badges
  badge: (type: "success" | "warning" | "pending" | "percent") => {
    const styles = {
      success: {
        background: "#e8f5e8",
        color: "#5a9a5a",
        border: "1px solid #d4e8d4"
      },
      warning: {
        background: "#fff7ed",
        color: "#d97706",
        border: "1px solid #fed7aa"
      },
      pending: {
        background: "#f5f5f5",
        color: "#757575",
        border: "1px solid #e8e8e8"
      },
      percent: {
        background: "#e8f5e8",
        color: "#5a9a5a",
        border: "1px solid #d4e8d4"
      },
    };
    const s = styles[type];
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "500" as const,
      background: s.background,
      color: s.color,
      border: s.border,
      whiteSpace: "nowrap" as const,
    };
  },

  // Tags (for metaobject items)
  tag: (complete: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500" as const,
    background: complete ? "#e8f5e8" : "#f5f5f5",
    color: complete ? "#5a9a5a" : "#757575",
    border: complete ? "1px solid #d4e8d4" : "1px solid #e8e8e8",
  }),

  // Progress bars
  progressBar: {
    height: "6px",
    background: "#e8e8e8",
    borderRadius: "3px",
    overflow: "hidden" as const,
    marginTop: "12px",
  },

  progressFill: (percent: number) => ({
    height: "100%",
    width: `${percent}%`,
    background: percent === 100 ? "#6b9b37" : percent > 0 ? "#6b9b37" : "#e8e8e8",
    borderRadius: "3px",
    transition: "width 0.4s ease",
  }),

  // Form elements
  input: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e8e8e8",
    background: "#fafafa",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  inputFocus: {
    borderColor: "#999999",
    boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.05)",
  },

  // Buttons
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    background: "#1a1a1a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    cursor: "pointer",
    transition: "background 0.2s, transform 0.1s",
  },

  buttonSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    background: "#ffffff",
    color: "#1a1a1a",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
  },

  buttonSuccess: {
    background: "#5a9a5a",
    color: "#ffffff",
  },

  // Filter tabs
  filterTab: (active: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 4px",
    background: "transparent",
    border: "none",
    borderBottom: active ? "2px solid #1a1a1a" : "2px solid transparent",
    fontSize: "14px",
    fontWeight: active ? "600" : "400" as const,
    color: active ? "#1a1a1a" : "#666666",
    cursor: "pointer",
    transition: "color 0.2s",
    marginRight: "24px",
  }),

  filterCount: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "22px",
    height: "22px",
    padding: "0 6px",
    borderRadius: "11px",
    background: "#f0f0f0",
    fontSize: "12px",
    fontWeight: "500" as const,
    color: "#666666",
  },

  // Section row (expandable)
  sectionRow: (expanded: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: expanded ? "#fafafa" : "#ffffff",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "background 0.15s",
  }),

  sectionRowHover: {
    background: "#fafafa",
  },

  // Expanded content
  expandedContent: {
    padding: "16px 20px 20px 52px",
    background: "#fafafa",
    borderBottom: "1px solid #f0f0f0",
  },

  // Link styles
  configureLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#1a1a1a",
    textDecoration: "none",
    transition: "opacity 0.2s",
  },

  viewAllLink: {
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#666",
    textDecoration: "none",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    transition: "color 0.2s",
  },

  // Icons
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#f5f5f5",
    fontSize: "16px",
    marginRight: "12px",
  },

  // Chevron
  chevron: (expanded: boolean) => ({
    fontSize: "18px",
    color: "#999999",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s",
  }),

  // Percentage display (header)
  percentageDisplay: {
    fontSize: "36px",
    fontWeight: "300" as const,
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
  },

  // Toggle button
  toggleButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "#ffffff",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#1a1a1a",
    cursor: "pointer",
  },

  // Divider
  divider: {
    height: "1px",
    background: "#e8e8e8",
    margin: "16px 0",
  },

  // Grid layouts
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },

  // Flex utilities
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  flexGap: (gap: number) => ({
    display: "flex",
    gap: `${gap}px`,
    alignItems: "center",
  }),

  stack: (gap: number) => ({
    display: "flex",
    flexDirection: "column" as const,
    gap: `${gap}px`,
  }),

  // Table styles
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
  },

  th: {
    textAlign: "left" as const,
    padding: "12px 16px",
    borderBottom: "1px solid #e8e8e8",
    color: "#666666",
    fontSize: "12px",
    textTransform: "uppercase" as const,
    fontWeight: "500" as const,
    letterSpacing: "0.03em",
  },

  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0f0f0",
    color: "#1a1a1a",
  },

  // Empty state
  emptyState: {
    textAlign: "center" as const,
    padding: "48px 24px",
    color: "#666666",
  },

  // Alert styles
  alert: (type: "success" | "warning" | "error" | "info") => {
    const colors = {
      success: { bg: "#e8f5e8", border: "#5a9a5a", color: "#2d5a2d" },
      warning: { bg: "#fff7ed", border: "#d97706", color: "#9a3412" },
      error: { bg: "#fef2f2", border: "#dc2626", color: "#991b1b" },
      info: { bg: "#eff6ff", border: "#3b82f6", color: "#1e40af" },
    };
    const c = colors[type];
    return {
      padding: "14px 18px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "10px",
      color: c.color,
      fontSize: "14px",
      marginBottom: "16px",
    };
  },
};

// Legacy export for compatibility
export const darkTheme = theme;

// Onestic Logo SVG inline
export const onesticLogo = `<svg width="94" height="20" viewBox="0 0 94 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4098_52)">
<path d="M0 13.0065C0 9.09707 2.97869 6.4725 7.40719 6.4725C11.8632 6.4725 14.8419 9.09707 14.8419 13.0065C14.8419 16.8673 11.8632 19.5146 7.40719 19.5146C2.97869 19.5146 0 16.864 0 13.0065ZM11.9975 13.0065C11.9975 10.3334 10.6545 8.8705 7.40719 8.8705C4.18743 8.8705 2.84439 10.3334 2.84439 13.0065C2.84439 15.6537 4.18736 17.0938 7.40719 17.0938C10.6545 17.0938 11.9975 15.6569 11.9975 13.0065ZM16.6154 19.2621V6.72488H19.2739V10.6084H19.4633C19.8661 8.48866 21.6362 6.4725 25.0212 6.4725C28.7265 6.4725 30.5517 8.81874 30.5517 11.7184V19.2621H27.6521V12.4498C27.6521 10.1036 26.526 8.91905 23.7608 8.91905C20.8338 8.91905 19.5217 10.3334 19.5217 13.055V19.2589H16.6222L16.6154 19.2621ZM32.3147 13.0065C32.3147 9.09707 35.1592 6.4725 39.5084 6.4725C43.6407 6.4725 46.4611 8.61812 46.4611 12.4271C46.4611 12.8802 46.4335 13.233 46.3543 13.6116H35.0283C35.135 16.0323 36.3988 17.3204 39.4843 17.3204C42.2771 17.3204 43.4307 16.4627 43.4307 14.9741V14.7735H46.3302V15C46.3302 17.6731 43.5374 19.5146 39.567 19.5146C35.1901 19.5146 32.3182 17.1941 32.3182 13.0065H32.3147ZM35.0524 12.0971H43.7234V12.0453C43.7234 9.72494 42.3011 8.61485 39.4568 8.61485C36.5056 8.61485 35.2142 9.85113 35.0558 12.0971H35.0524ZM48.207 15.0226V14.9482H51.1066V15.1489C51.1066 16.7896 52.1534 17.3171 54.9461 17.3171C57.5495 17.3171 58.3278 16.8123 58.3278 15.7023C58.3278 14.6667 57.6838 14.3398 55.7761 14.0873L52.1258 13.6343C49.6017 13.3301 48.0727 12.3236 48.0727 10.2298C48.0727 8.03559 50.194 6.4725 54.2987 6.4725C58.3794 6.4725 60.8485 8.00971 60.8485 10.987V11.0615H57.9765V10.9094C57.9765 9.42067 57.1707 8.64079 54.2195 8.64079C51.778 8.64079 50.9172 9.14562 50.9172 10.3301C50.9172 11.3139 51.4543 11.6667 53.4689 11.919L56.5543 12.3236C59.7224 12.7023 61.1722 13.712 61.1722 15.7799C61.1722 18.1262 58.7031 19.5146 54.9461 19.5146C50.652 19.5146 48.207 17.9255 48.207 15.0259V15.0226ZM68.955 19.2621C66.0827 19.2621 64.3092 18.0777 64.3092 15.0226V8.99355H62.0537V6.72167H64.3092V4H67.1812V6.72495H72.0126V8.99676H67.1812V14.8738C67.1812 16.411 67.9318 16.8156 69.5985 16.8156H72.016V19.2621H68.955ZM90.2119 14.356C90.1154 16.1715 88.6281 17.0679 86.1108 17.0679C83.1045 17.0679 81.7615 15.7055 81.7615 13.0065C81.7615 10.2556 83.1045 8.91905 86.1108 8.91905C88.6281 8.91905 90.1154 9.81549 90.2119 11.631H93.0874C93.0361 8.55339 90.1262 6.47243 86.1621 6.47243C81.7615 6.47243 78.8894 9.09707 78.8894 13.0065C78.8894 16.864 81.7615 19.5146 86.1621 19.5146C90.1222 19.5146 93.0321 17.4337 93.0874 14.356H90.2119ZM77.0095 11.0647H74.1097V19.2621H77.0095V11.0647ZM77.0095 4V5.81554C77.0095 6.31715 76.5751 6.72495 76.0415 6.72495H74.1097V9.44983H77.0095V7.63429C77.0095 7.13274 77.4432 6.72495 77.9767 6.72495H79.9086V4H77.0095Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_4098_52">
<rect width="94" height="19.6214" fill="white"/>
</clipPath>
</defs>
</svg>`;

// Quick helper for creating metaobject mutation (kept for compatibility)
export const createMetaobjectMutation = (type: string, definition: any) => `#graphql
  mutation CreateMetaobjectDefinition {
    metaobjectDefinitionCreate(definition: {
      name: "${definition.name}"
      type: "${type}"
      fieldDefinitions: [
        ${definition.fieldDefinitions.map((f: any) => `
          { name: "${f.name}", key: "${f.key}", type: "${f.type}"${f.required ? ', required: true' : ''}${f.description ? `, description: "${f.description}"` : ''} }
        `).join(',')}
      ]
      access: { storefront: PUBLIC_READ }
    }) {
      metaobjectDefinition { id type }
      userErrors { field message }
    }
  }
`;
