export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["'PretendardVariable'", "Pretendard", "sans-serif"],
      },
      boxShadow: {
        card: '0px 5px 15px rgba(0,0,0,0.05)',
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};