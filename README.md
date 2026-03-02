# Docker Projects

A comprehensive collection of containerized applications demonstrating best practices for Docker and Docker Compose. Each project is fully self-contained with its own Dockerfile, docker-compose configuration, and documentation.

## 📋 Table of Contents

- [Overview](#overview)
- [Projects](#projects)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Descriptions](#project-descriptions)
- [Development Workflow](#development-workflow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This repository contains multiple Docker-based projects across different technology stacks:

- **Backend Applications**: Node.js leaderboard API, Python Flask web app
- **Databases**: PostgreSQL, MySQL, Redis
- **Content Management**: WordPress setup
- **Infrastructure**: Monitoring stack with Prometheus

Each project demonstrates containerization patterns, multi-service orchestration with Docker Compose, and environment-based configuration.

## Projects

| Project | Tech Stack | Purpose |
|---------|-----------|---------|
| [ScoreVault-app](#scorevault-app) | Node.js, Express, PostgreSQL, Redis | Real-time leaderboard API with caching |
| [todo-python-app](#todo-python-app) | Flask, MySQL, Python | Task management web application |
| [WordPress](#wordpress) | WordPress, MySQL | Content management system setup |
| [Monitoring-stack](#monitoring-stack) | Prometheus, Docker | System monitoring and metrics collection |

## Prerequisites

Before running any project, ensure you have:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/) (version 1.29+)
- **Git**: For cloning the repository
- **Terminal/Command Prompt**: Familiarity with command-line operations

**Verify Installation**:
```bash
docker --version
docker compose --version
```

## Quick Start

### Clone the Repository

```bash
git clone https://github.com/dikshitbonu-bit/Docker-projects.git
cd Docker-projects
```

### Run Any Project

Each project follows the same pattern:

```bash
cd <project-folder>
docker compose up --build
```

To stop the services:
```bash
docker compose down
```

To rebuild and start fresh:
```bash
docker compose up --build --force-recreate
```

## Project Descriptions

### ScoreVault App

**Location**: `ScoreVault-app/`

A real-time leaderboard application demonstrating multi-service architecture with data caching.

**Stack**: Node.js (Express) + PostgreSQL + Redis

**Features**:
- RESTful API for leaderboard management
- Redis caching layer for performance
- PostgreSQL for persistent data storage
- Multi-container orchestration example

**Quick Start**:
```bash
cd ScoreVault-app
# Update .env with your configuration (optional)
docker compose up --build
# Access API at http://localhost:3000
```

**Key Files**:
- `index.js` - Express server and API endpoints
- `docker-compose.yml` - Service definitions
- `Dockerfile` - Node.js application image

---

### Todo Python App

**Location**: `todo-python-app/`

A full-stack task management web application with a user-friendly interface.

**Stack**: Flask + MySQL + HTML/CSS

**Features**:
- Add, view, and delete tasks
- MySQL database for persistent storage
- Bootstrap-based responsive UI
- Health checks for database reliability
- Environment-based configuration

**Quick Start**:
```bash
cd todo-python-app
docker compose up --build
# Access web app at http://localhost:5000
```

**Tech Details**:
- Python 3.12 with Flask 3.0.0
- MySQL 8.0 database
- Bootstrap UI framework
- Built-in health checks

---

### WordPress

**Location**: `WordPress/`

Ready-to-use WordPress setup for local development and learning Docker.

**Stack**: WordPress + MySQL

**Features**:
- Latest WordPress version
- MySQL 8.0 database
- Persistent volume storage
- Simple one-command setup

**Quick Start**:
```bash
cd WordPress
docker compose up -d
# Access WordPress at http://localhost:8080
# Complete installation wizard on first launch
```

**First Time Setup**:
1. Open http://localhost:8080 in your browser
2. Select language
3. Create an admin account
4. Start building your site

---

### Monitoring Stack

**Location**: `Monitoring-stack/`

Complete observability stack with metrics collection, storage, and visualization.

**Stack**: Node Exporter + Prometheus + Grafana

**Features**:
- **Node Exporter**: Collects system metrics (CPU, memory, disk, network)
- **Prometheus**: Time-series database for metrics storage and querying
- **Grafana**: Rich dashboards and visualization with alerting

**Quick Start**:
```bash
cd Monitoring-stack
docker compose up --build
# Access services at:
#   - Prometheus: http://localhost:9090
#   - Grafana: http://localhost:3000 (admin/admin by default)
#   - Node Exporter: http://localhost:9100/metrics
```

**Services**:
- `prometheus.yml` - Scrape targets and intervals
- `.env` - Grafana admin credentials
- Auto-configured dashboards with health checks

---

## Development Workflow

### General Pattern

1. **Navigate to project folder**:
   ```bash
   cd <project-name>
   ```

2. **Create environment file** (if needed):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services**:
   ```bash
   docker compose up --build
   ```

4. **View logs**:
   ```bash
   docker compose logs -f                    # All services
   docker compose logs -f <service-name>     # Specific service
   ```

5. **Access interactive shell** (debug):
   ```bash
   docker compose exec <service-name> sh
   ```

6. **Stop services**:
   ```bash
   docker compose down         # Keep volumes
   docker compose down -v      # Remove volumes too
   ```

### Development Tips

- **Volumes**: Services mounted with volumes auto-update when you edit files (check individual `docker-compose.yml`)
- **Environment Variables**: Use `.env` files for local overrides, never commit sensitive data
- **Logs**: Always check logs first when troubleshooting: `docker compose logs`
- **Container Shell**: Run `docker compose exec <service> bash` for interactive debugging
- **Rebuild Images**: Use `docker compose up --build` when Dockerfile changes

## Best Practices

### Project Structure
✅ Each project is self-contained with all dependencies defined  
✅ Compose files explicitly define all services and networks  
✅ Dockerfile follows multi-stage builds when beneficial  
✅ Environment variables configured via `.env` files  

### Security
✅ Sensitive data in `.env` (not committed to git)  
✅ `.gitignore` excludes local configuration  
✅ Use version tags for production base images  
✅ Run containers as non-root users when possible  

### Configuration Management
✅ Template `.env.example` provided for each project  
✅ All config via environment variables or config files  
✅ No hardcoded secrets or credentials  

### Performance
✅ Use caching layers (Redis where applicable)  
✅ Minimal Docker images with only necessary dependencies  
✅ Health checks configured for database containers  
✅ Volume mounting for development fast iterations  

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port (macOS/Linux)
lsof -i :8080

# Windows
netstat -ano | findstr :8080

# Solution: Change port in docker-compose.yml or stop conflicting service
```

**Permission denied errors**
- Ensure Docker daemon is running
- On Linux: Add user to docker group: `sudo usermod -aG docker $USER`
- Restart terminal after group changes

**Database connection fails**
```bash
# Check logs
docker compose logs <service-name>

# Verify containers are running
docker compose ps

# Test connectivity
docker compose exec <app-service> ping <db-service>
```

**Build fails**
```bash
# Clean build environment
docker compose down -v
docker system prune -a

# Rebuild
docker compose up --build
```

**Volumes not updating**
- Verify volume mount in docker-compose.yml
- Check file permissions on host machine
- Restart service: `docker compose restart <service>`

### Getting Help

For each project:
1. Check the project's individual README
2. Review `docker-compose.yml` for service configuration
3. Check Docker logs: `docker compose logs`
4. Verify `.env` file is correctly configured

## Project Checklist

- ✅ Docker & Docker Compose installed
- ✅ Repository cloned locally
- ✅ All projects follow same deployment pattern
- ✅ Environment variables documented
- ✅ Individual README files for each project
- ✅ Docker Compose files fully configured

---

**Happy containerizing! 🐳**
