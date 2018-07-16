'use strict';

(function () {

  var Map = {
    X: 55.752,
    Y: 37.616,
    ZOOM: 10
  };

  var Url = {
    CITY: 'xml/cities.xml',
    DISTRICT: 'xml/districts.xml',
    TERMINAL: 'xml/terminals.xml',
    OFFICE: 'xml/offices.xml'
  };

  var control = document.querySelector('.container_control');
  var cityList = control.querySelector('select[id="cityList"]');
  var districtList = control.querySelector('select[id="districtList"]');
  var terminalList = control.querySelector('select[id="terminalList"]');
  var officeList = control.querySelector('select[id="officeList"]');
  var toggleTerminals = control.querySelector('input[id="toggleTerminals"]');
  var toggleOffices = control.querySelector('input[id="toggleOffices"]');

  var yandexMap;
  var applicationTitle = 'Сеть обслуживания клиентов ' + window.util.getBankTitle();

  var cityCollection = [];
  var districtCollection = [];
  var terminalCollection = [];
  var officeCollection = [];

  function selectElement(list, collection) {
    var filters = collection.filter(function (element) {
      if (element.id === list.value) {
        return true;
      } else {
        return false;
      }
    });
    return filters[0];
  }

  function findGeoObject(target, collection) {
    var element = selectElement(target, collection);

    if (element) {
      yandexMap
        .setCenter([element.x, element.y], element.zoom, {checkZoomRange: true});
      var placemark = element.placemark;
      if (placemark) {
        placemark.balloon.open();
      }
    }
  }

  function addGeoObject(collection) {
    collection.forEach(function (value) {
      yandexMap.geoObjects.add(value.placemark);
    });
  }

  function toggleCollection(target, collection) {
    var checked = target.checked;

    collection.forEach(function (value) {
      value.placemark.options.set('visible', checked);
    });
  }

  function setupList(list, collection) {
    list.options.add(window.util.createOptionElement('выберите', '-1'));
    collection.forEach(function (value) {
      list.options.add(window.util.createOptionElement(value.name, value.id));
    });

    list.addEventListener('change', function (evt) {
      findGeoObject(evt.target, collection);
    });
  }

  function onLoadCities(text) {
    cityCollection = window.data.parseXml(text);
    setupList(cityList, cityCollection);

  }

  function onLoadDistricts(text) {
    districtCollection = window.data.parseXml(text);
    setupList(districtList, districtCollection);

  }

  function onLoadTerminals(text) {
    terminalCollection = window.data.parseXml(text);
    setupList(terminalList, terminalCollection);

    toggleTerminals.addEventListener('click', function (evt) {
      toggleCollection(evt.target, terminalCollection);
    });

    addGeoObject(terminalCollection);
  }

  function onLoadOffices(text) {
    officeCollection = window.data.parseXml(text);
    setupList(officeList, officeCollection);

    toggleOffices.addEventListener('click', function (evt) {
      toggleCollection(evt.target, officeCollection);
    });

    addGeoObject(officeCollection);
  }

  function init() {
    yandexMap = new window.ymaps.Map('map',
        {
          center: [Map.X, Map.Y],
          zoom: Map.ZOOM
        }
        ,
        {autoFitToViewport: 'ifNull'}
    );

    var errorHandler = function () {

    };

    window.backend.load(onLoadCities, errorHandler, Url.CITY);
    window.backend.load(onLoadDistricts, errorHandler, Url.DISTRICT);
    window.backend.load(onLoadTerminals, errorHandler, Url.TERMINAL);
    window.backend.load(onLoadOffices, errorHandler, Url.OFFICE);
  }

  window.ymaps.ready(init);

  document.title = applicationTitle;
  document.querySelector('.header')
    .children[0].firstChild.textContent = applicationTitle;

})();
