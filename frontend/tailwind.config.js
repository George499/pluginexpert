/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      xl2: "1500px",
    },
    extend: {
      backgroundImage: {
        "hero-image": "url('/images/bkground_1.png')",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateX(-20px)" },
        "100%": { opacity: "1", transform: "translateX(0)" },
      },
    },
    animation: {
      fadeIn: "fadeIn 1s ease-out",
    },
  },
  plugins: [],
};
