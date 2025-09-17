# GreenCoders - Backend (NestJS)

An API service for the Sustainability Marketplace that powers eco-product catalogs, checkout impact calculations, vendor dashboards, and admin reporting. Built for transparency, CO₂ impact tracking, and verified certifications.

## Introduction

It's a busy shopping day and thousands of eco-conscious customers are browsing online, trying to make greener choices. On most platforms, that means confusion, vague “eco-friendly” labels, missing certifications, or checkout pages that say nothing about impact. Shoppers hesitate, vendors lose trust, and admins can’t measure real sustainability.

With our system, think of a different kind of marketplace.
- A customer clicks on a product, sees its verified eco-certification, and at checkout a badge pops up: “This order saved 2.5kg of CO₂ compared to plastic alternatives.”
- Vendors upload their products and instantly see live dashboards linking sales to environmental impact.
- Admins no longer guess, they generate real-time reports showing exactly how much CO₂ the marketplace saved this quarter.


## Getting Started

```bash
npm install
```

### Prerequisites
- Node.js v20.19.0+
- npm v10+
- Git

### Start
```bash
npm run start:dev
```

### Available Scripts
```bash
npm run start:dev   # Dev server (watch)
npm run build       # Build for production
npm run start:prod  # Start built app
npm run lint        # ESLint
npm run test        # Jest tests
```

## Features

### Core Features (MVP)
- Catalog APIs for eco-certified products
- Cart/Checkout APIs with CO₂ impact calculation
- Order APIs with impact summaries

### Stretch Features
- Eco Impact Badges exposure via API
- Subscription eco-box orchestration
- Community endpoints (future)

## Real-Life Events

- Over-claiming Green Products: Helping a friend find sustainable skincare online, we noticed lots of vague “green” labels with no proof. That’s when we thought: what if the platform itself enforced eco-certifications and verified impact data?
- Checkout Confusion: We’ve seen shoppers abandon carts during promos because impact info wasn’t clear. They asked: “Is this actually better for the planet?”
- Vendor Struggles: A local eco-vendor told us customers didn’t trust their claims without a dashboard or verification system. Sales dropped despite genuine effort.
- Admin Blind Spots: Marketplace admins we spoke with couldn’t answer: “How much CO₂ did we save this quarter?” because the system wasn’t tracking it at all.

## Project Overview

### Mission
Transforming online shopping by making environmental impact transparent, measurable, and trustworthy.

### Goals & Objectives
- Provide a seamless eco-shopping experience.
- Track and display CO₂ savings per purchase.
- Offer vendor dashboards with eco-certification validation.
- Generate platform-wide sustainability and compliance reports.

### Target Users
- Eco-shoppers
- Vendors
- Admins

### Scope
- Core: Product catalog, cart + checkout, order tracking with eco-badges.
- Stretch: Impact badges on product/cart, subscription eco-boxes, community forum.

### 5. Functional Requirements

Eco-Shoppers
- Browse/filter eco-products with certifications
- Cart with total cost + CO₂ impact
- Secure checkout + eco-report confirmation
- Order tracking with impact summary

Vendors
- Register and upload eco-certifications
- Add/manage eco-products with sustainability data
- Dashboards with sales + CO₂ metrics

Admins
- Approve vendors and certifications
- Manage product categories/catalogs
- Generate sustainability compliance reports

### 6. Non-Functional Requirements
- Security: secure endpoints, cookie-based auth direction
- Performance: checkout response < 2s
- Scalability: 10k+ concurrent shoppers target
- Transparency: verified eco-badges and certifications
- Monitoring: error tracking + eco-data validation

### 7. Technical Requirements

## Tech Stack

### Backend
- NestJS (Node.js + TypeScript)
- Express platform
- Cookie parsing + CORS (credentials)
- PostgreSQL (future) with JSONB for flexible eco-data
- Jest for testing

## Project Structure

```
server/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   └── database.config.ts
│   ├── entities/
│   └── modules/
│       └── database/
│           └── database.module.ts
├── README.md
└── SETUP.md
```

## Contributing

Follow the same workflow as the client:

1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```
2. Make small, incremental edits; avoid whole-file rewrites
3. Run tests and linting
```bash
npm run test
npm run lint
```
4. Commit using conventional commits
```bash
git commit -m "feat(server): add your feature description"
```
5. Push and open a Pull Request

### 8. Success Metrics
- Verified vendors onboarded
- Accuracy of CO₂ reporting vs benchmarks
- Shopper engagement (repeat purchases, NPS)
- Admin reporting compliance rate

### 9. Deliverables
- Deployed marketplace backend
- Documentation for shoppers, vendors, admins
- Final demo with eco-reports

### 10. Testing & Validation
Impact Accuracy
- Compare CO₂ savings to sustainability datasets
- Cross-check vendor certifications with admin validations

User Experience
- Shoppers: eco-badge clarity at checkout
- Vendors: dashboards update sales + impact correctly
- Admins: mock compliance audits

Performance
- Simulate 10k concurrent shoppers; checkout < 2s with impact calcs
- Dashboards update within 1s