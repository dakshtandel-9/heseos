import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // public/media/draco holds three's vendored Draco decoder.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/media/draco/**']),
]);

export default eslintConfig;
