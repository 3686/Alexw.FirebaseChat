define(function() {
  return {
    username : function(raw) {
      return raw.replace(/[^A-Za-z0-9]+/g, '');
    },
    body : function(raw) {
      return raw.replace('script','');
    }
  };
});