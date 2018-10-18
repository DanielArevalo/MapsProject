var ExternalSale = function () {
    this.language = "es";
    this.name;
    this.lastname;
    this.country;
    this.PhoneCode;
    this.Currency;
    this.city;
    this.familiar;
    this.email;
    this.mobilePhone;
    this.plan = 0;
    this.anual;
    this.price = 0;
    this.peopleQ;
    this.bens = [];
    this.cardName;
    this.cardNumber;
    this.cardDueDate;
    this.cardCvc;
    this.setName = function (data) {
        this.name = data;
    }
    this.setLastName = function (data) {
        this.lastname = data;
    }
    this.setCountry = function (data) {
        this.country = data;
    }
    this.setCity = function (data) {
        this.city = data;
    }
    this.setFamiliar = function (data) {
        this.familiar = data;
    }
    this.setEmail = function (data) {
        this.email = data;
    }
    this.setMobilePhone = function (data) {
        this.mobilePhone = data;
    }
    this.setPlan = function (data) {
        this.plan = data;
    }
    this.setMonthly = function (data) {
        this.anual = data;
    }
    this.setPrice = function (data) {
        this.price = data;
    }
    this.setcardName = function (data) {
        this.cardName = data;
    }
    this.setcardNumber = function (data) {
        this.cardNumber = data;
    }
    this.setcardDueDate = function (data) {
        this.cardDueDate = data;
    }
    this.setcardCvc = function (data) {
        this.cardCvc = data;
    }
    this.getPlans = function () {
        $.ajax({
            url: "/Others/GetExternalPlans?cn=" + this.country + "&ci=" + this.city + "&f=" + this.familiar + "&cr=" + this.Currency,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                debugger;
                alert("No hay planes disponibles en el área");
                location.reload();
                return false;
            },
            success: function (result) {
                if (result.length > 0) {
                    /*Translate to new screen*/
                    $(".planCountry").text(sale.country);
                    $(".planNumber").text(result.length);
                    for (var k = 0; k < result.length; k++) {
                        var type = result[k];
                        $('#DrawPlans').append('<div class="col s12 inner-plan-gens" id="Mtype' + k + '"><div class="col s3"><label class="planTypename">' + type[0].PlanType + '</label></div></div>');
                    }
                    var counter = 0;
                    $(result).each(function (i, j) {
                        $("#Mtype" + i).append('<div class="col s9 bordered-plan"><div class="row" id="Atype' + i + '"></div></div>');
                        $(j).each(function (k, l) {
                            var m = currentLang.anual;
                            if (l.Monthly)
                                m = currentLang.mensual;
                            var draw = '<div class="col s6 inner-plan-tab" id="pln' + counter + '" data-planid="' + l.IdPlan + '" onclick="SetSeelingPlan(' + l.IdPlan + ',' + l.PeopleQ + ');">' +
                                '<div class="col s4">' + curr + '$</div>' +
                                '<div class="col s4">' + l.Price + '</div>' +
                                '<div class="col s4"><label for="test' + i + '' + k + '">' + m + '</label><input name="group1" type="radio" id="test' + i + '' + k + '" class="inner-plan-radio" /></div>' +
                                '</div>'
                            $("#Atype" + i).append(draw);
                            counter++;
                        });
                    });
                    SendToTop();
                    $('#tab4').hide("slide", { direction: "left" }, 300);
                    $('#tab5').show("slide", { direction: "right" }, 300);
                    return true;
                }
                SendDataToFailedPlan();
                $('#tab4').hide("slide", { direction: "left" }, 300);
                $('#tabNP').show("slide", { direction: "right" }, 300);
                SendToTop();
                return false;
            },
            async: true
        });
    }
    this.setSale = function () {
        var s = {
            FirstName: this.name,
            LastName: this.lastname,
            Email: this.email,
            Cellphone: this.mobilePhone,
            City: this.city,
            Plan: this.plan,
            PaymentType: 0,
            BuyerName: this.name + " " + this.lastname,
            BuyerCellPhone: this.mobilePhone,
            BuyerEmail: this.email,
            Beneficiaries: this.bens,
            CardData: { cardName: this.cardName, cardNumber: this.cardNumber, cardDueDate: this.cardDueDate, cardCvc: this.cardCvc }
        };
        $.ajax({
            url: "/Others/SetSale",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ saleData: s }),
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                SendToTop();
                alert("Error en el proceso de venta");
                $('#tabP').hide("slide", { direction: "left" }, 300);
                $('#tabF').show("slide", { direction: "right" }, 300);
                return false;
            },
            success: function (result) {
                SendToTop();
                if (result.Error.IsError) {
                    $(".pytError").append(result.Error.Description);
                    $('#tabP').hide("slide", { direction: "left" }, 300);
                    $('#tabF').show("slide", { direction: "right" }, 300);
                } else {
                    var saling = result.Annotations.split('&');
                    $(".pytId").append(saling[0]);
                    $(".pytFrom").append(saling[1]);
                    $(".pytTo").append(saling[2]);
                    $('#tabP').hide("slide", { direction: "left" }, 300);
                    $('#tabS').show("slide", { direction: "right" }, 300);
                }
            },
            async: true
        });
    }
}

