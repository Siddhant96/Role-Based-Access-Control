var mysql = require('mysql');

module.exports = (app,connection) => {
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
};