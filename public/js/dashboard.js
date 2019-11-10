$(document).ready(function() {

    //var socket = io();

    $('[data-toggle="offcanvas"]').click(function(){
        $("#navigation").toggleClass("hidden-xs");
    });

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

    $(document).on('click','.edit_product', ()=>{

        let id = $(this.activeElement).attr('product_id');

        let data = {"id": id};

        $.getJSON("api/productData", data, 

         function(data) {

            if(!data.error){

                data = data.success[0];

                for(let e in data){

                    $('#p_'+e).val(data[e]);

                }

            }

            else{

                alert(data.error);

            } 

          });

    })

    $(document).on('click','.delete_category', ()=>{
        if (confirm("Czy chcesz usunąć tę kategorię wraz z jej subkategoriami? Nie będzie dało się tego cofnąć!")) { 

        let id = $(this.activeElement).attr('category_id');
        let data = {"id": id};
        $.getJSON("api/deleteCategory", data, 
            function(data) {
                if(!data.error){
                    $(`#accordion${id}`).remove();
                }
                else{
                    alert(data.error);
                } 
            });
        
        let objects = $(`#accordion${id}`).find(`.main_accordion`);

        objects.map(e=>{
            let id = objects[e];
            id = id.id.substring(9);
            let data = {"id": id};
            $.getJSON("api/deleteCategory", data, 
            function(data) {
                if(!data.error){
                    $(`#accordion${id}`).remove();
                }
                else{
                    alert(data.error);
                } 
            });
        })
        } 

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

                                 <td>${e[i].client_id_subiekt}</td>

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

    function sortCategories(data){
        let highest = 0;
        data.map(function(obj){     
            if (obj.id > highest) highest = obj.id;    
        });
        let sorted = new Array(highest);
        for(let i = 0; i<= highest; i++){
            sorted[i] = new Array();
            data.forEach(e=>{
                if(e.parent_category_id === i){
                    sorted[i].push(e.id);
                }
            })
        }
        return sorted;
    }

    function accordion(list, i, data, last){
        let highest = 0;
        data.map(function(obj){     
            if (obj.id > highest) highest = obj.id;    
        });
        if(list[i].length>0 && i <= highest){
            list[i].forEach(e => {
                let current = 0;
                data.map((obj, index)=>{
                    if(obj.id === e) current = index;
                })
                $(`#panel-body${last}`).append(`
                <div class="panel-group main_accordion" id="accordion${e}">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion${e}" href="#collapse${e}">
                                    #${data[current].id}
                                    Nazwa: ${data[current].name}
                                </a>
                                <div class="f_right">
                                    <button type="button" category_id='${e}' class="btn btn-primary edit_category" data-toggle="modal" data-target="#edit_category">Edytuj</button>
                                    <button type="button" category_id='${e}' class="btn btn-danger delete_category">Usuń</button>
                                </div>  
                            </h4>
                        </div>
                        <div id="collapse${e}" class="panel-collapse collapse">
                            <div id='panel-body${e}' class="panel-body">
                            </div>
                            <div class="panel-group" style="margin: 15px; margin-top: 0px;">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <form class="append_category"> 
                                            <div class="input-group">
                                                <input class="hidden" name="parent_category_id" value="${e}"/>
                                                <input type="text" name="name" class="form-control" placeholder="Podaj nazwę">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-success" name="button" type="submit">Dodaj subkategorię</button>
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
                accordion(list, e, data, e);
             }); 
        }
        
    }

    function categoryListing(){

        $.getJSON("api/listCategories",

                function(data) {

                    if(!data.error){

                        $('#panel-body0').empty();

                        data = data.success;

                        let sort = sortCategories(data);

                        accordion(sort, 0, data, 0);

                    }

                    else{

                        alert(data.error);

                    }

                });

    }

    function productListing(){

        $.getJSON("api/listProducts",

                function(data) {

                    if(!data.error){

                        $('.products_table').empty();

                        data = data.success;

                        data.forEach(e => {

                            $('.products_table').append(`

                            <tr>

                                 <th scope="row" class='product_id'>${e.id}</th>

                                 <td>${e.name}</td>

                                 <td>${e.category_id}</td>

                                 <td><button type="button" product_id='${e.id}' class="btn btn-primary edit_product" data-toggle="modal" data-target="#edit_product">Edytuj</button></td>

                                 <td><button type="button" product_id='${e.id}' class="btn btn-danger delete_product">Usuń</button></td>

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

            case 'cat':

                categoryListing();

                break;

            case 'prod':

                productListing();

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
        categoryListing();
        productListing();

    });

});

