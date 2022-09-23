# machmit

Machmit is a vuejs based web application to manage your tasks and shifts.


## Run machmit

Run the following command to start the app (it needs docker and docker-compose to be installed):

```bash

docker compose build && docker compose up -d
```
Then go to `http://localhost:8001/` in your browser to see the app.

## Development

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Project Setup

```sh
yarn
```

#### Compile and Hot-Reload for Development

```sh
yarn dev
```

#### Type-Check, Compile and Minify for Production

```sh
yarn build
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

#### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
yarn build
yarn test:e2e # or `yarn test:e2e:ci` for headless testing
```

#### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