var sale = new ExternalSale();
var curr;
var validC = false;
var prod = false;
var propertiesLang;
var type;
var currentLang;

$(function () {
    FillDictionary();
    SetParameters();
    initAutocomplete();
    CheckHeight();
    FillHtmlInfo();
    UpdateSelectedLanguageStyle();
    $(window).resize(function () {
        CheckHeight();
    });
    $("#tab1").fadeIn("1200");
    $("#Dbt1").click(function () {
        if (IsNullOrEmpty("validate", "class"))
            return false;
        sale.setName($("#Name").val());
        sale.setLastName($("#LastName").val());
        $(".naming").text($("#Name").val());
        $("label[for='Country']").addClass("active");
        $('#tab1').hide("slide", { direction: "left" }, 300);
        $('#tab2').show("slide", { direction: "right" }, 300);
        SendToTop();
        return true;
    });
    $("#Dbt2").click(function () {
        if (IsNullOrEmpty("validateA", "class"))
            return false;
        if (IsNullOrEmptyString(sale.country) || IsNullOrEmptyString(sale.PhoneCode)) {
            alert(currentLang.message16);
            return false;
        }
        $('#tab2').hide("slide", { direction: "left" }, 300);
        $('#tab3').show("slide", { direction: "right" }, 300);
        SendToTop();
        return true;
    });
    $(".bordered-item").click(function () {
        $(".bordered-item").removeClass("highlight-item");
        sale.setFamiliar($(this).data("fam"));
        $(this).addClass("highlight-item");
    });
    $("#Dbt3").click(function () {
        if (!$(".bordered-item").hasClass("highlight-item")) {
            alert("Seleccione un tipo de plan");
            return false;
        }
        $('#tab3').hide("slide", { direction: "left" }, 300);
        $('#tab4').show("slide", { direction: "right" }, 300);
        SendToTop();
        return true;
    });
    $("#Dbt4").click(function () {
        if (IsNullOrEmpty("validateB", "class"))
            return false;
        if (!IsValidEmailAddress($("#Email").val())) {
            alert("Email Invalido");
            $('#Email').addClass("invalid");
            return false;
        }
        if ($("#MobPhone").val().length <= 7 || !validatePhone($("#MobPhone").val())) {
            alert("Celular Invalido");
            $('#MobPhone').addClass("invalid");
            return false;
        }
        sale.setEmail($("#Email").val());
        sale.setMobilePhone($("#MobPhone").val());
        if (sale.familiar)
            $(".planType").text("Familiar");
        else
            $(".planType").text("Individual");
        /*Get plans*/
        sale.getPlans();
        $("#Dbt4").hide();
        $(".c-p1").show();
        return true;
    });
    $("#Dbt5").click(function () {
        if (!($("input[type=radio]:checked").length > 0)) {
            alert("Seleccione un plan");
            return false;
        }
        if (!sale.familiar) {
            $('#tab5').hide("slide", { direction: "left" }, 300);
            $('#tabP').show("slide", { direction: "right" }, 300);
            return true;
        }
        for (var i = 0; i < (sale.peopleQ - 1) ; i++) {
            var f = '<h5>' + currentLang.beneficiario + ' ' + (i + 1) + '</h5><div class="row">' +
                '<div class="input-field col s6">' +
                '<i class="material-icons prefix">account_circle</i>' +
                '<input id="NameB' + i + '" type="text" class="validateC">' +
                '<label for="NameB' + i + '">' + currentLang.Name + '</label>' +
                '</div>' +
                '<div class="input-field col s6">' +
                '<i class="material-icons prefix">account_circle</i>' +
                '<input id="LastNameB' + i + '" type="text" class="validateCS">' +
                '<label for="LastNameB' + i + '">' + currentLang.Lastname + '</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="input-field col s6">' +
                '<i class="material-icons prefix">perm_identity</i>' +
                '<input id="CcB' + i + '" type="text" class="validateC">' +
                '<label for="CcB' + i + '">' + currentLang.id + '</label>' +
                '</div>' +
                '<div class="input-field col s6">' +
                '<i class="material-icons prefix">date_range</i>' +
                '<input id="BdtB' + i + '" type="date" class="datepicker">' +
                '<label for="BdtB' + i + '">' + currentLang.birthday + '</label>' +
                '</div>' +
            '</div>';
            $("#Bens").append(f);
        }
        var d = new Date();
        $('.datepicker').pickadate({
            selectMonths: true,
            selectYears: 100,
            closeOnSelect: true,
            closeOnClear: true,
            format: 'yyyy-mm-dd',
            max: d
        });
        $('#tab5').hide("slide", { direction: "left" }, 300);
        $('#tab6').show("slide", { direction: "right" }, 300);
        SendToTop();
        return true;
    });
    $("#Dbt6").click(function () {
        if (IsNullOrEmpty("validateC", "class"))
            return false;
        for (var i = 0; i < (sale.peopleQ - 1) ; i++) {
            sale.bens.push({ Name: $("#NameB" + i).val(), LastName: $("#LastNameB" + i).val(), Cc: $("#CcB" + i).val(), Birthday: $("#BdtB" + i).val(), });
        }
        $('#tab6').hide("slide", { direction: "left" }, 300);
        $('#tabP').show("slide", { direction: "right" }, 300);
        SendToTop();
        return true;
    });
    $("#DbtP").click(function () {
        if (IsNullOrEmpty("validateF", "class"))
            return false;
        if (prod)
            if (!validC) {
                alert('Numero de tarjeta Invalido');
                return false;
            }
        sale.setcardName($("#Ch").val());
        sale.setcardNumber($("#Ccn").val());
        sale.setcardDueDate($("#Cm").val() + "/" + $("#Cy").val());
        sale.setcardCvc($("#Cvc").val());
        sale.setSale();
        $("#DbtP").hide();
        $(".c-p2").show();
        return true;
    });
    $("#DbtR").click(function () {
        $('#tabF').hide("slide", { direction: "left" }, 300);
        $('#tabP').show("slide", { direction: "right" }, 300);
        $("#DbtP").show();
        $(".c-p2").hide();
        SendToTop();
        return true;
    });
    $('#Ccn').validateCreditCard(function (result) {
        if ($(this).val().length > 3) {
            if ($(".card-data-right").text().length < 5) {
                $(this).after('<label for="Ccn" class="card-data-right">' + result.card_type.name + '</label>');
                $(".card-data-right").show();
                $("label[for='Ccn']").addClass("active");
            }
            if (result.valid && result.length_valid && result.luhn_valid)
                validC = true;
            else
                validC = false;
        } else {
            $(".card-data-right").hide();
            $(".card-data-right").empty();
            validC = false;
        }
    });
    SendToTop();
});

