import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        script: ["Caveat", "Dancing Script", "cursive"],
        body: ["Nunito", "Outfit", "sans-serif"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        love: {
          cream: "#FDFBF7",
          blush: "#FFB6C1",
          blushHover: "#FF9EAE",
          blushActive: "#FF8A9D",
          lavender: "#E6E6FA",
          lavenderHover: "#D8D8F6",
          burgundy: "#4A2E35",
          body: "#5C4048",
          muted: "#8A6D76",
        },
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },

        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        "float-up": {
          "0%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "0",
          },
          "10%": {
            opacity: "0.8",
          },
          "90%": {
            opacity: "0.8",
          },
          "100%": {
            transform: "translateY(-110vh) rotate(360deg)",
            opacity: "0",
          },
        },

        wiggle: {
          "0%,100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },

        "pulse-soft": {
          "0%,100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.9",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-up": "float-up linear infinite",
        wiggle: "wiggle 0.4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
      },
    },
  },

  plugins: [tailwindcssAnimate],
};