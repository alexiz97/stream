(function($) {
  "use strict"; // Start of use strict

  $( window ).resize(function() {
    resizeVideoNA();
    resizeComunicatorNA();
    resizePlayer();
    resizeComunicator();
  });
  function resizeVideoNA(){
    let vw = $('.videona').width();
    let h = vw * 0.5625;
    $('.videona').height(h);
  };
  function resizeComunicatorNA(){
    let vh = $('.videona').height();
    let wh = $( '.content' ).height();
    let nh = $('.navbar').height();
    let ch = wh - vh;
    $('.comunicator').height(ch);
    let mh = $('#menu').height() + 200;
    let uh = nh - mh;
    $('.users').height(uh);
    $(".videona").css("line-height", vh-550+"px");
  };
  function resizePlayer(){
    let vw = $('.video').width();
    let h = vw * 0.5625;
    $('.video').height(h);
  };
  function resizeComunicator(){
    let vh = $('.video').height();
    let wh = $( '.content' ).height();
    let nh = $('.navbar').height();
    let ch = wh - vh;
    $('.comunicator').height(ch);
    let mh = $('#menu').height() + 200;
    let uh = nh - mh;
    $('.users').height(uh);
  };

  function video(){
    $.ajax({
        url:'https://test.siedlcepolnoc.pl/hls/test_audio.m3u8',
        type:'HEAD',
        error: function()
        {   
            $('#video').hide();
            resizeVideoNA();
            resizeComunicatorNA();
            var sec = 16;
    
            function pad(val) {
                return val < 16 ? val : val;
            }
            var timer = setInterval(function () {
                $(".counter").text(pad(--sec));
            }, 1000);
    
            setTimeout(function () {
                clearInterval(timer);
            }, 16000);
            setTimeout(function(){
            video();
            }, 16000);
        },
        success: function()
        {
                $('#video').show();
                $('.videona').hide();
                $('.videona-adm').hide();
                var player = videojs('video', {
                language: 'pl',
                plugins: {
                      videoJsResolutionSwitcher: {
                        ui: true,
                        default: 'low', // Default resolution [{Number}, 'low', 'high'],
                        dynamicLabel: true // Display dynamic labels or gear symbol
                      }
                    }
                  }, function(){
                    var player = this;
                    window.player = player;
                    player.updateSrc([
              //        {
              //          src: 'https://stream.siedlcepoludnie.pl/hls/poludnie.m3u8',
              //          type: 'application/x-mpegURL',
              //          label: 'Auto',
              //          res: 720
              //        },
              //        {
              //          src: 'https://stream.siedlcepoludnie.pl/hls/poludnie_low.m3u8',
              //          type: 'application/x-mpegURL',
              //          label: 'Niska',
              //          res: 240
              //        },
              //        {
              //          src: 'https://stream.siedlcepoludnie.pl/hls/poludnie_mid.m3u8',
              //          type: 'application/x-mpegURL',
              //          label: 'Średnia',
              //          res: 480
              //        },
              //        {
              //          src: 'https://stream.siedlcepoludnie.pl/hls/poludnie_high.m3u8',
              //          type: 'application/x-mpegURL',
              //          label: 'Wysoka',
              //          res: 540
              //        },
              //        {
              //          src: 'https://stream.siedlcepoludnie.pl/hls/poludnie_hd720.m3u8',
              //          type: 'application/x-mpegURL',
              //          label: 'HD',
              //          res: 720
              //        },
                      {
                        src: 'https://test.siedlcepolnoc.pl/hls/test_src.m3u8',
                        type: 'application/x-mpegURL',
                        label: 'Wideo',
                        res: 1080
                      },
                      {
                        src: 'https://test.siedlcepolnoc.pl/hls/test_audio.m3u8',
                        type: 'application/x-mpegURL',
                        label: 'Audio'
                      }
                    ]);
                    player.on('resolutionchange', function(){
                      console.info('Source changed to %s', player.src());
                    });
                    x = "<p style='margin: auto;width: 40%;margin-top: 10%;text-align: center; font-family: montserrat; font-size: 16px; height: 60px;'>Wpisz liczbę osób korzystających z programu zebrania..</p><div class='input-group' style='margin: auto;width: 10%;min-width: 200px;'><input type='number' min='1' id='updateListCount' class='form-control' placeholder=''><span class='input-group-btn'><div class='btn btn-secondary vjs-close-button' id='updateList' type='button' style='background-color: #104F88;'>Zatwierdź</div></span></div>";  
                  player.createModal();
                  $(".vjs-modal-dialog-content").append(x);
                  });
                  player.play();
                  resizePlayer();
                    resizeComunicator();
                    $( window ).resize(function() {
                        resizePlayer();
                        resizeComunicator();
                    });
                  }
    });
    }

  video();
  
  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 71)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 80
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Floating label headings for the contact form
  $(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  });

})(jQuery); // End of use strict