function CheckHeight() {
    var h = parseInt($(window).height());
    var w = parseInt($(window).width());
    var hh = parseInt($("header").height());
    var bh = parseInt($("#sale-body").height());
    var sum = parseInt(hh + bh);
    if (w <= 768) {
        $("#sale-body").css("min-height", h + "px");
        $("footer").removeClass("fixed-footer");
    } else {
        if (sum < h) {
            $("#sale-body").css("min-height", h + "px");
            $("footer").removeClass("fixed-footer");
        } else {
            $("#sale-body").css("min-height", "0");
            $("footer").addClass("fixed-footer");
        }
    }
}

function initAutocomplete() {
    autocomplete = new window.google.maps.places.Autocomplete(
        (document.getElementById('Country')),
        { types: ['geocode'] });
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    var place = autocomplete.getPlace();
    var country;
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        switch (addressType) {
            case "locality":
                sale.setCity(place.address_components[i].long_name);
                break;
            case "administrative_area_level_2":
                if (IsNullOrEmptyString(sale.city))
                    sale.setCity(place.address_components[i].long_name);
                break;
            case "administrative_area_level_1":
                if (IsNullOrEmptyString(sale.city))
                    sale.setCity(place.address_components[i].long_name);
                break;
            case "country":
                country = place.address_components[i].long_name;
                break;
        }
    }
    $.get("https://restcountries.eu/rest/v1/name/" + country, function (data) {
        var already = false;
        $(data).each(function (i, j) {
            if (!already)
                if (!IsNullOrEmptyString(j.callingCodes[0])) {
                    if (IsNullOrEmptyString(sale.city))
                        sale.setCity(j.capital);
                    sale.setCountry(j.translations.es);
                    sale.PhoneCode = j.callingCodes[0];
                    sale.Currency = j.currencies[0];
                    curr = j.currencies[0];
                    $("#MobPhone").val("+" + sale.PhoneCode + " ");
                    $("label[for='MobPhone']").addClass("active");
                    already = true;
                }
        });
    });
}

