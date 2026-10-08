# theMovies

A dark movie and TV discovery app built with Next.js App Router, Tailwind CSS, TanStack Query, Zustand, and TMDB.

## Requirements

- Node.js 20 or newer
- A TMDB API Read Access Token

## Local setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and add the TMDB token:

```env
TMDB_API_READ_TOKEN=your_tmdb_read_access_token
```

Start the development server:

```bash
npm run dev
```

Open <http://localhost:3000>.

## Routes

- `/` - hero, trending and top-rated movie/TV sections
- `/movie` - searchable movie catalog
- `/tv` - searchable TV catalog
- `/movie/:id` - movie details
- `/tv/:id` - TV series details

## Validation

```bash
npm run lint
npm run build
```

## Vercel deployment

Add `TMDB_API_READ_TOKEN` under **Project Settings -> Environment Variables** for Production and Preview, then redeploy. The TMDB token is consumed by the server proxy at `/api/tmdb`; it should not use a `NEXT_PUBLIC_` variable in production.

TMDB attribution is required for images and data used by the application. See the [TMDB developer documentation](https://developer.themoviedb.org/docs/authentication-application).
