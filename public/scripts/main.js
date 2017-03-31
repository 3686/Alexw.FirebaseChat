"use strict";

define(['pubsub', 'config', 'querystring', 'logger', 'preferences', 'user', 'sanity', 'roomnamer'], function (pubsub, config, querystring, logger, preferences, user, sanity, roomnamer) {

  firebase.initializeApp(config);

  var uiConfig = {
    callbacks: {
      signInSuccess: function (currentUser, credential, redirectUrl) {
        pubsub.publish('firebase.login.successful');
        return false;
      },
      uiShown: function () {
        pubsub.publish('firebase.login.shown')
      }
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: '/tos.html'
  };

  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  // The start method will wait until the DOM is loaded.
  ui.start('#auth', uiConfig);

  firebase.auth().onAuthStateChanged(function (fUser) {
    logger.info("onAuthStateChanged");
    if (fUser) {
      pubsub.publish("user.loggedin", fUser);
    } else {
      pubsub.publish("user.loggedout");
    }
  });

  pubsub.subscribe("user.loggedin", function (fUser) {
    var updates = {};
    var now = new Date();
    var key = "/login/" + now.getUTCFullYear() + "/" + now.getUTCMonth() + "/" + now.getUTCDate() + "/" + now.getUTCHours() + ":" + now.getUTCMinutes() + ":" + now.getUTCSeconds();
    updates[key] = {
      displayName: fUser.displayName,
      email: fUser.email
    };
    firebase.database().ref().update(updates);
  });

  pubsub.subscribe("user.loggedin", function (fUser) {
    user.displayName = fUser.displayName;
    user.email = fUser.email;

    document.getElementById("auth").style.visibility = "hidden";
    document.getElementById("content").style.visibility = "visible";

    var defaultRoom = roomnamer.get(user.displayName);
    var room = preferences.getRoomOrDefault();
    pubsub.publish("room.change.requested", room);
  });

  pubsub.subscribe("user.loggedout", function () {
    logger.warn("logged out");
    document.getElementById("auth").style.visibility = "visible";
    document.getElementById("content").style.visibility = "hidden";
  });

  var subscription;

  pubsub.subscribe("room.change.requested", function (rName) {
    logger.info("room.change.requested:");
    logger.info(rName);

    if (rName) {
      if (rName.trim().length > 0) {
        pubsub.publish("room.change.successful", rName);
      }
    }

    pubsub.publish("room.change.failed", rName);
  });

  pubsub.subscribe("room.change.successful", function (rName) {
    document.getElementById("history").innerHTML = "";
    document.getElementById("roomname").value = rName;
  });

  pubsub.subscribe("room.change.successful", function (rName) {
    logger.info("Changing rooms to " + rName);
    if (subscription && subscription.off) {
      subscription.off();
    }

    var chatroomReference = firebase.database().ref("/chatroom/" + rName + "/messages/");
    subscription = chatroomReference.on('value', function (e) {
      logger.info("new room data:");
      logger.info(e.val());
      pubsub.publish("room.data.available", e.val());
    });

    logger.info("Subscribed to chatroom: " + rName);
  });

  pubsub.subscribe("room.change.successful", function (rName) {
    preferences.setRoom(rName);
    logger.info("Set room name to " + rName);
  });

  pubsub.subscribe("room.data.available", function (data) {
    if (!data || data == null) {
      logger.warn(data);
      return;
    }
    var element = document.getElementById("history");
    element.innerHTML = "";
    var objectArray = Object.keys(data).map(function (key) { return data[key]; });
    for (var i = 0; i < objectArray.length; i++) {
      var item = objectArray[i];
      pubsub.publish("room.data.row.available", item);
    }
  });

  pubsub.subscribe("room.data.row.available", function (data) {

    logger.info("room.data.row.available data:");
    logger.info(data);

    var element = document.getElementById("history");
    var id = new Date(data.utc).getTime();

    var formattedDate = new Date(data.utc).toDateString();
    var classes = data.from == user.displayName ? "me" : "";
    var content = "<blockquote id=" + id + " class=" + classes + ">" + data.body;
    content += "<footer>" + data.from + " on " + formattedDate + "</footer></blockquote>"

    element.innerHTML = element.innerHTML + content;
    document.getElementById("" + id).scrollIntoView();
  });

  pubsub.subscribe("room.post.requested", function (body) {

    var roomName = preferences.getRoomOrDefault(sanity.username(user.displayName));
    var epoch = (new Date()).getTime();

    if (body && body.trim().length > 0) {

      var postData = {
        from: sanity.username(user.displayName),
        body: sanity.body(body),
        utc: epoch
      };

      var updates = {};
      updates["/chatroom/" + roomName + "/messages/" + epoch] = postData;
      var result = firebase.database().ref().update(updates);
      logger.info(result);

      pubsub.publish("room.post.successful");
    } else {
      pubsub.publish("room.post.failed", body);
    }
  });

  pubsub.subscribe("room.post.successful", function () {
    document.getElementById('message').value = "";
    document.getElementById('message').focus();
  });

  window.onRoomChange = function () {
    var roomname = document.getElementById("roomname").value.trim();
    var rName = roomnamer.get(roomname, user.displayName);
    pubsub.publish("room.change.requested", rName);
  };

  window.onSubmit = function () {
    var message = document.getElementById('message').value.trim();
    pubsub.publish("room.post.requested", message);
  };

});