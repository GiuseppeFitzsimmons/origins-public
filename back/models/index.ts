import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const dbconfig : any = {
  "development": {
    username: "docker",
    password: "docker",
    database: "originsdb",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  "test": {
    username: "postgres",
    password: "verona123",
    database: "postgres",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  "container": {
    username: "docker",
    password: "docker",
    database: "originsdb",
    host: "pg_container",
    dialect: "postgres"
  },
  "production": {
    username: "docker",
    password: "docker",
    database: "originsdb",
    host: "host.docker.internal",
    dialect: "postgres"
  }
}

const config:any=dbconfig[env];
console.log("config", config);

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);
  
export { Sequelize, sequelize };