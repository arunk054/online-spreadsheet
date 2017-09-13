Condition.FireUnitTests = {};
var c = {};
var x = 4; 

Condition.FireUnitTests.test1 = function() {
    c = Condition.make("c", function(obj) {return (obj.val > 3);});

    fireunit.ok(c.getName() === "c", "c1 ok");
    fireunit.ok(c.evalPredicate({val : x}) === true, "c2 ok");

    c.addHandler(Handler.make("h1", function(obj) {alert("x is now " + obj.val);}));
    c.addHandler(Handler.make("h2", function(obj) {alert("hello");}));

    c.runHandlers({val : x});

    x = 2;
    
    c.runHandlers({val : x});
    alert("done");
};

// FireUnit.runTests(Cell.FireUnitTests);