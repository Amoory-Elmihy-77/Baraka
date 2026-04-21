# Baraka Application - Docker Deployment

This guide explains how to quickly run the entire Baraka stack (Frontend + Backend) using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Environment Setup

Before starting the containers, ensure your backend `.env` file is properly configured. 

The `docker-compose.yml` is configured to automatically read variable secrets from your `back/.env` file. Ensure that the file `back/.env` exists and has the following properties:

```env
PORT=5001
MONGO_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN=7d
```

*(Note: The `NEXT_PUBLIC_API_URL` for the frontend is already mapped correctly inside the `docker-compose.yml` file)*

## Running the Application 🚀

To build and start both the Next.js Frontend and the Node.js Backend simultaneously, run the following command from the root folder (where this README is located):

```bash
docker compose up --build -d
```

- `--build`: Forces Docker to build fresh images for both frontend and backend using our multi-stage Dockerfiles.
- `-d`: Runs the containers in "detached" mode (in the background).

### Accessing the Apps

Once the containers are successfully running:
- **Frontend App:** Navigate to [http://localhost:3000](http://localhost:3000)
- **Backend API:** The API is accessible at [http://localhost:5001](http://localhost:5001)

## Other Useful Commands

### See Live Logs
To watch the running logs for both apps:
```bash
docker compose logs -f
```
Or for a specific service:
```bash
docker compose logs -f frontend
docker compose logs -f backend
```

### Stop the Application
To gracefully stop the running containers:
```bash
docker compose stop
```

### Completely Remove Containers
To tear down the containers and the network entirely:
```bash
docker compose down
```
