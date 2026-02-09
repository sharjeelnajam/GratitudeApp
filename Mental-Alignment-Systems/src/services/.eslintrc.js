/**
 * Services Module ESLint Rules
 * 
 * Additional rules for services to ensure they can evolve server-side.
 */

module.exports = {
  rules: {
    // Services should not depend on features
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './**',
            from: '../features/**',
            message: 'Services should not depend on features. Services can be moved server-side independently.',
          },
          {
            target: './**',
            from: '../shared/ui/**',
            message: 'Services should not depend on UI components. Services are logic-only.',
          },
        ],
      },
    ],
  },
};
