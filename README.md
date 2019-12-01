# Custom Visuals PBI

## Code from Jorge's Channel [Power BI Custom Visual Fundamentals](https://www.youtube.com/playlist?list=PL6z9i4iVbl8C2mtjFlH3ECb3q00eFDLAG) adjusted for d3@5 and pbi version 3.1.7

Start with:

1. pbiviz new mlc
"error  Unable to create visual. Error: Package install failed." ->  install the missing packages manually
2. cd mlc
3. npm install core-js
4. npm install powerbi-visuals-utils-dataviewutils
5. pbiviz start
6. Install the latest version of d3: npm install --save d3@5
7. go to pbiviz.json and update the externalJS attribute with the d3.min.js path: "node_modules/d3/dist/dr.min.js"
8. next we need to install the new type definitions for D3.js: npm install --save-dev @types/d3@5 
9. install bootstrap: npm install bootstrap --save
10. in visual.less import bootstrap: @import (less) "node_modules/bootstrap/dist/css/bootstrap.css";
11. we can start creating our chart. In visual.ts import d3:
import * as d3 from "d3";
import { values } from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

Refer to [Migrating to powerbi-visuals-tools 3.x](https://microsoft.github.io/PowerBI-visuals/docs/how-to-guide/migrating-to-powerbi-visuals-tools-3-0/) to get started with the new version of powerbi-visuals-tools.

Reference: 
- Proving Ground [Custom Power BI Visual - Space Plan Viewer](https://www.youtube.com/watch?v=izCFlEjT5wo)
- Power BI BIM [Vcad Architecture](https://www.youtube.com/watch?v=1TO5lsjSdVw)
- BIM Services [Full Ifc data navigation into Power BI](https://www.youtube.com/watch?v=0m7F8I_NK2k)
- BIM Services [PowerBI and Bim - How we built a report with PowerBi and Vcad viewer](https://youtu.be/ydoLNe47SXE)


