# Deployment

Deploy the backend and frontend as separate services. The repository includes a
Render Blueprint at `render.yaml` and a Vercel configuration at
`todo_frontend/vercel.json`.

## Backend on Render

1. In Render, create a Blueprint instance from this repository and select
   `render.yaml`. Its service uses `todo_backend` as the root directory,
   `npm install` to build, and `npm start` to run.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string, including the
   database name (for example, `TODO`).
3. Set `CLIENT_URL` to the deployed Vercel site's full origin, such as
   `https://your-site.vercel.app` (no trailing path).

For local development, copy `.env.example` to `.env` in `todo_backend` and set
your Atlas URI. Never commit `.env` or expose the Atlas URI in the frontend.

## Frontend on Vercel

1. Import the repository into Vercel and set the project root directory to
   `todo_frontend`. The Vercel configuration builds with `npm run build`
   and publishes `build`.
2. Set `REACT_APP_API_URL` to the deployed Render backend URL, such as
   `https://todo-backend.onrender.com`.
3. Redeploy after setting the environment variable. Create React App embeds it
   into the production build.

For local development, copy `.env.example` to `.env` in `todo_frontend`. The
frontend must be rebuilt after changing `REACT_APP_API_URL`, since Create React
App embeds it into the production build.

After deployment, test creating, completing, editing, and deleting tasks. Make
sure Atlas network access permits connections from the backend host.
