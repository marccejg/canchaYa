import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,// Esto asegura que todas las rutas sean manejadas por React Router en el cliente
  }
})