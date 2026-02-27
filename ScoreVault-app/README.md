# ScoreVault App

A simple leaderboard application built with Node.js, PostgreSQL, and Redis running inside Docker containers. This repository demonstrates how to wire multiple services together using Docker Compose and manage configuration via environment variables.

##  Project Structure

```
ScoreVault-app/
├── Dockerfile
├── docker-compose.yml
├── index.js          # main application code
├── package.json
├── .env              # (ignored) local environment values
├── .env.example      # template for collaborators
└── README.md         # this file
```

##  Prerequisites

- Docker & Docker Compose installed on your machine.
- Basic familiarity with terminal/command prompt.

> This project is designed for local development; you do not need to install Node.js or PostgreSQL locally.

##  Configuration

Configuration is handled via environment variables. Sensitive values such  are stored in an `.env` file that is **not** committed to git.

1. Copy the example and edit:
   ```sh
   cd ScoreVault-app
   cp .env.example .env
   # then open .env and fill in real values if you wish
   ```


##  Running Locally

Start all services with Docker Compose:

```sh
docker-compose up --build
```

This will build the `app` image, start a PostgreSQL container named `db`, a Redis container named `cache`, and the Node.js application.

- The app listens on `localhost:3000`.
- Containers communicate using the service names (`db` and `cache`).

Stop and remove containers with:

```sh
docker-compose down
```

##  Development Workflow

- Edit `index.js` for application logic.
- Adjust `docker-compose.yml` if you need extra services or ports.
- Use `docker-compose logs -f app` to see application output.

##  Notes

- `.env` is **gitignored**; never commit secrets.
- Use `.env.example` as a template for collaborators or CI setups.
- In production, set equivalent environment variables via your deployment infrastructure rather than a file.

---

