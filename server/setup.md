# NestJS Backend Setup

## Clone and Create a Branch

```bash
git clone https://github.com/ZEED2468/GreenCoders.git
cd GreenCoders/server

# create a feature branch
git checkout -b feat/backend-setup
```

## Environment Variables

Create a `.env` file in the server directory (optional). Minimal variables:

```env
PORT=3000
NODE_ENV=development
```

If a `.env.sample` file exists, copy it to `.env` and adjust values:

```bash
# from the server folder
copy .env.sample .env   # Windows PowerShell
```

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Database Setup

Not required for the minimal setup.

## Project Structure

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── config/
│   ├── app.config.ts
│   └── database.config.ts
├── entities/
└── modules/
    └── database/
        └── database.module.ts
```

