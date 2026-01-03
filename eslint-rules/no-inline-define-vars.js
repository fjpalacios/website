/**
 * ESLint Custom Rule: no-inline-define-vars
 *
 * Prevents the problematic pattern of combining is:inline with define:vars
 * in Astro script tags, which causes scope issues and script execution failures.
 *
 * @see docs/BUGFIX_CODE_BLOCKS.md
 * @see docs/BUGFIX_SEARCH_MODAL.md
 */

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow is:inline with define:vars in Astro script tags",
      category: "Possible Errors",
      recommended: true,
      url: "https://github.com/fjpalacios/website/blob/main/docs/BUGFIX_CODE_BLOCKS.md",
    },
    messages: {
      noInlineDefineVars:
        "Avoid using 'is:inline' with 'define:vars'. This causes scope issues. Use 'set:html' with JSON.stringify() instead.",
    },
    schema: [],
    fixable: null,
  },

  create(context) {
    return {
      // For .astro files: Check JSXElement nodes (script tags in Astro are parsed as JSX)
      JSXElement(node) {
        const openingElement = node.openingElement;
        if (!openingElement || openingElement.name.name !== "script") {
          return;
        }

        let hasIsInline = false;
        let hasDefineVars = false;

        // Check attributes
        for (const attr of openingElement.attributes) {
          if (attr.type === "JSXAttribute") {
            let attrName = "";

            // Handle namespaced attributes (e.g., is:inline, define:vars)
            if (attr.name.type === "JSXNamespacedName") {
              attrName = `${attr.name.namespace.name}:${attr.name.name.name}`;
            } else {
              attrName = attr.name.name;
            }

            if (attrName === "is:inline") {
              hasIsInline = true;
            }

            if (attrName === "define:vars") {
              hasDefineVars = true;
            }
          }
        }

        // Report if both attributes are present
        if (hasIsInline && hasDefineVars) {
          context.report({
            node: openingElement,
            messageId: "noInlineDefineVars",
          });
        }
      },

      // For regular JS/TS files: Check template literals that might contain Astro script tags
      TemplateLiteral(node) {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText(node);

        if (text.includes("<script") && text.includes("is:inline") && text.includes("define:vars")) {
          context.report({
            node,
            messageId: "noInlineDefineVars",
          });
        }
      },

      // Also check string literals in regular JS/TS files
      Literal(node) {
        if (typeof node.value === "string") {
          const text = node.value;

          if (text.includes("<script") && text.includes("is:inline") && text.includes("define:vars")) {
            context.report({
              node,
              messageId: "noInlineDefineVars",
            });
          }
        }
      },
    };
  },
};
