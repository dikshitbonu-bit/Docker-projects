# Monitoring Stack

A complete observability platform combining Node Exporter, Prometheus, and Grafana for comprehensive metrics collection, storage, and visualization.

## Overview

This monitoring stack demonstrates a production-grade monitoring setup for Docker environments. It collects system and application metrics, stores them in a time-series database, and provides rich visualization through Grafana dashboards. Perfect for local development and learning containerized monitoring infrastructure.

## Features

- **Node Exporter**: Collects detailed system metrics (CPU, memory, disk, network, processes)
- **Prometheus**: Time-series database for metrics collection, storage, and retrieval with powerful query language
- **Grafana**: Beautiful dashboards, alerting, and data visualization with multiple data sources
- **Health Checks**: All services include built-in health monitoring
- **Persistent Storage**: Metrics and dashboards retained across container restarts
- **Easy Configuration**: YAML-based Prometheus config and environment-based Grafana setup

## Tech Stack

- **Node Exporter** (v1.10.2): System metrics exporter
- **Prometheus** (v3.10.0): Time-series database and metrics scraper
- **Grafana** (v12.4.0): Visualization and dashboarding platform
- **Docker Compose**: Multi-container orchestration
- **Docker**: Containerization

## Prerequisites

- Docker ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose ([Install Docker Compose](https://docs.docker.com/compose/install/))

## Quick Start

### 1. Configure Grafana Credentials

Edit `.env.example` file to set your own  Grafana admin credentials (optional):
```bash
cp .env.example .env 
```

### 2. Start the Monitoring Stack

```bash
cd Monitoring-stack
docker compose up -d --build
```

### 3. Access the Services

Once all services are healthy (wait ~30 seconds):

**Prometheus** - Metrics storage and querying:
```
http://localhost:9090
```

**Grafana** - Dashboards and visualization:
```
http://localhost:3000
```

**Node Exporter** - Raw system metrics (JSON):
```
http://localhost:9100/metrics
```

### 4. Verify Services

Check all services are running:
```bash
docker compose ps
```

View health status:
```bash
docker compose ps --format "table {{.Names}}\t{{.Status}}"
```

## Configuration

### Node Exporter

Node Exporter runs as a service collecting:
- CPU, memory, disk usage and I/O
- Network interfaces and traffic
- Process information
- System load and uptime
- File system metrics

Accessible at: `http://localhost:9100/metrics`

Metrics are automatically scraped by Prometheus every 15 seconds.

### Prometheus Configuration

Edit `prometheus.yml` to customize scrape targets and intervals:

```yaml
global:
  scrape_interval: 15s        # Default scrape interval
     

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  
```


### Grafana Configuration

Grafana is configured via environment variables (`.env`):

```env
GF_SECURITY_ADMIN_USER=admin                    # Admin username
GF_SECURITY_ADMIN_PASSWORD=changeme               # Admin password
GF_USERS_ALLOW_SIGN_UP=false                    # Disable signup
```

Once logged in, you can:
- Add data sources (Prometheus is pre-configured)
- Create custom dashboards
- Set up alerts and notifications
- Configure authentication providers

**Prometheus Data Source**:
- URL: `http://prometheus:9090`
- Already configured in Grafana
- Start querying metrics immediately

## Project Structure

```
Monitoring-stack/
├── docker-compose.yml          # Service definitions (Node Exporter, Prometheus, Grafana)
├── prometheus.yml              # Prometheus scrape configuration
├── .env                        # Grafana credentials and configuration
├── .env.example               # Environment variables template
├── README.md                  # This file

```

## Usage Examples

### 1. Prometheus Queries

In Prometheus UI (http://localhost:9090 → Graph tab):

**Check service health**:
```
up
```

**System CPU usage**:
```
node_cpu_seconds_total
```

**Memory usage**:
```
node_memory_MemAvailable_bytes
```

**Disk usage**:
```
node_filesystem_avail_bytes
```

**View metrics over 5 minutes**:
```
metric_name[5m]
```

**Calculate rate of change**:
```
rate(node_cpu_seconds_total[5m])
```

### 2. Check Target Status

In Prometheus UI:
- Navigate to **Status** > **Targets**
- View all scrape targets (Node Exporter, Prometheus, custom services)
- Check health status (UP/DOWN)
- See last scrape time and duration

### 3. Grafana Dashboards

In Grafana (http://localhost:3000):

**Explore Metrics**:
1. Click **Explore** in left sidebar
2. Select Prometheus data source
3. Start typing metric names
4. View real-time graphs

**Create Dashboards**:
1. Click **+** in left sidebar → **Dashboard**
2. Add panels with metric queries
3. Customize time range, legends, thresholds
4. Save dashboard

**Built-in Dashboards**:
- System metrics from Node Exporter
- Prometheus internal metrics
- Service health overview

### 4. Access Raw Metrics

Get raw metrics in JSON/text format:
```bash
curl http://localhost:9100/metrics
```

Common Node Exporter metrics:
- `node_cpu_seconds_total` - CPU time per core
- `node_memory_MemFree_bytes` - Available memory
- `node_filesystem_avail_bytes` - Available disk space
- `node_load1` - 1-minute load average

## Development Workflow

### View Container Status

```bash
# Check running containers
docker compose ps

# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f grafana
docker compose logs -f prometheus
docker compose logs -f node-exporter
```

### Access Container Shells

```bash
# Interactive shell in Prometheus
docker compose exec prometheus sh

# Interactive shell in Grafana
docker compose exec grafana sh

# Interactive shell in Node Exporter
docker compose exec node-exporter sh

# Check Prometheus configuration
docker compose exec prometheus cat /etc/prometheus/prometheus.yml
```

### Service Management

```bash
# Stop services (keep data)
docker compose stop

# Stop and remove containers (keep volumes)
docker compose down

# Stop and remove everything including volumes
docker compose down -v

# Restart services
docker compose restart

# Restart specific service
docker compose restart prometheus
docker compose restart grafana
docker compose restart node-exporter

# Rebuild and restart
docker compose up -d --build
```

### Check Service Health

```bash
# View detailed container status
docker compose ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check Prometheus health
curl http://localhost:9090/-/healthy

# Check Grafana health
curl http://localhost:3000/api/health

# Check Node Exporter health
curl http://localhost:9100/-/healthy
```

## Persistence

Metrics are stored in the `data/prometheus/` directory (created automatically). This ensures:
- Metrics survive container restarts
- Historical data is retained
- Queries can span long time periods

To reset all data:
```bash
docker compose down -v
docker compose up -d
```

## Integration with Other Projects

Monitor services from other projects in this repository:

### Step 1: Ensure Metrics Endpoint

Your application should expose metrics on a specific port and path:
- Common ports: 8080, 9090, 3000, 8000
- Common paths: `/metrics`, `/health`, or custom paths
- Format: Prometheus metrics format (text-based key-value)

### Step 2: Add Service to Prometheus Config

Edit `prometheus.yml` to add your service:

```yaml
scrape_configs:
  # Existing targets...
  
  # Add your app
  - job_name: 'scorevault-app'
    static_configs:
      - targets: ['host.docker.internal:3000']  # From Windows/macOS
    # OR for Linux:
      # - targets: ['scorevault-app:3000']
    scrape_interval: 15s
  
  - job_name: 'todo-app'
    static_configs:
      - targets: ['host.docker.internal:5000']
    scrape_interval: 15s
```

### Step 3: Restart Prometheus

```bash
docker compose restart prometheus
```

### Step 4: Create Grafana Dashboard

1. Log into Grafana (http://localhost:3000)
2. Click **+** → **Dashboard**
3. Click **+ Add panel**
4. Select Prometheus as data source
5. Write metric queries for your app
6. Customize visualization and save

### Native Docker Integration

For Docker metrics without custom exporters:
- Node Exporter collects host-level Docker metrics
- Consider using cAdvisor for container-specific metrics
- Can be added to docker-compose.yml if needed

## Common Use Cases

### System Performance Monitoring
- Real-time CPU, memory, disk usage tracking
- Network traffic analysis
- Process monitoring and resource allocation
- Long-term trend analysis

### Application Metrics
- Request rates and response times
- Error rates and exceptions
- Business metrics (orders, conversions, etc.)
- Custom application metrics

### Infrastructure Health
- Container uptime and availability
- Service connectivity checks
- Database health monitoring
- Alerting on threshold violations

### Debugging & Troubleshooting
- PromQL queries to investigate anomalies
- Time-range analysis of performance issues
- Correlation between different metrics
- Historical trend analysis

### Dashboards & Visualization
- Grafana dashboards for team viewing
- Executive-level performance summaries
- Alerts and notifications
- Multi-service at-a-glance status

## Troubleshooting

### Services won't start

**Check logs**:
```bash
docker compose logs
docker compose logs prometheus
docker compose logs grafana
docker compose logs node-exporter
```

**Validate configuration**:
```bash
docker compose config    # Validate docker-compose.yml
```

**Rebuild**:
```bash
docker compose down -v
docker compose up -d --build
```

### Grafana login issues

**Can't access Grafana**:
- Ensure container is running: `docker compose ps grafana`
- Wait 30+ seconds for startup (check health via `docker compose logs grafana`)
- Try default credentials: `admin` / `admin`
- Clear browser cache

**Reset admin password**:
```bash
docker compose exec grafana grafana-cli admin reset-admin-password newpassword
```

### Prometheus targets showing DOWN

**Check target connectivity**:
```bash
# List targets in Prometheus UI: Status > Targets
# Or query: curl http://localhost:9090/api/v1/targets

# Verify service is running
docker compose ps

# Test connectivity to service
docker compose exec prometheus ping node-exporter
```

**Fix network connectivity**:
- Ensure services are in same `monitoring` network
- Check docker-compose.yml `networks` section
- Restart services: `docker compose restart`

### No data visible in Grafana/Prometheus

**Wait for data collection**:
- Default scrape interval is 15 seconds
- Wait 30+ seconds, then refresh

**Verify targets are scraping**:
1. Go to Prometheus (http://localhost:9090)
2. Click **Status** → **Targets**
3. All targets should show **UP**
4. Check "Last Scrape Time"

**Check metric visibility**:
```bash
curl http://localhost:9100/metrics | grep node_
```

### Port already in use

**Find conflicting process**:
```bash
# Windows
netstat -ano | findstr :9090
netstat -ano | findstr :3000
netstat -ano | findstr :9100

# macOS/Linux
lsof -i :9090
lsof -i :3000
lsof -i :9100
```

**Solutions**:
1. Stop the conflicting process
2. Change ports in `docker-compose.yml`
3. Use different monitoring stack instance

### Memory issues with Prometheus

**Prometheus needs significant storage for long-term metrics**:
```bash
# Check volume usage
docker volume ls | grep monitoring

# Reduce retention period in docker-compose.yml:
# --storage.tsdb.retention.time=7d
```

**Clean up old data**:
```bash
docker compose down -v    # Delete all volumes and data
docker compose up -d      # Start fresh
```

### Slow Grafana dashboard

**Optimize queries**:
- Use `rate()` for time-series
- Use `[5m]` time windows for smoothing
- Add recording rules in Prometheus

**Increase Prometheus resources**:
- Add memory limits in docker-compose.yml
- Reduce scrape frequency (edit prometheus.yml)

## Next Steps

### Immediate (5 minutes)
1. Access Prometheus: http://localhost:9090
   - Explore available metrics
   - Run sample PromQL queries
2. Access Grafana: http://localhost:3000
   - Update admin password
   - Explore Prometheus connection
   
### Short-term (1 hour)
3. Create custom Grafana dashboards
   - Add panels for Node Exporter metrics
   - Visualize CPU, memory, disk, network usage
4. Monitor other Docker projects
   - Add ScoreVault or Todo app to prometheus.yml
   - Create dashboards for each service

### Medium-term (1 day)
5. Configure alerting
   - Set up Prometheus alert rules
   - Configure Grafana notifications
   - Test alerts and notifications
6. Add more exporters
   - PostgreSQL exporter for databases
   - Redis exporter for caching layers
   - Custom application metrics

### Long-term (ongoing)
7. Build knowledge base
   - Document common queries
   - Create runbooks for incidents
   - Establish monitoring best practices
8. Optimize performance
   - Tune scrape intervals
   - Implement recording rules
   - Archive old metrics

## Quick Reference

### Important URLs
| Service | URL | Credentials |
|---------|-----|-------------|
| Prometheus | http://localhost:9090 | None required |
| Grafana | http://localhost:3000 | admin / admin |
| Node Exporter Metrics | http://localhost:9100/metrics | Read-only |

### Key Ports
- **9100**: Node Exporter metrics
- **9090**: Prometheus web UI and API
- **3000**: Grafana dashboards and UI

### Useful Commands
```bash
# Status
docker compose ps
docker compose logs -f

# Control
docker compose up -d --build
docker compose restart <service>
docker compose down -v

# Access
docker compose exec prometheus sh
docker compose exec grafana sh
docker compose exec node-exporter sh

# Verify health
curl http://localhost:9090/-/healthy
curl http://localhost:3000/api/health
curl http://localhost:9100/-/healthy
```

---

**Happy monitoring! **
