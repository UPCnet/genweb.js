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

  // $('select:not([multiple])').dropkick();
  $('ul.dk_options_inner').addClass('scrollable');
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


  $( '#NotAttendeesMsg' ).hide();

  if($( '#SendInvitation' ).length){
    var attendants = $( '.attendee' ).map(function(){
                      return $.trim($(this).text());
                    }).get()

    if(attendants.length <= 0){
      $( '#SendInvitation' ).remove();
      $( '#NotAttendeesMsg' ).show();
    }
  }

  $( '#SendInvitation' ).on( 'click', function(){
    dexterity_url = $( this ).attr( 'data-dexterityUrl' );
    $.ajax({
        type: 'POST',
        url: dexterity_url + '/event_to_attendees',
        success: function(){ }
      });
  });


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
