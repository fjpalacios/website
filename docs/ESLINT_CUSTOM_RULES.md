# Custom ESLint Rules

This document describes the custom ESLint rules implemented for this project.

## Overview

Custom rules are stored in the `eslint-rules/` directory and registered in `eslint.config.mjs` as the `astro-script-safety` plugin.

## Rules

### `no-inline-define-vars`

**Type:** Error  
**Category:** Possible Errors

#### Description

Prevents the problematic pattern of combining `is:inline` with `define:vars` in Astro script tags, which causes scope issues and script execution failures in production builds.

#### Problem

When combining `is:inline` with `define:vars` in Astro script tags:

```astro
<!-- ❌ BAD - Will fail in production -->
<script is:inline define:vars={{ myVar }}>
  console.log(myVar); // Scope issue - won't work
</script>
```

**Why it fails:**

- `define:vars` auto-wraps code in an IIFE (Immediately Invoked Function Expression)
- `is:inline` prevents Astro from processing the script normally
- The combination creates double-wrapping that breaks variable scope in production

**Historical bugs caused by this pattern:**

1. **Code blocks bug** - Code copy buttons stopped working ([BUGFIX_CODE_BLOCKS.md](./BUGFIX_CODE_BLOCKS.md))
2. **Search modal bug** - Search modal failed to open ([BUGFIX_SEARCH_MODAL.md](./BUGFIX_SEARCH_MODAL.md))

#### Solution

Use `set:html` with `JSON.stringify()` to inject variables, then access them in a separate script:

```astro
<!-- ✅ GOOD - Works in all environments -->
<script is:inline set:html={`window.__CONFIG__ = ${JSON.stringify({ myVar })};`} />
<script>
  const myVar = window.__CONFIG__?.myVar || defaultValue;
  console.log(myVar); // Works correctly
</script>
```

#### Configuration

The rule is already configured in `eslint.config.mjs`:

```javascript
plugins: {
  "astro-script-safety": astroScriptSafety,
},
rules: {
  "astro-script-safety/no-inline-define-vars": "error",
}
```

#### Examples

**❌ Incorrect:**

```astro
<script is:inline define:vars={{ theme: currentTheme }}>
  document.documentElement.classList.add(theme);
</script>
```

**✅ Correct:**

```astro
<script is:inline set:html={`window.__THEME__ = ${JSON.stringify({ theme: currentTheme })};`} />
<script>
  const theme = window.__THEME__?.theme || "light";
  document.documentElement.classList.add(theme);
</script>
```

#### Implementation Details

The rule works by:

1. **For `.astro` files:** Checks JSX AST nodes for `<script>` elements with both `is:inline` and `define:vars` attributes
2. **For `.js/.ts` files:** Checks template literals and string literals that might contain inline Astro script tags

The rule handles:

- Namespaced JSX attributes (`is:inline`, `define:vars`)
- Both `.astro` component files and JavaScript/TypeScript files
- Template strings that might contain Astro markup

#### Testing

To test the rule, create a temporary file with the problematic pattern:

```bash
echo '<script is:inline define:vars={{ test: "value" }}>console.log(test);</script>' > test.astro
bun x eslint test.astro
# Should show: error  Avoid using 'is:inline' with 'define:vars'...
rm test.astro
```

## Adding New Custom Rules

To add a new custom rule:

1. **Create the rule file** in `eslint-rules/`:

```javascript
// eslint-rules/my-new-rule.js
export default {
  meta: {
    type: "problem",
    docs: { description: "Rule description" },
    messages: { myMessage: "Error message" },
  },
  create(context) {
    return {
      // AST visitors
    };
  },
};
```

2. **Register the rule** in `eslint-rules/index.js`:

```javascript
import myNewRule from "./my-new-rule.js";
import noInlineDefineVars from "./no-inline-define-vars.js";

export default {
  rules: {
    "no-inline-define-vars": noInlineDefineVars,
    "my-new-rule": myNewRule, // Add here
  },
};
```

3. **Enable the rule** in `eslint.config.mjs`:

```javascript
rules: {
  "astro-script-safety/no-inline-define-vars": "error",
  "astro-script-safety/my-new-rule": "warn", // Add here
}
```

## References

- [ESLint Custom Rules Documentation](https://eslint.org/docs/latest/extend/custom-rules)
- [Astro ESLint Parser](https://github.com/ota-meshi/astro-eslint-parser)
- Project bug fixes: [BUGFIX_CODE_BLOCKS.md](./BUGFIX_CODE_BLOCKS.md), [BUGFIX_SEARCH_MODAL.md](./BUGFIX_SEARCH_MODAL.md)
