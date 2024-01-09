# STYLE GUIDE

## Formatting and Linting ##

This project uses ESLint and Prettier.
Modifications should not be made to the ESLint settup. 
Prettier should not be manually configured.

---

## File Names

File name should be camelCase: 

`fetchData.js` not `fetch_data.js`

## React Exports

Don't use `export default`. 
Be intentional that import and export names match in React.

## React Imports

### Actual Style

``` javascript
import React, { useEffect } from "react";
//
import { useStore } from "zustand"
//
import SystemPrompt from "./systemPrompt";
import { seeds } from "../../utility/seeds";
import { SeedPaper } from "./login_styles";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
//
import { Typography } from "@mui/material"
//
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
// ----------------------------------------------------------------------
```

### Annotated for Clarity

``` javascript
// react
import React, { useEffect } from "react";

// stuff from libraries
import { useStore } from "zustand"

// components, utilities, and close relatives
import SystemPrompt from "./systemPrompt";
import { seeds } from "../../utility/seeds";
import { SeedPaper } from "./login_styles";
import { BasicBox, OutlinePaper } from "../../mui/reusable";

// components from MUI 5
import { Typography } from "@mui/material"

// MUI 5 iconography
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

// divider line
// ----------------------------------------------------------------------
```

---
