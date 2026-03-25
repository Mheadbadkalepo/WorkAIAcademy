import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import https from 'https'

function paystackPlugin(): Plugin {
  return {
    name: 'paystack-verify-plugin',
    configureServer(server) {
      server.middlewares.use('/api/charge', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', () => {
          const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/charge',
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.VITE_PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          };

          const request = https.request(options, reqRes => {
            let data = '';
            reqRes.on('data', chunk => { data += chunk; });
            reqRes.on('end', () => {
              res.statusCode = reqRes.statusCode || 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            });
          });

          request.on('error', error => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
          });

          request.write(body);
          request.end();
        });
      });

      server.middlewares.use('/api/verify', (req, res) => {
        const urlStr = req.url || '';
        const url = new URL(urlStr, 'http://localhost');
        const reference = url.searchParams.get('reference');
        
        if (!reference) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing reference' }));
          return;
        }

        const options = {
          hostname: 'api.paystack.co',
          port: 443,
          path: `/transaction/verify/${encodeURIComponent(reference)}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.VITE_PAYSTACK_SECRET_KEY}`
          }
        }

        const request = https.request(options, reqRes => {
          let data = ''

          reqRes.on('data', (chunk) => {
            data += chunk
          })

          reqRes.on('end', () => {
            res.statusCode = reqRes.statusCode || 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data)
          })
        })

        request.on('error', error => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        })

        request.end()
      })
    }
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    paystackPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
