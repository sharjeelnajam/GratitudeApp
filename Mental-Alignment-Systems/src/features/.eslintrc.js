/**
 * Feature Module ESLint Rules
 * 
 * Additional rules for feature modules to ensure decoupling.
 */

module.exports = {
  rules: {
    // Features should not import from other features
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './**',
            from: '../**',
            except: ['../shared/**', '../domain/**', '../services/**', '../theme/**', '../config/**'],
            message: 'Features should only import from shared, domain, services, theme, and config modules.',
          },
        ],
      },
    ],
  },
};
