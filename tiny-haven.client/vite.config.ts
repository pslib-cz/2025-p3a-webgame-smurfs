import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "tiny-haven.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (env.NODE_ENV !== 'production') {
    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        // Wrap in try-catch just in case dotnet is missing in a non-prod env
        try {
            if (0 !== child_process.spawnSync('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit', }).status) {
                throw new Error("Could not create certificate.");
            }
        } catch (e) {
            console.warn("Could not create SSL certs. Skipping (this is normal in Docker builds).");
        }
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7292';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/api': {
                target,
                secure: false
            },
            '/images': {
                target,
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '62799'),
        https: fs.existsSync(keyFilePath) && fs.existsSync(certFilePath) ? {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        } : undefined
    }
})
