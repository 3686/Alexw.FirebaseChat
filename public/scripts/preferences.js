define(['logger', 'RoomInformation'], function (logger, RoomInformation) {

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
    getRoomOrDefault: function (defaultRoom) {
      var path = getCookie('room.path');
      var displayName = getCookie('room.displayName');
      if(displayName && path) {
        return new RoomInformation(path, displayName);
      }
      return defaultRoom;
    },
    setRoom: function(room) {
      setCookie('room.displayName', room.displayName);
      setCookie('room.path', room.path);
    }
  }

});