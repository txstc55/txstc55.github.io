// tailwind.config.js
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        31: "7.75rem",
        30: "7.5rem",
        29: "7.25rem",
        28: "7rem",
        84: "21rem",
        112: "28rem",
        120: "30rem",
        130: "32.5rem",
        140: "35rem",
        148: "37rem",
        160: "40rem",
        180: "45rem",
        46: "11.5rem",
        54: "13.5rem",
      },
      transitionDelay: {
        400: "400ms",
      },
      transitionDuration: {
        2000: "2000ms",
        1500: "1500ms",
      },
      colors: {
        blackPearl: "#011627",
        sale: "#B2DDF7",
        turquoise: "#2EC4B6",
        alizarin: "#E71D36",
        treePoppy: "#FF9F1C",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
