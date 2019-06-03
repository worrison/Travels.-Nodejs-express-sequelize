module.exports = {
    development: {
        username: "root",
        password: "",
        database: "edreams",
        host: "localhost",
        dialect: 'mysql',
    },
    test: {
      dialect: "sqlite",
      storage: ":memory:"
    },
    production: {
      username: "edreams",
      password: "123456",
      database: "edreams",
      host: "localhost",
      dialect: 'mysql',
    }
  };