var mysql = require("mysql");


module.exports = (app,connection) => {
  
  // Routes starting from here.
  /*
  app.post('/test_route', (req, res) => {
    console.log('inside test');
    console.log(req.body);
    res.redirect('/');

  });
  */
  app.get("/fetch_users", (request, response) => {
    //console.log('inside fetch_users');
    connection.query(
      "SELECT id, user_name FROM Users",
      (err, result, fields) => {
        if (err) throw err;
        //console.log("inside fetch users");
        //console.log(result);
        response.send(result);
      }
    );
  }); // end of fetch_users

  app.get("/fetch_roles", (req, res) => {
    const userid = req.query.userid;
      connection.query(
        "SELECT role_name FROM Users_Roles WHERE user_id = ?",
        [userid],
        (err, result, fields) => {
          if (err) throw err;
          //console.log("inside fetch roles");
          //console.log(result);
          res.send(result);
        }
      );
  }); // end of fetch_roles

  app.get("/fetch_resources", (req, res) => {
      connection.query(
        "SELECT resource_name FROM Resources",
        (err, result, fields) => {
          if (err) throw err;
          //console.log("inside fetch roles");
          //console.log(result);
          res.send(result);
        }
      );
  }); // end of fetch_resources
  app.post('/check_access', (req, res) => {
    //console.log(req.query);
    if (req.body == {}) {
      res.send('You must fill the form first.');
    }
    const { role_name, resource_name, action } = req.body;
    //console.log(role_name);
    connection.query(
      
      `SELECT ${action} FROM Resources_Roles WHERE role_name = '${role_name}' AND resource_name = '${resource_name}'`,
      
      (err, result, fields) => {
        if (err) throw err;
        console.log("inside check access");
        console.log(result);
        //console.log(fields);
        res.send(result);
      }
    );
    
  });
  
  app.get("/fetch_all_roles", (req, res) => {
    connection.query(
      "SELECT role_name FROM Roles",
      (err, result, fields) => {
        if (err) throw err;
        //console.log("inside fetch roles");
        //console.log(result);
        res.send(result);
      }
    );
  });
  

};