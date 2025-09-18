# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application containing an interactive educational game called "Should I Delegate This?" designed for school leaders and educators. The game helps users learn when to delegate tasks to AI versus when to keep them human-driven through timed decision-making scenarios. The goal is to develop this into a standalone React app hosted on Vercel.

## Development Setup

This project is a Next.js application configured for static export and Vercel deployment:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture

- **Next.js 15.5.3**: App Router architecture with static export configuration
- **React 18**: Modern React app using functional components and hooks
- **Game State Machine**: Manages four distinct states: `setup`, `playing`, `results`, `finished`
- **Timer System**: 45-second countdown per scenario with visual progress indicators
- **Scoring System**: 100 points per correct decision with percentage-based final scoring
- **Static Export**: Configured for static site generation and edge deployment

## Current Dependencies

- **React 18**: Core framework
- **Next.js 15.5.3**: Full-stack React framework with app router
- **Tailwind CSS 3.4.1**: Utility-first styling framework
- **lucide-react 0.460.0**: Modern icon library
- **TypeScript 5**: Full type safety implementation

## Core Game Mechanics

- **Scenarios**: 6 predefined educational scenarios covering different delegation contexts
- **Decision Flow**: Group discussion → timed decision → immediate feedback → next scenario
- **Feedback System**: Provides both correct/incorrect explanations and humorous "what went wrong" examples
- **Round Structure**: Scenarios are grouped into rounds (changes at scenario 3)

## Key Data Structures

- **Game State**: Controls UI flow between setup, gameplay, and results screens
- **Scenarios Array**: Contains predefined scenarios with metadata:
  - `category`: Type of educational task
  - `scenario`: The decision prompt
  - `shouldDelegate`: Boolean indicating correct answer
  - `feedback`: Correct/incorrect explanations
  - `funnyWrong`: Humorous consequence examples

## Deployment Configuration

- **Vercel**: Primary hosting platform
- **Static Export**: Configured for optimal performance
- **Domain**: Will be accessible at custom domain or vercel.app subdomain
- **Build Optimization**: Tailwind purging and React production builds

## Content Modification

To modify game content:
- Edit the `scenarios` array in the main component
- Adjust timer duration (currently 45 seconds)
- Modify scoring system (currently 100 points per correct answer)
- Update styling via Tailwind classes

## Current File Structure

```
/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ShouldIDelegateGame.tsx
├── node_modules/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── CLAUDE.md
└── WARP.md
```

## Deployment Configuration

- **Static Export**: Configured in `next.config.js` with `output: 'export'`
- **Trailing Slash**: Enabled for better static hosting compatibility
- **Image Optimization**: Disabled for static export compatibility
- **Vercel Ready**: Optimized for Vercel deployment with static generation