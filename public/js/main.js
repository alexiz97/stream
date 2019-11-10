$(document).ready(function() {

  //var socket = io();

  $.get("/api/user_data").then(function(data) {
    $(".member-name").text("Witaj, " + data.email);
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