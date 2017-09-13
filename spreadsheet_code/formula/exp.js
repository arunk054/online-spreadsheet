// Exp = NumExp + IndexExp  + StrExp + OpExp

// numExp(number: Nat)
// strExp(string: String)
// indexExp(row: Nat, col: Nat)
// opExp(rator: Identifier, rands: [Exp]);

var Exp = new Object();

// NumExp
var NumExp = instantiate(Exp);
NumExp.expType = "NumExp";

var numExp = function(n) {
    var a = instantiate(NumExp);
    a.number = n;
    return a;
};

// StrExp
var StrExp = instantiate(Exp);
StrExp.expType = "StrExp";

var strExp = function(n) {
    var a = instantiate(StrExp);
    a.string = n;
    return a;
};

// IndexExp
var IndexExp = instantiate(Exp);
IndexExp.expType = "IndexExp";

var indexExp = function(r,c) {
    var a = instantiate(IndexExp);
    a.row = r;
    a.col = c;
    return a;
};

// RangeExp
var RangeExp = instantiate(Exp);
RangeExp.expType = "RangeExp";

var rangeExp = function(kw,i1,i2, direction) {//i1, i2 are IndexExp
    var a = instantiate(RangeExp);
    a.kw = kw;
    a.rangeLower = i1;
    a.rangeHigher = i2;
	a.dir = direction;// 0 or 1
    return a;
};

// // PlusExp
// var PlusExp = instantiate(Exp);
// var plusExp = function(e1, e2) {
//     var a = instantiate(PlusExp);
//     a.expType = "plus";
//     a.rand1 = e1;
//     a.rand2 = e2;
//     return a;
// };


// OpExp
var OpExp = instantiate(Exp);
OpExp.expType = "OpExp";

var opExp = function(id, exps) {
    var a = instantiate(OpExp);
    a.rator = id;
    a.rands = exps;
    return a;
};

// isEqualTo

// isEqualTo

NumExp.isEqualTo = function(e) {
    return (e.expType === "NumExp" &&
            this.number === e.number);
};


StrExp.isEqualTo = function(e) {
    return (e.expType === "StrExp" &&
            this.string === e.string);
};

IndexExp.isEqualTo = function(ind) {
    return (ind.expType === "IndexExp" &&
    this.row === ind.row && 
    this.col === ind.col);
};

RangeExp.isEqualTo = function(ind) {
    return (ind.expType === "RangeExp" &&
    this.rangeLower.isEqualTo(ind.rangeLower) && 
    this.rangeHigher.isEqualTo(ind.rangeHigher));
};


OpExp.isEqualTo = function(e) {
    if (e.expType !== "OpExp") return false;
    if (this.rator !== e.rator) return false;
    if (this.rands.length !== e.rands.length) return false;
    var g = function(p,q) {return p.isEqualTo(q);};
    var ans = Array.mapf(g, this.rands, e.rands);
    return ans.andmap(function(b) {return b;});
};


// Show
// ====
NumExp.show = function() {
    return this.number + "";
};

StrExp.show = function() {
    return "\""+ this.string + "\"";
};


// IndexExp
// --------

// Do not change this order!
var AlphaUpper = 
    ["Z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
     "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"];


var remainder = function(a,b) {
    return a%b;
};

var quotient = function(a,b) {
    return parseInt(a/b);
};


// n is the column number on the spreadsheet, which is
// 0<=j

Exp.unparseColNum = function(j) {
    var base  = 26;
    var a = [];
    var q = j+1;
    var r = 0;
    var j = 0;

    while (true) {
	if (q <= 0) break;
	
	r = remainder(q, base);
	a[j]=AlphaUpper[r];
	
	q = quotient(q, base);
	if (r === 0) {  // !
	    q = q - 1;  // !
	};
	j=j+1;
	
    };
    return a.reverse().join("");
};



Exp.unparseRowNum = function(i) {
    return ((i+1)+"");
};

// internally, indices are zero based, but when shown, they
// conform to the spreadsheet convention of AlphaNumeric
// indices, with the row numeric starting from 1 and the col alpha
// starting from A.

IndexExp.show = function() {
    //    return ("[" + this.row + " " + this.col + "]");
    return (Exp.unparseColNum(this.col) + "" + Exp.unparseRowNum(this.row));
};

RangeExp.show = function () {
	return "(" + this.kw + " "+ this.rangeLower.show() + " "+this.rangeHigher.show() + ")";
}

OpExp.show = function() {
    var ans =  "(" + this.rator + " " +  
    this.rands.mapMethod("show").join(" ") + ")";
    return ans;
};


// Evaluation
// ===========

// Evaluation
// -----------
NumExp.evalExp = function() {
    return this.number;
};


StrExp.evalExp = function() {
    return this.string;
};


IndexExp.evalExp = function() {
    throw("IndexExp.evalExp() unimplemented");
};

RangeExp.evalExp = function() {
};

OpExp.evalExp = function() {
    vals = this.rands.mapMethod("evalExp");
    return applyOperation(this.rator, vals);
};

// all operations are assumed to be binary
var applyOperation  = function(op, vals) {
    var n1 = vals[0];
    var n2 = vals[1];
    switch (op) {
    case "+": return n1+n2;
    case "-": return n1-n2;
    case "*": return n1*n2;
    case "/": return n1/n2;
    default: throw("unknown operator " + op);
    };
};

// plusExp(numExp(5), indexExp(1,5))
// s = makeSpreadSheet(url) ;; deserialize 
// saveSpreadSheet(url,s) ;; serialize
// Check out DAV to implement this.
