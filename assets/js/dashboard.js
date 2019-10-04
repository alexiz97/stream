$(document).ready(function() {
    var socket = io();

    function wypelnijTabele(data){
        $('.raporty_head').empty();
        $('.raporty_table').empty();
        data.header.forEach(e => {
            $('.raporty_head').append(`
              <th scope="col">${e}</th>
          `)
        })
        data.success.forEach(el => {
            $('.raporty_table').append(`
            <tr>
            `)
            data.entity.forEach(en => {
                $('.raporty_table').append(`
                    <td>${el[en]}</td>
                `)
            });
            $('.raporty_table').append(`
            </tr>
            `)
        });
    }

    $('form.raport').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : $(this).attr('action'),
            data     : $(this).serialize(),
            success  : function(data) {
                wypelnijTabele(data);
            }
        });
    
    });

    rysujMape();
    function drawTextBG(ctx, txt, font, x, y) {    
        ctx.save();
        ctx.font = font;
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#f50';
        var width = ctx.measureText(txt).width;
        ctx.fillRect(x, y, width, parseInt(font, 10));
        ctx.fillStyle = '#000';
        ctx.fillText(txt, x, y);
        ctx.restore();
    }
    function rysujMape(){
        let c = document.getElementById("canvas");
        var img = new Image();
        let ctx = c.getContext("2d");
        img.src = '/assets/images/mapa.png';
        img.onload = function(){
            ctx.drawImage(img, 0, 0);
            $.getJSON("api/getRoweryData",
                function(data) {
                    if(!data.error){
                        let rowery = data.success;
                        rowery.forEach(element => {
                            ctx.beginPath();
                            let coords = element.lokalizacja.split(';')
                            let stan = element.id_stan;
                            ctx.moveTo(coords[0], coords[1]);
                            ctx.arc(coords[0], coords[1], 10, 0, 2 * Math.PI, false);
                            if(stan === 1){
                                ctx.fillStyle = 'green';
                            }
                            else if(stan === 2){
                                ctx.fillStyle = 'orange';
                            }
                            else{
                                ctx.fillStyle = 'red';
                            }
                            ctx.fill();
                            ctx.fillStyle = "white";
                            ctx.font = "13px Arial";
                            ctx.textAlign='center';
                            ctx.textBaseline='middle';
                            ctx.fillText(element.id_rower, coords[0], coords[1]);
                        });
                    }
                    else{
                        alert(data.error);
                    }
                });
            $.getJSON("api/getStacjeData",
            function(data) {
                if(!data.error){
                    let stacje = data.success;
                    stacje.forEach(element => {
                        ctx.beginPath();
                        let coords = element.lokalizacja.split(';')
                        let X = new Number(coords[0]);
                        let Y = new Number(coords[1]);
                        drawTextBG(ctx, element.nazwa, "Arial", X, Y);
                    });
                }
                else{
                    alert(data.error);
                }
            });
        };
        
    }
    $('.switch').click(()=>{
        let next = $(this.activeElement).attr('id');
        let prev = $('#prev');
        $('.active').removeClass('active');
        $(this.activeElement).parent().addClass('active');
        switchView(prev, next);
    })
    function switchView(prev, next){
      $(prev).hide();
      $('.'+next).show();
      $(prev).removeAttr('id');
      $('.'+next).attr('id', 'prev');
      dataInject(next);
  }
    $(document).on('click','.edit_user', ()=>{
        let id = $(this.activeElement).attr('konto_id');
        let data = {"id_konto": id};
        $.getJSON("api/fullUserData", data, 
         function(data) {
            if(!data.error){
                data = data.success[0];
                for(let e in data){
                    $('#e_'+e).val(data[e]);
                }
            }
            else{
                alert(data.error);
            } 
          });
    })
    $(document).on('click','.delete_user', ()=>{
        let id = $(this.activeElement).attr('konto_id');
        let data = {"id_konto": id};
        $.getJSON("api/deleteUser", data, 
         function(data) {
            if(!data.error){
                userListing();
            }
            else{
                alert(data.error);
            } 
          });
    })
    $(document).on('click','.edit_rower', ()=>{
        let id = $(this.activeElement).attr('rower_id');
        let data = {"id_rower": id};
        $.getJSON("api/fullRowerData", data, 
         function(data) {
            if(!data.error){
                data = data.success[0];
                for(let e in data){
                    $('#r_'+e).val(data[e]);
                }
            }
            else{
                alert(data.error);
            } 
          });
    })
    $(document).on('click','.delete_rower', ()=>{
        let id = $(this.activeElement).attr('rower_id');
        let data = {"id_rower": id};
        $.getJSON("api/deleteRower", data, 
         function(data) {
            if(!data.error){
                rowerListing();
            }
            else{
                alert(data.error);
            } 
          });
    })
    $(document).on('click','.edit_stacja', ()=>{
        let id = $(this.activeElement).attr('stacja_id');
        let data = {"id_stacja": id};
        $.getJSON("api/fullStacjaData", data, 
         function(data) {
            if(!data.error){
                data = data.success[0];
                for(let e in data){
                    $('#s_'+e).val(data[e]);
                }
            }
            else{
                alert(data.error);
            } 
          });
    })
    $(document).on('click','.delete_stacja', ()=>{
        let id = $(this.activeElement).attr('stacja_id');
        let data = {"id_stacja": id};
        $.getJSON("api/deleteStacja", data, 
         function(data) {
            if(!data.error){
                stacjaListing();
            }
            else{
                alert(data.error);
            } 
          });
    });

    function getStacjeData(){
        $.getJSON("api/getStacjeData",
            function(data) {
                if(!data.error){
                    return data.success;
                }
                else{
                    return data.error;
                }
            });
    }
    
    function userListing(){
        $.getJSON("api/listUsers",
                function(data) {
                    if(!data.error){
                        $('.users_table').empty();
                        data = data.success;
                        data.forEach(e => {
                            $('.users_table').append(`
                            <tr>
                                 <th scope="row" class='konto_id'>${e.id_konto}</th>
                                 <td>${e.imie}</td>
                                 <td>${e.nazwisko}</td>
                                 <td>${e.login}</td>
                                 <td>${e.email}</td>
                                 <td><button type="button" konto_id='${e.id_konto}' class="btn btn-primary edit_user" data-toggle="modal" data-target="#edit_user">Edytuj</button></td>
                                 <td><button type="button" konto_id='${e.id_konto}' class="btn btn-danger delete_user">Usuń</button></td>
                             </tr>
                            `)
                         }); 
                    }
                    else{
                        alert(data.error);
                    }
                });
    }
    function rowerListing(){
        $.getJSON("api/listRowery",
                function(data) {
                    if(!data.error){
                        $('.rowery_table').empty();
                        data = data.success;
                        data.forEach(e => {
                            $('.rowery_table').append(`
                            <tr>
                                 <th scope="row" class='rower_id'>${e.id_rower}</th>
                                 <td>${e.marka}</td>
                                 <td>${e.model}</td>
                                 <td>${e.lokalizacja}</td>
                                 <td>${e.nazwa}</td>
                                 <td>${e.stan}</td>
                                 <td><button type="button" rower_id='${e.id_rower}' class="btn btn-primary edit_rower" data-toggle="modal" data-target="#edit_rower">Edytuj</button></td>
                                 <td><button type="button" rower_id='${e.id_rower}' class="btn btn-danger delete_rower">Usuń</button></td>
                             </tr>
                            `)
                         }); 
                    }
                    else{
                        alert(data.error);
                    }
                });
    }
    function stacjaListing(){
        $.getJSON("api/listStacja",
                function(data) {
                    if(!data.error){
                        $('.stacja_table').empty();
                        data = data.success;
                        data.forEach(e => {
                            $('.stacja_table').append(`
                            <tr>
                                 <th scope="row" class='stacja_id'>${e.id_stacja}</th>
                                 <td>${e.nazwa}</td>
                                 <td>${e.lokalizacja}</td>
                                 <td>${e.ulica}</td>
                                 <td>${e.numer}</td>
                                 <td>${e.miasto}</td>
                                 <td><button type="button" stacja_id='${e.id_stacja}' class="btn btn-primary edit_stacja" data-toggle="modal" data-target="#edit_stacja">Edytuj</button></td>
                                 <td><button type="button" stacja_id='${e.id_stacja}' class="btn btn-danger delete_stacja">Usuń</button></td>
                             </tr>
                            `)
                         }); 
                    }
                    else{
                        alert(data.error);
                    }
                });
    }
    function dataInject(obj){
        switch (obj) {
            case 'das':
                
                break;
            case 'rowe':
                rowerListing();
                stacjaListing();
                break;
            case 'map':
                rysujMape();
                break;
            case 'usr':
                userListing();
                break;  
            case 'rep':
                
                break;
            default:
                break;
        }
    }
    $('form').on('submit',function(e){
        userListing();
        rowerListing();
        stacjaListing();
    });
});
