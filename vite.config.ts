import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const localApiPlugin = () => ({
  // Triggering restart for tailwind config update
  name: 'local-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const rawUrl = req.url || '';
      const url = rawUrl.split('?')[0];

      if (url.includes('/api/')) {
        console.log(`[Vite API Trace] ${req.method} ${rawUrl}`);
      }

      if (url === '/api/ping') {
        res.setHeader('Content-Type', 'text/plain');
        res.end('pong');
        return;
      }

      // --- LIBRARY ENDPOINTS ---
      if (url === '/api/images' && req.method === 'GET') {
        try {
          const dir = path.resolve(__dirname, 'public/images');
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
          const data = files.map(f => ({
            id: f,
            name: f,
            url: `/images/${f}`,
            timestamp: fs.statSync(path.join(dir, f)).mtimeMs
          }));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
        return;
      }

      if (url === '/api/save-image' && req.method === 'POST') {
        const chunks: Buffer[] = [];
        req.on('data', chunk => { chunks.push(chunk); });
        req.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString('utf-8');
            const { name, base64 } = JSON.parse(body);
            const dir = path.resolve(__dirname, 'public/images');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const ext = path.extname(name);
            const filename = `${path.basename(name, ext)}_${Date.now()}${ext}`;
            const filePath = path.join(dir, filename);
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(filePath, base64Data, 'base64');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, image: { id: filename, name: filename, url: `/images/${filename}`, timestamp: Date.now() } }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
        return;
      }

      // --- ARCHIVE ENDPOINTS ---
      if (url === '/api/archive' && req.method === 'GET') {
        try {
          const dir = path.resolve(__dirname, 'public/archive');
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
          const data = files.map(f => ({
            id: f,
            name: f,
            url: `/archive/${f}`,
            timestamp: fs.statSync(path.join(dir, f)).mtimeMs
          }));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
        return;
      }

      if (url === '/api/save-to-archive' && req.method === 'POST') {
        console.log('[Vite API DEBUG] Received save-to-archive request');
        const chunks: Buffer[] = [];
        req.on('data', chunk => {
          console.log('[Vite API DEBUG] Receiving data chunk, size:', chunk.length);
          chunks.push(chunk);
        });
        req.on('end', () => {
          try {
            console.log('[Vite API DEBUG] All data received, total chunks:', chunks.length);
            const body = Buffer.concat(chunks).toString('utf-8');
            console.log('[Vite API DEBUG] Body length:', body.length);
            const { name, base64 } = JSON.parse(body);
            console.log('[Vite API DEBUG] Parsed name:', name);
            console.log('[Vite API DEBUG] Base64 length:', base64 ? base64.length : 'undefined');
            const dir = path.resolve(__dirname, 'public/archive');
            console.log('[Vite API DEBUG] Archive directory:', dir);
            if (!fs.existsSync(dir)) {
              console.log('[Vite API DEBUG] Creating archive directory');
              fs.mkdirSync(dir, { recursive: true });
            }
            const filename = `${Date.now()}_${name}`;
            const filePath = path.join(dir, filename);
            console.log('[Vite API DEBUG] Writing to file:', filePath);
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(filePath, base64Data, 'base64');
            console.log(`[Vite API] Archived: ${filename}`);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, image: { id: filename, name: filename, url: `/archive/${filename}`, timestamp: Date.now() } }));
          } catch (e) {
            console.error('[Vite API ERROR] Failed to save to archive:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
        return;
      }

      // --- OVERLAY ENDPOINTS ---
      if (url === '/api/overlays' && req.method === 'GET') {
        try {
          const dir = path.resolve(__dirname, 'public/overlays');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            // Copy default logo if it exists in public
            const defaultLogo = path.resolve(__dirname, 'public/logo_overlay.png');
            if (fs.existsSync(defaultLogo)) {
              fs.copyFileSync(defaultLogo, path.join(dir, 'logo_overlay.png'));
            }
          }
          const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
          const data = files.map(f => ({
            id: f,
            name: f,
            url: `/overlays/${f}`,
            timestamp: fs.statSync(path.join(dir, f)).mtimeMs
          }));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
        return;
      }

      if (url === '/api/save-overlay' && req.method === 'POST') {
        const chunks: Buffer[] = [];
        req.on('data', chunk => { chunks.push(chunk); });
        req.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString('utf-8');
            const { name, base64 } = JSON.parse(body);
            const dir = path.resolve(__dirname, 'public/overlays');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const ext = path.extname(name);
            const filename = `${path.basename(name, ext)}_${Date.now()}${ext}`;
            const filePath = path.join(dir, filename);
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(filePath, base64Data, 'base64');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, image: { id: filename, name: filename, url: `/overlays/${filename}`, timestamp: Date.now() } }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
        return;
      }

      if (url === '/api/delete-image' && req.method === 'DELETE') {
        try {
          const query = new URL(rawUrl, `http://${req.headers.host}`).searchParams;
          const id = query.get('id');
          if (id) {
            // Security: Prevent path traversal by only allowing filenames (no / or ..)
            const safeId = path.basename(id);
            if (safeId !== id) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid file ID' }));
              return;
            }

            const libPath = path.join(__dirname, 'public/images', safeId);
            const arcPath = path.join(__dirname, 'public/archive', safeId);
            const ovlPath = path.join(__dirname, 'public/overlays', safeId);
            if (fs.existsSync(libPath)) fs.unlinkSync(libPath);
            if (fs.existsSync(arcPath)) fs.unlinkSync(arcPath);
            if (fs.existsSync(ovlPath)) fs.unlinkSync(ovlPath);
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
        return;
      }

      next();
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3006,
      host: '127.0.0.1',
      allowedHosts: ['echo.mariohau.de', 'localhost']
    },
    css: {
      postcss: {
        plugins: []
      }
    },
    plugins: [react(), localApiPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } }
  };
});
