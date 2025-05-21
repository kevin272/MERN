import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // Important for external access via Ngrok
    port: 5173,           // Ensure this matches your local server port
    allowedHosts: [
      "8f72-2400-1a00-b030-f054-2cd5-7e18-ceef-ca81.ngrok-free.app"
    ]
  }
})
