var mysql = require("mysql");
var express = require("express");
//var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const keys = require('./config/keys');
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/client')));

const dbconfig = {
  host: keys.host,
  user: keys.user,
  password: keys.password,
  database: keys.database
};

var connection;
function handleDisconnect() {
  connection = mysql.createConnection(dbconfig);
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }
    else {
      console.log('connection established');
    }                                    // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
handleDisconnect();
//console.log(dbconfig);

  
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname + "/client/home.html"));
});
/*
require('./routes/homeRoutes')(app,connection);
require('./routes/createRoutes')(app,connection);
require('./routes/delete_routes')(app, connection);
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

//create routes
app.post('/edit_access', (req, res) => {
  if (req.body == {}) {
    res.send('You must fill the form first.');
  }
  console.log(req.body);
  const { resource_name, role_name, can_read, can_write, can_delete } = req.body;
  connection.query(`delete from Resources_Roles where resource_name='${resource_name}' and role_name='${role_name}'`, (err, result) => {
    if (err) {
      res.send('sql error'); throw err;
    }
    connection.query(`insert into Resources_Roles(resource_name,role_name,can_read,can_write,can_delete)values('${resource_name}','${role_name}','${can_read}','${can_write}','${can_write}')`, (err, resultin) => {
      if (err) {
        res.send('sql error'); throw err;
      }
      res.send(resultin.affectedRows == 1);
    });//end of inside query
    
  });// end of top query
});

app.post('/create_user', (req, res) => {
  if (req.body == {}) {
    res.send('You must fill the form first.');
  }
  const { user_name, password } = req.body;
  connection.query(`select * from Users where user_name = '${user_name}'`, (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      connection.query(`insert into Users(user_name,password) values('${user_name}','${password}')`,
        (err, resulted, fields) => {
          if (err) throw err;
          //if (result.length == 0)
            //console.log('inside create user result lenght is 0.'); res.send({});
          console.log(resulted);
          res.send(resulted.affectedRows == 1);
        });// end of inside query.
    }//end of if
    else
      res.send(false);
  });
  
});

app.post('/create_role', (req, res) => {
  if (req.body == {}) {
    res.send('You must fill the form first.');
  }
  const { role_name} = req.body;
  connection.query(` insert ignore into Roles(role_name) values('${role_name}')`,
    (err, result, fields) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log('inside create role result length is 0.'); res.send({});
      }
      console.log(result);
      res.send(result.affectedRows == 1);
      
  });
});

app.post('/create_resource', (req, res) => {
  if (req.body == {}) {
    res.send('You must fill the form first.');
  }
  const { resource_name} = req.body;
  connection.query(` insert ignore into Resources(resource_name) values('${resource_name}')`,
    (err, result, fields) => {
      if (err) {
        res.send('sql error'); throw err;
      }
      if (result.length == 0) {
        console.log('inside create resource result length is 0.'); res.send({});
      }
      //console.log(result);
      res.send(result.affectedRows == 1);
      
  });
});
app.post('/add_user_role', (req, res) => {
    if (req.body.length == 0) { res.send('You must fill the form first'); return; }
    console.log('inside add_user_role');
    console.log(req.body);
  const { user_id, role_name } = req.body;
    connection.query(`select * from Users_Roles where user_id = ${user_id} and role_name = '${role_name}'`,
              (err, result) => {
                  if (err) throw err;
                  console.log('result of top select query.');
                  console.log(result);
                  if (result.length == 0) { //means no such user role pair exists.
                    
                    connection.query(`insert into Users_Roles(user_id,role_name) values(${user_id},'${role_name}')`,
                       (err, result) => {
                      if (err) throw err;
                      console.log(result.affectedRows);
                      res.send(result.affectedRows == 1);

                    });
                  } // end of if
                  else
                    res.send(false);
                    });// END OF TOP CONNECTION.QUERY

});
  
app.post('/remove_user_role', (req, res) => {
  if (req.body.length == 0) { res.send('You must fill the form first'); return; }
  console.log('inside remove_user_role');
   console.log(req.body);
  const { user_id, role_name } = req.body;
  connection.query(` delete from Users_Roles where user_id = ${user_id} and role_name='${role_name}'`,
    (err, result) => {
      if (err) throw err;
      console.log('after delete query.');
      if (result.affectedRows > 0)
        res.send(true);
      else
        res.send(false);
  }
  );
    
});
 // delete routes
 app.post('/delete_user', (req, res) => {
  const { user_id } = req.body;
  connection.query(`delete from Users_Roles where user_id=${user_id}`, (err, result) => {
    if (err) { res.send('sql error in deleting from Users_Roles'); throw err; };
    connection.query(`delete from Users where id = ${user_id}`, (err, resulted) => {
      if (err) { res.send('sql error in deleting from Users'); throw err; }
      res.send(resulted.affectedRows == 1);
    });
  });// end of outer query
});

app.post('/delete_role', (req, res) => {
  const { role_name } = req.body;
  connection.query(`delete from Resources_Roles where role_name = '${role_name}'`, (err, result) => {
    if (err) { res.send('sql error in delete from Resources_Roles'); throw err;}
  });
  connection.query(`delete from Users_Roles where role_name='${role_name}'`, (err, result) => {
    if (err) { res.send('sql error in deleting from Users_Roles'); throw err; };
    connection.query(`delete from Roles where role_name = '${role_name}'`, (err, resulted) => {
      if (err) { res.send('sql error in deleting from Roles'); throw err; }
      res.send(resulted.affectedRows == 1);
    });
  });// end of outer query
});

app.post('/delete_resource', (req, res) => {
  const { resource_name } = req.body;
  
  connection.query(`delete from Resources_Roles where resource_name='${resource_name}'`, (err, result) => {
    if (err) { res.send('sql error in deleting from Resource_Roles'); throw err; };
    connection.query(`delete from Resources where resource_name = '${resource_name}'`, (err, resulted) => {
      if (err) { res.send('sql error in deleting from Resources'); throw err; }
      res.send(resulted.affectedRows == 1);
    });
  });// end of outer query
});


const PORT = process.env.PORT || 5000;

const host = "0.0.0.0";

app.listen(PORT);
