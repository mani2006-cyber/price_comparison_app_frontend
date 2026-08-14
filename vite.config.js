import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // Bind to all network interfaces (not just localhost) so a phone/tablet
        // on the same wifi can reach the dev server via the machine's LAN IP -
        // "npm run dev" alone only listens on localhost, which a phone can't
        // resolve to this machine at all.
        host: true,
    },
})
