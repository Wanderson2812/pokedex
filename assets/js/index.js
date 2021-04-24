function getUrl(url) {
    $.ajax({
        url: url || "https://pokeapi.co/api/v2/pokemon/3",
        success: function (req) {
            createObject(req);
            nextPrevious(req);
            search();
        }
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
    objPokemon.name = objPokemon.name.charAt(0).toUpperCase() + objPokemon.name.slice(1);

    $('section .content').append(appendPokemon);

    var $this = $('.card-body').attr('id', objPokemon.id);
    getInfo(objPokemon, $this);

    $this.find('figure.pokemon-image img').attr('src', objPokemon.image).attr('alt', objPokemon.name);
    $this.find('.pokemon-info-top .pokemon-name-number h1').text(objPokemon.name);
    $this.find('.pokemon-info-top .pokemon-name-number h2').text("#" + objPokemon.id);
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
        });
    });
}

function getVariantForm(obj) {
    var urlSpecie = obj.species.url;
    $.ajax({
        url: urlSpecie,
        success: function (req) {
            var variant = req.varieties;
            appendVariantForm(variant);
        }
    });
}

function appendVariantForm(variant) {
    var variantForm = variant;
    for (let prop in variantForm) {
        if (!variantForm[prop].is_default) {
            debugger
            var variantType = variantForm[prop].pokemon.name.replace(/(^[a-z]+\-+)/g, '');
        }
    }
}

var appendPokemon =
    '<div class="card-body">\n\
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
        </div>\n\
        <div class="pokemon-stats-base">\n\
            <h1>Base Stats</h1>\n\
        </div>\n\
    </div>';

var appendButtomPokemonVariantForm =
'';



/* <div class="pokemon-variants">\n\
                    <div class="mega">\n\
                        <img src="assets/img/mega-evolution.png" alt="MegaEvolution">\n\
                    </div>\n\
                    <div class="gmax">\n\
                        <img src="assets/img/gigantamax.png" alt="GigantaMax">\n\
                    </div>\n\
                </div>\n\ */