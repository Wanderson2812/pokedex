function getUrl(url) {
    $.ajax({
        type: 'GET',
        url: url || "https://pokeapi.co/api/v2/pokemon/1"
    }).done(function (req) {
        createObject(req);
        nextPrevious(req);
        search();
    }).fail(function (req) {
        alert("Pokémon Not Found");
    });
}
getUrl();

function createObject(obj) {
    var objPokemon = {
        name: obj.name,
        image: obj.sprites.other["official-artwork"].front_default,
        types: obj.types,
        stats: obj.stats,
        id: obj.id
    }

    appendCard(objPokemon);
    getVariantForm(obj);
}

function appendCard(objPokemon) {
    $('.card-body.old-card').remove();
    $('section .content').append(appendPokemon);

    var $this = $('.card-body').attr('id', objPokemon.id);
    getInfo(objPokemon, $this);

    if (objPokemon.name.split('-').length >= 2) {
        var nameObj = objPokemon.name.split('-');
        for (var i = 0; i < nameObj.length; i++) {
            if (nameObj[i] == "mega") {
                $('.image-background').show().addClass('background-mega');
                $('body').css('background', 'linear-gradient(145deg, #f38ec6 0%, #1799ecCC 50%, #c5df41 100%)');
            } else if (nameObj[i] == "gmax") {
                $('.image-background').show().addClass('background-gmax');
                $('body').css('background', 'linear-gradient(145deg, #19a7e8 0%, #ffffff 50%, #e6216d 100%)');
            }
            nameObj[i] = nameObj[i].charAt(0).toUpperCase() + nameObj[i].slice(1);
        }
        objPokemon.name = nameObj.join(' ')
    } else {
        $('.image-background').hide();
        $('.alternative-forms').hide();
        objPokemon.name = objPokemon.name.charAt(0).toUpperCase() + objPokemon.name.slice(1);
    }

    $this.find('figure.pokemon-image img').attr('src', objPokemon.image).attr('alt', objPokemon.name);
    $this.find('.pokemon-info-top .pokemon-name-number h1').text(objPokemon.name);
    $this.find('.pokemon-info-top .pokemon-name-number h2').text("#" + objPokemon.id);

    $('.alternative-form-buttons').hide();
    $('.hide-alternative-form').on('click', function () {
        if ($('.alternative-form-buttons').is(':visible')) {
            $('.alternative-form-buttons').hide();
            $('.hide-alternative-form').css('transform', 'rotate(90deg)');
        } else {
            $('.hide-alternative-form').css('transform', 'rotate(180deg)');
            $('.alternative-form-buttons').show();
        }
    });
}

function getInfo(objPokemon, $this) {
    var colorType = [];

    //get color type pokemon
    for (var i = 0; i < objPokemon.types.length; i++) {
        var slot = objPokemon.types[i].slot;
        var type = objPokemon.types[i].type;

        colorType.push(type.name);

        $this.find(".pokemon-type-form .pokemon-type").append('<li class="type' + slot + '"></li>');
        $this.find(".type" + slot + "").text(type.name.toUpperCase());
        $this.find(".type" + slot + "").css("background", "var(--" + type.name + ")");
        $this.find(".type" + slot + "").css("border", "var(--b-" + type.name + ")");

        if (objPokemon.types.length == 1) {
            $this.find(".type" + slot + "").addClass('monoType');
        }
    }

    //get base stats pokemon
    for (var j = 0; j < objPokemon.stats.length; j++) {
        var type_stat = objPokemon.stats[j].stat.name;
        var base_type_stat = objPokemon.stats[j].base_stat;

        $this.find(".pokemon-stats-base").append('<ul class="pokemon-stats">\n\
                                                        <li class="stats-name ' + type_stat + '"></li>\n\
                                                        <li class="stats-value ' + base_type_stat + '"></li>\n\
                                                        <li class="stats-bar">\n\
                                                            <span class="stats-preogress"></span>\n\
                                                        </li>\n\
                                                    </ul>');

        var $nameStat = $this.find("." + type_stat + "");
        var nameStat;
        switch (type_stat) {
            case 'hp':
                nameStat = 'hp';
                break;
            case 'attack':
                nameStat = 'atk';
                break;
            case 'defense':
                nameStat = 'def';
                break;
            case 'special-attack':
                nameStat = 'sp.atk';
                break;
            case 'special-defense':
                nameStat = 'sp.def';
                break;
            case 'speed':
                nameStat = 'speed';
                break;
        }

        $nameStat.text(nameStat.toUpperCase());

        var $statValue = $this.find("." + base_type_stat + "");
        $statValue.text(base_type_stat);
        $statValue.parent().find('.stats-bar .stats-preogress').css('width', base_type_stat + 'px');
    }

    //validation apply color background by type pokemon
    if (colorType.length > 1) {
        $this.parents('body').css("background", "linear-gradient(90deg, var(--bg-" + colorType[0] + ") 50%, var(--bg-" + colorType[1] + ") 50%)");
    } else {
        $this.parents('body').css("background", "var(--bg-" + colorType[0] + ")");
    }
}

