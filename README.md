# [ts-log](https://github.com/kallaspriit/ts-log)-adapter-ava

| Branch | Status |
| ------ | ------ |
| master | [![Continuous Integration](https://github.com/userfrosting/ts-log-adapter-ava/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/userfrosting/ts-log-adapter-ava/actions?query=branch:master+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/ts-log-adapter-ava/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/ts-log-adapter-ava/branch/master) |

An adapter for the ts-log interface that pushes logging to ava.

## Install

```bash
npm i @userfrosting/ts-log-adapter-ava
```

## Usage

> **IMPORTANT**<br/>
> This is an ES module package targeting NodeJS `^12.17.0 || >=13.2.0`. Learn more at the [NodeJS ESM docs](https://nodejs.org/api/esm.html).

```js
import test from "ava";
import { logAdapter } from "@userfrosting/ts-log-adapter-ava";
import main from "./main.js";

test("example", t => {
    const result = main(logAdapter(t.log));
    t.true(result);
});
```

## API

API documentation is regenerated for every release using [API Extractor](https://www.npmjs.com/package/@microsoft/api-extractor) and [API Documenter](https://www.npmjs.com/package/@microsoft/api-documenter).
The results reside in [docs/api](./docs/api/index.md).

## Release process

Generally speaking, all releases should first traverse through `alpha`, `beta`, and `rc` (release candidate) to catch missed bugs and gather feedback as appropriate. Aside from this however, there are a few steps that **MUST** always be done.

1. Make sure [`CHANGELOG.md`](./CHANGELOG.md) is up to date.
2. Update version via `npm` like `npm version 3.0.0` or `npm version patch`.
3. `npm publish`.
4. Create release on GitHub from tag made by `npm version`.

## License

[MIT](LICENSE)
