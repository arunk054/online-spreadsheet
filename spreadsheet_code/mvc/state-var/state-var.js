/* A state variable is an object which manages its
 * encapsulated state.


 * Each state variable is associated with a conditions
 * object, which contains a set of conditions indexed by
 * condition name.  


 * The object must contain a field called value, denoting
   the current value of the state variable, and oldValue,
   the previous value of the state variable, and, possibly,
   additional fields.

 * When the variable's state changes, the handlers of each
   condition in the conditions object are run.
*/

var StateVar = {};

StateVar.make = function(name, spec) {

    var initValue = typeof(spec) === "object" ? spec.initValue : spec;
    var show    = 
      typeof(spec) === "object" 
      ? spec.show    
      : function() {return this.getValue() + "";};

    var a = {};

    var conditions = {};

    var value = initValue;

    var getName  = function() {
	return name;
    };
    
    var getValue = function() {
	return value;
    };

    var setValue = function(v) {
	var obj = {oldValue : value, value : v};
	value = v;
	conditions.forEachOwnProperty(function(name, cond) {
		cond.runHandlers(obj);
	    });
    };

    var setCondition = function(condition) {
	conditions[condition.getName()] = condition;
    };
    
    var addHandler = function(conditionName, handler) {
	conditions[conditionName].addHandler(handler);
    };

    var init = function() {
	var change = 
	Condition.make("change", function(obj) { 
		return (obj.value !== obj.oldValue);
	    });

	var changeToTrue = 
	Condition.make("changeToTrue", function(obj) { 
		return (obj.value === true && obj.oldValue === false);
	    });

	var changeToFalse = 
	Condition.make("changeToFalse", function(obj) { 
		return (obj.value === false && obj.oldValue === true);
	    });

	setCondition(change);
	if (typeof(value) === "boolean") {
	    setCondition(changeToTrue);
	    setCondition(changeToFalse);
	};
    };

    a.getName =  getName;
    a.getValue = getValue;
    a.show   = show;
    a.setValue = setValue;
    a.setCondition = setCondition;
    a.addHandler = addHandler;
    a.conditions = conditions;  // only for debugging

    init();
    return a;
};
