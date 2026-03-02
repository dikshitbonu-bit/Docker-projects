# Flask MySQL Todo App 📝i

A simple and elegant Todo application built with Flask and MySQL, fully containerized with Docker.


## Features ✨

- ✅ Add new tasks
- ❌ Delete completed tasks
- 🔄 Real-time task list updates
- 🐳 Fully Dockerized application
- 🗄️ MySQL database for persistent storage
- 🔒 Environment-based configuration
- 🏥 Health checks for database reliability

## Tech Stack 🛠️

- **Backend**: Flask (Python 3.12)
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Frontend**: HTML, CSS (Bootstrap)

## Project Structure 📁

```
python-todo-app/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Multi-container setup
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── templates/
│   └── index.html       # Frontend template
└── README.md            # This file
```

## Docker Multi-Stage Build 🐳

The Dockerfile uses a **multi-stage build** approach to create an optimized, smaller final image:

**Build Stage** (`builder`):
- Uses `python:3.12-slim` as the base
- Installs all Python dependencies from `requirements.txt`
- Dependencies are cached in `/app/deps` directory

**Final Stage**:
- Starts with a fresh `python:3.12-slim` image
- Copies only the compiled dependencies from the builder stage
- Copies application code
- Sets `PYTHONPATH=/app/deps` for Python to find dependencies
- Exposes port 5000 and runs the Flask app

**Benefits**:
- ✨ Smaller final image size (dependencies cached separately)
- 🚀 Faster rebuilds when code changes (dependency layer reused)
- 🔒 Cleaner production image (no build tools or temporary files)

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29 or higher)
- Git

## Quick Start 🚀

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd python-todo-app
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred values:

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=todo_db
MYSQL_USER=todo_user
MYSQL_PASSWORD=your_user_password
MYSQL_HOST=mysql
```

⚠️ **Important**: Never commit the `.env` file to version control!

### 3. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build
```

Or run in detached mode (background):

```bash
docker-compose up -d --build
```

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

## Usage Guide 📖

### Adding a Task
1. Type your task in the input field
2. Click the "Add Task" button or press Enter
3. Your task appears in the list below

### Deleting a Task
1. Click the "Delete" button next to any task
2. The task is permanently removed

## Docker Commands 🐳

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs todo-app
docker-compose logs mysql
```

### Stop the Application
```bash
docker-compose down
```

### Stop and Remove Volumes (Delete Database Data)
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up --build
```

## Troubleshooting 🔧

### MySQL Container Unhealthy

If you see errors about MySQL being unhealthy:

1. **Wait longer**: MySQL takes 20-30 seconds to initialize on first run
2. **Check logs**: `docker-compose logs mysql`
3. **Restart**: `docker-compose restart mysql`

### Connection Refused Errors

- Ensure the `.env` file has `MYSQL_HOST=mysql` (not `localhost`)
- The Flask app uses the service name from `docker-compose.yml`

### Port Already in Use

If port 5000 is already taken:

```yaml
# In docker-compose.yml, change:
ports:
  - "8080:5000"  # Use port 8080 instead
```

Then access at `http://localhost:8080`

### Database Data Persistence

Data is stored in a Docker volume named `mysql-data`. To reset:

```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
```

## Development 💻

### Running Without Docker (Local Development)

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install and start MySQL locally**

3. **Update `.env` file**:
   ```env
   MYSQL_HOST=localhost
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

### Making Code Changes

1. Edit your code
2. Rebuild the container:
   ```bash
   docker-compose up --build
   ```

## Environment Variables 🔐

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | - | ✅ |
| `MYSQL_DATABASE` | Database name | todo_db | ✅ |
| `MYSQL_USER` | MySQL user | todo_user | ✅ |
| `MYSQL_PASSWORD` | MySQL user password | - | ✅ |
| `MYSQL_HOST` | MySQL host | mysql | ✅ |

## Database Schema 🗃️

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (Primary Key) | Auto-incrementing task ID |
| `task` | VARCHAR(255) | Task description |
| `created_at` | TIMESTAMP | Task creation timestamp |

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments 🙏

- Flask documentation
- MySQL Docker documentation
- Bootstrap for styling



---

