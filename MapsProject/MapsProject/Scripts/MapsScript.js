var map;
var id = $("#Name").val();
console.log(id);
var geocoder;
var type;
var myLatLng = null;
var sucursales;
var propertiesLang;
var currentLang;
var allMarkers = [];
var custCity;
var custCountry;
var custRegion;
var inputM;
var searchBox;
var searchTerms = [];
var currentSearchPlace;
var currentSearchType;
var specialities = [];
var appliedFilters = [];
var infoWindowsOpenCurrently;
var mxResults = 0;
var mapRange;
var currentMeasures = null;
var rpt = true;
var zooming = 16;
var mapsUrl = '/Maps/GetSitePerFilter?';
var markers = [];
var placingEx = null;
var infoWindow;
var AllQueriedSites = [];
var currentMarker = null;
var rCountry;
var rState;
var rCity;
debugger;
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

$(function () {
	GetAllSites();
	FillDictionary();
	if (parseInt($(window).width()) < 901) {
		mxResults = 10;
	}
	$('#MapDistance').change(function () {
		mapRange = $('#MapDistance').val();
		$('.sucursal').hide();
		GetClosestMarkers(parseInt(mapRange));
	});
});

function GetAllSites() {
	$.ajax({
		
		url: "/Maps/GetAllSites",
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		error: function (xhr) {
			alert("Error en la ontención de todos los sitios, por favor recargue la página " + xhr);
		},
		success: function (result) {
			console.log(result);
			if (result.length > 0)
				AllQueriedSites = result;
			else
				alert("Error en la ontención de los sitios, por favor recargue la página getallsite");
		},
		async: true
	});
}

function initMapDa() {
	SetParameters();
	DrawExtras();
	GetPosition2();
	if (!IsNullOrEmptyNew(rCountry))
		SetExtraInfo();
}

function SetExtraInfo() {
	$.get("/Maps/GetCountryInfo?name=" + rCountry, function (data) {
		if (data.length > 0) {
			var cntr = 0;
			$("#CountryInfo").append('<h3>' + currentLang.titleSpecific + '</h3><ul id="extra-info"></ul>');
			$.each(data, function (i, j) {
				$("#extra-info").append('<ul><li>' + j.Name + ' - ' + j.Cantidad + '</li></ul>');
				cntr = cntr + parseInt(j.Cantidad);
			});
			$("#CountryInfo").append('<label>' + currentLang.totalClinics + ': ' + cntr + '</label>');
		} else $("#CountryInfo").empty();
	});
}

function GetPosition2() {
	if (!IsNullOrEmptyNew(rCountry)) {
		var geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ 'address': rCountry }, function (results, status) {
			if (status === window.google.maps.GeocoderStatus.OK) {
				myLatLng = {
					lat: results[0].geometry.location.lat(),
					lng: results[0].geometry.location.lng()
				};
				DrawMap2();
			} else
				alert("Error obteniendo coordenadas del país " + rCountry);
		});
	} else {
		$.getJSON('https://ipinfo.io', function (data) {
			var loc = data.loc.split(',');
			myLatLng = {
				lat: parseFloat(loc[0]),
				lng: parseFloat(loc[1])
			};
			DrawMap2();
		});
	}
}

function SetParameters() {
	var userLang = navigator.language || navigator.userLanguage;
	type = QueryString.type;
	var lang = userLang.split("-")[0];
	if (lang != null) {
		if (lang === "es") currentLang = propertiesLang.Es;
		else if (lang === "pr" || lang === "br") currentLang = propertiesLang.Pr;
		else currentLang = propertiesLang.En;
	} else currentLang = propertiesLang.En;
	rCountry = QueryString.country;
	rState = QueryString.state;
	rCity = QueryString.city;
}

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
		totalClinics: "Total de clínicas"
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
		totalClinics: "Dental Offices quantity"
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
		totalClinics: "Total de clínicas"
	};
	propertiesLang = { Es: es, En: en, Pr: pr };
}

function DrawExtras() {
	$('.sucgenTitle').append(currentLang.SucsPlaceHolder);
	$('.lblHHg').append(currentLang.Find);
	$('#Busqueda').attr("placeholder", currentLang.FindPlaceHolder);
	$('.lblDistance').text(currentLang.title1);
}

function IsNullOrEmpty(string) {
	if (string != null && string !== "") {
		return false;
	}
	return true;
}

function IsNullOrEmptyNew(string) {
	if (string == null || string === "") {
		return true;
	}
	return false;
}

function CheckOrAddSpecialitie(speciality) {
	try {
		if ($.inArray(speciality, specialities) === -1) {
			specialities.push(speciality);
		}
	} catch (e) {
		debugger;
	}
}

