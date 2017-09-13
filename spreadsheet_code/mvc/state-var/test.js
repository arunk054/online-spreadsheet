StateVar.FireUnitTests = {};
var svX = {};
var svY = {};
var h = {};
var g = {};

StateVar.FireUnitTests.test1 = function() {
    svX = StateVar.make("x", 
           {initValue: 4, 
	    show: function() {
		   return this.getValue() + "";
	          }});

    fireunit.ok(svX.getName() === "x", "sx1 ok");
    fireunit.ok(svX.getValue()  === 4, "sx2 ok");
    fireunit.ok(svX.show()  === "4", "sx3 ok");

    svX.setValue(5);
    
    h = Handler.make("h", function(obj) {
	    alert("handler h:  variable x changed from " + 
		  obj.oldValue + " to "  + obj.value);
	});

    svX.addHandler("change", h);
    svX.setValue(6);
};



StateVar.FireUnitTests.test2 = function() {
    svY = StateVar.make("y", 4);

    fireunit.ok(svY.getName() === "y", "sy1 ok");
    fireunit.ok(svY.getValue()  === 4, "sy2 ok");
    fireunit.ok(svY.show()  === "4", "sy3 ok");

    svY.setValue(5);
    
    h = Handler.make("h", function(obj) {
	    alert("handler h: variable y changed from " + 
		  obj.oldValue + " to "  +  obj.value);
	});

    svY.addHandler("change", h);
    
    svY.setValue(6);

    var negative = 
    Condition.make("negative", function(obj) { return obj.value < 0;});
    svY.setCondition(negative);

    g = Handler.make("g", function(obj) {
	    alert("handler g: variable y is negative: " + obj.value);
	});

    svY.addHandler("negative", g);

    svY.setValue(-3);
    svY.setValue(2);
};

// FireUnit.runTests(Cell.FireUnitTests);