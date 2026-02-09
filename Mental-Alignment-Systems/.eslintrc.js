/**
 * ESLint Configuration
 * 
 * Strict linting rules for code quality and safety.
 * Enforces module boundaries and feature decoupling.
 */

module.exports = {
  root: true,
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // TypeScript strict rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Import rules - enforce module boundaries
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Features cannot import from other features
          {
            target: './src/features/*',
            from: './src/features/*',
            except: ['./src/features/*/index.ts'],
            message: 'Features should not import from other features directly. Use shared modules instead.',
          },
          // Domain cannot import from features, services, or UI
          {
            target: './src/domain/**',
            from: ['./src/features/**', './src/services/**', './src/shared/ui/**'],
            message: 'Domain models should not import from features, services, or UI.',
          },
          // Services cannot import from features
          {
            target: './src/services/**',
            from: './src/features/**',
            message: 'Services should not import from features. Features depend on services, not vice versa.',
          },
          // Shared UI cannot import from features
          {
            target: './src/shared/ui/**',
            from: './src/features/**',
            message: 'Shared UI should not import from features. Features depend on shared UI, not vice versa.',
          },
        ],
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/domain/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/services/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/shared/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/features/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/theme/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/config/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'prefer-destructuring': ['warn', { object: true, array: false }],

    // React/React Native specific
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off', // Using TypeScript for prop validation
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'build/',
    '*.config.js',
  ],
};
