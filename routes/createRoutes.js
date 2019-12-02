var mysql = require("mysql");

module.exports = (app,connection) => {

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
  
};