/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            spacing: {
                headerHeight: '64px',
                contentHeight: 'calc(100vh - 64px)',
                notificationHeader: '74px',
                notificationContent: 'calc(100vh - 64px - 74px)',
                filesContent: 'calc(100vh - 40px - 64px - 96px)',
            },
        },
    },
}
