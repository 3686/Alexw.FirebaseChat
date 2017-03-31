define(['logger'], function (logger) {

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  return {
    getRoomOrDefault: function (rName) {
      var cValue = getCookie('room');
      logger.info(cValue);
      if(cValue == null || cValue.trim().length == 0) {
        return rName;
      };
      return cValue;
    },
    setRoom: function(rName) {
      setCookie('room', rName);
    }
  }

});