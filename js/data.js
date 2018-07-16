'use strict';

(function () {

  function createPlacemark(x, y, info, address, imageHref) {
    var placemark = new window.ymaps
      .Placemark([x, y], {balloonContent: info, name: address, description: address},
          {
            iconLayout: 'default#image',
            iconImageHref: imageHref,
            iconImageSize: [24, 24],
            iconImageOffset: [0, 0]
          });
    placemark.options.set('visible', true);

    return placemark;
  }

  function createObject(id, name, x, y, zoom, address, cityId, districtId, placemark) {
    var object = {};

    object.id = id;
    object.name = name;
    object.x = x;
    object.y = y;
    object.zoom = zoom;
    object.address = address;
    object.cityId = cityId;
    object.districtId = districtId;
    object.placemark = placemark;

    return object;
  }

  var element = {

    'terminals': {set: function (id, name, x, y, zoom, address, cityId, districtId) {
      var info = window.util.getBankTitle() + '<br>' + 'Терминал: ' + name + '<br>' + address;
      var placemark = createPlacemark(x, y, info, address, 'img/terminal.png');

      return createObject(id, name, x, y, zoom, address, cityId, districtId, placemark);
    }},

    'offices': {set: function (id, name, x, y, zoom, address, cityId, districtId) {
      var info = window.util.getBankTitle() + '<br>' + 'Филиал: ' + name + '<br>' + address;
      var placemark = createPlacemark(x, y, info, address, 'img/office.png');

      return createObject(id, name, x, y, zoom, address, cityId, districtId, placemark);
    }},

    'cities': {set: function (id, name, x, y, zoom, address, cityId, districtId) {

      return createObject(id, name, x, y, zoom, address, cityId, districtId);
    }},

    'districts': {set: function (id, name, x, y, zoom, address, cityId, districtId) {

      return createObject(id, name, x, y, zoom, address, cityId, districtId);
    }}

  };

  window.data = {

    parseXml: function (text) {
      var list = [];
      var data = new DOMParser().parseFromString(text, 'text/xml');
      var nodeList = data.firstChild.children;
      var firstNodeName = data.firstChild.nodeName;

      [].forEach.call(nodeList, function (node) {
        var id = node.getAttribute('id');
        var name = node.getAttribute('name');
        var x = parseFloat(node.getAttribute('x'));
        var y = parseFloat(node.getAttribute('y'));
        var zoom = parseInt(node.getAttribute('zoom'), 10);
        var address = node.getAttribute('address');
        var cityId = parseInt(node.getAttribute('cityId'), 10);
        var districtId = parseInt(node.getAttribute('districtId'), 10);
        list.push(element[firstNodeName]
          .set(id, name, x, y, zoom, address, cityId, districtId)
        );
      });

      return list;
    }

  };

})();
