﻿$(function () {

});

function ShowCortinilla() {
    $('.Cortinilla').show("fast");
}

function HideCortinilla() {
    $('.Cortinilla').hide("fast");
}

function ShowCortinillaWarning() {
    $('.CortinillaWarning').show("fast");
}

function HideCortinillaWarning() {
    $('.CortinillaWarning').hide("fast");
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function IsNullOrEmpty(data) {
    if (data === "" || data == null)
        return true;
    return false;
}