/*global jarn */
/*global prettyPrint */
/*global portal_url */
/*global Recaptcha */
/*global RecaptchaOptions */
/*global Handlebars */


// En aquest script agruparem tots els "document ready" quan sigui necessari

$(document).ready(function () {
  // set a TTL for it (change on production)
  jarn.i18n.setTTL(100000);
  // Load the i18n Plone catalog for genweb
  jarn.i18n.loadCatalog('genweb');
  window._gw_i18n = jarn.i18n.MessageFactory('genweb');

$('[type=file]').each(function(index, value) {
              $(value).customFileInput();
});

  // var max_iterations = 40;
  // var intervalId = setInterval(function(event) {
  //    if (window._gw_i18n !== undefined && window._i18nsucks === true) {
  //        $('[type=file]').each(function(index, value) {
  //            $(value).customFileInput();
  //        });
  //        clearInterval(intervalId);
  //    }

  //    max_iterations -= 1;
  //    if (max_iterations <= 0) {
  //     clearInterval(intervalId);
  //     $('.namedblobimage-field input, .namedblobfile-field input').css({position: 'inherit', opacity: '1'});
  //    }

  // }, 50);

  // $('select:not([multiple])').dropkick();
  $('ul.dk_options_inner').addClass('scrollable');
  if ($(window).width() < 640 ) {
    /* aquestes dues classes que s'afegeixen són necessàries? aparentment funciona igual i llavors funciona bé la vista beta
    $('.nav-tabs').addClass('nav-stacked');
    $('.nav-pills').addClass('nav-stacked'); */
    $(document).scrollTop( $("#content").offset().top ); //aquí saltava un error perquè faltava '#'
  }
  $('.custom-chekbox[type="checkbox"]').customInput();
  $('.custom-radio[type="radio"]').customInput();

  // Tooltips
  $('[rel="tooltip"]').tooltip({container: 'body'});
  $('.ploneCalendar .event a').on('click', function (e) {e.preventDefault();});
  $('.ploneCalendar .event a').tooltip({container: 'body', html: 'true', trigger: 'click'});

  $('[rel="popover"]').popover();
  $(document).on('touchend click', '.amunt a', function() {
    $("html, body").animate({ scrollTop: 0 }, 'slow');
  });
  $('.dropdown:has(.badge)').addClass('nou');
  $('ul.dropdown-menu li:has(.actionMenuSelected)').addClass('active');

  $('.userScreen').click(function() {
    $('html').removeClass('simulated-mobile-view');
    $('html').removeClass('simulated-tablet-view');
    $("#content").getNiceScroll().hide();
    $("#content").css({ overflow: "visible" }); //fixa bug de l'scroll
  });
  $('.userTablet').click(function() {
    $("#content").css({ overflow: "hidden" }); //fixa bug de l'scroll
    $('html').removeClass('simulated-mobile-view');
    $('html').addClass('simulated-tablet-view');
    $("html.simulated-tablet-view #content").niceScroll({touchbehavior:false,cursorcolor:"#000",cursoropacitymax:0.75,cursoropacitymin: 0.25,cursorwidth:6});
    $("html.simulated-tablet-view #content").getNiceScroll().show();
    $("#content").getNiceScroll().resize();
  });
  $('.userMobile').click(function() {
    $("#content").css({ overflow: "hidden" }); //fixa bug de l'scroll
    $('html').removeClass('simulated-tablet-view');
    $('html').addClass('simulated-mobile-view');
    $("html.simulated-mobile-view #content").niceScroll({touchbehavior:false,cursorcolor:"#000",cursoropacitymax:0.75,cursoropacitymin: 0.25,cursorwidth:6});
    $("html.simulated-mobile-view #content").getNiceScroll().show();
    $("#content").getNiceScroll().resize();
  });

  var prettify = false;
  $("pre").each(function() {
      $(this).prepend('<code>');
      $(this).append('</code>');
      $(this).addClass('prettyprint linenums');
      prettify = true;
  });

  if ( prettify ) {
      $.getScript(window.location.href + "/++genweb++static/js/prettify.js", function() {prettyPrint();});
  }

  // Toggle search
  $("#search-results-bar dl a").on("click", function(e) {
    e.preventDefault();
    $("#search-results-bar dl dd.actionMenuContent").toggle();
  });


  // actualització títol menú 1, mostra l'opció de primer nivell que hem seleccionat, es fa a partir del 2on valor de la llista del breadcrumb
  var lititol=$('ol.breadcrumb li:eq(1) a');// cas amb breadcrumb no visible
  if (lititol.length===0) { lititol=$('ol.breadcrumb li:eq(1)'); }// cas amb breadcrumb visible
  var nouTitol=lititol.text();
  if (nouTitol) {$('#titol-menu-1 a').text(nouTitol);}

  // actualització títol menú 2, mostra l'opció de primer nivell que hem seleccionat, es fa a partir del 3er valor de la llista del breadcrumb
  /*  var lititol=$('ol.breadcrumb li:eq(2) a');// cas amb breadcrumb no visible
    if (lititol.length===0) lititol=$('ol.breadcrumb li:eq(2)');// cas amb breadcrumb visible
    var nouTitol=lititol.text();
    if (nouTitol) $('#titol-menu-2').text(nouTitol);*/

  function input_text_default(captcha_type){
    var text_default="";
    if (captcha_type==='image')  {
      text_default=translations.instructions_audio;
    } else {
      text_default=translations.instructions_visual;
    }
    $('#recaptcha_response_field').val(text_default);

  }

  // RECAPTCHA
  if (_.hasOwnProperty(window, 'RecaptchaOptions')) {
    if (RecaptchaOptions !== undefined) {
      var translations = RecaptchaOptions.custom_translations;
      $('div.recaptcha_only_if_incorrect_sol').text(translations.incorrect_try_again);
      $('li.recaptcha_play_again span').text(translations.refresh_btn);
      $('#recaptcha_reload').attr('alt',translations.refresh_btn);
      $('a.recaptcha_only_if_image span').text(translations.audio_challenge);
      $('#recaptcha_switch_audio').attr('alt',translations.audio_challenge);
      $('a.recaptcha_only_if_audio span').text(translations.visual_challenge);
      $('#recaptcha_switch_img').attr('alt',translations.visual_challenge);
      $('li.recaptcha_help span').text(translations.help_btn);
      $('#recaptcha_whatsthis').attr('alt',translations.help_btn);

      input_text_default('audio');

      $('#recaptcha_switch_type').click(
        function(){
          input_text_default(Recaptcha.type);
        }
      );
    }
  }


  // FI RECAPTCHA

  // Share popover specific
  $('.share_popover')
    .popover({
      html:true,
      placement:'left',
      content:function(){
          return $($(this).data('contentwrapper')).html();
      }
    })
    .click(function(e) { // evita scroll top
      e.preventDefault();
  });

  // Tags select2 field
  $('#searchbytag').select2({
      tags: [],
      tokenSeparators: [","],
      minimumInputLength: 1,
      ajax: {
          url: portal_url + '/getVocabulary?name=plone.app.vocabularies.Keywords&field=subjects',
          data: function (term, page) {
              return {
                  query: term,
                  page: page // page number
              };
          },
          results: function (data, page) {
              return data;
          }
      }
  });

  // Tags search
  $('#searchbytag').on("change", function(e) {
      var query = $('#searchinputcontent .searchInput').val();
      var path = $(this).data().name;
      var tags = $('#searchbytag').val();

      $('.listingBar').hide();
      $.get(path + '/search_filtered_content', { q: query, t: tags }, function(data) {
          $('#tagslist').html(data);
      });
  });

  // Content search
  $('#searchinputcontent .searchInput').on('keyup', function(event) {
      var query = $(this).val();
      var path = $(this).data().name;
      var tags = $('#searchbytag').val();
      $('.listingBar').hide();
      $.get(path + '/search_filtered_content', { q: query, t: tags }, function(data) {
          $('#tagslist').html(data);
      });
  });


  var liveSearch = function(data_url) {
    return function findMatches(q, cb) {
      $.get(data_url + '?q=' + q, function(data) {
        window._gw_typeahead_last_result = data;
        cb(data);
      });

    };
  };

  window._gw_typeahead_last_result = [];
  var selector = '#gwsearch .typeahead';
  var $typeahead_dom = $(selector);
  $typeahead_dom.typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'states',
    displayKey: 'title',
    source: liveSearch($typeahead_dom.attr('data-typeahead-url')),
    templates: {
      suggestion: Handlebars.compile('<a class="{{class}}" href="{{itemUrl}}">{{title}}</a>'),
      empty: '<div class="tt-empty"><p>'+ window._gw_i18n("No hi ha elements") + '<p></div>'
    }
  }).on("typeahead:datasetRendered", function(event) {
    var $dropdown = $(this).parent().find('.tt-dropdown-menu');
    var $separator = $dropdown.find('.tt-suggestion a.with-separator').parent();
    var separator_css = {
      "border-top": ' 1px solid rgba(0, 0, 0, 0.2)',
      'background-color': "#f5f5f5",
      "padding-top": "4px"
    };

    if ($separator.is(':first-child')) {
      separator_css['border-top-left-radius']= "8px";
      separator_css['border-top-right-radius']= "8px";
      separator_css['border-top'] = "none";
    }

    $separator.css(separator_css);
    $separator = $dropdown.find('.tt-suggestion a.with-background').parent();
    $separator.css({'background-color': "#f5f5f5" });
  })
  .on("keyup", function(event) {
      if (event.keyCode === 13) {
          var text = $(this).val();
          if (!_.findWhere(window._gw_typeahead_last_result, {'title': text})) {
              window.location.href = $typeahead_dom.attr('data-search-url') + '?SearchableText=' + text;
          }

      }
  })
  .on("typeahead:selected", function(event, suggestion, dataset) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.location.href = suggestion.itemUrl;

  });

  // Append the accessibility thinggy when the link opens in new window
  append_new_window_icon();

}); // End of $(document).ready

