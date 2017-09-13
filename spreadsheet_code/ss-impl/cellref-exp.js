///Create a garbage ref expression object that holds the obj if it is an invalid cell ref
var GarbRefExp = instantiate(Exp);
GarbRefExp.expType = "GarbRefExp";

var garbRefExp = function() {
    var a = instantiate(GarbRefExp);
    return a;
};

GarbRefExp.isEqualTo = function(e) {
    return (e.expType === GarbRefExp.expType);
};

GarbRefExp.DisplayString = "#$";

GarbRefExp.show = function() {
	return GarbRefExp.DisplayString;
};

// Evaluation
// ----------

GarbRefExp.evalExp = function(ss) {
	throw("Cell reference does not exist");
};

var CellRefExp = instantiate(Exp);
CellRefExp.expType = "CellRefExp";

var cellRefExp = function(c) {
    var a = instantiate(CellRefExp);
    a.cell = c;
    return a;
};

CellRefExp.isEqualTo = function(e) {
    return (e.expType === CellRefExp.expType && this.cell === e.cell);
};


CellRefExp.show = function() {
    var rc = this.cell.getSpreadSheet().indexOf(this.cell);
	if (rc == null){//the cell ref does not exist, hence it will show garbage
		return GarbRefExp.DisplayString;
	}
    var r = rc[0];
    var c = rc[1];
    return (Exp.unparseColNum(c) + "" + Exp.unparseRowNum(r));
};

// Evaluation
// ----------

CellRefExp.evalExp = function(ss) {
    var rc = this.cell.getSpreadSheet().indexOf(this.cell);

	if (rc == null || this.cell.getResult() === Cell.ERROR_VALUE){
		return GarbRefExp.evalExp();
	}
    return this.cell.getResult();
};

///////// Create the RangeRefExp

var RangeRefExp = instantiate(Exp);
RangeRefExp.expType = "RangeRefExp";

var rangeRefExp = function(kw,cellArr,dir) {
    var a = instantiate(RangeRefExp);
    a.kw = kw;
	a.cellArr = cellArr;
	a.dir = dir;
    return a;
};

RangeRefExp.isEqualTo = function(e) {
    return (e.expType === RangeRefExp.expType && this.kw === e.kw && this.firstRef.isEqualTo(e.firstRef) && this.lastRef.isEqualTo(e.lastRef));
};


RangeRefExp.show = function() {
	var c1 = GarbRefExp.DisplayString,c2 = GarbRefExp.DisplayString;
	var i;

	for( i = 0; i< this.cellArr.length;++i) {
		c1 = this.cellArr[i].show();
		if (c1 !== GarbRefExp.DisplayString)
			break;
	}
	for (var j = this.cellArr.length-1; j>=i;--j) {
		c2 = this.cellArr[j].show();
		if (c2 !== GarbRefExp.DisplayString)
			break;
	}
	return "("+this.kw+" "+c1+" "+c2+")";
};

// Evaluation
// ----------
RangeRefExp.applyOperation = function(kw, val1,val2) {
    var n1 = val1;
    var n2 = val2;

    switch (kw) {
		case "SUM": return n1+n2;
		case "PROD": return n1*n2;
		default: throw("unknown keyword " + kw);
    };
};

RangeRefExp.evalExp = function(ss) {

	var c1 = this.cellArr[0], c2 = this.cellArr[1];

	if (c1.isEqualTo(c2))
		return c1.evalExp();

	var val = this.applyOperation (this.kw,c1.evalExp(),c2.evalExp());

	for (var i = 2; i < this.cellArr.length;++i) {
		val = this.applyOperation (this.kw,this.cellArr[i].evalExp(),val);
	}
    return val;
};


// Normalization: 
// --------------

// Converts each index reference in an Exp to a cell in the
// spreadsheet ss.

NumExp.normalize = function(ss) {
    return this;
};

StrExp.normalize = function(ss) {
    return this;
};

IndexExp.normalize = function(ss) {
    var c = ss.getCell(this.row, this.col);
    if (!c) {
        throw("index out of bounds: "  + this.show());
    };
    return cellRefExp(c);
};

RangeExp.normalize = function(ss) {
	var cellArr = [];
	cellArr.push(this.rangeLower.normalize(ss));

	if (this.rangeLower.expType !== GarbRefExp.expType && this.rangeHigher.expType !== GarbRefExp.expType)
	{
		var start,end;
		if (this.dir == 0) {//along the same row
			start = this.rangeLower.col;
			end = this.rangeHigher.col;
		}else{
			start = this.rangeLower.row;
			end = this.rangeHigher.row;
		}

		for (var i = start+1; i<end;++i) {
			if (this.dir == 0)
				cellArr.push(indexExp(this.rangeLower.row,i).normalize(ss));
			else
				cellArr.push(indexExp(i,this.rangeLower.col).normalize(ss));
		}
	}
	cellArr.push(this.rangeHigher.normalize(ss));
    return rangeRefExp(this.kw,cellArr,this.dir);
};

OpExp.normalize = function(ss) {
    var nes = this.rands.mapMethod("normalize", ss);
    return opExp(this.rator, nes);
};

CellRefExp.normalize = function(ss) {
    return this;
};

RangeRefExp.normalize = function(ss) {
    return this;
};

GarbRefExp.normalize = function(ss) {
    return this;
};

// Collect cells in a normalized formula

// Exp.parents() : set[cell]

NumExp.parents = function() {
    return Set.emptySet;
};

StrExp.parents = function() {
    return Set.emptySet;
};


CellRefExp.parents = function() {
    return Set.mkSet(this.cell);
};


GarbRefExp.parents = function() {
    return Set.emptySet;
};

RangeRefExp.parents = function() {
	var cellArr = this.cellArr;
    var cells = this.cellArr.mapMethod("parents"); // array of sets
    var ans = cells.myReduce("union", Set.emptySet);	
	return ans;
};

OpExp.parents = function() {
    var rands = this.rands;
    var rps = rands.mapMethod("parents"); // array of sets
    var ans = rps.myReduce("union", Set.emptySet);
    return ans;
};


