var saleObj = {};
var bens = 0;
var same = false;
var valC = false;
var latamPlans;
var familiar = false;
var anual = false;
var max = 1;
var existingBens = 0;

$(document).ready(function () {
    // $('select').material_select();
});

$(function () {
    GraphInitials();
    $('#btnStep1').click(function () {
        if ($('#Plans')[0].value !== "0") {
            saleObj.CountryId = $('#sltCountry').val();
            saleObj.Plan = $('#Plans').val();
            max = parseInt($('#Plans option:selected').data("desc").split('-')[2].replace(' ', '')) - 1;
            $('.steps-former .atr1').removeClass("ls-active");
            $('.steps-former .atr1').addClass("ls-past");
            $('.steps-former .atr2').addClass("ls-active");
            if (max > 1) {
                $('.incld').text('* Incluir beneficiarios (' + max + ')');
                $('.incld').show();
            }
            SlideAndHide("#Stp1");
            GraphStep2();
        } else {
            $('#Plans').addClass('invalidA');
        }
    });
    $('#btnStep2').click(function () {
        if ($('#Mobile').val().length < 6) {
            $('#Mobile').addClass("invalid");
            alert('Ingrese un Celular válido');
            return false;
        }
        var myphone = $('#Mobile').val().replace(/\D/g, '');
        if (myphone.length < 6) {
            alert('Ingrese un Celular Válido');
            return false;
        }
        if ($('#Same').val() != "0" && $('#Same').val() != "1") {
            $('#Same').addClass("invalidA");
            return false;
        }
        if ($('#Name').val().length < 1) {
            $('#Name').addClass("invalid");
            return false;
        }
        if ($('#LastName').val().length < 1) {
            $('#LastName').addClass("invalid");
            return false;
        }
        $('#Same').removeClass("invalidA");
        if ($('#Same').val() === "1") {
            if ($('#Email').val().length < 1) {
                $('#Email').addClass("invalid");
                return false;
            }
            if (!validateEmail($('#Email').val())) {
                alert('Ingrese un Email Válido');
                return false;
            }
            same = true;
        }
        var full = true;
        $('.selectium').each(function (i, j) {
            if (IsNullOrEmpty(j.value)) {
                full = false;
                $('#' + j.id).addClass("invalid");
            } else $('#' + j.id).addClass("valid");
        });
        if (!full) {
            alert('Ingrese todos los campos obligatorios');
            return false;
        }
        saleObj.FirstName = $('#Name').val();
        saleObj.LastName = $('#LastName').val();
        saleObj.CustomerId = $('#cId').val();
        saleObj.Cellphone = myphone;
        saleObj.Email = $('#Email').val();
        saleObj.Street = $('#Address').val();
        saleObj.Birthday = $('#Birthday').val();
        saleObj.Gender = "Male";
        if (existingBens > 0) {
            var beints = [];
            for (var k = 0; k < existingBens; k++) {
                beints.push({ Name: $("#Name" + k).val(), Lastname: $("#LastName" + k).val(), Id: $("#cId" + k).val() });
            }
            saleObj.Beneficiaries = beints;
        }
        $('.steps-former .atr2').removeClass("ls-active");
        $('.steps-former .atr2').addClass("ls-past");
        $('.steps-former .atr3').addClass("ls-active");
        SlideAndHide("#Stp2");
        GraphStep3();
    });
    $('#btnStep3').click(function () {
        var ver = true;
        $('.validCarda').each(function (i, j) {
            if ($(this)[0].value.length < 1) {
                ver = false;
                $(this).addClass("invalid");
            }
        });
        if (!ver) {
            return false;
        }
        if (saleObj.PaymentType === 0) {
            if (!valC) {
                alert('Tarjeta no válida');
                return false;
            }
            ver = true;
            $('.validCard').each(function (i, j) {
                if ($(this)[0].value.length < 1) {
                    ver = false;
                    $(this).addClass("invalid");
                }
            });
            if (!ver) {
                alert('Por favor, llene todos los campos obligatorios');
                return false;
            } else {
                saleObj.CardData = {
                    CardName: $('#CH').val(), CardNumber: $('#CN').val(), CardCvc: $('#CV').val(),
                    CardExpirationMonth: $('#EM').val(), CardExpirationYear: $('#EY').val()
                };
            }
        }
        saleObj.BuyerName = $('#BuyerName').val();
        saleObj.BuyerCellPhone = $('#BuyerPhone').val();
        saleObj.BuyerEmail = $('#BuyerMail').val();
        GoBuy();
        return true;
    });
    $("input[name='groupP']").change(function () {
        $('.payment').each(function (i, j) {
            $(this).removeClass("visible");
        });
        $('.' + $(this)[0].id).addClass("visible");
        saleObj.PaymentType = parseInt($(this)[0].value);
    });
    $('.datepicker').pickadate({
        format: 'yyyy-mm-dd',
        //selectYears: true,
        selectMonths: true,
        monthsFull: ['Enero', 'Fébrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
        today: 'Hoy',
        clear: 'Borrar',
        close: 'Cerrar',
        formatSubmit: 'yyyy/mm/dd',
        selectYears: 100,
        max: true
    });
    $('.selectium').change(function () {
        if ($(this).hasClass("invalid")) {
            $(this).removeClass("invalid");
            $(this).addClass("valid");
        } else if ($(this).hasClass("invalidA")) {
            $(this).removeClass("invalidA");
        }
    });
    $('.validCarda').change(function () {
        if ($(this).hasClass("invalid")) {
            $(this).removeClass("invalid");
            $(this).addClass("valid");
        }
    });
    $('.validCard').change(function () {
        if ($(this).hasClass("invalid")) {
            $(this).removeClass("invalid");
            $(this).addClass("valid");
        }
    });
});

function GraphInitials() {
    $('.steps-former .atr1').addClass("ls-active");
    GetAndGraphCountries();
    GetAndGraphPayment();
}

function GetAndGraphCountries() {
    $.ajax({
        url: '/Sales/GetCountries',
        type: "POST",
        cache: true,
        success: function (data) {
            if (data.length < 1) {
                alert('Error cargando la lista de paises, por favor recargue la página');
                return false;
            } else {
                try {
                    if (data.Countries.length < 1) {
                        alert('Error cargando la lista de paises, por favor recargue la página');
                        return false;
                    }
                } catch (e) {

                }
                console.log("Paises");
                $(data).each(function (i, j) {
                    console.log(i, j);
                    var opt1 = '<option value="' + j.CountryId + '">' + j.Country + '</option>';
                    $('#sltCountry').append(opt1);
                });
                $("#Cntr").fadeIn("slow");
                $('#sltCountry').change(function () {
                    ShowCortinilla();
                    GetAndGraphPlans();
                });
            }
            return true;
        },
        error: function (xhr) {
            debugger;
            alert('Hubo error en el tiempo de espera, por favor vuelva a intentarlo.');
            saleObj = {};
            location.reload();
        }
    });
}

function GetAndGraphPlans() {
    $('#latP').empty();
    $('#plny').empty();
    var country = parseInt($('#sltCountry').val());
    if (country === 0) {
        $('#Plans').empty();
        $("#plny").fadeOut("slow");
        $('#btnStep1').fadeOut("slow");
        $('#latP').empty();
    } else {
        var val = $('#sltCountry option:selected').text().toUpperCase();
        if (val !== "LATAM" && val !== "LAT" && val !== "LATINOAMÉRICA")
            GetPlans(country);
        else
            DrawAndPlayLatam();
    }
}

function DrawAndPlayLatam() {
    $('#latP').append('<h5>Selecciona el tipo de plan</h5>' +
        '<select id="FamType">' +
        '<option value="0" selected>Selecciona una opción</option>' +
        '<option value="false">Individual</option>' +
        '<option value="true">Familiar</option>' +
        '</select>' +
        '<div id="pmDv"></div>');
    HideCortinilla();
    $('#FamType').change(function () {
        $('#pmDv').empty();
        $('#plny').empty();
        $('#pmDv').append('<h5>Selecciona el periodo de pago</h5>' +
                '<select id="PmntTp">' +
                '<option value="0" selected>Selecciona una opción</option>' +
                '<option value="false">Mensual</option>' +
                '<option value="true">Anual</option>' +
                '</select>');
        $('#PmntTp').change(function () {
            $('#plny').empty();
            GetAndDrawLatam();
        });
    });
}

function GetAndDrawLatam() {
    ShowCortinilla();
    familiar = $('#FamType').val();
    anual = $('#PmntTp').val();
    $.ajax({
        url: '/Sales/GetPlansLatam?familiar=' + familiar + '&anual=' + anual,
        type: "GET",
        cache: true,
        success: function (data) {
            $('#Plans').empty();
            $("#plny").fadeOut("slow");
            $('#btnStep1').fadeOut("slow");
            if (data.length < 1) {
                alert('No existen planes para este país, por favor seleccione otro país e intente de nuevo');
            } else {
                $('#plny').html('<h5 class="section-title">Elige un plan</h5><select id="Plans" class="selectium"></select>');
                console.log("Planes");
                var opt1 = '<option value="0" disabled selected>Selecciona un plan</option>';
                $('#Plans').append(opt1);
                $(data).each(function (i, j) {
                    console.log(i, j);
                    opt1 = '<option value="' + j.PlanId + '" data-desc="' + j.Description + '" data-currency="' + j.Currency + '" ' +
                        'data-price="' + j.Value + '">' + j.PlanName + '</option>';
                    $('#Plans').append(opt1);
                });
                $("#plny").fadeIn("slow");
                $('#btnStep1').fadeIn('fast');
            }
            HideCortinilla();
        },
        error: function (xhr) {
            debugger;
            alert('Hubo error en el tiempo de espera, por favor vuelva a intentarlo.');
            saleObj = {};
            location.reload();
        }
    });
}

function GetAndGraphPayment() {
    $.ajax({
        url: '/Sales/GetPf',
        type: "POST",
        cache: true,
        success: function (data) {
            if (data.length < 1) {
                alert('Usted no posee formas de pago asociadas, no puede realizar la venta');
                location.reload();
            } else {
                GraphPm(data);
            }
        },
        error: function (xhr) {
            debugger;
            alert('Usted no posee formas de pago asociadas, no puede realizar la venta o hubo un error al obtenerlas');
            location.reload();
        }
    });
}

function GraphPm(data) {
    //debugger;
    $(data).each(function (i, j) {
        if (j === "EFECTIVO") {
            $('.pmntO').append('<div class="col-md-4"><input class="with-gap" name="groupP" type="radio" id="Cashe" checked value="1" /><label for="Cashe">Efectivo</label></div>');
            $('.pmntI').append('<div class="col-md-12 Cashe payment visible"><span>El método de pago escogido es efectivo, recuerde recibir el valor total de la transacción.</span></div>');
        }
        if (j === "TARJETA DE CREDITO") {
            $('.pmntO').append('<div class="col-md-4"><input class="with-gap" name="groupP" type="radio" id="Carde" value="0" /><label for="Carde">Tarjeta de Crédito</label></div>');
            var tc = '<div class="col-md-12 Carde payment">'
                        + '<span>El método de pago escogido es tarjeta, ingrese la siguiente información.</span>'
                        + '<div class="input-field col-md-6">'
                            + '<input id="CN" type="text" class="validCard" name="card_number" placeholder="1234 5678 9012 3456">'
                            + '<label for="CN">Número de la tarjeta (*)</label>'
                        + '</div>'
                        + '<div class="input-field col-md-6">'
                            + '<select id="EM" class="validCard">'
                                + '<option disabled selected>Mes de expiración (*)</option>'
                                + '<option value="01">Enero</option>'
                                + '<option value="02">Febrero</option>'
                                + '<option value="03">Marzo</option>'
                                + '<option value="04">Abril</option>'
                                + '<option value="05">Mayo</option>'
                                + '<option value="06">Junio</option>'
                                + '<option value="07">Julio</option>'
                                + '<option value="08">Agosto</option>'
                                + '<option value="09">Septiembre</option>'
                                + '<option value="10">Octubre</option>'
                                + '<option value="11">Noviembre</option>'
                                + '<option value="12">Diciembre</option>'
                            + '</select>'
                        + '</div>'
                        + '<div class="input-field col-md-6">'
                            + '<select id="EY" class="validCard">'
                                + '<option disabled selected>Año de expiración (*)</option>'
                            + '</select>'
                        + '</div>'
                        + '<div class="input-field col-md-6">'
                            + '<input id="CV" type="number" class="validCard" min="000" max="9999" maxlength="4">'
                           + ' <label for="CV">Código de Seguridad (*)</label>'
                        + '</div>'
                        + '<div class="input-field col-md-6">'
                            + '<input id="CH" type="text" class="validCard">'
                            + '<label for="CH">Nombre en la tarjeta (*)</label>'
                        + '</div>'
                    + '</div>';
            $('.pmntI').append(tc);
            var currentYear = (new Date).getFullYear();
            for (var k = 0; k < 10; k++) {
                var maxY;
                if (k === 0)
                    maxY = currentYear;
                else
                    maxY = parseInt(currentYear) + (k + 1);
                $('#EY').append('<option value="' + maxY + '">' + maxY + '</option>');
            }
        }
        if (j === "TARJETA DE CREDITO (PREVENTA)") {
            $('.pmntO').append('<div class="col-md-4"><input class="with-gap" name="groupP" type="radio" id="CardePref" value="2" /><label for="CardePref">Tarjeta de Crédito (Preventa)</label></div>');
            $('.pmntI').append('<div class="col-md-12 CardePref payment"><span>El método de pago escogido es Tarjeta de crédito (Preventa), recuerde que el cliente recibirá un correo electrónico con un link para poder realizar el pago.</span></div>');
        }
    });
    $("input[name='groupP']").change(function () {
        $('.payment').each(function (i, j) {
            $(this).removeClass("visible");
        });
        $('.' + $(this)[0].id).addClass("visible");
        saleObj.PaymentType = parseInt($(this)[0].value);
    });
    $('#CN').keyup(function () {
        $('#CN').validateCreditCard(function (result) {
            valC = result.valid;
            //debugger;
            if (valC) {
                //debugger;
                var imgUrl = '../../Content/Images/others.png';
                switch (result.card_type.name) {
                    case "visa":
                        imgUrl = '../../Content/Images/visa.png';
                        break;
                    case "amex":
                        imgUrl = '../../Content/Images/amex.png';
                        break;
                    case "diners_club_international":
                        imgUrl = '../../Content/Images/diners.png';
                        break;
                    case "diners_club_carte_blanche":
                        imgUrl = '../../Content/Images/diners.png';
                        break;
                    case "visa_electron":
                        imgUrl = '../../Content/Images/visa.png';
                        break;
                    case "mastercard":
                        imgUrl = '../../Content/Images/master.png';
                        break;
                    case "discover":
                        imgUrl = '../../Content/Images/discover.jpg';
                        break;
                    case "maestro":
                        imgUrl = '../../Content/Images/maestro.png';
                        break;
                }
                $('#CN').css('background-image', 'url(' + imgUrl + ')');
            } else {
                $("#CN").css('background-image', 'none');
            }
        });
    });
}

function GetPlans(country) {
    $.ajax({
        url: '/Sales/GetPlansByCountries',
        type: "POST",
        cache: true,
        data: { 'country': country },
        success: function (data) {
            $('#Plans').empty();
            $("#plny").fadeOut("slow");
            $('#btnStep1').fadeOut("slow");
            if (data.length < 1) {
                alert('No existen planes para este país, por favor seleccione otro país e intente de nuevo');
            } else {
                $('#plny').html('<h5 class="section-title">Elige un plan</h5><select id="Plans" class="selectium"></select>');
                console.log("Planes");
                var opt1 = '<option value="0" disabled selected>Selecciona un plan</option>';
                $('#Plans').append(opt1);
                $(data).each(function (i, j) {
                    console.log(i, j);
                    opt1 = '<option value="' + j.PlanId + '" data-desc="' + j.Description + '" data-currency="' + j.Currency + '" ' +
                        'data-price="' + j.Value + '">' + j.PlanName + '</option>';
                    $('#Plans').append(opt1);
                });
                $("#plny").fadeIn("slow");
                $('#btnStep1').fadeIn('fast');
            }
            HideCortinilla();
        },
        error: function (xhr) {
            debugger;
            alert('Hubo error en el tiempo de espera, por favor vuelva a intentarlo.');
            saleObj = {};
            location.reload();
        }
    });
}

function SlideAndHide(id) {
    $(id).hide('fade', { direction: 'left' }, 300);
}

function GraphStep2() {
    $('#Stp2').fadeIn("slow");
}

function GraphStep3() {
    saleObj.PaymentType = 1;
    if (same) {
        $('#BuyerMail').val($('#Email').val());
        $('#BuyerName').val($('#Name').val() + " " + $('#LastName').val());
        if ($('#Mobile').val().length > 0) {
            $('#BuyerPhone').val($('#Mobile').val());
            $('.lblBBna').addClass("active");
        }
        $('.lblBBn').addClass("active");
    }
    FillReview();
    $('#Stp3').fadeIn("slow");
}

function GoBuy() {
    ShowCortinilla();
    $('#ContenedorWarning').empty();
    $.ajax({
        url: '/Sales/SetSale',
        type: "POST",
        cache: true,
        data: { 'sale': saleObj },
        success: function (data) {
            HideCortinilla();
            var title;
            var content;
            var btn;
            if (data.Error.IsError) {
                title = '<label class="title-error">Error procesando la venta</label>';
                $("#ContenedorWarning").append(title);
                var ds = data.Error.Description.split('-');
                content = '<label class="content-error">Descripcion: ' + ds[0] + '<br>' +
                    'Mensaje: ' + data.Error.Message + '<br>' +
                    'Source: ' + data.Error.Source + '</label>';
                $("#ContenedorWarning").append(content);
                btn = '<input type="submit" class="button-error btn" value="Revisar Venta" onclick="ReviewSale();" />';
                $("#ContenedorWarning").append(btn);
            } else {
                var venta = data.Annotations.split('&');
                if (venta[0] === "2") {
                    title = '<label class="title-success">Gracias por comprar con SmileGo</label>';
                    $("#ContenedorWarning").append(title);
                    content = '<label class="content-success">La venta ha sido procesada y pronto llegará ' +
                        'un correo electrónico al comprador.';
                    $("#ContenedorWarning").append(content);
                    btn = '<input type="submit" class="button-success btn" value="Aceptar" onclick="NewSale();" />';
                    $("#ContenedorWarning").append(btn);
                } else {
                    title = '<label class="title-success">Gracias por comprar con SmileGo</label>';
                    $("#ContenedorWarning").append(title);
                    content = '<label class="content-success">Código de venta: ' + venta[0] + '<br>' +
                        'Fecha inicio plan: ' + venta[1] + '<br>' +
                        'Fecha Fin plan: ' + venta[2] + '</label>';
                    $("#ContenedorWarning").append(content);
                    btn = '<input type="submit" class="button-success btn" value="Aceptar" onclick="NewSale();" />';
                    $("#ContenedorWarning").append(btn);
                }
            }
            ShowCortinillaWarning();
        },
        error: function (xhr) {
            HideCortinilla();
            alert('Hubo error en el tiempo de espera, por favor vuelva a intentarlo.');
            saleObj = {};
            location.reload();
        }
    });
}

function ReviewSale() {
    HideCortinillaWarning();
    $('#Stp3').fadeOut("slow");
    $('#Stp1').fadeIn("slow");
}

function ReviewSaleR() {
    location.reload();
}

function NewSale() {
    saleObj = {};
    location.reload();
}

function NewSaleR() {
    window.location.href = "http://www.smilego.com/";
}

function FillReview() {
    var pln = $('#Plans').find(":selected")[0];

    //debugger;
    $(".buy-review").empty();
    $(".buy-review").append('<h5 class="section-title">Revisión de la compra</h5>');
    //var gnrr = 'Masculino';
    //if ($('#Genre').val() != "Male") {
    //gnrr = 'Femenino';
    //}
    var ctn = '<div class="col-md-6">' +
        '<label class="title-review">Titular del plan</label>' +
        '<ul>' +
        '<li>Nombre: ' + $('#Name').val() + ' ' + $('#LastName').val() + '</li>' +
        '<li>Identificación: ' + $('#cId').val() + '</li>' +
        '<li>Celular: ' + $('#Mobile').val() + '</li>' +
        '<li>Email: ' + $('#Email').val() + '</li>' +
        //'<li>Género: ' + gnrr + '</li>' +
        '<li>Dirección: ' + $('#Address').val() + '</li>' +
        '<li>Fecha de nacimiento: ' + $('#Birthday').val() + '</li>' +
        '</ul>' +
        '</div>' +
        '<div class="col-md-4">' +
        '<label class="title-review">Plan Adquirido</label>' +
        '<ul>' +
        '<li>Nombre: ' + pln.text + '</li>' +
        '<li>Descripción: ' + pln.attributes[1].value + '</li>' +
        '<li>País de uso: ' + $("#sltCountry option:selected").text() + '</li>' +
        '</ul>' +
        '</div>' +
        '<div class="col-md-2">' +
        '<label class="title-review">Total</label>' +
        '<span class="total-review">' + pln.attributes[3].value + ' ' + pln.attributes[2].value + '</span>' +
        '</div>';
    $(".buy-review").append(ctn);
}

function BenScreen() {
    $('#Fillbens').append('<div class="input-field col-md-12 benito"><h5 class="section-title">Ingresa los datos del beneficiario que usará el plan, los campos con (*) son obligatorios</h5>' +
        '<div class="input-field col-md-6">' +
        '<input id="Name' + existingBens + '" type="text" class="selectium">' +
        '<label for="Name' + existingBens + '">Nombre (*)</label>' +
        '</div>' +
        ' <div class="input-field col-md-6">' +
            '<input id="LastName' + existingBens + '" type="text" class="selectium">' +
            '<label for="LastName' + existingBens + '">Apellido (*)</label>' +
        '</div>' +
        '<div class="input-field col-md-6">' +
            '<input id="cId' + existingBens + '" type="text" class="selectium">' +
            '<label for="cId' + existingBens + '">Identificación (*)</label>' +
        '</div></div>');
    if ((max - $('.benito').length) !== 0) {
        $('.incld').empty();
        $('.incld').text('* Incluir beneficiarios (' + (max - 1) + ')');
    } else $('.incld').hide();
    existingBens++;
}