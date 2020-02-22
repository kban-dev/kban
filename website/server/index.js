/* eslint-disable no-console */
const express = require('express');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;

if (!dev) {
  const app = express();

  app.get('/kb/:uid*', (req, res) => {
    res.sendFile('/kb/[...uid].html', { root: 'website/out' });
  });

  app.get('/_next/*', express.static(__dirname + '/../out'));

  app.get('/', (req, res) => {
    res.sendFile(`index.html`, { root: 'website/out' });
  });

  app.get('/:path*', (req, res) => {
    res.sendFile(
      req.params.path.endsWith('.html')
        ? `${req.params.path}`
        : `${req.params.path}.html`,
      { root: 'website/out' },
    );
  });

  // app.get('*', express.static(__dirname + '/../out'));

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port}`);
  });
} else {
  const next = require('next');
  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();

  const devProxy = {
    '/api': {
      target: 'http://127.0.0.1:4000/api/',
      pathRewrite: { '^/api': '/' },
      changeOrigin: true,
    },
  };

  nextApp.prepare().then(() => {
    const app = express();

    if (dev && devProxy) {
      const proxyMiddleware = require('http-proxy-middleware');
      Object.keys(devProxy).forEach(function(context) {
        app.use(proxyMiddleware(context, devProxy[context]));
      });
    }

    app.get('*', (req, res) => {
      return handle(req, res);
    });

    app.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port}`);
    });
  });
}
