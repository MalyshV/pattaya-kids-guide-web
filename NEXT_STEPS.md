# Next Steps — Pattaya Kids Guide

This file tracks the next development steps for the project.

The goal is to keep development moving through **small, safe commits**.

When returning to the project after a pause, start here.

---

# Current Priority

Continue building the **Events API**.

Next endpoint to implement:

    GET /api/events/[slug]

This endpoint will return details of a single event.

---

# Suggested Commit Breakdown

The endpoint should be implemented through several small commits.

Example sequence:

### Commit 1
Create route file:

    src/app/api/events/[slug]/route.ts

---

### Commit 2
Add service method:

    getApprovedEventBySlug(slug)

Location:

    src/services/events.service.ts

---

### Commit 3
Add Prisma query:

Find event by slug.

Return null if event does not exist.

---

### Commit 4
Add NotFound error handling.

Use existing error helpers.

---

### Commit 5
Map Prisma model to DTO.

Reuse:

    mapEventToDto()

---

### Commit 6
Return response using helper:

    ok()

---

# Sorting Improvements

Improve sorting logic for event lists.

Rules:

Upcoming events:

    startDate ASC

Past events:

    startDate DESC

---

# Places Foundation

Next larger feature after events:

Introduce **Places model**.

Steps:

### Commit 1
Add Prisma model:

    Place

---

### Commit 2
Run migration.

---

### Commit 3
Add seed data.

---

### Commit 4
Add DTO.

---

### Commit 5
Add mapper.

---

### Commit 6
Add service.

---

### Commit 7
Add API route.

---

# Event Details Page

Once `/api/events/[slug]` works:

Create frontend page for event details.

Location:

    src/app/events/[slug]/page.tsx

Responsibilities:

- fetch event
- render event data
- prepare SEO metadata

---

# Future Product Features

After core API:

- family-friendly places
- birthday category
- event discovery
- favorites
- visited places
- user preferences

---

# Daily Development Rule

The minimum goal is:

    1 commit per day

Examples of valid commits:

- add helper
- add DTO field
- introduce parser
- refactor route
- add service method
- update documentation

Consistency is more important than large changes.

---

# When Stuck

Do not ask:

    What should I build today?

Ask instead:

    What is the next smallest useful commit?
    