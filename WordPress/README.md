# WordPress with MySQL - Docker Compose Setup

A simple WordPress website running with MySQL database using Docker Compose. Perfect for local development or learning Docker.

## What's Inside

- **WordPress:** Latest version, web interface on port 8080
- **MySQL 8:** Database with persistent storage
- **Docker Compose:** Manages both containers with one command

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Clone or Download
```bash
git clone <your-repo-url>
cd wordpress-app
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and set your own passwords (optional for local dev, but recommended).

### 3. Start the Application
```bash
docker compose up -d
```

### 4. Access WordPress

Open your browser and go to:
```
http://localhost:8080
```

Follow the WordPress installation wizard:
- Choose language
- Create admin account
- Start building your site

## File Structure
```
wordpress-app/
├── docker-compose.yml    # Defines services and configuration
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Template for .env file
└── README.md             # You are here
```

## Environment Variables

All sensitive data is stored in `.env` file. See `.env.example` for required variables.


## Common Commands

**Start services:**
```bash
docker compose up -d
```

**Stop services:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f
```

**Restart services:**
```bash
docker compose restart
```

**Remove everything (including data):**
```bash
docker compose down -v
```

## Data Persistence

MySQL data is stored in a Docker volume named `db_data`. This means:
- Your WordPress content survives container restarts
- You can safely stop and start services
- Data is only deleted if you run `docker compose down -v`

## Troubleshooting

**Can't access WordPress:**
- Check if containers are running: `docker compose ps`
- Check logs: `docker compose logs wordpress`
- Ensure port 8080 is not already in use

**Database connection error:**
- Wait 30 seconds for MySQL to fully start
- Check environment variables match in both services
- View database logs: `docker compose logs db`

**Reset everything:**
```bash
docker compose down -v
docker compose up -d
```

## Security Notes

**For Production:**
- Change all default passwords
- Use strong, unique passwords
- Don't expose MySQL port externally
- Keep `.env` file secret (already in `.gitignore`)
- Use HTTPS with proper SSL certificates
- Regular backups of the `db_data` volume

## Tech Stack

- **WordPress:** 6.x (latest)
- **MySQL:** 8.0
- **Docker:** Required
- **Docker Compose:** v3.8 spec

## License

Free to use for learning and development.

## Contributing

Found an issue? Feel free to open an issue or submit a pull request.

---

**Built as part of 90 Days of DevOps challenge**
