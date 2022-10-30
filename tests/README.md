# End to end tests

## Install

```bash
yarn
# install the playwright stuff
npx playwright install
```

## Initialize

Create some test data in the database:

- Create a namepace named `testns`
- Create in the `testns` namespace a user named `testuser` with a password `testuserpwd`

Change the namespace key in `tests/conf.ts`

## Run tests

Run all the available tests:

```bash
yarn runtest
```

Run one test:

```bash
yarn runtest browser=firefox test=api/raw
```
