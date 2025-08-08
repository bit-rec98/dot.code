/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./public/data/*.json", // Incluir archivos JSON
  ],
  safelist: [
    // Gradientes para servicios, ideas y FAQs
    /* "bg-gradient-to-br",
    "from-blue-900",
    "to-blue-700",
    "from-purple-900",
    "to-purple-700",
    "from-green-900",
    "to-green-700",
    "from-orange-900",
    "to-orange-700",
    "from-red-900",
    "to-red-700",
    "from-pink-900",
    "to-pink-700",
    "from-indigo-900",
    "to-indigo-700",
    "from-teal-900",
    "to-teal-700",
    "from-cyan-900",
    "to-cyan-700",
    "from-yellow-900",
    "to-yellow-700",
    "from-gray-900",
    "to-gray-700", */
    // O usar patrones
    {
      pattern: /bg-gradient-to-br/,
    },
    {
      pattern:
        /from-(blue|purple|green|orange|red|pink|indigo|teal|cyan|yellow|gray)-(700|900)/,
    },
    {
      pattern:
        /to-(blue|purple|green|orange|red|pink|indigo|teal|cyan|yellow|gray)-(700|900)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
