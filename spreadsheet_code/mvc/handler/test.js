Handler.FireUnitTests = {};
var h = {};

Handler.FireUnitTests.test1 = function() {
    h = Handler.make("h1", function() {return 5;});
   
    fireunit.ok(h.getName() === "h1",  "h1 ok");
    fireunit.ok(h.getFunction()() === 5, "h2 ok");
};

// FireUnit.runTests(Cell.FireUnitTests);