module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'postgres'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'govportal_cms'),
      user: env('DATABASE_USERNAME', 'govportal'),
      password: env('DATABASE_PASSWORD', 'GovPortal@2025'),
      ssl: env.bool('DATABASE_SSL', false),
      schema: 'public',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
});