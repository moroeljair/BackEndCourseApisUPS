module.exports = {
  apps: [
    {
      name: "empleados-api",

      script: "node_modules/tsx/dist/cli.mjs",
      args: "src/index.ts",

      instances: 1,

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      error_file: "/var/www/empleados-api/logs/err.log",
      out_file: "/var/www/empleados-api/logs/out.log",

      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
