import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from "dotenv"

// load environment variables
config();
console.log("building this");
// eslint-disable-next-line no-undef
console.log(process.env)
    // https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // eslint-disable-next-line no-undef
        "ENV_CLIENT_ID": JSON.stringify(process.env.CLIENT_ID),
        // eslint-disable-next-line no-undef
        "BASE_URL": JSON.stringify(process.env.BASE_URL),
        // eslint-disable-next-line no-undef
        "PROD_BASE_URL": JSON.stringify(process.env.PROD_BASE_URL)
    },
    server: {
        proxy: {
            "/auth": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            },
            "/api": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            }
        },
    },
})