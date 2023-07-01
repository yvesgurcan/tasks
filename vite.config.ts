import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../',
    },
    root: 'src',
    resolve: {
        alias: { '/src': path.resolve(process.cwd(), 'src') },
    },
});