// Token input z3c.form widget
function keywordTokenInputActivate(id, newValues, oldValues) {
  $('#'+id).tokenInput(newValues, {
      theme: "facebook",
      tokenDelimiter: "\n",
      tokenValue: "name",
      preventDuplicates: true,
      prePopulate: oldValues
  });
}

function append_new_window_icon()
{
    /*  afegeix icon_blank.gif a tots els <a target='_blank'>
        EXCEPCIONS:
        - si troba una imatge (no importa quina imatge sigui, pdf, facebook, twitter, etc, seran vàlides)
            - dins <a>
            - immeditament després <a>
        - té la classe no_icon_blank            */

    var text_alt =
    {
        ca: '(obriu en una finestra nova)',
        es: '(abrir en una ventana nueva)',
        en: '(open in new window)'
    };

    var lang = $('html').attr('lang');

    $('a[target = "_blank"]').each(function(i,obj) // busquem tots el <a> amb target _blank
    {
        if (!$(this).hasClass('no_icon_blank')) // que no tinguin classe no_icon_blank
        {
          var new_window_icon = '<img style="margin-left:5px;" class="link_blank" alt="' + text_alt[lang] + '" src="++genweb++static/images/icon_blank.gif">';
          if ($(this).hasClass('contenttype-link')) { // si és un element en el menú
            $(this).find('span').append(new_window_icon);
          } else { // resta casos
            var img = $(this).find("img")[0];
            if (img === undefined) // que no tinguin una imatge dins <a>
            {
              var img2 = $(this).next('img:first')[0];
              if (img2 === undefined) // que no tinguin imatge immediatament després <a>
              {
                $(this).append(new_window_icon);
              }

//                var img2 = $(this).next('img:first')[0];
//                if (img2 === undefined) // que no tinguin imatge immediatament després <a>
//                {
//                    $(this).append('<img style="margin-left:5px;" class="link_blank" alt="' + text_alt[lang] + '" src="icon_blank.gif">');
//                }
            }
          }
        }
    });
}
