import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        checkout: resolve(__dirname, 'vault-checkout.html'),
        confirmation: resolve(__dirname, 'vault-confirmation.html'),
        orders: resolve(__dirname, 'vault-orders.html'),
      },
    },
  },
});
