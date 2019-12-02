var connection = require("../connection");
module.exports = app => {
  app.post("/auth", (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
      connection.query(
        "SELECT * FROM Users WHERE user_name = ? AND password = ?",
        [username, password],
        (error, results, fields) => {
          if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = username;
            response.redirect("/home");
          } else {
            response.send("Incorrect Username and/or Password!");
          }
          response.end();
        }
      );
    } else {
      response.send("Please enter Username and Password!");
      response.end();
    }
  });
};
