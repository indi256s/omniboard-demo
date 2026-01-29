# Deployment Guide — Omniboard v2.0

Quick guide for deploying to production.

---

## 🚀 Option 1: Vercel (Recommended)

**Why:** Zero-config, automatic HTTPS, global CDN, free tier

### Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd omniboard-v2
vercel

# Follow prompts
# - Project name: omniboard-demo
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist

# Get URL: https://omniboard-demo-xyz.vercel.app
```

### Via GitHub
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Click "Deploy" (auto-detects Vite)
5. Done! ✅

**Custom Domain:**
```bash
vercel domains add omniboard.your-company.com
# Follow DNS setup instructions
```

---

## 🐳 Option 2: Docker

**Why:** Self-hosted, full control, works anywhere

### Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### Build & Run
```bash
# Build image
docker build -t omniboard:latest .

# Run locally
docker run -p 3000:80 omniboard:latest

# Visit http://localhost:3000
```

### Deploy to Production
```bash
# Tag for registry
docker tag omniboard:latest your-registry.com/omniboard:v2.0

# Push
docker push your-registry.com/omniboard:v2.0

# Deploy (Kubernetes, ECS, etc.)
kubectl apply -f k8s/deployment.yaml
```

---

## ☁️ Option 3: Netlify

**Why:** Free tier, drag-and-drop deploys, fast

### Via Netlify CLI
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Via UI
1. Drag `/dist` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Done! ✅

### netlify.toml (for redirects)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📦 Option 4: Static Hosting (S3, R2, etc.)

**Why:** Cheapest option, highly scalable

### AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### Cloudflare Pages
```bash
npm run build
wrangler pages publish dist --project-name=omniboard
```

---

## 🔧 Environment Variables

If you add API integration, use environment variables:

### `.env.production`
```bash
VITE_API_URL=https://api.your-company.com
VITE_WS_URL=wss://ws.your-company.com
```

### Access in code
```js
const API_URL = import.meta.env.VITE_API_URL;
```

### Vercel
```bash
vercel env add VITE_API_URL production
```

### Docker
```bash
docker run -e VITE_API_URL=https://api.example.com omniboard:latest
```

---

## 🔐 Security Checklist

Before deploying:

- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Add CSP headers
- [ ] Remove console.log statements
- [ ] Add rate limiting if API-connected
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets

### CSP Headers (nginx)
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';";
```

---

## 📊 Monitoring

### Production Health Checks

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://pingdom.com/)
- [StatusCake](https://statuscake.com/)

**Analytics:**
```html
<!-- Add to index.html -->
<script defer data-domain="omniboard.company.com" src="https://plausible.io/js/script.js"></script>
```

**Error Tracking:**
```bash
npm install @sentry/react
```

```js
// main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
});
```

---

## 🚦 Performance Optimization

### Already Optimized ✅
- Tree-shaking (Vite)
- Code splitting (React Router lazy loading)
- CSS purging (Tailwind production build)
- Asset compression (Vite minify)

### Additional Improvements
```bash
# Install compression plugin
npm install vite-plugin-compression -D
```

```js
// vite.config.js
import compression from 'vite-plugin-compression';

export default {
  plugins: [
    compression({ algorithm: 'brotli' })
  ]
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Vercel)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitLab CI (Docker)
```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: docker:latest
  script:
    - docker build -t registry.company.com/omniboard:$CI_COMMIT_SHA .
    - docker push registry.company.com/omniboard:$CI_COMMIT_SHA
```

---

## 🧪 Pre-Deploy Testing

```bash
# Lint
npm run lint

# Type check (if using TypeScript)
npm run type-check

# Build test
npm run build
npm run preview

# E2E tests (if added)
npm run test:e2e
```

---

## 📞 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### Routes Don't Work (404)
- **Vercel/Netlify:** Auto-configured ✅
- **Nginx:** Add `try_files $uri /index.html;`
- **S3:** Enable "Static website hosting" + index.html error doc

### Blank Page
- Check browser console for errors
- Verify base path in `vite.config.js`:
  ```js
  export default {
    base: '/'  // or '/subpath/' if deployed to subdirectory
  }
  ```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] Environment variables configured
- [ ] Custom domain DNS pointed
- [ ] HTTPS enabled
- [ ] Monitoring/analytics set up
- [ ] Error tracking configured
- [ ] Team notified of new URL

---

## 🎉 Post-Deploy

1. **Share URL** with team
2. **Bookmark** in Slack/Wiki
3. **Monitor** first 24h for errors
4. **Collect feedback** from users
5. **Iterate** based on usage

---

**Recommended Stack:**
- **Dev/Staging:** Vercel (instant deploys)
- **Production:** Docker + Kubernetes (if scale matters) or Vercel Pro

**Estimated Setup Time:**
- Vercel: 5 minutes
- Docker: 30 minutes
- Full CI/CD: 2 hours

Good luck! 🚀