function DrawEspecialidades() {
	if (type === "prestador") {
		$('#EspecialidadesFill').empty();
		var specs = '<ul class="ulSpecs">' + '</ul>';
		$('#EspecialidadesFill').append(specs);
		$(specialities).each(function (i, j) {
			var spec = '<li>' +
                '<input type="checkbox" value="' +
                j +
                '" class="liInpEspe" /><label>' +
                j +
                '</label>' +
                '</li>';
			$('.ulSpecs').append(spec);
		});
	}
	$(".liInpEspe").change(function () {
		appliedFilters = [];
		$('.liInpEspe').each(function () {
			var sThisVal = (this.checked ? $(this).val() : "");
			if (!IsNullOrEmpty(sThisVal)) {
				appliedFilters.push(sThisVal);
			}
		});
		if (appliedFilters.length > 0) {
			$('.sucursal').each(function (i, j) {
				var info = $('#' + $(this)[0].id + ' .SpecList').attr("data-especialidad").split(',');
				$(appliedFilters).each(function (k, l) {
					if (jQuery.inArray(l, info) !== -1) $('#' + j.id).show(); else $('#' + j.id).hide();
				});
			});
		} else {
			$('.sucursal').each(function () {
				$('#' + $(this)[0].id).show();
			});
		}
	});
}

function DrawMap2() {
	map = new window.google.maps.Map(document.getElementById('map'), {
		zoom: zooming,
		center: myLatLng,
		mapTypeId: window.google.maps.MapTypeId.ROADMAP,
		icon: '/content/Images/locationG.png'
	});
	var allowed = false;
	if (IsNullOrEmptyNew(rCountry)) {
		try {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					allowed = true;
					MapSetting(position);
				});
				if (allowed) return true;
			}
		} catch (e) {
			debugger;
		}
	}
	var coord = { latitude: myLatLng.lat, longitude: myLatLng.lng }
	var position = { coords: coord }
	MapSetting(position);
	return true;
}

function MapSetting(position) {
	myLatLng = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	};
	map.setCenter(myLatLng);
	geocoder = new window.google.maps.Geocoder;
	geocoder.geocode({ 'location': myLatLng }, function (results, status) {
		if (status === window.google.maps.GeocoderStatus.OK) {
			var placeCounter = results.length - 3;
			custCity = results[placeCounter].address_components[0].long_name.toUpperCase();
			custCountry = results[placeCounter].address_components[1].long_name.toUpperCase();
			custRegion = results[placeCounter].address_components[0].long_name.toUpperCase();
			currentSearchPlace = custCity;
			currentSearchType = "LOCALITY";
			if (results[1]) {
				zooming = 4;
				map.setZoom(zooming);
				currentMarker = new window.google.maps.Marker({
					position: myLatLng,
					map: map,
					icon: '/content/Images/locationG.png'
				});
			} else {
				custCity = "BOGOTÁ";
				custCountry = "COLOMBIA";
				custRegion = "CUNDINAMARCA";
				currentSearchPlace = custCity;
				currentSearchType = "LOCALITY";
			}
		} else {
			custCity = "BOGOTÁ";
			custCountry = "COLOMBIA";
			custRegion = "CUNDINAMARCA";
			currentSearchPlace = custCity;
			currentSearchType = "LOCALITY";
		}
		if (IsNullOrEmptyNew(rCountry)) {
			GetSitePerFilter2(currentSearchPlace, 2);
		} else {
			GetSitePerFilter2(rCountry, 1);
		}
	});
	BounceSearcher();
}

function GetSitePerFilter2(param,id) {
	debugger;
	$.ajax({
		url: mapsUrl + "param=" + param + "&filter=" + id + "&lat=" + myLatLng.lat + "&lng=" + myLatLng.lng,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		error: function (xhr) {
			alert("Error en la ejecución, por favor recargue la página getsitefilter2" + xhr);
		},
		success: function (result) {

			if (result.length < 1) {
				GetSitePerFilter2("BOGOTÁ", 2);
			} else {
				var s = result.forEach(function(item) {
					console.log(item)
				});
				console.log(s);
				AddMarkers();
				if ($("#Sucursales").find("div").length < 1) {
					$('.spnSucsError').show();
				}
			}
		},
		async: true
	});
}

function AddMarkers() {
	$(sucursales).each(function (i, j) {
		DrawSucursal(i, j);
	});
	DrawEspecialidades();
	EventEspecilitie();
}

