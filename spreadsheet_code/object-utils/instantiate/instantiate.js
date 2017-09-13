instantiate = function(o) {
    var F = function() {};
    F.prototype = o;
    var a = new F();
    return a;
};

//Commented this because, YUI libraries were failing with this.
/*
Object.prototype.parent = function() {
    return this.constructor.prototype;
};*/



