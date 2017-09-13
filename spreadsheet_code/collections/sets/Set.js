// Set library for JS using Arrays
// -------------------------------


var Set = new Object();

Set.isEmpty = function() {
    return (this.arr.length  === 0);
};

Set.getSize = function() {
    return this.arr.length;
};

Set.show  = function() {
    return this.arr.copy();
};

Set.contains = function(x) {
    for (var j = 0; j < this.getSize();  j++) {
	if (this.arr[j] === x)
	    return true;
    };
    return false;
};


// Is this object a subset of s?
Set.subsetOf = function(s) {
    for (var j = 0; j < this.getSize(); j++) {
	if (! s.contains(this.arr[j])) {
	    return false;
	};
    };
    return true;
};

Set.equals = function(s) {
    return (this.subsetOf(s) && s.subsetOf(this));
};

// These functions modify the set:
// * add
// * pop
// * delete

Set.add = function(x) {
    if (! this.contains(x))
	this.arr.push(x);
};

Set.pop = function() {
    if (this.isEmpty()) {
        throw Set.Exception("trying to pop an empty set");
    };
    var x = this.arr.pop();
    return x;
};

// Shallow copy of the set returns a set with 
Set.copy = function() {
    var s = Set.mkSet();
    s.arr = this.arr.copy();
    return s;
};

Set.union = function(s) {
    var ans  = this.copy();
    for (j = 0; j < s.getSize(); j++) {
	ans.add(s.arr[j]);
    };
    return ans;
};

Set.intersection = function(s) {
    var ans = Set.mkSet();
    ans.arr = this.arr.filter(function(x) {return s.contains(x);})
    return ans;
};

Set.difference = function(s) {
    var ans = Set.mkSet();
    ans.arr = this.arr.filter(function(x) {return !(s.contains(x));})
    return ans;
};

Set.mkSet = function() {
    var s = instantiate(Set);
    s.arr = [];
    for (var j = 0; j < arguments.length; j++) {
	s.add(arguments[j]);
    };
    return s;
};


Set.emptySet = Set.mkSet();