function nextPrevious(req) {
    var getNextPokemon = req;
    $(".next").unbind('click');
    $(".previous").unbind('click');

    $('.content').find('.card-body').addClass('old-card');

    $('.next').on('click', function () {
        var id = getNextPokemon.id + 1;
        var urlNext = "https://pokeapi.co/api/v2/pokemon/" + id + "";
        getUrl(urlNext);
    });

    $('.previous').on('click', function () {
        var id = getNextPokemon.id - 1;
        var urlPrevious = "https://pokeapi.co/api/v2/pokemon/" + id + "";
        getUrl(urlPrevious);
    });
}

function search() {
    $('.pokemon-search-image img').unbind('click');
    $('.pokemon-search-image img').on('click', function () {
        var $inputSearch = $(this).parent('figure').find('input');

        if ($('.pokemon-search-input').is(':visible')) {
            $(this).attr('src', 'assets/img/poke-lock.png');
            $inputSearch.hide();
        } else {
            $(this).attr('src', 'assets/img/poke-open.png');
            $inputSearch.show();

        }

        $inputSearch.unbind('change');
        $inputSearch.change(function () {
            var id = $(this).val();
            var urlSearch = "https://pokeapi.co/api/v2/pokemon/" + id + "";
            getUrl(urlSearch);

            $('.pokemon-search-image img').attr('src', 'assets/img/poke-lock.png');
            $inputSearch.val('').hide();
            
            $('.next').show();
            $('.previous').show();
        });
    });
}

function getVariantForm(obj) {
    var urlSpecie = obj.species.url;
    var nameCurrent = obj.name;

    $.ajax({
        type: 'GET',
        url: urlSpecie
    }).done(function (req) {
        var variant = req.varieties;
        getUrlVariantForm(variant, nameCurrent);
    }).fail(function (req) {
        alert("Not Pokémon Alternative Form Found");
    });
}

function getUrlVariantForm(variant, nameCurrent) {
    var variantForm = variant;

    for (let prop in variantForm) {
        var typeVariant = variantForm[prop];
        if (nameCurrent == typeVariant.pokemon.name) {
            continue;
        } else {
            $('.alternative-forms').show();
            selectVariantForm(typeVariant);
        }
    }

    var qtdFormVariant = $('.card-body .pokemon-variants').children().length;
    var windowWidth = $('section').innerWidth();

    switch (qtdFormVariant) {
        case 1: {
            $('.pokemon-variants').css('grid-template-columns', '1fr');
            break;
        }
        case 2: {
            $('.pokemon-variants').css('grid-template-columns', '1fr 1fr');
            break;
        }
        case 3: {
            if (windowWidth >= 425) {
                $('.pokemon-variants').css('grid-template-columns', '1fr 1fr 1fr');
            } else {
                $('.pokemon-variants').css('grid-template-columns', '1fr 1fr');
            }
            break;
        }
        default: {
            if (windowWidth >= 768) {
                $('.pokemon-variants').css('grid-template-columns', '1fr 1fr 1fr 1fr');
            } else if (windowWidth >= 425) {
                $('.pokemon-variants').css('grid-template-columns', '1fr 1fr 1fr');
            } else {
                $('.pokemon-variants').css('grid-template-columns', '1fr 1fr');
            }
            break;
        }
    }
}

function selectVariantForm(typeVariant) {
    var nameVariant = typeVariant.pokemon.name.replace(/(^[a-z]+\-+)/g, '');
    var nameVariantForm = nameVariant.charAt(0).toUpperCase() + nameVariant.slice(1);

    $('.card-body .pokemon-variants').append('<li id="' + nameVariant + '" class="form-variant">' + nameVariantForm + '</li>');

    $('#' + nameVariant + '').on('click', function () {
        if (!typeVariant.is_default) {
            $('.next').hide();
            $('.previous').hide();
        } else {
            $('.next').show();
            $('.previous').show();
        }
        var urlVariantType = typeVariant.pokemon.url;
        getUrl(urlVariantType);
    });
}

var appendPokemon =
    '<div class="card-body">\n\
        <div class="image-background"></div>\n\
        <div class="info-background">\n\
            <div class="pokemon-info-top">\n\
                <figure class="pokemon-image">\n\
                    <img/>\n\
                </figure>\n\
                <div class="pokemon-name-number">\n\
                    <h1 class="pokemon-name"></h1>\n\
                    <h2 class="pokemon-number"></h2>\n\
                </div>\n\
                <div class="pokemon-type-form">\n\
                    <ul class="pokemon-type"></ul>\n\
                </div>\n\
                <div class="alternative-forms">\n\
                    <div class="alternative-forms-image">\n\
                        <h1>Alternative Forms</h1>\n\
                        <img class="hide-alternative-form" src="assets/img/arrow-collapse.png" alt="Collapse ALternative Form" />\n\
                    </div>\n\
                    <div class="alternative-form-buttons">\n\
                        <ul class="pokemon-variants"></ul>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <div class="pokemon-stats-base">\n\
                <h1>Base Stats</h1>\n\
            </div>\n\
        </div>\n\
    </div>';