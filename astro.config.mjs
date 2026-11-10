import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lauragarrido.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
