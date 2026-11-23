import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sasazu - Tarjetas de Lealtad',
        short_name: 'Sasazu',
        description: 'Base digital de tarjetas de lealtad para Sasazu Burger and Beer',
        theme_color: '#3F6350',      // verde profundo, la barra del navegador cuando está instalada
        background_color: '#FDFBF7', // blanco pan, pantalla de carga al abrir
        display: 'standalone',       // así se ve como app, sin barra de navegador
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
