define(['logger', 'cookies', 'RoomInformation'], function (logger, cookies, RoomInformation) {

  return {

    getRoomOrDefault: function (defaultRoom) {

      if(!defaultRoom) {
        throw new Error("defaultRoom was null");
      }

      var path = cookies.get('room.path');
      var displayName = cookies.get('room.displayName');
      if (displayName && path) {
        return new RoomInformation(path, displayName);
      }
      return defaultRoom;
    },
    setRoom: function (room) {
      if (!room) { 
        throw new Error("null defaultRoom");
      }      
      cookies.set('room.displayName', room.displayName);
      cookies.set('room.path', room.path);
    }
  }

});