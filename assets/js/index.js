var objUrl;
function getListPokemon(url) {
    $.ajax({
        url: url || "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1",
        success: function (req) {
            objUrl = req;
            getUrlPokemon(objUrl);
            //getNextPrevUrl(req);
        }
    });
}
getListPokemon();

function getUrlPokemon(req) {
    var listUrlPokemon = req.results;

    for (let prop in listUrlPokemon) {
        debugger
        var url = listUrlPokemon[prop].url;
        $.ajax({
            url: url,
            async: false,
            success: function (req) {
                createObjectPokemon(req);
                nextPreviousPokemon();
            }
        });
    }

    // if (!$('.content').hasClass('slick-slider')) {
    //     debugger
    //     $('.content').slick({
    //         useCSS: false,
    //         arrows: false,
    //         mobileFirst: true,
    //         infinite: false
    //     });
    // } else {
    //     $('.content').slick('refresh');
    //}
}

function createObjectPokemon(obj) {
    debugger
    var objPokemon = {
        name: obj.name,
        image: obj.sprites.other["official-artwork"].front_default,
        types: obj.types,
        stats: obj.stats,
        id: obj.id
    }
    appendCardPokemon(objPokemon);
}

function appendCardPokemon(objPokemon) {
    $('.card-body.old-card').remove();
    objPokemon.name = objPokemon.name.charAt(0).toUpperCase() + objPokemon.name.slice(1);

    // if (lastIndex) {
    //     $('section .content').slick('slickAdd', appendPokemon);
    // } else {
    $('section .content').append(appendPokemon);
    //}

    var $this = $('.card-body').last().attr('id', objPokemon.id);
    getInfoPokemon(objPokemon, $this);

    $this.find('figure.pokemon-image img').attr('src', objPokemon.image).attr('alt', objPokemon.name);
    $this.find('.card-body-info .pokemon-name-number h1').text(objPokemon.name);
    $this.find('.card-body-info .pokemon-name-number h2').text("#" + objPokemon.id);
}

function getInfoPokemon(objPokemon, $this) {
    var colorType = [];

    //get color type pokemon
    for (var i = 0; i < objPokemon.types.length; i++) {
        var slot = objPokemon.types[i].slot;
        var type = objPokemon.types[i].type;

        colorType.push(type.name);

        $this.find(".pokemon-types .pokemon-type").append('<li class="type' + slot + '"></li>');
        $this.find(".type" + slot + "").text(type.name.toUpperCase());
        $this.find(".type" + slot + "").css("background", "var(--" + type.name + ")");
        $this.find(".type" + slot + "").css("border", "var(--bs-" + type.name + ")");

        if (objPokemon.types.length == 1) {
            $this.find(".type" + slot + "").addClass('monoType');
        }
    }

    //get base stats pokemon
    for (var j = 0; j < objPokemon.stats.length; j++) {
        var type_stat = objPokemon.stats[j].stat.name;
        var base_type_stat = objPokemon.stats[j].base_stat;
        var nameStat;

        $this.find(".pokemon-stats-base").append('<ul class="pokemon-stats">\n\
                                                        <li class="stats-name ' + type_stat + '"></li>\n\
                                                        <li class="stats-value ' + base_type_stat + '"></li>\n\
                                                        <li class="stats-bar">\n\
                                                            <span class="stats-preogress"></span>\n\
                                                        </li>\n\
                                                    </ul>');

        var $nameStat = $this.find("." + type_stat + "");
        if (type_stat == 'hp') {
            $nameStat.text(type_stat.toUpperCase());
        } else if (type_stat == 'attack') {
            nameStat = 'atk';
            $nameStat.text(nameStat.toUpperCase());
        } else if (type_stat == 'defense') {
            nameStat = 'def';
            $nameStat.text(nameStat.toUpperCase());
        } else if (type_stat == 'special-attack') {
            nameStat = 'sp.atk';
            $nameStat.text(nameStat.toUpperCase());
        } else if (type_stat == 'special-defense') {
            nameStat = 'sp.def';
            $nameStat.text(nameStat.toUpperCase());
        } else if (type_stat == 'speed') {
            $nameStat.text(type_stat.toUpperCase());
        }

        var $statValue = $this.find("." + base_type_stat + "");
        $statValue.text(base_type_stat);
        $statValue.parent().find('.stats-bar .stats-preogress').css('width', base_type_stat + 'px');
    }

    //validation apply color background by type pokemon
    if (colorType.length > 1) {
        var colorTypeDuo = colorType.toString().replace(',', '-');
        $this.css("background", "var(--bg-" + colorTypeDuo + ")");
    } else {
        var colorTypeMono = colorType.toString().replace(',', '-');
        $this.css("background", "var(--bg-" + colorTypeMono + ")");
    }
}

