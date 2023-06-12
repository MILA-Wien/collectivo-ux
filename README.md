# collectivo frontend

A vue.js based web application for [collectivo](https://github.com/MILA-Wien/collectivo).

## Run collectivo-ux

Run the following command to start the app (it needs docker and docker-compose to be installed):

```bash

docker compose build && docker compose up -d
```
Then go to `http://localhost:8001/` in your browser to see the app.
## Environment variables
We have the following environment variables:
* `VITE_API_URL`: the url of the backend api
* `VITE_KEYCLOAK_URL`: the url of the keycloak server

## Development

### Requirements

Npm and nodejs need to be installed for development.

Then install yarn with `npm install -g yarn`.

### Development mode

For development mode you need to have a different setup than mentionend above.

1. In your terminal and your [collectivo repository](https://github.com/MILA-Wien/collectivo), please follow the first three steps of its README and use the following command for step three
```bash
docker compose up -d collectivo db keycloak
```
2. Please edit your `/etc/hosts/` file and add the following line
```bash
127.0.0.1 keycloak
```
3. Add some CORS-disabler Add-On to your browser e.g. [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) for Firefox or [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) for Chrome and start it in development mode
4. In your terminal run
```bash
yarn dev
```
and now open the following link in your browser
```bash
127.0.0.1:5173
```

5. Enter the user credentials mentioned below and start developing


### User credentials

To pass your local keycloak login wall in development mode you need to enter the following user credentials:

Email: `test_member_1@example.com`

Password: `test`


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Useful commands

### Project Setup

```sh
yarn install
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

If not done yet, add the following to your `/etc/hosts` file:

```sh
127.0.0.1 keycloak 127.0.0.1
```
Then run the following command to test the app:

```sh
yarn build:staging
yarn test:e2e # or `yarn test:e2e:ci` for headless testing
```

#### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
