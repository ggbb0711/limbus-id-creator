# Folder structure

id-creator(frontend, Next.js) - id-creator/src
    /StatusEffectScrapping(scrapper for status effect data)
id-creator-server(backend, ASP.NET Core)
    /Server(source code)
    /Server.Tests(tests)

Before searching for or creating files, read docs/folder-structure.md. It maps where every feature, service, config and constant lives and the exact steps to add, update or delete features and folders.


# Commands:

## Frontend(base directory)
npm run frontend:install - install frontend packages
npm run frontend:dev - start in dev mode

## Backend(base directory)
npm run backend:install - install backend packages
npm run backend:dev - run backend in dev mode

## Database(base directory)
npm run db:start - start database using docker compose locally
npm run db:stop - stop database in docker compose locally
npm run db:migrate - migrate with the lattest EFCore database migration file

## Running tests (from repo root)

    npm test                 frontend + backend
    npm run frontend:test    Jest, id-creator/
    npm run backend:test     xUnit, id-creator-server/Server.Tests

## Pass extra args after --, e.g.:
    npm run frontend:test -- path/to/file.test.ts
    npm run backend:test -- --filter "FullyQualifiedName~ClassOrMethodName"

## Linting (from repo root)

    npm run lint             frontend + backend
    npm run lint:fix         auto-fix both
    npm run frontend:lint    ESLint, id-creator/   (frontend:lint:fix to fix)
    npm run backend:lint     dotnet format --verify-no-changes, id-creator-server/   (backend:lint:fix to fix)

## IMPORTANT

- When making changes, always create new branches, even if we already on a branch that is not main, make new branch too.
- No auto commit
- Always run lint and tests after applying changes
- Assume we are on a linux system
- When in plan mode, please also include in the plan all the tests you are going to make

### Docs:

#### Folder structure:

docs/folder-structure.md

- Please read this doc before adding or changing anything in the project to understand its folder structure.

- Whenever the folder structure changes (folder added/moved/renamed/deleted, layout convention changed) or a new feature/service/controller/repository/background service is added or removed, update docs/folder-structure.md in the same change