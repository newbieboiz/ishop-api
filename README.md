# Installation

Create new project

```sh
mkdir ishop
cd ishop
npm init -y
```

Install all dependencies.

```sh
npm i express cross-env module-alias helmet rimraf dotenv cors body-parser cookie-parser express-session mongoose bcryptjs jsonwebtoken convict uuid zod @casl/ability @casl/prisma
```

```sh
npm i -D typescript @types/express @types/node @types/body-parser @types/cookie-parser @types/express-session @typescript-eslint/parser @types/cors @typescript-eslint/eslint-plugin @types/bcryptjs @types/jsonwebtoken @types/convict @types/uuid eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-simple-import-sort concurrently nodemon ts-node prisma
```

Set up typescript

```sh
npx tsc --init
```
