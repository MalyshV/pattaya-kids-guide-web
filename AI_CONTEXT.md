# AI Context — Pattaya Kids Guide

## Project Overview

Pattaya Kids Guide is a web platform that helps parents discover family-friendly activities in Pattaya.

The platform focuses on **live events and real-world activities**, not just static place listings.

Core concept:

**Events + Places + Personalization**

The system is designed as a **live guide for parents**, where content changes frequently and reflects real-world activities happening in the city.

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

---

### Places

Permanent locations:

- playgrounds
- cafés
- activity centers
- parks
- family venues

Places represent physical locations that parents may visit repeatedly.

---

## Current Tech Stack

The project uses:

- Next.js (App Router)
- TypeScript (strict mode)
- Prisma
- PostgreSQL (Neon)
- Prisma adapter for Neon
- REST API inside `app/api`

Backend and frontend live in the **same repository**.

---

## Backend Architecture

Backend follows a layered structure:

    route -> service -> mapper -> dto

### Route

Location example:

    src/app/api/events/route.ts

Responsibilities:

- parse request
- validate query parameters
- call service
- map results to DTO
- return response

Important rule:

Routes must **not contain business logic**.

---

### Service

Example:

    src/services/events.service.ts

Responsibilities:

- database queries
- filtering
- pagination
- lifecycle rules
- core business logic

---

### Mapper

Example:

    src/mappers/event.mapper.ts

Responsibilities:

- convert Prisma models into DTOs
- isolate database schema from API responses

---

### DTO

Example:

    src/dto/event.dto.ts

Responsibilities:

- define public API response shapes
- ensure stable API contract

---

## Current API

### GET /api/events

Supported query parameters:

- type = upcoming | ongoing | past
- page
- limit

Example request:

    /api/events?type=upcoming&page=1&limit=10

Example response:

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

**Past events are NOT deleted.**

Reasons:

- archive
- SEO value
- user trust
- historical reference

---

## Database

The project uses:

- PostgreSQL (Neon)
- Prisma ORM
- Prisma adapter for Neon pooled connections

Important detail:

Neon uses a **connection pooler**, so Prisma must use the adapter-based client.

The project uses:

    @prisma/adapter-pg

Using the default Prisma client without adapter:

    new PrismaClient()

may cause:

    PrismaClientInitializationError

because Neon requires pooled connections.

---

## Seed Data

Seed scripts are designed to be:

- idempotent
- safe to run multiple times
- based on upsert
- duplicate-safe

Demo events include:

- Upcoming
- Ongoing
- Past

All demo events contain:

    [DEMO]

in the title.

The slug is used as the upsert anchor and must remain stable.

---

## Development Rules

When modifying this project:

- keep route handlers thin
- keep business logic in services
- do not leak Prisma models to API responses
- avoid `any`
- respect strict TypeScript
- prefer readable code over clever code
- avoid over-engineering
- keep functions small and clear

---

## Workflow

Development is intentionally done through **small commits**.

Valid commit examples:

- add helper
- add DTO field
- refactor route
- add service method
- add mapper
- update docs
- improve validation

Progress is measured by **consistent commits**, not large changes.

---

## Current Milestone

Current stage:

**v0.2 events-api**

Implemented:

- Prisma schema
- Neon database connection
- seed with demo events
- event lifecycle logic
- events API
- pagination
- DTO layer
- mapper layer
- service layer
- centralized API error handling
- apiHandler wrapper for routes

---

## Immediate Next Steps

Next backend tasks:

1. Add:

       GET /api/events/[slug]

2. Improve sorting:

       upcoming → startDate ASC
       past → startDate DESC

3. Introduce Places model and API

4. Build event details page

5. Prepare groundwork for personalization

---

## Important Note

This project is intentionally built through **steady incremental development**.

The goal is:

- rebuild engineering confidence
- maintain consistent commits
- create a real product with real value
- move toward financial independence through software development