function nextPreviousPokemon() {
    debugger
    var next = objUrl.next;
    var previous = objUrl.previous;

    $(".next").unbind('click');
    $('.next').on('click', function () {
        debugger
        $('.content').find('.card-body').addClass('old-card');
        getListPokemon(next);
        // if (slickNextPrev.currentSlideB < slickNextPrev.nextSlideB) {
        //     countIndex = countIndex + 1;
        //     slickNextPrev.direction = 'right';
        // }
    });

    $(".previous").unbind('click');
    $('.previous').on('click', function () {
        debugger
        $('.content').find('.card-body').addClass('old-card');
        getListPokemon(previous);
        // if (slickNextPrev.currentSlideB > slickNextPrev.nextSlideB) {
        //     countIndex = countIndex - 1;
        //     slickNextPrev.direction = 'left';
        // }
    });

}

// function getNextPrevUrl(req) {
//     //debugger
//     urlNext = req.next;
//     urlPrev = req.previous;
// }

// var lastIndex, countIndex = 1;
// function slickSlide(req) {
//     $('.content').slick({
//         useCSS: false,
//         mobileFirst: true,
//         infinite: false,
//         // nextArrow: '<span class="slick-next"></span>',
//         // prevArrow: '<span class="slick-prev"></span>',
//         edgeFriction: 0.5,
//         speed: 800
//     });

//     $('.content').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
//         debugger
//         slick.nextSlideB = nextSlide;
//         slick.currentSlideB = currentSlide;
//     });

//     $('.content').on('afterChange', function (slick, currentSlide) {
//         debugger
//         nextPreviousPokemon();
//         //$('.content').slick('refresh');

//         // if (countIndex > currentSlide.slideCount - 1) {
//         //     lastIndex = true;
//         //     getListPokemon(urlNext);
//         // }
//     });

//     $('.content').on('reInit', function (slick) {
//         debugger
//         nextPreviousPokemon();
//         // var slickReinit = $('.content').slick('getSlick');
//         // var totalSlide = slickReinit.slideCount;
//         // var totalSlideAppend = $('.content').find('.card-body').length;
//         // var removeOldSlides = totalSlideAppend / 2;
//     });

//     $('.content').on('init', function (slick) {
//         debugger
//         nextPreviousPokemon();
//     });

//     // $('.content').on('edge', function (event, slick, direction) {
//     //     //debugger
//     //     slick.lastIndex = true;
//     //     slick.directionEdge = direction;
//     // });
// }

var appendPokemon =
    '<div class="card-body">\n\
        <div class="card-body-info">\n\
            <div class="pokemon-info-top">\n\
                <figure class="pokemon-image">\n\
                    <img/>\n\
                </figure>\n\
                <div class="pokemon-name-number">\n\
                    <h1 class="pokemon-name"></h1>\n\
                    <h2 class="pokemon-number"></h2>\n\
                </div>\n\
                <div class="pokemon-types">\n\
                    <ul class="pokemon-type"></ul>\n\
                </div>\n\
            </div>\n\
            <div class="pokemon-info-base-stats">\n\
                <div class="pokemon-stats-base">\n\
                    <h1>Base Stats</h1>\n\
                </div>\n\
            </div>\n\
        </div>\n\
    </div>';