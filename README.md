# GreenCoders - Sustainability Marketplace

> An eco-friendly digital marketplace that enables shoppers to buy sustainable goods, vendors to showcase eco-certifications, and admins to generate real-time sustainability reports.

## Project Vision

GreenCoders transforms online shopping by making environmental impact **transparent**, **measurable**, and **trustworthy**. We're building more than a marketplace – we're creating a sustainability engine where every purchase tells a story.

### The Problem We're Solving

- **Shoppers** can't measure the environmental impact of their purchases
- **Vendors** struggle to showcase eco-certifications and prove sustainability claims
- **Admins** lack tools to generate comprehensive sustainability reports
- **Trust** in "eco-friendly" labels is low due to lack of transparency

### Our Solution

- **Real-time CO₂ tracking** with every product and purchase
- **Verified eco-certifications** for all vendors and products
- **Impact dashboards** showing sales linked to sustainability metrics
- **Comprehensive reporting** for compliance and transparency

## Project Structure

```
GreenCoders/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── store/         # State management (Redux Toolkit)
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js Backend API
│   ├── src/
│   │   ├── modules/       # Feature modules (NestJS)
│   │   ├── common/        # Shared utilities
│   │   └── database/      # Database configurations
│   └── package.json       # Backend dependencies
├── docs/                  # Project documentation
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md             # This file
```

## Tech Stack

### Frontend (Client)
- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Redux Toolkit** - Predictable state management
- **Jest** - Testing framework

### Backend (Server)
- **Node.js + TypeScript** - Runtime and type safety
- **NestJS** - Scalable Node.js framework
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication
- **Jest** - Testing framework

### DevOps & Infrastructure
- **AWS** - Cloud hosting and services
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipelines
- **Prometheus & Grafana** - Monitoring and analytics
- **Sentry** - Error tracking

### Data Science
- **Python** - Data processing and analysis
- **Pandas & NumPy** - Data manipulation
- **Scikit-learn** - Machine learning for insights
- **Kaggle Datasets** - Sustainability data sources

## Quick Start

### Prerequisites
- **Node.js** (v20.19.0 or higher)
- **npm** (v10.0.0 or higher)
- **Git**
- **PostgreSQL** (for backend, when available)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/ZEED2468/GreenCoders.git
cd GreenCoders

# Setup frontend
cd client
npm install
npm run dev

# Open browser to http://localhost:5173
```
```

## Key Features

### For Eco-Shoppers
- Browse verified eco-products with certifications
- See real-time CO₂ impact calculations
- Track environmental savings with each purchase
- Receive detailed sustainability reports

### For Vendors
- Upload and verify eco-certifications
- Showcase sustainability credentials
- Access impact dashboards linking sales to environmental metrics
- Manage eco-product catalog with sustainability data

### For Admins
- Approve vendor registrations and certifications
- Generate platform-wide sustainability reports
- Monitor compliance and environmental impact
- Manage product categories and marketplace policies

## Design Philosophy

### Sustainability First
Every design decision prioritizes environmental impact and user education about sustainable choices.

### Transparency by Default
All environmental claims are backed by verified data and real-time calculations.

### Accessibility & Inclusion
Built with WCAG guidelines to ensure the platform is accessible to all users.

### Performance & Efficiency
Optimized code that reduces energy consumption and server load.

## Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup and architecture
- [x] Frontend starter kit with React + Vite
- [x] UI component library with eco-theming
- [x] Basic responsive layout
- [ ] Backend API foundation with NestJS
- [ ] Database schema design

### Phase 2: Core Marketplace
- [ ] User authentication and profiles
- [ ] Product catalog with search and filters
- [ ] Shopping cart and checkout flow
- [ ] Vendor registration and onboarding
- [ ] Basic order management

### Phase 3: Sustainability Engine
- [ ] CO₂ impact calculation algorithms
- [ ] Eco-certification verification system
- [ ] Real-time sustainability tracking
- [ ] Impact badges and visual indicators
- [ ] Environmental reporting dashboard

### Phase 4: Advanced Features
- [ ] Admin dashboard with analytics
- [ ] Vendor impact reporting
- [ ] Community features and forums
- [ ] Mobile application
- [ ] API for third-party integrations

## Contributing

We welcome contributions from developers who share our vision of sustainable technology! 

### How to Get Started
1. Read our [Contributing Guidelines](CONTRIBUTING.md)
2. Check out [Good First Issues](https://github.com/ZEED2468/GreenCoders/labels/good%20first%20issue)
3. Join our community discussions
4. Submit your first PR!

### Contribution Areas
- **Feature Development** - New marketplace features
- **Bug Fixes** - Improve user experience
- **Documentation** - Help others understand the project
- **Testing** - Ensure code quality and reliability
- **Design & UI** - Enhance visual design and usability
