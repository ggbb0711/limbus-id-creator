# Limbus ID Creator

Create and customize Limbus Company-style ID cards.

**Live site:** [https://limbus-company-id-creator.com/](https://limbus-company-id-creator.com/)

## Project Structure

This is a monorepo with two apps:

- `id-creator/` — React frontend (Create React App)
- `id-creator-server/` — ASP.NET Core (.NET 8) backend API, with PostgreSQL and RabbitMQ

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+) and npm
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker](https://www.docker.com/) (for PostgreSQL and RabbitMQ)
- [Entity Framework Core tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) for migrations:
  ```
  dotnet tool install --global dotnet-ef
  ```

## Setup

### 1. Install dependencies

From the repo root, this installs both the frontend and backend dependencies:

```
npm install
```

### 2. Configure environment variables

**Frontend** — create `id-creator/.env`:

```
NODE_PATH=./src
REACT_APP_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
REACT_APP_LOCAL_SAVE_MAX_LEN=5
REACT_APP_SERVER_URL=http://localhost:8080
```

**Backend** — create `id-creator-server/.env`:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password123
POSTGRES_DB=LimbusCompanyIDMaker
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin

TokenEndpoint=https://www.googleapis.com/oauth2/v1/userinfo?access_token=
SessionExpiredDay=14
COOKIESESSION_DOMAIN=localhost
DefaultConnection=Host=localhost;Port=9000;Database=LimbusCompanyIDMaker;Username=postgres;Password=password123
FrontendUri=http://localhost:3000
CookieSessionProtectorSecret=<random-secret-string>

RABBITMQ_HOST=localhost
RABBITMQ_HOST_USER_NAME=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VH=/
RABBITMQ_REQUESTED_HEARTBEAT=300

MODE=Dev
LISTEN_ON=http://0.0.0.0:8080
UPLOAD_FOLDER=/upload/

AWS_S3_BUCKET_NAME=<your-s3-bucket-name>
AWS_ACCESS_KEY=<your-aws-access-key>
AWS_SECRET_KEY=<your-aws-secret-key>
```

Both `.env` files are gitignored — never commit real secrets to them.

### 3. Start infrastructure and run migrations

This starts Postgres, starts RabbitMQ, and applies EF Core migrations:

```
npm run setup
```

## Running Locally

Start both the frontend and backend together:

```
npm start
```

Or run them individually:

```
npm run frontend:start   # React app at http://localhost:3000
npm run backend:start    # API at http://localhost:8080
```

## Other Useful Commands

| Command | Description |
| --- | --- |
| `npm run db:start` | Start the PostgreSQL container |
| `npm run db:stop` | Stop the PostgreSQL container |
| `npm run db:migrate` | Apply EF Core database migrations |
| `npm run infra:start` | Start the RabbitMQ container |
| `npm run frontend:install` | Install frontend dependencies only |
| `npm run backend:install` | Restore backend dependencies only |