function BounceSearcher() {
	var input = document.getElementById('Busqueda');
	var searchBox = new window.google.maps.places.SearchBox(input);
	map.addListener('bounds_changed', function () {
		searchBox.setBounds(map.getBounds());
	});
	searchBox.addListener('places_changed', function () {
		currentSearchPlace = null;
		$('#MapDistance').val("0");
		$('.spnSucsError').hide();
		var places = searchBox.getPlaces();
		if (places.length === 0) {
			$('.spnSucsError').show();
			return;
		}
		searchTerms = [];
		myLatLng = {
			lat: parseFloat(places[0].geometry.location.lat()),
			lng: parseFloat(places[0].geometry.location.lng())
		};
		GetAndDrawNearest();
	});
}

function deleteMarkers() {
	clearMarkers();
	allMarkers = [];
}

function deleteMarkersInner() {
	clearMarkers();
}

function clearMarkers() {
	setMapOnAll(null);
}

function setMapOnAll(map) {
	for (var i = 0; i < allMarkers.length; i++) {
		allMarkers[i].setMap(map);
	}
}

function EventEspecilitie() {
	$('.sucursal').click(function () {
		if ($('#MapDistance').val() !== "0")
			$('#MapDistance').val("0").trigger('change');
		var id = $(this)[0].id;
		var suc = $('#' + id + " .sucursal-title").text();
		var mk;
		$(allMarkers).each(function (i, j) {
			if (j.title === suc) mk = j;
		});
		if (!IsNullOrEmpty(mk)) {
			map.setCenter(mk.position);
			map.setZoom(15);
			window.google.maps.event.trigger(mk[id], 'click');
		}
	});
}

function GetClosestMarkers(distance) {
	find_closest_marker(distance);
}

function rad(x) {
	return x * Math.PI / 180;
}

function find_closest_marker(distance) {
	var lat = myLatLng.lat;
	var lng = myLatLng.lng;
	var r = 6371;
	deleteMarkersInner();
	for (var i = 0; i < allMarkers.length; i++) {
		var mlat = allMarkers[i].position.lat();
		var mlng = allMarkers[i].position.lng();
		var dLat = rad(mlat - lat);
		var dLong = rad(mlng - lng);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = r * c;
		if (distance !== 0) {
			if (d <= distance) {
				allMarkers[i].setMap(map);
				var title = allMarkers[i].title;
				$('.sucursal').each(function (k, l) {
					var nm = $("#" + l.id + " .sucursal-title").text();
					// ReSharper disable once ClosureOnModifiedVariable
					if (title === nm) {
						$("#" + $(this)[0].id).show();
						return false;
					}
					// ReSharper disable once NotAllPathsReturnValue
				});
			}
		} else {
			allMarkers[i].setMap(map);
			$('.sucursal').show();
		}
	}
}

function GetAndDrawNearest() {
	var lat = myLatLng.lat;
	var lng = myLatLng.lng;
	var r = 6371;
	deleteLocationMarker();
	deleteMarkersInner();
	allMarkers = [];
	$('#Sucursales').empty();
	$(AllQueriedSites).each(function (i, j) {
		if (!IsNullOrEmpty(j.City)) {
			if (j.City.toLowerCase() === "miami" || j.City.toLowerCase() === "deerfield beach" ||
                j.City.toLowerCase() === "pompano beach" || j.City.toLowerCase() === "coconut creek" ||
                j.City.toLowerCase() === "fort lauderdale" || j.City.toLowerCase() === "n. lauderdale" ||
                j.City.toLowerCase() === "dania beach" || j.City.toLowerCase() === "lauderhill") {
				debugger;
			}
		}
		var mlat = j.Latitude;
		var mlng = j.Longitude;
		var dLat = rad(mlat - lat);
		var dLong = rad(mlng - lng);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = r * c;
		if (d <= 20) {
			debugger;
			DrawSucursal(i, j);
		}
	});
	EventEspecilitie();
	currentMarker = new window.google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: '/content/Images/locationG.png'
	});
	map.setCenter(myLatLng);
	map.setZoom(zooming);
}

function deleteLocationMarker() {
	currentMarker.setMap(null);
}

