
function initializeLanguageSelector() {

    // Language Selector items
    var languageSelectorItems = document.querySelectorAll('#faoLanguageSelector .dropdown-item');

    // Actual languages
    const languages = document.querySelectorAll('[data-sf-role]');
    if (languages) {

        for (i = 0; i < languages.length; i++) {

            if (languages[i].value === '') {

                var culture = languages[i].getAttribute('data-sf-role');
                for (j = 0; j < languageSelectorItems.length; j++) {

                    var c = languageSelectorItems[j].getAttribute('data-sf-culture');
                    if (c === culture) {

                        let n = languageSelectorItems[j];
                        n.parentNode.removeChild(n);
                    }
                }
            }
        }
    }

    $('#dropdownLanguageMenu').on('click', function (event) {
        if ($("#faoLanguageSelector").children().length <= 0) {
            $("#faoLanguageSelector").hide();
        }
    });

    if ($("#faoLanguageSelector").children().length <= 0) {
        $("#dropdownLanguageMenu").addClass("dropdown-disabled");
    }
 }

function openLink(culture) {

    var url = document.querySelector('[data-sf-role="' + culture + '"]').value;
    if (url !== '')
        window.location.href = url;
}