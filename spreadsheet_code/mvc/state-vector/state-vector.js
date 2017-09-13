// A state vector manages a set of state variables.

var StateVector = {};

StateVector.make = function(obj) {
    return obj.mapOwnProperties(StateVar.make);
};
