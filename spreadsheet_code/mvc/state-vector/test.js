StateVector.FireUnitTests = {};
var sv = {};
var h = {};

StateVector.FireUnitTests.test1 = function() {
    sv = StateVector.make({x : 4, y : 5});
    var svX = sv.x;
    var svY = sv.y;

    fireunit.ok(svX.getName() === "x", "s1 ok");
    fireunit.ok(svX.getValue()  === 4, "s2 ok");

    svX.setValue(5);
    
    h = Handler.make("h", function(obj) {
	    alert(obj.oldValue + " changed to "  + 
		  obj.value);
	});

    svX.addHandler("change", h);
    
    svX.setValue(6);
};

// FireUnit.runTests(Cell.FireUnitTests);