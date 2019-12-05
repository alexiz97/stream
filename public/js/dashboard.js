$(document).ready(function() {

    //var socket = io();

    $('[data-toggle="offcanvas"]').click(function(){
        $("#navigation").toggleClass("hidden-xs");
    });


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
    $(document).on('submit','form.append_category', (e)=>{

        e.preventDefault();

        $.ajax({

            type     : "POST",

            cache    : false,

            url      : "/api/addCategory",

            data     : $(e.currentTarget).serialize(),

            success  : function(d) {
                d = d.success;
                $(`#panel-body${d.parent_category_id}`).append(`
                <div class="panel-group main_accordion" id="accordion${d.id}">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion${d.id}" href="#collapse${d.id}">
                                    #${d.id}
                                    Nazwa: ${d.name}
                                </a>
                                <div class="f_right">
                                    <button type="button" category_id='${d.id}' class="btn btn-primary edit_category" data-toggle="modal" data-target="#edit_category">Edytuj</button>
                                    <button type="button" category_id='${d.id}' class="btn btn-danger delete_category">Usuń</button>
                                </div>  
                            </h4>
                        </div>
                        <div id="collapse${d.id}" class="panel-collapse collapse">
                            <div id='panel-body${d.id}' class="panel-body">
                            </div>
                            <div class="panel-group" style="margin: 15px; margin-top: 0px;">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <form class="append_category" action="/api/addCategory"> 
                                            <div class="input-group">
                                                <input class="hidden" name="parent_category_id" value="${d.id}"/>
                                                <input type="text" name="name" class="form-control" placeholder="Podaj nazwę">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-success" type="submit">Dodaj subkategorię</button>
                                                </span> 
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `)

            }

        });

    

    });
    

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

  $('.switch_in').click(()=>{

    let next = $(this.activeElement).attr('id');

    let prev = $('#prev_in_terr');

    switchViewIn(prev, next);

})

function switchViewIn(prev, next){

  $(prev).hide();

  $('.'+next).show();

  $(prev).removeAttr('id');

  $('.'+next).attr('id', 'prev_in_terr');

}

    $(document).on('click','.edit_client', ()=>{

        let id = $(this.activeElement).attr('konto_id');

        let data = {"id_konto": id};

        $.getJSON("api/clientData", data, 

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

    $(document).on('click','.delete_client', ()=>{

        let id = $(this.activeElement).attr('konto_id');

        let data = {"id_konto": id};

        $.getJSON("api/deleteClient", data, 

         function(data) {

            if(!data.error){

                clientListing();

            }

            else{

                alert(data.error);

            } 

          });

    })

    function clientListing(){

        $.getJSON("api/listClients",

                function(data) {

                    if(!data.error){

                        $('.clients_table').empty();

                        e = data.success;

                        for (var i=0; i<e.length; i++) {

                            $('.clients_table').append(`

                            <tr>

                                 <th scope="row" class='konto_id'>${e[i].id}</th>

                                 <td>${e[i].name}</td>

                                 <td>${e[i].login}</td>

                                 <td>${e[i].email}</td>

                                 <td><button type="button" konto_id='${e[i].id}' class="btn btn-primary edit_client" data-toggle="modal" data-target="#edit_client">Edytuj</button></td>

                                 <td><button type="button" konto_id='${e[i].id}' class="btn btn-danger delete_client">Usuń</button></td>

                             </tr>

                            `)

                         }; 

                    }

                    else{

                        alert(data.error);

                    }

                });

    }

    //TERRITORIES

    $(document).on('click','.edit_territory', ()=>{

        let id = $(this.activeElement).attr('territory_id');

        let data = {"id_territory": id};

        $.getJSON("api/territoryData", data, 

         function(data) {

            if(!data.error){

                data = data.success[0];

                for(let e in data){

                    $('#et_'+e).val(data[e]);

                }

            }

            else{

                alert(data.error);

            } 

          });

    })

    $(document).on('click','.delete_territory', ()=>{

        let id = $(this.activeElement).attr('territory_id');

        let data = {"id_territory": id};

        $.getJSON("api/deleteTerritory", data, 

         function(data) {

            if(!data.error){

                territoryListing();

            }

            else{

                alert(data.error);

            } 

          });

    })

    function territoryListing(){

        $.getJSON("api/listTerritories",

                function(data) {

                    if(!data.error){

                        $('.territories_table').empty();

                        e = data.success;

                        for (var i=0; i<e.length; i++) {
                            let type;
                            if(e[i].type === "Miejski"){type = 'city';}
                            else{type = 'vill';}
                            $('.territories_table').append(`
                            <div class="panel panel-default">
                            <div class="panel-heading" role="tab" id="heading${e[i].number}"  data-toggle="collapse" data-parent="#accordion" href="#collapse${e[i].number}" aria-expanded="false" aria-controls="collapse${e[i].number}">
                              <h4 class="panel-title">
                                <a class="collapsed">
                                <b>${e[i].number}<b> ${e[i].name}
                                </a>
                              </h4>
                            </div>
                            <div id="collapse${e[i].number}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading${e[i].number}">
                              <div class="panel-body bckg_${type}">
                              ${e[i].type}
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                              </div>
                              <div class="panel-footer">
                                    <button type="button" territory_id='${e[i].id}' class="btn btn-primary edit_territory" data-toggle="modal" data-target="#edit_territory">Edytuj</button>
                                    <button type="button" territory_id='${e[i].id}' class="btn btn-danger delete_territory">Usuń</button>
                                    <button type="button" territory_id='${e[i].id}' data-toggle="modal" data-target="#add_assignment" class="btn btn-success add_assignment">Przydziel</button>
                                </div>
                            </div>

                            `)

                         }; 

                    }

                    else{

                        alert(data.error);

                    }
                });

    }

    //ASSIGNMENTS

    $(document).on('click','.insertDateAssign', ()=>{
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); 
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        $('#dateOfAssignment').val(today);
    });
    $(document).on('click','.insertDateReturn', ()=>{
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); 
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        $('#dateOfReturn').val(today);
    });

    $(document).on('click','.add_assignment', ()=>{

        let id = $(this.activeElement).attr('territory_id');

        let data = {"id_territory": id};

        $.getJSON("api/territoryData", data, 

         function(data) {

            if(!data.error){

                data = data.success[0];

                $('#assign_territory_id').val(data.id);

            }

            else{

                alert(data.error);

            } 

          });
          $.getJSON("api/listExecutives", 

         function(data) {

            if(!data.error){
                $('#executive_id').empty();

                data = data.success;

                for(let e in data){

                    $('#executive_id').append(`<option value="${data[e].id}">${data[e].name}</option>`);

                }

                

            }

            else{

                alert(data.error);

            } 

          });

    })

    //EXECUTIVES

    function executiveListing(){

        $.getJSON("api/listExecutives",

                function(data) {

                    if(!data.error){

                        $('.executives_table').empty();

                        e = data.success;

                        for (var i=0; i<e.length; i++) {

                            $('.executives_table').append(`

                            <tr>

                                 <th scope="row" class='konto_id'>${e[i].id}</th>

                                 <td>${e[i].name}</td>

                                 <td>${e[i].phone_num}</td>

                                 <td><button type="button" konto_id='${e[i].id}' class="btn btn-primary edit_client" data-toggle="modal" data-target="#edit_client">Edytuj</button></td>

                                 <td><button type="button" konto_id='${e[i].id}' class="btn btn-danger delete_client">Usuń</button></td>

                             </tr>

                            `)

                         }; 

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

            case 'ter':

                territoryListing();
                executiveListing();
                break;

            case 'prod':



                break;

            case 'usr':

                clientListing();

                break;  

            case 'rep':

                

                break;

            default:

                break;

        }

    }
    $('form').on('submit',function(e){

        clientListing();
        territoryListing();
        executiveListing()
    });

});

