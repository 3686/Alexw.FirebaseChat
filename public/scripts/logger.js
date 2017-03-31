define(function() {
  return {
    info : function() {
      console.info(arguments);
    },
    error : function() {
      console.error(arguments);
    },
    warn : function() {
      console.warn(arguments);
    }
  };
});