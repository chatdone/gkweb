const Configs = {
  session: {
    SESSION_COOKIE_KEY: 'gk-session',
    USER_COOKIE_KEY: 'gk-session-user',
  },
  env: {
    GRAPHQL_URL:
      import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5173/graphql',
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
    NOTIFICATION_API_URL:
      import.meta.env.VITE_NOTIFICATION_API_URL ||
      'https://notification-api.sandbox.gokudos.io/api',
    WEBSITE_URL: import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173',
    GOOGLE_APP_ID: import.meta.env.VITE_GOOGLE_APP_ID,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
    STRIPE_PUBLISH_KEY: import.meta.env.VITE_STRIPE_PUBLISH_KEY,
    SENTRY_DSN:
      import.meta.env.VITE_SENTRY_DSN ||
      'https://0cc28349996c47fca02a19f27d55e861@o1239720.ingest.sentry.io/6575078',
    SENTRY_AUTH_TOKEN: import.meta.env.VITE_SENTRY_AUTH_TOKEN,
    GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    ENABLE_DEDOCO: import.meta.env.VITE_ENABLE_DEDOCO === 'true',
    DEBUG_ONBOARDING_TOOLTIP:
      import.meta.env.VITE_DEBUG_ONBOARDING_TOOLTIP === 'true',
    ENABLE_PROJECT_TEMPLATES:
      import.meta.env.VITE_ENABLE_PROJECT_TEMPLATES === 'true',
  },
  msal: {
    APP_ID: import.meta.env.VITE_MSAL_APP_ID || '',
    REDIRECT_URI:
      import.meta.env.VITE_MSAL_REDIRECT_URI || 'http://localhost:3000',
    SCOPES: ['user.read', 'files.readwrite', 'calendars.readwrite'],
  },
  v3ReleaseDate: '2022-07-31',
  GK_ENVIRONMENT: import.meta.env.VITE_GK_ENVIRONMENT || 'local',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5173',
  ENABLE_WEBSOCKETS: import.meta.env.VITE_ENABLE_WEBSOCKETS === 'true',
};

export default Configs;
