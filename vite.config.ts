import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr({svgrOptions: {exportType: 'default'}})],
    css: {
        postcss: {
            plugins: [autoprefixer, tailwindcss],
        },
    },
})
