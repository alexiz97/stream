$(document).ready(function() {
  var socket = io();
  $.getJSON("userData",
         function(data) {
            $('.injct_login').append(data.login);
            $('.injct_email').append(data.email);      
          }); 

    $('form.default').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : $(this).attr('action'),
            data     : $(this).serialize(),
            success  : function(data) {
                alert(JSON.stringify(data));
            }
        });
    
    });


});