# THREE-CSGMesh

This repo is originally forked from https://github.com/manthrax/THREE-CSGMesh which contains work,

-   Copyright 2011 Evan Wallace (http://madebyevan.com/), MIT license.
-   Copyright 2020 Michael Schlachter (https://github.com/manthrax), MIT license.

My modifications,

-   Started with CSGMesh.js from https://github.com/manthrax/THREE-CSGMesh/blob/master/CSGMesh.js
-   Converted to TypeScript by adding type annotations to all variables
-   Converted `var` to `const` and `let`
-   More Three.js integration (THREE r121)
-   Much Refactoring
-   New GitHub repo
-   Working Examples
-   support for three r141

## Constructive Solid Geometry

Perform binary operations on mesh geometries. Works with geometries of base type `THREE.BufferGeometry` only.

-   [Union](#Union) : Return a new CSG solid consisting of A and B
-   [Subtract](#Subtract) : Return a new CSG solid where B is subtracted from A
-   [Intersect](#Intersect) : Return a new CSG solid where both A and B overlap

Example 1 : https://sbcode.net/threejs/csg/

Example 2 : https://sbcode.net/threejs/engraving/

![Example](docs/csg.jpg)

## Download `CSGMesh.js` from CDN

```
import { CSG } from 'https://cdn.jsdelivr.net/gh/Sean-Bradley/THREE-CSGMesh@master/dist/client/CSGMesh.js'
```

## Download Project

```bash
git clone https://github.com/Sean-Bradley/THREE-CSGMesh.git
cd THREE-CSGMesh
npm install
npm run dev
```

Visit http://127.0.0.1:8080

This is a TypeScript project consisting of two subprojects with their own `tsconfig.json`

To edit the client `./src/client/client.ts`. If you started using `npm run dev`, changes will be auto rebuilt and your browser refreshed due to Webpack hot module reloading.

The server component in folder `./src/server/` is not used in development mode. It is useful if you want to run the production build through a NodeJS express server. See `./src/server/server.ts` for further instructions.

## Operations

### Union

Return a new CSG solid consisting of A and B

    A.union(B)

    +-------+            +-------+
    |       |            |       |
    |   A   |            |       |
    |    +--+----+   =   |       +----+
    +----+--+    |       +----+       |
         |   B   |            |       |
         |       |            |       |
         +-------+            +-------+

### Subtract

Return a new CSG solid where B is subtracted from A

    A.subtract(B)

    +-------+            +-------+
    |       |            |       |
    |   A   |            |       |
    |    +--+----+   =   |    +--+
    +----+--+    |       +----+
         |   B   |
         |       |
         +-------+

### Intersect

Return a new CSG solid where both A and B overlap

    A.intersect(B)

    +-------+
    |       |
    |   A   |
    |    +--+----+   =   +--+
    +----+--+    |       +--+
         |   B   |
         |       |
         +-------+

## Three.js TypeScript Course

Visit https://github.com/Sean-Bradley/Three.js-TypeScript-Boilerplate for a Three.js TypeScript boilerplate containing many extra branches that demonstrate many examples of Three.js.

> To help support this Three.js example, please take a moment to look at my official Three.js TypeScript course at

[![Three.js TypeScript Course](docs/threejs-course-image.png)](https://www.udemy.com/course/threejs-tutorials/?referralCode=4C7E1DE91C3E42F69D0F)

[Three.js and TypeScript](https://www.udemy.com/course/threejs-tutorials/?referralCode=4C7E1DE91C3E42F69D0F)

**Discount Coupons** @ [https://sbcode.net/coupons](https://sbcode.net/coupons)