function SetSeelingPlan(data, pq) {
    sale.setPlan(data);
    sale.peopleQ = pq;
}

function IsNullOrEmptyString(data) {
    if (data === "" || data == null || data == " ")
        return true;
    return false;
}

function IsNullOrEmptyArray(data) {
    var val = false;
    $(data).each(function (i, j) {
        if (j === "" || j == null || j == " ")
            val = true;
    });
    return val;
}

function IsNullOrEmpty(name, type) {
    var val = false;
    switch (type) {
        case "class":
            $("." + name).each(function (i, j) {
                if (j.value === "" || j.value == null || j.value == " ") {
                    val = true;
                    $('#' + j.id).addClass("invalid");
                } else
                    $('#' + j.id).addClass("valid");
            });
            break;
    }
    return val;
}

function IsValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

function validatePhone(txtPhone) {
    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    if (filter.test(txtPhone))
        return true;
    return false;
}

function SendDataToFailedPlan() {

}

function SendToTop() {
    //window.scrollTo(0, 0);
    $("html, body").animate({ scrollTop: 0 }, "fast");
}

var QueryString = function () {
    var queryString = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof queryString[pair[0]] === "undefined") {
            queryString[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof queryString[pair[0]] === "string") {
            var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
            queryString[pair[0]] = arr;
        } else {
            queryString[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return queryString;
}();

function FillDictionary() {
    var es = {
        Name: "Nombre",
        Contact: "Contacto",
        Address: "Dirección",
        MainPhone: "Teléfono Principal",
        SecPhone: "Teléfono Secundario",
        Email: "Email",
        Zip: "Código Postal",
        Find: "Buscar",
        FindPlaceHolder: "Ingrese su parámetro de búsqueda",
        SucsPlaceHolder: "Nuestras Sucursales",
        titleSpecific: "Clínicas por estado",
        title1: "Seleccione la distancia",
        totalClinics: "Total de clínicas",
        message1: "Hola Soy Maya, voy buscar un excelente plan en pocos segundos. ¿Estas listo?",
        Home: "Inicio",
        PD: "Planes Dentales",
        RO: "Red de Odontólogos",
        FAQ: "FAQ",
        continuar: "Continuar",
        message2: "Gusto en conocerte <span class='accent-name naming'></span> , ¿en donde deseas usar tu plan?",
        Lastname: "Apellido",
        comprar: "Comprar",
        realizarpago: "Realizar Pago",
        revisarpago: "Revisar Pago",
        Flocation: "Localización",
        message3: "¿Buscas un plan Individual o Familiar?",
        Sindi: "Individual",
        Sfami: "Familiar",
        message4: "<span class='accent-name naming'></span>, tu correo electrónico y teléfono celular y estaremos listos",
        Fcel: "Celular",
        message5: "<span class='accent-name planNumber'>2</span> opciones de plan <span class='accent-name planType'></span> en <span class='accent-name planCountry'></span>",
        message6: "Ingresa la información de los beneficiarios.",
        message7: "Ingresa los datos de tu tarjeta.",
        Fcardnumber: "Número de la tarjeta",
        Fcardcvc: "Código de seguridad",
        Fcardmonth: "Mes",
        Fcardyear: "Año",
        Fcardholder: "Titular de la tarjeta",
        message8: "Gracias por tu compra, el proceso de venta ha sido satisfactorio.",
        message9: "El código de la venta es <label class='pytId highlight-text'></label>.",
        message10: "Puedes empezar a usar tu plan a partir del <label class='pytFrom highlight-text'></label>.",
        message11: "Tu plan vence el <label class='pytTo highlight-text'></label>.",
        message12: "Hubo un error en el proceso de compras.",
        message13: "El error reportado por el sistema es: ",
        message14: "No hay planes disponibles en este área",
        message15: "No te preocupes, tenemos tus datos y cuando tengamos planes disponibles en tu área te contáctaremos.",
        mensual: "Mensual",
        anual: "Anual",
        message16: "Seleccione una localización válida del formulario de autocompletar.",
        beneficiario: "Beneficiario",
        id: "Número de identificación",
        birthday: "Fecha de Nacimiento"
    };
    var en = {
        Name: "Name",
        Contact: "Contact",
        Address: "Address",
        MainPhone: "Main Phone",
        SecPhone: "Secondary Phone",
        Email: "Email",
        Zip: "Zip Code",
        Find: "Search",
        FindPlaceHolder: "Enter your search parameter",
        SucsPlaceHolder: "Our Branches",
        titleSpecific: "Dental office by state",
        title1: "Select the distance",
        totalClinics: "Dental Offices quantity",
        message1: "Hi I'm Maya', I'm gonna give you a great plan in a few seconds. Are you ready?",
        Home: "Home",
        PD: "Dental Plans",
        RO: "Dentists Network",
        FAQ: "FAQ",
        continuar: "Continue",
        message2: "Nice to meet you <span class='accent-name naming'></span> , Where do you think use your plan?",
        Lastname: "Last Name",
        comprar: "Buy",
        realizarpago: "Make a Payment",
        revisarpago: "Check Payment",
        Flocation: "Location",
        message3: "What plan are you looking for?",
        Sindi: "Individual",
        Sfami: "Familiar",
        message4: "<span class='accent-name naming'></span>, give us your email and phone, then we'll be ready",
        Fcel: "Mobile Phone",
        message5: "<span class='accent-name planNumber'></span> plan options <span class='accent-name planType'></span> in <span class='accent-name planCountry'></span>",
        message6: "Enter the beneficiaries information.",
        message7: "Enter the details of your card.",
        Fcardnumber: "Card Number",
        Fcardcvc: "CVV",
        Fcardmonth: "Month",
        Fcardyear: "Year",
        Fcardholder: "Card Holder",
        message8: "Thank you for your purchase, the sale process had been successful.",
        message9: "The sale code is <label class='pytId highlight-text'></label>.",
        message10: "You can use your plan from <label class='pytFrom highlight-text'></label>.",
        message11: "Your plan due date is <label class='pytTo highlight-text'></label>.",
        message12: "We had a mistake in the sale process",
        message13: "The system reported error is: ",
        message14: "We have no available plans in your area.",
        message15: "Don't worry, we got your information, when we have plans we'll reach you.",
        mensual: "Monthly",
        anual: "Yearly",
        message16: "Select a valid location from the form.",
        beneficiario: "Beneficiary",
        id: "Id",
        birthday: "Birthday"
    };
    var pr = {
        Name: "Nome",
        Contact: "contato",
        Address: "Endereço",
        MainPhone: "Telefone principal",
        SecPhone: "Telefone secundário",
        Email: "Email",
        Zip: "CEP",
        Find: "Pesquisa",
        FindPlaceHolder: "Digite seu critério de pesquisa",
        SucsPlaceHolder: "Nossas Filiais",
        titleSpecific: "Clínicas de Estado",
        title1: "Selecione a distância",
        totalClinics: "Total de clínicas",
        message1: "Oi eu sou Maya, eu vou encontrar um excelente plano em poucos segundos. Estás pronto?",
        Home: "Home",
        PD: "Planos Dentales",
        RO: "Rede dentistas",
        FAQ: "FAQ",
        continuar: "Continuar",
        message2: "Prazer em conhecê-lo <span class='accent-name naming'></span> , onde você quiser usar o seu plano?",
        Lastname: "Sobrenome",
        comprar: "Comprar",
        realizarpago: "Fazer o Pagamento",
        revisarpago: "Avaliação de Pagamento",
        Flocation: "Localização",
        message3: "Está à procura de um plano individual ou familiar?",
        Sindi: "Individual",
        Sfami: "Familiar",
        message4: "<span class='accent-name naming'></span>, e-mail e telefone celular para estar prontos",
        Fcel: "Telefone celular",
        message5: "<span class='accent-name planNumber'></span> plano de opções <span class='accent-name planType'></span> em <span class='accent-name planCountry'></span>",
        message6: "Introduza as informações de beneficiário.",
        message7: "Introduza os seus dados de cartão.",
        Fcardnumber: "Número do cartão",
        Fcardcvc: "Código de segurança",
        Fcardmonth: "mês",
        Fcardyear: "Ano",
        Fcardholder: "Titular do cartão",
        message8: "Obrigado por sua compra, o processo de venda foi bem sucedida.",
        message9: "Código de venda é <label class='pytId highlight-text'></label>.",
        message10: "Você pode começar a usar o seu plano de <label class='pytFrom highlight-text'></label>.",
        message11: "Seu plano expira <label class='pytTo highlight-text'></label>.",
        message12: "Houve um erro no processo de aquisição.",
        message13: "O erro relatado pelo sistema é: ",
        message14: "Não há planos nesta área",
        message15: "Não se preocupe, nós temos sua informação, quando temos planos disponíveis em sua área entrará em contato.",
        mensual: "Mensal",
        anual: "Anual",
        message16: "Selecione um local válido do formulário.",
        beneficiario: "Beneficiário",
        id: "Número de identificação",
        birthday: "Aniversário"
    };
    propertiesLang = { Es: es, En: en, Pr: pr };
}

function SetParameters() {
    var lang;
    var userLang = navigator.language || navigator.userLanguage;
    if (!IsNullOrEmptyString(QueryString.lang))
        lang = QueryString.lang;
    else
        lang = userLang.split("-")[0];
    if (lang != null) {
        if (lang === "es") currentLang = propertiesLang.Es;
        else if (lang === "pr" || lang === "br") currentLang = propertiesLang.Pr;
        else currentLang = propertiesLang.En;
    } else currentLang = propertiesLang.En;
}

function FillHtmlInfo() {
    var body = $("body");
    //textos simples
    body.find(".message1").html(currentLang.message1);
    body.find(".message2").html(currentLang.message2);
    body.find(".message3").html(currentLang.message3);
    body.find(".message4").html(currentLang.message4);
    body.find(".message5").html(currentLang.message5);
    body.find(".message6").html(currentLang.message6);
    body.find(".message7").html(currentLang.message7);
    body.find(".message8").html(currentLang.message8);
    body.find(".message9").html(currentLang.message9);
    body.find(".message10").html(currentLang.message10);
    body.find(".message11").html(currentLang.message11);
    body.find(".message12").html(currentLang.message12);
    body.find(".message13").html(currentLang.message13);
    body.find(".message14").html(currentLang.message14);
    body.find(".message15").html(currentLang.message15);
    body.find(".Fnaming").html(currentLang.Name);
    body.find(".Flastning").html(currentLang.Lastname);
    body.find(".MenuH").html(currentLang.Home);
    body.find(".MenuPD").html(currentLang.PD);
    body.find(".MenuRO").html(currentLang.RO);
    body.find(".MenuFAQ").html(currentLang.FAQ);
    body.find(".Flocation").html(currentLang.Flocation);
    body.find(".Sindi").html(currentLang.Sindi);
    body.find(".Sfami").html(currentLang.Sfami);
    body.find(".Fcel").html(currentLang.Fcel);
    body.find(".Femail").html(currentLang.Email);
    //Buttons // Inputs
    body.find(".cotinueM").val(currentLang.continuar);
    body.find(".buyM").val(currentLang.comprar);
    body.find(".rpp").val(currentLang.realizarpago);
    body.find(".rvp").val(currentLang.revisarpago);
    body.find(".Fcardnumber").attr("placeholder", currentLang.Fcardnumber);
    body.find(".Fcardcvc").attr("placeholder", currentLang.Fcardcvc);
    body.find(".Fcardmonth").attr("placeholder", currentLang.Fcardmonth);
    body.find(".Fcardyear").attr("placeholder", currentLang.Fcardyear);
    body.find(".Fcardholder").attr("placeholder", currentLang.Fcardholder);
}

function UpdateSelectedLanguageStyle() {
    var lang = "es";
    if (!IsNullOrEmptyString(QueryString.lang))
        lang = QueryString.lang;
    var items = $(".languageSelection li");
    $.each(items, function (i, j) {
        if ($(this).attr("data-lang") === lang)
            $(this).addClass("selected-lang");
    });
}