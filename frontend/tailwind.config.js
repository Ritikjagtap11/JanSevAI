/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: '#443F3F',
                rose: {
                    DEFAULT: '#A37C7C',
                    light: '#C4A0A0',
                },
                'bg-subtle': '#F7F2F2',
            },
            fontFamily: {
                playfair: ['Playfair Display', 'serif'],
                dmsans: ['DM Sans', 'sans-serif'],
                tiro: ['Tiro Devanagari Hindi', 'serif'],
            },
            letterSpacing: {
                widest: '0.18em',
                relaxed: '0.06em',
                button: '0.05em',
            }
        },
    },
    plugins: [],
}
