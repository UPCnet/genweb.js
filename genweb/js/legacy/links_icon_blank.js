function append_new_window_icon()
{
    /*
        afegeix icon_blank.gif a tots els <a target='_blank'>
        EXCEPCIONS:
        - si troba una imatge (no importa quina imatge sigui, pdf, facebook, twitter, etc, seran vàlides)
            - dins <a>
            - immeditament després <a>
        - té la classe no_icon_blank
    */

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
          var new_window_icon = '<img style="margin-left:5px;" class="link_blank" alt="' + text_alt[lang] + '" src="' + portal_url + '/++genweb++static/images/icon_blank.gif">';
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
            }
          }
        }
    });
}
