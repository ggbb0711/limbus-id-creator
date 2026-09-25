import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import checkFile from "eslint-plugin-check-file";

export default defineConfig([
  // Includes react, react-hooks, @next/next and typescript-eslint rules
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "build/**", "next-env.d.ts", "StatusEffectScrapping/**"]),
  {
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // React Compiler rules from eslint-plugin-react-hooks v7. Existing code predates them (setState in
      // effects, refs read during render); keep them visible as warnings until those components are refactored.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      // Enforce PascalCase for component files (tsx/jsx). Next's app/ files (page.tsx, layout.tsx) are excluded.
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/{components,features}/**/*.{tsx,jsx}": "PASCAL_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      // camelCase folders everywhere in src, and Next's route naming under app/
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/!(app)/**/": "CAMEL_CASE",
          "src/app/**/": "NEXT_JS_APP_ROUTER_CASE",
        },
      ],
    },
  },
  // Exclude index files from naming convention
  {
    files: ["**/index.{ts,tsx,js,jsx}"],
    rules: {
      "check-file/filename-naming-convention": "off",
    },
  },
  // Exclude hook files (use* camelCase) in hooks folders
  {
    files: ["**/hooks/use*.{ts,tsx,js,jsx}"],
    rules: {
      "check-file/filename-naming-convention": "off",
    },
  },
  // The card is captured by modern-screenshot, which needs plain <img> (no lazy loading / srcset)
  {
    files: ["src/features/cardCreator/**"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);
