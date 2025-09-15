# GreenCoders - Sustainability Marketplace

An eco-friendly digital marketplace that enables shoppers to buy sustainable goods, vendors to showcase eco-certifications, and admins to generate real-time sustainability reports. Built with transparency, CO₂ impact tracking, and eco-badges at its core.

## Project Overview

GreenCoders is not just another e-commerce platform – it's a sustainability engine where:
- **Shoppers** see real-time eco-badges and CO₂ savings with every purchase
- **Vendors** showcase verified eco-certifications and track impact metrics
- **Admins** generate comprehensive sustainability compliance reports

### Mission
Transforming online shopping by making environmental impact transparent, measurable, and trustworthy.

## Features

### Core Features (MVP)
- **Product Catalog** - Browse eco-certified sustainable products
- **Shopping Cart** - Add/remove items with real-time CO₂ impact calculation
- **Secure Checkout** - Complete purchases with sustainability confirmation
- **Order Tracking** - Monitor orders with eco-impact summaries

### Stretch Features
- **Eco Impact Badges** - Visual sustainability indicators at product and cart levels
- **Subscription Eco-Boxes** - Monthly curated sustainable product deliveries
- **Community Forum** - Platform for eco-discussions and tips

## Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Redux Toolkit** - Predictable state management
- **Jest** - Testing framework

### Styling & Design
- **Custom Eco Theme** - Green-focused color palette
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Dark Mode** - Built-in theme switching

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── common/        # Shared components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   ├── store/             # Redux store and slices
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── services/          # API services
│   ├── constants/         # App constants
│   └── assets/            # Images, icons, etc.
├── tests/                 # Test files
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- **Node.js** (v20.19.0 or higher)
- **npm** (v10.0.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZEED2468/GreenCoders.git
   cd GreenCoders/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
```
### Components
All UI components follow the shadcn/ui design system with custom eco-friendly theming.

## Contributing

We welcome contributions from developers who share our vision of sustainable technology! 

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Contribution Guidelines
- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described
- Ensure all checks pass before submitting PR

### Development Workflow
- Use feature branches for all development
- Follow conventional commit messages
- Squash commits before merging
- All PRs require code review
