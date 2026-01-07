// export type Theme = {
//   background: string;
//   foreground: string;
//   card: string;
//   cardForeground: string;
//   popover: string;
//   popoverForeground: string;
//   primary: string;
//   primaryRgb: string;
//   primaryForeground: string;
//   secondary: string;
//   secondaryForeground: string;
//   muted: string;
//   mutedForeground: string;
//   accent: string;
//   accentForeground: string;
//   destructive: string;
//   border: string;
//   input: string;
//   ring: string;
//   radius: string;
//   chart: string[];
// };

export const THEMES = {
  PAPER_GRAY: {
    background: "#f7f7f5",
    foreground: "#1a1a18",
    card: "#ffffff",
    cardForeground: "#1a1a18",
    popover: "#ffffff",
    popoverForeground: "#1a1a18",
    primary: "#2f3e46",
    primaryRgb: "47, 62, 70",
    primaryForeground: "#ffffff",
    secondary: "#ced4da",
    secondaryForeground: "#1a1a18",
    muted: "#e6e7e5",
    mutedForeground: "#555753",
    accent: "#6c757d",
    accentForeground: "#ffffff",
    destructive: "#c92a2a",
    border: "#dcded9",
    input: "#dcded9",
    ring: "#2f3e46",
    radius: "0.6rem",
    chart: ["#2f3e46", "#495057", "#6c757d", "#adb5bd", "#343a40"],
  },

  CLASSIC_NAVY: {
    background: "#f8fafc",
    foreground: "#0a2540",
    card: "#ffffff",
    cardForeground: "#0a2540",
    popover: "#ffffff",
    popoverForeground: "#0a2540",
    primary: "#0a2540",
    primaryRgb: "10, 37, 64",
    primaryForeground: "#ffffff",
    secondary: "#1f3b63",
    secondaryForeground: "#ffffff",
    muted: "#e3e8ef",
    mutedForeground: "#3c516f",
    accent: "#2c7be5",
    accentForeground: "#ffffff",
    destructive: "#b42318",
    border: "#d0d7e2",
    input: "#d0d7e2",
    ring: "#0a2540",
    radius: "0.55rem",
    chart: ["#0a2540", "#2c7be5", "#4a6fa5", "#8aa4cf", "#1f3b63"],
  },

  WARM_IVORY: {
    background: "#faf3e7",
    foreground: "#2a2a2a",
    card: "#fff8ed",
    cardForeground: "#2a2a2a",
    popover: "#fff8ed",
    popoverForeground: "#2a2a2a",
    primary: "#7a4b2c",
    primaryRgb: "122, 75, 44",
    primaryForeground: "#ffffff",
    secondary: "#c9a888",
    secondaryForeground: "#2a2a2a",
    muted: "#e8d7c4",
    mutedForeground: "#5c4939",
    accent: "#a47148",
    accentForeground: "#ffffff",
    destructive: "#ba2d0b",
    border: "#e2d3c2",
    input: "#e2d3c2",
    ring: "#7a4b2c",
    radius: "0.7rem",
    chart: ["#7a4b2c", "#a47148", "#c9a888", "#ddb892", "#6c584c"],
  },

  SOFT_MONO: {
    background: "#ffffff",
    foreground: "#111111",
    card: "#fafafa",
    cardForeground: "#111111",
    popover: "#fafafa",
    popoverForeground: "#111111",
    primary: "#111111",
    primaryRgb: "17, 17, 17",
    primaryForeground: "#ffffff",
    secondary: "#e9e9e9",
    secondaryForeground: "#111111",
    muted: "#f2f2f2",
    mutedForeground: "#555555",
    accent: "#444444",
    accentForeground: "#ffffff",
    destructive: "#cc0000",
    border: "#e5e5e5",
    input: "#e5e5e5",
    ring: "#111111",
    radius: "0.5rem",
    chart: ["#111111", "#333333", "#555555", "#777777", "#aaaaaa"],
  },

  TERRACOTTA: {
    background: "#f4ede4",
    foreground: "#2b211a",
    card: "#fffaf4",
    cardForeground: "#2b211a",
    popover: "#fffaf4",
    popoverForeground: "#2b211a",
    primary: "#9c3d22",
    primaryRgb: "156, 61, 34",
    primaryForeground: "#ffffff",
    secondary: "#c76d3a",
    secondaryForeground: "#ffffff",
    muted: "#e5d2c3",
    mutedForeground: "#4a3a30",
    accent: "#b8572b",
    accentForeground: "#ffffff",
    destructive: "#a11212",
    border: "#e1d2c5",
    input: "#e1d2c5",
    ring: "#9c3d22",
    radius: "0.65rem",
    chart: ["#9c3d22", "#c76d3a", "#e19f6f", "#6f422a", "#b8572b"],
  },
} as const;

export const THEME_NAME_LIST = [
  "PAPER_GRAY",
  "CLASSIC_NAVY",
  "WARM_IVORY",
  "SOFT_MONO",
  "TERRACOTTA"
 ] as const;

export type ThemeKey = keyof typeof THEMES;

export type THEME_NAME_LIST = (typeof THEMES)[ThemeKey];

// const DEFAULT_CHART_COLORS = [
//   "#4f46e5",
//   "#22c55e",
//   "#eab308",
//   "#f43f5e",
//   "#3b82f6",
// ];


export function themeToCssVars(theme: any) {
    // const chart = theme.chart && Array.isArray(theme.chart)
    // ? theme.chart
    // : DEFAULT_CHART_COLORS;

  return `
:root {
  --background: ${theme.background};
  --foreground: ${theme.foreground};

  --card: ${theme.card};
  --card-foreground: ${theme.cardForeground};

  --popover: ${theme.popover};
  --popover-foreground: ${theme.popoverForeground};

  --primary: ${theme.primary};
  --primary-rgb: ${theme.primaryRgb};
  --primary-foreground: ${theme.primaryForeground};

  --secondary: ${theme.secondary};
  --secondary-foreground: ${theme.secondaryForeground};

  --muted: ${theme.muted};
  --muted-foreground: ${theme.mutedForeground};

  --accent: ${theme.accent};
  --accent-foreground: ${theme.accentForeground};

  --destructive: ${theme.destructive};

  --border: ${theme.border};
  --input: ${theme.input};
  --ring: ${theme.ring};

  --radius: ${theme.radius};

  /* charts */
--chart-1: ${theme.chart?.[0] ?? "#4f46e5"};
--chart-2: ${theme.chart?.[1] ?? "#22c55e"};
--chart-3: ${theme.chart?.[2] ?? "#eab308"};
--chart-4: ${theme.chart?.[3] ?? "#f43f5e"};
--chart-5: ${theme.chart?.[4] ?? "#3b82f6"};
}
`;
}

