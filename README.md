# hi.domains

> 管理员与经纪人后台已实现。入口、权限配置、订单流程和验证说明见 [后台使用文档](docs/ADMIN_BROKER.md)。下方为项目早期说明，部分功能状态已过时。

AI Domain Intelligence Platform.

This repository contains the first-stage website framework for `hi.domains`.
It uses Next.js, TypeScript, App Router and Tailwind CSS.

## Current Scope

Included:

- Home page
- Login page
- Signup page
- Dashboard shell
- Pricing page
- Responsive SaaS-style UI

Not included yet:

- AI analysis
- Database
- Payments
- User system
- API routes

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Routes

- `/`
- `/login`
- `/signup`
- `/dashboard`
- `/pricing`

## Environment

No environment variables are required for the current phase. See `.env.example`.

## Notes

The Analyze, Login, Signup and Dashboard actions are static UI placeholders.
