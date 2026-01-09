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


export const HTMLWrapper = (theme:any,clean:string | undefined) =>{
  return (
    `
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <!-- Google Font -->
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

        <!-- Tailwind -->
        <script src="https://cdn.tailwindcss.com/3.0.0"></script>

        <!-- Iconify -->
        <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

        <style>
            ${themeToCssVars(theme)}
        </style>
        </head>

        <body class="bg-[var(--background)] text-[var(--foreground)] w-full">
        ${clean ?? ""}
        </body>

        </html>
    `
  )
}