
var Handler  = {};

Handler.make = function(name, func) {
    var a = {};
    var getName  = function() {return name;};
    var getFunction = function() {return func;};
    var evalFunction = function(obj) {
	//	alert("running handler " + name);
	return func(obj);
    };
    a.getName = getName;
    a.getFunction = getFunction;
    a.evalFunction = evalFunction;
    return a;
};
    