# Pattaya Kids Guide

Live web guide for parents in Pattaya.

This project is not a static catalog.  
It is an event-driven discovery platform for families.

Core concept:

**Events + Places + Personalization**

---

## Project Status

Current milestone: **v0.2 events-api**

Already implemented:

- Next.js app structure
- Prisma + Neon PostgreSQL connection
- seed with demo events
- event lifecycle logic
- GET /api/events
- pagination
- DTO layer
- mapper layer
- service layer
- safe query parsing
- centralized API error handling
- apiHandler wrapper for routes

---

## Product Model

### Events

Temporary activities:

- workshops
- festivals
- mall activities
- hotel kids programs
- beach activities
- seasonal events

Important rule:

**Event can exist without a Place.**

Examples:

- hotel kids workshop
- beach pop-up activity
- festival in a park
- event in a mall

### Places

Permanent locations:

- playgrounds
- cafés
- activity centers
- parks
- family venues

---

## Tech Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Prisma
- PostgreSQL (Neon)
- Prisma adapter for Neon
- REST API inside `app/api`

---

## Database

This project uses:

- PostgreSQL (Neon)
- Prisma 7
- Prisma config mode (`prisma.config.ts`)
- Adapter-based Prisma Client

Important detail:

Neon uses a **connection pooler**, so Prisma must use the adapter-based client.

The project uses:

    @prisma/adapter-pg

Example client initialization:

    import { PrismaClient } from "@prisma/client"
    import { Pool } from "pg"
    import { PrismaPg } from "@prisma/adapter-pg"

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    })

    const adapter = new PrismaPg(pool)

    export const prisma = new PrismaClient({
      adapter
    })

Important:

Using the default Prisma client without adapter:

    new PrismaClient()

may cause:

    PrismaClientInitializationError

because Neon requires pooled connections.

---

## Architecture

Backend follows layered structure:

    route -> service -> mapper -> dto

### Route

Thin API handlers only.

Location example:

    src/app/api/events/route.ts

### Service

Business logic lives here.

Example:

    src/services/events.service.ts

### Mapper

Maps Prisma models to DTOs.

Example:

    src/mappers/event.mapper.ts

### DTO

Defines public API response shape.

Example:

    src/dto/event.dto.ts

Important rules:

- do not move business logic into route handlers
- do not leak Prisma models directly to frontend
- keep API stable and predictable

---

## Current API

### GET /api/events

Query params:

- type = upcoming | ongoing | past
- page = number
- limit = number

Example:

    /api/events?type=upcoming&page=1&limit=10

Response shape:

    {
      "data": [],
      "meta": {
        "total": 0,
        "page": 1,
        "limit": 10,
        "totalPages": 0
      }
    }

---

## Event Lifecycle Logic

Rules:

- Upcoming → startDate > now
- Ongoing → startDate <= now <= endDate
- Past → endDate < now

Important rule:

**Past events are not deleted.**

Reasons:

- archive
- SEO value
- user trust
- historical reference

---

## Getting Started

Install dependencies:

    npm install

Generate Prisma client if needed:

    npx prisma generate

Run database migrations:

    npx prisma migrate dev

Run seed:

    npx prisma db seed

Start development server:

    npm run dev

---

## Environment

Environment variables live in `.env`

Required:

    DATABASE_URL=postgresql://user:password@host/db

Important:

- `.env` must never be committed
- DATABASE_URL must not be wrapped in quotes

Correct:

    DATABASE_URL=postgresql://user:password@host/db

Incorrect:

    DATABASE_URL="postgresql://user:password@host/db"

---

## Seed Notes

Seed data is:

- idempotent
- safe to run multiple times
- based on upsert
- never creates duplicates

Demo events include:

- Upcoming
- Ongoing
- Past

All demo events contain:

    [DEMO]

in the title.

Slug is used as the upsert anchor and must stay stable.

---

## Development Rules

- avoid `any`
- respect strict TypeScript
- keep services small
- keep route handlers thin
- prefer readable code over clever code
- avoid over-engineering

---

## Current File Structure

    src/
      app/
        api/
          events/
      dto/
      lib/
      mappers/
      services/

---

## Near-Term Next Steps

1. GET /api/events/[slug]
2. sorting improvements
3. Places API
4. event details page
5. personalization foundations

---

## Project Intent

This project matters for more than code.

It is being built as:

- a path back into the profession
- a way to rebuild confidence through steady engineering work
- a practical product with real users and real value
- a step toward financial independence

---

## Project Principles

This project follows a few simple engineering principles.

### 1. Keep API handlers thin

Route handlers should only:

- parse request
- call service layer
- map results to DTO
- return response

Business logic must live in services.

Example structure:

    route -> service -> mapper -> dto

### 2. Do not leak database models

Prisma models must not be returned directly from API routes.

Always map them to DTOs.

Reason:

- protects API contract
- prevents accidental schema leaks
- keeps frontend independent from database structure

### 3. Prefer small commits

Development is done through small incremental commits.

Examples of valid commits:

- add helper
- add DTO field
- introduce parser
- refactor route
- add service method
- update documentation

Progress is measured by **consistent commits**, not large changes.

### 4. Prefer clarity over cleverness

Code should be readable after a pause.

Avoid:

- over-engineering
- unnecessary abstractions
- complex helpers that hide logic

Readable code is preferred over smart code.

### 5. Past events are never deleted

Past events are part of the historical record.

Reasons:

- SEO value
- trust
- archive
- analytics
