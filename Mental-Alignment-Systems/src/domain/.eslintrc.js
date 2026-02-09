/**
 * Domain Module ESLint Rules
 * 
 * Additional rules for domain models to ensure purity.
 */

module.exports = {
  rules: {
    // Domain should be pure - no external dependencies
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './**',
            from: [
              '../features/**',
              '../services/**',
              '../shared/ui/**',
              '../theme/**',
            ],
            message: 'Domain models should be pure. No dependencies on features, services, UI, or theme.',
          },
        ],
      },
    ],
    // Domain should not have side effects
    'no-console': 'error',
  },
};
