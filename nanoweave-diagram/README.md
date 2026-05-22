# Nanoweave Process Diagram

Interactive process flow diagram for the Nanoweave biorefinery.
Built with React + Vite.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Render

1. Push this folder to a GitHub repository
2. In Render dashboard → New → Static Site
3. Connect your GitHub repo
4. Set the following:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Click Deploy

Your app will be live at `https://your-app-name.onrender.com`

## Embed in WordPress

Once deployed, add an HTML block to any WordPress page:

```html
<iframe
  src="https://your-app-name.onrender.com"
  width="100%"
  height="700px"
  frameborder="0"
  style="border-radius:8px;">
</iframe>
```

## Project structure

```
nanoweave-diagram/
├── index.html          # Entry point
├── vite.config.js      # Vite config
├── package.json        # Dependencies
└── src/
    ├── main.jsx        # React root
    └── App.jsx         # Full diagram component
```
