/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'main':'#28774C',
        'maindark':'#1C5335',
      },
      keyframes:{
        'openNav':{
          '0%':{
            transform:'translateX(-320px)'
          },
          '100%':{
            transform:'translateX(0)'
          },
        },
        'closeNav':{
          '0%':{
            transform:'translateX(0)'
          },
          '100%':{
            transform:'translateX(-320px)'
          },
        }
      },
      animation:{
        openNav:'openNav 1s forwards',
        closeNav:'closeNav 1s forwards'
      }
    },
  },
  plugins: [],
}