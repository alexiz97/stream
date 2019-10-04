$(document).ready(function() {
    stacjaListing();
    rowerListing();
    showDolary();
    $('form').on('submit',function(e){
        stacjaListing();
        rowerListing();
        showDolary();
    });
    function showDolary(){
        $.getJSON("api/showDolary",
         function(data) {
             let dol = data.success[0].dolary;
             $('.inject_dolary').empty();
             $('.inject_dolary').append('Twoje dolary: ' + dol);    
          }); 
    }
    $('.switch').click(()=>{
        let next = $(this.activeElement).attr('id');
        let prev = $('#prev');
        $('.active').removeClass('active');
        $(this.activeElement).parent().addClass('active');
        switchView(prev, next);
    })
    $(document).on('click','.wypo_rower',()=>{
        let id = $(this.activeElement).attr('stacja_id');
        rowerListing(id);
    })
    $(document).on('click','.finalwypo_rower',()=>{
        let id = $(this.activeElement).attr('rower_id');
        finalwypoRower(id);
    })
    function switchView(prev, next){
      $(prev).hide();
      $('.'+next).show();
      $(prev).removeAttr('id');
      $('.'+next).attr('id', 'prev');
      dataInject(next);
    }
    $(document).on('click','.zwro_rower', ()=>{
        let id = $(this.activeElement).attr('rower_id');
        let koszt = $(this.activeElement).attr('koszt');
        $('#z_id_rower').val(id);
        $('#z_koszt').val(koszt);
    })
    $(document).on('click','.extend_rower', ()=>{
        let id = $(this.activeElement).attr('rower_id');
        $('#ex_id_rower').val(id);
    })
    function finalwypoRower(id_rower){
        let dat = {"id_rower": id_rower};
        $.getJSON("api/addWypozycz",dat,
            function(data) {
                if(!data.error){
                    alert(data);
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
                                <td>${e.nazwa}</td>
                                <td>${e.ulica}</td>
                                <td>${e.numer}</td>
                                <td>${e.miasto}</td>
                                <td><button type="button" stacja_id='${e.id_stacja}' class="btn btn-primary wypo_rower">Wybierz</button></td>
                            </tr>
                        `)
                        }); 
                }
                else{
                    alert(data.error);
                }
            });
    }
    function rowerListing(id){
        let dat = {"id_stacja": id};
        $.getJSON("api/listRoweryStacja", dat,
                function(data) {
                    if(!data.error){
                        $('.rowery_table').empty();
                        data = data.success;
                        data.forEach(e => {
                            $('.rowery_table').append(`
                            <tr>
                                 <td>${e.marka}</td>
                                 <td>${e.model}</td>
                                 <td>${e.nazwa}</td>
                                 <td><button type="button" rower_id='${e.id_rower}' class="btn btn-success finalwypo_rower">Wypożycz</button></td>
                             </tr>
                            `)
                         }); 
                    }
                    else{
                        alert(data.error);
                    }
                });
    }
    function wypozyczListing(){
        $.getJSON("api/listWypozycz",
            function(data) {
                if(!data.error){
                    $('.wypo_table').empty();
                    data = data.success;
                    data.forEach(e => {
                        let koszt = e.koszt + 'zł';
                        let button1 = `<td><button type="button" koszt='${e.koszt}' rower_id='${e.id_rower}' class="btn btn-primary zwro_rower" data-toggle="modal" data-target="#wypo_end">Zwróć</button></td>`
                        if(e.skonczone){
                            koszt = 'opłacono';
                            button1 = ``;
                        }
                        let current_datetime = new Date(e.czas_od);
                        let formatted_date = current_datetime.toLocaleString("pl-PL");

                        $('.wypo_table').append(`
                            <tr>
                                <td>${e.marka}</td>
                                <td>${e.model}</td>
                                <td>${formatted_date}</td>
                                <td>${koszt}</td>
                                ${button1}
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
            case 'rowe':
                stacjaListing();
                break;
            case 'opla':
                wypozyczListing();
                break;
            default:
                break;
        }
    }
});