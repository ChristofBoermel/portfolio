/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#18d26e',
                secondary: '#ffffff',
                dark: '#444444',
                light: '#f9f9f9',
            },
            fontFamily: {
                sans: ['Raleway', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
