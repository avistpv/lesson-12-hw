# Task List Application
## Project Structure

```
lesson-12-hw/
├── src/
│   ├── app.ts                 # Express application setup
│   ├── server.ts              # Server entry point
│   ├── errors.ts              # Custom error class
│   ├── config/
│   │   └── database.ts        # Database configuration
│   ├── models/
│   │   ├── task.model.ts      # Task Sequelize model
│   │   └── user.model.ts      # User Sequelize model
│   ├── controllers/
│   │   └── task.controller.ts # Task route handlers
│   ├── services/
│   │   └── task.service.ts    # Task business logic
│   ├── routes/
│   │   └── task.routes.ts     # Task API routes
│   └── types/
│       └── task.types.ts      # Task type definitions
├── tests/
│   └── tasks.test.ts          # Integration tests
├── package.json
├── tsconfig.json              # Main TypeScript configuration
├── tsconfig.app.json          # Application TypeScript config
├── tsconfig.node.json         # Node.js TypeScript config
├── tsconfig.test.json         # Test TypeScript config
└── jest.config.js             # Jest test configuration
```
