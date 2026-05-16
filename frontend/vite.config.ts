import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react()],
    resolve: {
        alias: {
            $fonts: resolve('./src/vendor/fonts'),
            $assets: resolve('./src/assets'),
        },
        tsconfigPaths: true,
    },
    build: {
        assetsInlineLimit: 0,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
          @use "/src/scss/variables" as *;
          @use "/src/scss/mixins";
        `,
            },
        },
    },
})
