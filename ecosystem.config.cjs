module.exports = {
  apps: [
    {
      name: "empleados-api",

      script: "node_modules/tsx/dist/cli.mjs",
      args: "src/index.ts",

      instances: 1,

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      error_file: "/var/www/empleados-api/shared/logs/err.log",
      out_file: "/var/www/empleados-api/shared/logs/out.log",

      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "18.225.157.243",
      ref: "origin/main",

      repo: "git@github.com:moroeljair/BackEndCourseApisUPS.git",

      path: "/var/www/empleados-api",

      "post-deploy":
        "mkdir -p /var/www/empleados-api/shared/logs && ln -sfn /var/www/empleados-api/shared/.env .env && npm ci && pm2 startOrReload ecosystem.config.cjs --env production && pm2 save",

      ssh_options:
        "IdentityFile=/home/jair/Documentos/GitHub/Maestria/APIS/aws/instancia_de_prueba_1/mi-servidor.pem",
    },
  },
};
