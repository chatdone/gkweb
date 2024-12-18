[![sandbox](https://github.com/GoKudos/web/actions/workflows/deploy.yml/badge.svg?branch=sandbox&event=push)](https://github.com/GoKudos/web/actions/workflows/deploy.yml) [![Deploy](https://github.com/GoKudos/web/actions/workflows/deploy.yml/badge.svg?branch=staging&event=push)](https://github.com/GoKudos/web/actions/workflows/deploy.yml)

# web
Frontend v3

# Folder Structure
```
web/
├── .husky
├── node_modules
├── public/
│   ├── .well-known/
│   │   ├── apple-app-site-association
│   │   ├── assetlinks.json
│   │   └── microsoft-identity-association.json
│   ├── favicon.ico
│   ├── pwa-192x192
│   └── pwa-512x512
├── src/
│   ├── assets/
│   │   ├── <filename>.<extension>
│   │   └── index.ts
│   ├── components/
│   │   ├── <ComponentName>/
│   │   │   ├── <ComponentName>.module.less
│   │   │   ├── <ComponentName>.test.tsx
│   │   │   ├── <ComponentName>.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── configs/
│   │   └── index.ts
│   ├── constants/
│   │   └── <name>.constants.ts
│   ├── css/
│   │   └── <name>.css
│   ├── generated/
│   │   ├── graphql-types.ts
│   │   └── schema.graphql
│   ├── graphql/
│   │   └── fragments.ts
│   ├── hooks/
│   │   ├── use<HookName>.tsx
│   │   ├── use<HookName>.test.tsx
│   │   └── index.ts
│   ├── locale/
│   │   ├── <language>.json
│   │   └── index.ts
│   ├── navigation/
│   │   ├── navigation.ts
│   │   └── Router.tsx
│   ├── pages/
│   │   ├── <PageName>/
│   │   │   ├── <PageComponent>.tsx
│   │   │   ├── <PageName>.tsx
│   │   │   ├── <PageName>.module.less
│   │   │   └── index.ts
│   │   └── <module_name>/
│   │       └── <PageName>/
│   │           ├── <PageComponent>/
│   │           │   ├── <PageComponent>.module.less
│   │           │   ├── <PageComponent>.tsx
│   │           │   └── index.ts
│   │           ├── <PageName>.tsx
│   │           ├── <PageName>.module.less
│   │           └── index.ts
│   ├── services/
│   │   ├── integrations/
│   │   │   ├── <integration>.service.test.ts
│   │   │   └── <integration>.service.ts
│   │   ├── <name>.service.test.ts
│   │   ├── <name>.service.ts
│   │   └── index.ts
│   ├── stores/
│   │   └── use<Name>Store.ts
│   ├── test-utils/
│   │   ├── index.ts
│   │   └── setupTests.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── <name>.utils.test.ts
│   │   └── <name>.utils.ts
│   ├── index.less
│   ├── main.tsx
│   ├── setupApp.ts
│   └── vite-env.d.ts
├── .prettierrc
├── codegen.yml
├── index.html
├── MakeFile
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.prod.json
├── vite.config.ts
└── yarn.lock
```
