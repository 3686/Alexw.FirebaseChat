define(['logger', 'sanity'], function (logger, sanity) {
  
  var onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  };

  return {
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