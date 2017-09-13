/*
 * A condition is an object with 3 fields:
 *
 * --  name
 *
 * -- predicate that takes an object. 

 * -- a list of handlers, each of whose function takes the
       same object.  (See the method runHandlers).
 */


var Condition = {};

Condition.make = function(name, predicate) {
    var a = {};
    var handlers = [];  

    var getName  = function() {
	return name;
    };
    
    var getPredicate = function() {
	return predicate;
    };

    var evalPredicate = function(obj) {
	return predicate(obj);
    };

    var addHandler = function(handler) {
	handlers.push(handler);
    };

    var runHandlers = function(obj) {
	//		alert("running condition " + name + "...");
	var b = predicate(obj);
	//		alert ("... predicate is " + b);
	if (b) {
	    handlers.forEach(function(handler) {handler.evalFunction(obj);});
	};
    };

    a.getName = getName;
    a.getPredicate = getPredicate;
    a.evalPredicate = evalPredicate;
    a.addHandler = addHandler;
    a.runHandlers = runHandlers;
    a.handlers = handlers;  // debugging
    return a;
};

    

