# Project Map — Pattaya Kids Guide

## Purpose

This file helps AI tools and developers quickly understand the repository structure and where to look for important logic.

Project: Pattaya Kids Guide

Type:
Live web guide for parents in Pattaya

Core concept:
Events + Places + Personalization

This is NOT just a static catalog of places.
It is an event-driven discovery platform for families.

---

## Tech Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Prisma
- PostgreSQL (Neon)
- Prisma adapter for Neon
- REST API inside app/api

Frontend and backend live in the same repository.

---

## Current Milestone

Current milestone:
v0.2 events-api

Completed:

- Prisma schema
- Neon connection
- seed with demo events
- event lifecycle logic
- events API
- pagination
- DTO layer
- mapper layer
- service layer
- husky + lint-staged

Planned next:

1. Event details endpoint
2. Sorting improvements
3. Places API
4. Personalization features

---

## Architecture Rule

Backend uses layered architecture:

route → service → mapper → dto

Rules:

- route handlers must stay thin
- business logic must live in services
- mappers must isolate Prisma models from API responses
- DTOs define public API shape
- do not leak raw database models to the frontend
- do not move business logic into route handlers

---

## Repository Structure

### App Routes

Location:

    src/app

Purpose:

- Next.js app router pages
- API route handlers under `src/app/api`

Important area:

    src/app/api

Example:

    src/app/api/events/route.ts

Rule:

API route files should contain minimal logic.
They should call services and return DTO-based responses.

---

### Services

Location:

    src/services

Purpose:

- business logic
- filtering
- pagination
- lifecycle logic
- orchestration of database reads

Example:

    src/services/events.service.ts

Service responsibilities:

- query Prisma
- determine event status buckets
- apply pagination
- return domain-ready results for mapping

---

### Mappers

Location:

    src/mappers

Purpose:

- convert Prisma models into DTOs
- keep API responses stable
- isolate database schema from API contract

Example:

    src/mappers/event.mapper.ts

Rule:

Frontend should depend on DTOs, not raw Prisma model shape.

---

### DTOs

Location:

    src/dto

Purpose:

- define API response contracts
- keep response shapes explicit and predictable

Example:

    src/dto/event.dto.ts

---

### Prisma

Location:

    prisma

Important files:

    prisma/schema.prisma

Purpose:

- database schema
- model definitions
- seed logic

Notes:

- database is PostgreSQL on Neon
- project uses Prisma adapter for Neon pooled connections
- seed data must be idempotent
- demo events use `[DEMO]` in title
- slug is used as stable upsert anchor and should not be changed casually

---

### Environment

Main file:

    .env

Required variable:

    DATABASE_URL

Important rules:

- `.env` must never be committed
- `.env` must stay in `.gitignore`
- `DATABASE_URL` must not be wrapped in quotes

Correct:

    DATABASE_URL=postgresql://user:password@host/db

Incorrect:

    DATABASE_URL="postgresql://user:password@host/db"

---

## Current API

### GET /api/events

Purpose:

Return paginated events filtered by lifecycle type.

Query params:

- `type=upcoming | ongoing | past`
- `page=number`
- `limit=number`

Example:

    /api/events?type=upcoming&page=1&limit=10

Response format:

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

This is a core business rule.

Definitions:

- Upcoming → `startDate > now`
- Ongoing → `startDate <= now <= endDate`
- Past → `endDate < now`

Important:

Past events are NOT deleted.

Reasons:

- archive
- SEO value
- trust
- historical reference

---

## Content Model

### Events

Temporary content, for example:

- workshops
- festivals
- mall activities
- hotel kids programs
- beach activities
- seasonal events

Important rule:

Event can exist WITHOUT a Place.

Examples:

- hotel kids workshop
- pop-up event
- beach activity
- mall event

### Places

Permanent locations, for example:

- playgrounds
- cafés
- activity centers
- parks

---

## Development Priorities

When editing or generating code for this repository:

- preserve current architecture
- keep code readable
- avoid over-engineering
- avoid `any`
- respect strict TypeScript
- keep services focused
- keep API predictable and consistent

---

## Where To Look First

If working on event listing API:

1. `src/app/api/events/route.ts`
2. `src/services/events.service.ts`
3. `src/mappers/event.mapper.ts`
4. `src/dto/event.dto.ts`
5. `prisma/schema.prisma`

If working on database structure:

1. `prisma/schema.prisma`
2. seed files
3. service files that query Prisma

If working on API response shape:

1. DTO files
2. mappers
3. route handlers

---

## Planned Next Features

### 1. Event details endpoint

Planned route:

    GET /api/events/[slug]

### 2. Sorting improvements

Rules:

- upcoming: `startDate ASC`
- past: `startDate DESC`

### 3. Places API

Planned route:

    /api/places

### 4. Personalization

Planned features:

- favorites
- visited places
- user preferences

---

## Notes for AI Assistants

When helping with this project:

- treat this as a real product, not a demo catalog
- preserve the layered architecture
- do not mix Prisma models with DTOs
- do not place business logic into route handlers
- consider SEO and archival value for past events
- remember that events may exist without places
- prefer practical, maintainable solutions over clever abstractions
