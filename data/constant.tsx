import {
  Plane,
  Brain,
  Wallet,
  ShoppingCart,
  CheckSquare,
  Utensils,
  Baby
} from "lucide-react";
import { themeToCssVars } from "./themes";

export const suggestions = [
  {
    icon: Plane,
    name: "Travel Planner App",
    description:
      "Trip planning dashboard with maps, itineraries, and booking cards. Clean modern layout with soft colors."
  },
  {
    icon: Brain,
    name: "AI Learning Platform",
    description:
      "Gamified learning experience with progress steps and streaks. Friendly, engaging, and colorful UI."
  },
  {
    icon: Wallet,
    name: "Finance Tracker",
    description:
      "Expense tracking dashboard with charts and budget goals. Minimal UI with dark mode support."
  },
  {
    icon: ShoppingCart,
    name: "E-Commerce Store",
    description:
      "Product browsing and checkout experience. Premium UI with strong call-to-action design."
  },
  {
    icon: CheckSquare,
    name: "Smart To-Do Planner",
    description:
      "Task management with calendar and priority views. Simple productivity-focused interface."
  },
  {
    icon: Utensils,
    name: "Food Delivery App",
    description:
      "Restaurant listings and fast ordering flow. Bright visuals with large food images."
  },
  {
    icon: Baby,
    name: "Kids Learning App",
    description:
      "Interactive learning app for kids with rewards. Colorful UI and playful illustrations."
  }
];


export function HTMLWrapper(theme: any, innerHTML: string = "") {
  const camelToKebab = (s: string) =>
    s.replace(/[A-Z]/g, m => "-" + m.toLowerCase())

  const cssVars = Object.entries(theme || {})
    .filter(([k]) => k !== "chart")
    .map(([k, v]) => `--${camelToKebab(k)}:${v}`)
    .join(";")

  const charts =
    theme?.chart?.map((c: string, i: number) => `--chart-${i + 1}:${c}`).join(";") || ""

  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>

<script src="https://cdn.tailwindcss.com"></script>

<style>
:root{${cssVars};${charts}}
html,body{
  margin:0;
  padding:0;
  background:var(--background);
  color:var(--foreground);
  font-family:Inter,system-ui,sans-serif;
}
</style>
</head>

<body class="bg-[var(--background)] text-[var(--foreground)]">
${innerHTML}
</body>
</html>
`
}
