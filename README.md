# Danywens Storefront

Contemporary streetwear e-commerce storefront for Danywens — premium quality, bold design.

## Tech Stack

- **Vite** — Build tool
- **React** — UI framework
- **TypeScript** — Type safety
- **shadcn-ui** — Component library
- **Tailwind CSS** — Styling

## Local Setup

1. Clone the repository and navigate to the project directory.
2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

The app runs at [http://localhost:8080](http://localhost:8080).

## Admin Setup

1. Navigate to [http://localhost:8080/admin](http://localhost:8080/admin).
2. Sign in with the default password `admin123` (or set `VITE_ADMIN_PASSWORD` in `.env` for a custom password).
3. From the admin dashboard you can manage products, collections, homepage content, site settings, and media.

## Deploy to Vercel

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New** → **Project** and import your repository.
4. Vercel auto-detects the Vite setup. Click **Deploy**.
5. (Optional) Add `VITE_ADMIN_PASSWORD` in Project Settings → Environment Variables for a custom admin password.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run unit tests in watch mode |
