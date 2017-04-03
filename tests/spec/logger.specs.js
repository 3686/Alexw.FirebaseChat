define(['logger'], function (logger) {
  describe("logger", function () {
    beforeEach(function () {
      spyOn(console, 'warn');
      spyOn(console, 'info');
      spyOn(console, 'error');
    });
    describe("warn", function () {
      it("writes to console", function () {
        logger.warn('hello world');
        expect(console.warn).toHaveBeenCalled();
      });
    });
    describe("info", function () {
      it("writes to console", function () {
        logger.info('hello world');
        expect(console.info).toHaveBeenCalled();
      });
    });
    describe("error", function () {
      it("writes to console", function () {
        logger.error('hello world');
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});