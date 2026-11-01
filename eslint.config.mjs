import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'out/**', 'next-env.d.ts', '**/* 2.*'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Existing site files trip these rules. Per the build brief they warn instead of being edited.
  // engine/ is held to errors (see the last block).
  {
    rules: {
      'react/jsx-no-comment-textnodes': 'warn',
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['engine/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'prefer-const': 'error',
    },
  },
];

export default config;