function DrawSucursal(i, j) {
	var latLng = { lat: j.Latitude, lng: j.Longitude };
	var marker = new window.google.maps.Marker({
		position: latLng,
		map: map,
		title: j.Name,
		draggable: false,
		animation: window.google.maps.Animation.DROP,
		icon: '/content/Images/location.png'
	});
	allMarkers.push(marker);
	var contentString;
	var leftWriting;
	var spec;
	var specs = "";
	if (!IsNullOrEmpty(j.Specialities)) {
		specs += '<div class="SpecList" data-especialidad="' + j.Specialities + '"> <ul>';
		spec = j.Specialities.split(',');
		$(spec).each(function (k, l) {
			CheckOrAddSpecialitie(l);
			//specs += '<li onclick="SelectFilter(this);">' + l + '<li>';
			specs += '<li>' + l + '</li>';
		});
		specs += '</ul></div>';
	} else
		specs = '<div class="SpecList" data-especialidad="Null"><label class="NoSpecs">Sin especialidades</label></div>';
	if (type === "prestador") {
		contentString = '<div id="iw-container" >' +
            '<span class="iw-title">' + j.Name + '</span>' +
            '<div class="gm-style-iw gm-style-iw-body">' +
            '<label style="display:block;"><span class="bolding">' + currentLang.Name + ':</span> <span class="lighting">' + j.Contact + '</span></label>' +
            '<label style="display:block;"><span class="bolding">' + currentLang.Address + ':</span> <span class="lighting"> ' + j.Address + '</span></label>' +
            '<label style="display:block;"><span class="bolding">' + currentLang.MainPhone + ':</span> <span class="lighting">' + j.Phone1 + '</span></label>' +
            '<label style="display:block;"><span class="bolding">' + currentLang.SecPhone + ':</span> <span class="lighting"> ' + j.Phone2 + '</span></label>' +
            '<label style="display:block;"><span class="bolding">' + currentLang.Email + ':</span> <span class="lighting"> ' + j.Email + '</span></label>' +
            '<label style="display:block;"><span class="bolding">' + currentLang.Zip + ':</span> <span class="lighting">' + j.ZipCode + '</span></label>' +
            '</div>' +
            '</div>';
		leftWriting = '<div class="col-md-12 sucursal"  tabindex="' + i + '" id="' + j.Id + '" data-country="' + j.Country + '" data-city="' + j.City + '" data-name="' + j.Name + '" id="SucursalId' + i + '" >' +
            '<h3 class="sucursal-title">' + j.Name + '</h3>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.Name + ':</span> <span class="lighting">' + j.Contact + '</span></h4>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.Address + ':</span> <span class="lighting">' + j.Address + '</span></h4>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.MainPhone + ':</span> <span class="lighting">' + j.Phone1 + '</span></h4>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.SecPhone + ':</span> <span class="lighting">' + j.Phone2 + '</span></h4>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.Email + ':</span> <span class="lighting">' + j.Email + '</span></h4>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.Zip + ':</span> <span class="lighting">' + j.ZipCode + '</span></h4>' +
            specs +
            '</div>';
		$('#Sucursales').append(leftWriting);
	} else {
		contentString = '<div id="iw-container">' +
            '<span class="iw-title">' + j.Name + '</span>' +
            '<div class="gm-style-iw gm-style-iw-body">' +
            '<label style="display:block;"><span class="bolding">' + currentLang.Address + ':</span> <span class="lighting">' + j.Address + '</span></label>' +
            '</div>' +
            '</div>';
		leftWriting = '<div class="col-md-12 sucursal"  tabindex="' + i + '" id="' + j.Id + '" data-country="' + j.Country + '" data-city="' + j.City + '" data-name="' + j.Name + '" >' +
            '<h3 class="sucursal-title">' + j.Name + '</h3>' +
            '<h4 class="sucursal-item"><span class="bolding">' + currentLang.Address + ':</span> <span class="lighting">' + j.Address + '</span></h4>' +
            '</div>';
		$('#Sucursales').append(leftWriting);
	}
	var infowindow = new window.google.maps.InfoWindow({
		content: contentString,
		maxWidth: 350
	});
	marker.addListener('click', function () {
		infowindow.open(map, marker);
	});
	window.google.maps.event.addListener(marker, 'click', function () {
		typeof infoWindowsOpenCurrently !== 'undefined' && infoWindowsOpenCurrently.close();
		infowindow.open(map, marker);
		infoWindowsOpenCurrently = infowindow;
		var iwOuter = $('.gm-style-iw');
		var iwBackground = iwOuter.prev();
		iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
		iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
		// ReSharper disable once RequiresFallbackColor
		iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': "rgba(72, 181, 233, 0.6) 0 1px 6px", 'z-index': '1' });
		var iwCloseBtn = iwOuter.next();
		iwCloseBtn.css({ opacity: '1', right: '42px', top: '8px', border: '7px solid #41b6e6', 'width': '27px', 'height': '27px', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9' });
		iwCloseBtn.mouseout(function () {
			$(this).css({ opacity: '1' });
		});
	});
}