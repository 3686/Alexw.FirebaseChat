define(['logger', 'sanity'], function (logger, sanity) {
  
  var onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  };

  var isString = function(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
  };

  return {
    validate: function() {
      var names = Array.prototype.slice.call(arguments);
      return names.every(function(element) {
        if(isString(element)) {
          if(element.trim().length > 0) {
            return true;
          }
        }
        return false;
      });
    },
    get: function () {
      var names = Array.prototype.slice.call(arguments);
      var lowercase = names.map(function (element) { return ("" + element).toLowerCase(); });
      var safe = lowercase.map(function (element) { return sanity.username(element); });
      var sorted = safe.sort();
      var distinct = sorted.filter(onlyUnique);
      var joined = distinct.join("-");
      logger.info(joined);
      return joined;
    }
  };
});