module.exports = {
  // Tell ESLint this is the root config (don't look for configs in parent directories)
  root: true,

  // Environment: Globals that are predefined
  env: {
    node: true,        // Allow Node.js globals (process, __dirname, require, etc.)
    es2022: true,      // Enable ES2022 syntax (top-level await, etc.)
    jest: true,        // Allow Jest globals (describe, it, expect, etc.)
  },

  // Parser: How to understand the code
  parser: '@typescript-eslint/parser',  // Use TypeScript parser instead of default JS parser
  
  parserOptions: {
    ecmaVersion: 2022,                  // Use ECMAScript 2022 features
    sourceType: 'module',               // Allow import/export statements
    project: './tsconfig.json',         // Use tsconfig.json for type information
  },

  // Plugins: Add extra rules
  plugins: [
    '@typescript-eslint',               // TypeScript-specific rules
    'prettier',                         // Prettier integration
  ],

  // Extends: Use predefined rule sets
  extends: [
    'eslint:recommended',               // ESLint's recommended rules (basic JS best practices)
    'plugin:@typescript-eslint/recommended',  // TypeScript best practices
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Advanced TS rules (uses type info)
    'prettier',                         // Disable ESLint rules that conflict with Prettier
    'plugin:prettier/recommended',      // Enable Prettier rules
  ],

  // Custom Rules: Override or add specific rules
  rules: {
    /* ===== TypeScript-Specific Rules ===== */
    
    // Allow 'any' type (sometimes necessary, especially during development)
    '@typescript-eslint/no-explicit-any': 'warn',  // 'warn' instead of 'error' = yellow squiggly
    
    // Allow unused variables if they start with underscore (e.g., _req, _id)
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { 
        argsIgnorePattern: '^_',        // Ignore function args starting with _
        varsIgnorePattern: '^_',        // Ignore variables starting with _
      },
    ],
    
    // Allow non-null assertions (!) when you're sure a value exists
    '@typescript-eslint/no-non-null-assertion': 'off',
    
    // Require explicit return types on functions (good practice but can be annoying)
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // Require explicit types on exported functions/classes (recommended for libraries)
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // Allow @ts-ignore comments (sometimes needed for third-party library issues)
    '@typescript-eslint/ban-ts-comment': 'warn',
    
    // Enforce consistent type imports (import type { User } from './types')
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports' },
    ],
    
    /* ===== General JavaScript/Node.js Rules ===== */
    
    // Allow console.log (useful for debugging, can change to 'error' in production)
    'no-console': 'off',
    
    // Warn about debugger statements (should remove before production)
    'no-debugger': 'warn',
    
    // Enforce === instead of == (strict equality)
    'eqeqeq': ['error', 'always'],
    
    // Disallow var (use const/let instead)
    'no-var': 'error',
    
    // Prefer const over let when variable is never reassigned
    'prefer-const': 'warn',
    
    // Disallow multiple empty lines (max 1)
    'no-multiple-empty-lines': ['error', { max: 1 }],
    
    // Require curly braces for all control statements (if, for, while, etc.)
    'curly': ['error', 'all'],
    
    /* ===== Prettier Integration ===== */
    
    // Show Prettier formatting issues as ESLint errors
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',              // Handle Windows (CRLF) vs Unix (LF) line endings automatically
      },
    ],
  },

  // Override rules for specific files/patterns
  overrides: [
    {
      // Less strict rules for test files
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',  // Allow 'any' in tests
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
    {
      // Less strict rules for config files
      files: ['**/*.config.js', '**/*.config.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',  // Allow require() in config files
      },
    },
  ],

  // Ignore these files/folders
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.js',                             // Ignore compiled JS files (only lint TS)
    'coverage/',                        // Ignore test coverage reports
    '.env',
  ],
};

