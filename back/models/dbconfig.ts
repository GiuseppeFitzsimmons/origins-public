
const dbconfig = {
  "development": {
    username: "postgres",
    password: "verona123",
    database: "postgres",
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
export default dbconfig