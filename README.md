# Infraflow Test Task Monorepo

## Overview

This repository contains a monorepo for the Infraflow test task, featuring:
- **Fastify backend** with tRPC, Prisma, Kafka, and MinIO S3 in `/apps/api`
- **Next.js frontend** with shadcn/ui components in `/apps/web`
- Docker configurations in each project and a root-level `docker-compose.yml` to orchestrate the entire stack

## Monorepo Structure

```
.
├── apps
│   ├── api           # Fastify + tRPC + Prisma + Kafka + MinIO S3
│   └── web           # Next.js frontend with shadcn/ui components
├── docker-compose.yml            # Starts frontend, backend, Kafka, Zookeeper, MinIO, Postgres
├── .env.example                  # Root environment variables example
├── apps/api/.env.example         # Backend environment variables example
├── apps/web/.env.example         # Frontend environment variables example
├── package.json                  # Monorepo package.json
└── image.jpeg       # Site screenshot
```

## Features

- **File Upload**: Upload files to the server or MinIO
- **File Editing**: Edit file metadata or contents
- **File Deletion**: Remove files from storage
- **File Listing**: View all files in a reusable table component
- UI components built with [shadcn/ui](https://github.com/shadcn/ui)

## Prerequisites

- Docker & Docker Compose
- Node.js (for local frontend development)
- npm or yarn

## Development

1. **Clone the repository**  
	 ```bash
	 git clone
	 ```

2. **Install dependencies**  
	 For the monorepo root:
	 ```bash
	 npm install
	 ```

	 Then, install dependencies for each app:

	 For the backend:
	 ```bash
	 cd apps/api
	 npm install
	 ```
	 For the frontend:
	 ```bash
	 cd apps/web
	 npm install
	 ```

3. **Start the backend in development mode**  
	 ```bash
	 cd apps/api
	 docker-compose -f docker-compose.dev.yml up
	 ```
4. **Start the frontend in development mode**  
	 ```bash
	 cd apps/web
	 npm run dev
	 ```
3. Open http://localhost:3000 in your browser.

## Production

1. **Set up environment variables**  
	 Copy the example files to `.env` for root, backend, and frontend:
	 ```bash
	 cp .env.example .env
	 cp apps/api/.env.example apps/api/.env
	 cp apps/web/.env.example apps/web/.env
	 ```
2. **Build and start all services**  
	 ```bash
	 docker-compose up --build
	 ```
3. Access the services:
	 - Frontend: http://localhost:3000
	 - API: http://localhost:4000/api/v1

## Screenshot

![Site Screenshot](./image.jpeg)

## License

This project is licensed under the MIT License.
