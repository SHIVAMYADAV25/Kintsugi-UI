export type Theme = {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryRgb: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  border: string
  input: string
  ring: string
  radius: string
  chart: string[]
}

/* ----------------------------------------
   Core Product Themes (Your originals)
---------------------------------------- */

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
    chart: ["#2f3e46", "#495057", "#6c757d", "#adb5bd", "#343a40"]
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
    chart: ["#0a2540", "#2c7be5", "#4a6fa5", "#8aa4cf", "#1f3b63"]
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
    chart: ["#7a4b2c", "#a47148", "#c9a888", "#ddb892", "#6c584c"]
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
    chart: ["#111111", "#333333", "#555555", "#777777", "#aaaaaa"]
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
    chart: ["#9c3d22", "#c76d3a", "#e19f6f", "#6f422a", "#b8572b"]
  },

  /* ----------------------------------------
     Brand Modes (Famous Websites)
  ---------------------------------------- */

  NETFLIX: {
    background: "#0b0b0f",
    foreground: "#ffffff",
    card: "#141414",
    cardForeground: "#ffffff",
    popover: "#141414",
    popoverForeground: "#ffffff",
    primary: "#e50914",
    primaryRgb: "229, 9, 20",
    primaryForeground: "#ffffff",
    secondary: "#b81d24",
    secondaryForeground: "#ffffff",
    muted: "#1f1f1f",
    mutedForeground: "#aaaaaa",
    accent: "#f40612",
    accentForeground: "#ffffff",
    destructive: "#ff3b30",
    border: "#2a2a2a",
    input: "#2a2a2a",
    ring: "#e50914",
    radius: "0.75rem",
    chart: ["#e50914", "#b81d24", "#f40612", "#ffffff", "#555555"]
  },

  GITHUB: {
    background: "#0d1117",
    foreground: "#e6edf3",
    card: "#161b22",
    cardForeground: "#e6edf3",
    popover: "#161b22",
    popoverForeground: "#e6edf3",
    primary: "#0969da",
    primaryRgb: "9, 105, 218",
    primaryForeground: "#ffffff",
    secondary: "#1f6feb",
    secondaryForeground: "#ffffff",
    muted: "#21262d",
    mutedForeground: "#8b949e",
    accent: "#2da44e",
    accentForeground: "#ffffff",
    destructive: "#f85149",
    border: "#30363d",
    input: "#30363d",
    ring: "#0969da",
    radius: "0.6rem",
    chart: ["#0969da", "#2da44e", "#f85149", "#8b949e", "#1f6feb"]
  },

  STRIPE: {
    background: "#0a0b10",
    foreground: "#ffffff",
    card: "#12131a",
    cardForeground: "#ffffff",
    popover: "#12131a",
    popoverForeground: "#ffffff",
    primary: "#635bff",
    primaryRgb: "99, 91, 255",
    primaryForeground: "#ffffff",
    secondary: "#7a73ff",
    secondaryForeground: "#ffffff",
    muted: "#1c1e27",
    mutedForeground: "#a1a1aa",
    accent: "#00d4ff",
    accentForeground: "#000000",
    destructive: "#ff453a",
    border: "#2a2d3a",
    input: "#2a2d3a",
    ring: "#635bff",
    radius: "0.8rem",
    chart: ["#635bff", "#00d4ff", "#7a73ff", "#ffffff", "#a1a1aa"]
  },

  LINEAR: {
    background: "#0f1117",
    foreground: "#ffffff",
    card: "#151822",
    cardForeground: "#ffffff",
    popover: "#151822",
    popoverForeground: "#ffffff",
    primary: "#5e6ad2",
    primaryRgb: "94, 106, 210",
    primaryForeground: "#ffffff",
    secondary: "#8b93f8",
    secondaryForeground: "#ffffff",
    muted: "#1e2230",
    mutedForeground: "#9ca3af",
    accent: "#2dd4bf",
    accentForeground: "#0f1117",
    destructive: "#fb7185",
    border: "#2a2f45",
    input: "#2a2f45",
    ring: "#5e6ad2",
    radius: "0.7rem",
    chart: ["#5e6ad2", "#2dd4bf", "#8b93f8", "#fb7185", "#9ca3af"]
  },

  NOTION: {
    background: "#f7f6f3",
    foreground: "#37352f",
    card: "#ffffff",
    cardForeground: "#37352f",
    popover: "#ffffff",
    popoverForeground: "#37352f",
    primary: "#37352f",
    primaryRgb: "55, 53, 47",
    primaryForeground: "#ffffff",
    secondary: "#e6e6e3",
    secondaryForeground: "#37352f",
    muted: "#efefe9",
    mutedForeground: "#787774",
    accent: "#b5b5b3",
    accentForeground: "#37352f",
    destructive: "#d92d20",
    border: "#e0e0dc",
    input: "#e0e0dc",
    ring: "#37352f",
    radius: "0.5rem",
    chart: ["#37352f", "#b5b5b3", "#787774", "#e6e6e3", "#d92d20"]
  }
} as const

export const THEME_NAME_LIST = Object.keys(THEMES) as (keyof typeof THEMES)[]
export type ThemeKey = keyof typeof THEMES

export function themeToCssVars(theme: Theme) {
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

  --chart-1: ${theme.chart[0]};
  --chart-2: ${theme.chart[1]};
  --chart-3: ${theme.chart[2]};
  --chart-4: ${theme.chart[3]};
  --chart-5: ${theme.chart[4]};
}
`
}
