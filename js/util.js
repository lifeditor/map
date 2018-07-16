'use strict';

(function () {

  var BANK_TITLE = '"Банк Виртуальный"';

  window.util = {

    getBankTitle: function () {
      return BANK_TITLE;
    },

    createOptionElement: function (name, value) {
      var option = document.createElement('option');
      option.text = name;
      option.value = value;

      return option;
    }

  };

})();
