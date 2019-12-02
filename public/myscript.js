$(document).ready( ()=> {

  
  $.get("/fetch_users",(data, textStatus, jqXHR) =>{
  //console.log(data);
  let options = "<option value=''>Select</options>";
  data.forEach(element => {
  options += "<option value='" + element.id + "'>" + element.user_name + "</option>\n";
  });
  $("#users").html(options);   
  });
  
  $.get("/fetch_resources",(data, textStatus, jqXHR) =>{
  //console.log(data);
  let options = "<option value=''>Select</options>";
  data.forEach(element => {
  options += "<option value='" + element.resource_name + "'>" + element.resource_name + "</option>\n";
  });
  $("#resources").html(options);   
  });
  
  $.get("/fetch_all_roles",(data, textStatus, jqXHR) =>{
    //console.log(data);
    if(data.length == 0)
      alert('No Roles defined yet.');
    else{
    let options = "<option value=''>Select</options>";
    data.forEach(element => {
    options += "<option value='" + element.role_name + "'>" + element.role_name + "</option>\n";
    });
    $("#all_roles").html(options);
    }   
  });
  
  //function to submit form.
  
  }); // end of $(document).ready()
  
  function getRoles(value){
   //console.log(value);
   
   $.get("/fetch_roles", {userid:value},function(data) {
   let options = "<option value=''>Select</options>";
   data.forEach(element => {
   options += "<option value='" + element.role_name + "'>" +element.role_name + "</option>\n";
   });
   $("#roles").html(options);
  
   });
   
  }
  