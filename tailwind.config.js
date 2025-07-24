// tailwind.config.js
export const content = ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'];
export const theme = {
    extend: {
        animation: {
            'spin-slow': 'spin 3s linear infinite',
        },
    },
};
export const plugins = [];
