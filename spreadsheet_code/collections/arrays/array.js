// require object-utilities/properties/properties.js

// equals : any -> boolean
Array.prototype.isEqualTo = function(a) {
    var k = 0;
    // In Javascript, typeof a is "object" even when a is an array (ouch!)
    if (a.constructor !== Array) {
        return false;
    };

    if (this.length !== a.length)  {
        return false;
    };
    k = a.length;

    for (var j = 0;  j < k; j++) {
        if ((typeof this[j]) === "object" && 
            this[j].hasMethod('isEqualTo')) {
            if (!this[j].isEqualTo(a[j])) {
                return false;
            };
        }
        else {
            if (this[j] !== a[j]) return false;
        };
    };
    return true;
};

//insert before position i, an element x
// 0 <= i <= this.length
// after insertion, x is at position i.
Array.prototype.insert  = function(i,x) {
    this.splice(i,0, x);
};

// delete the element at position i
// 0 <= i < this.length
Array.prototype.delete  = function(i) {
    this.splice(i,1);
};



// create : [length : nat, objType: Object] -> Array.

// creates an array of size length and populates it with
// instances of objType.

Array.create = function(length, elementMaker) {
    var ans = new Array(length);
    for (var j = 0; j < ans.length; j++) {
	ans[j] = elementMaker(j);
    };
    return ans;
};

// Creates a copy of the array
Array.prototype.copy = function() {
    return this.slice(0);
};
    

// [1, 2, 3].forEachIndex(function(i) {
// 	this[i] = this[i]*2;
//     });

Array.prototype.forEachIndex = function(f) {
    for (var i = 0; i < this.length; i++) {
	f.apply(this, [i]);
    };
};


Array.prototype.forEach = function(f) {
    for (var i = 0; i < this.length; i++) {
	f.apply(this, [this[i]]);
    };
};

// Example [a,b].mapMethod("hello", x, y)

// Applies the method named methodName to each element of
// the array.  Each element's methodName method is applied
// to that object and the arguments to mapMethod of which
// methodName is the first argument.

Array.prototype.mapMethod = function(methodName) {
    var a = new Array(this.length);
    var e = null;
    var m = null;

    // adapted from http://www.mennovanslooten.nl/blog/post/59
    var args = [].splice.apply(arguments, [1]);

    for (var i = 0; i < this.length; i++) {
	e = this[i];
	m = e[methodName];
	a[i] = m.apply(this[i], args);
    };
    return a;
};

//calls the methodName on each element of the array
Array.prototype.evaluate = function(methodName) {
    var e = null;
    var m = null;

    // adapted from http://www.mennovanslooten.nl/blog/post/59
    var args = [].splice.apply(arguments, [1]);

    for (var i = 0; i < this.length; i++) {
		e = this[i];
		m = e[methodName];
		m.apply(this[i], args);
    };
    return;
};

Array.prototype.myReduce = function(methodName) {
    var result = null;
    var e = null;
    var m = null;

    // adapted from http://www.mennovanslooten.nl/blog/post/59
    var args = [].splice.apply(arguments, [1]);

	//Use the args only for the first element of the array
	if (this.length > 0 ) {
		e = this[0];
		m = e[methodName];
		result = m.apply(this[0], args);
	}
    for (var i = 1; i < this.length; i++) {
		e = this[i];
		m = e[methodName];
		result = m.apply(this[i], [result]);
	};
    return result;
};

// andmap
// ------

// Usage:
// arr.andmap(function(x) {...})
// arr.andmap("foo");

Array.prototype.andmap = function(pred) {

    for (var i = 0; i < this.length; i++) {
	var b = typeof pred === "string" ? 
	     this[i][pred]() : 
	     pred(this[i]);
	if (!b) return false;
	else continue;
    };
    return true;
};


// ormap
// ------

// Usage:
// arr.ormap(function(x) {...})
// arr.ormap("foo");

Array.prototype.ormap = function(pred) {

    for (var i = 0; i < this.length; i++) {
	var b = typeof pred === "string" ? 
	     this[i][pred]() : 
	     pred(this[i]);
	if (b) return true;
	else continue;
    };
    return false;
};







// Array.mapf(function(x,y) {return x + y;}, [1, 2], [3, 4]) => [4, 6]

Array.mapf = function(f) {
    var args = [].splice.apply(arguments,[1]);
    //    alert("args = " + args);
    if (args.length === 0) return [];
    var ok = args.andmap(function(a) {return args[0].length === a.length;});
    if (!ok) throw ("array args are of unequal length");

    var dummy = {};
    var a = Array.create(args[0].length, function(i) {
	    var z = args.map(function(x) {return x[i];});
	    return f.apply(dummy, z);
	});
    return a;
};






	 



    


    



    

