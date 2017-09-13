/*
 * Spreadsheet implementation. 
 *
 */

var SpreadSheet = {};

// invariants:

// noRows === rowHeaders.length
// (for var i=0, i< noRows) { noCols === rowHeaders[i].cells.length}

//this var is a workaround for a small thing, to avoid timeout function to owerwite the heading
var heading = "";

SpreadSheet.make = function(name, noRows, noCols) {
    var ss = {};
    var noRows = noRows;
    var noCols = noCols;

	function createColumns(ss,nCols) {
		return Array.create(nCols, 
			  function(j) { 
				var c = Cell.make(ss);
				return c;
			});
	}

    var rowHeaders = 
    Array.create(noRows,
                 function(i) {
        	 	    var rh = RowHeader.make(i);
		     		rh.cells = createColumns(ss,noCols);
		    		return rh;
                 });

//Not sure where this is used, hence commented
/*    var colHeaders = 
    Array.create(noCols,
                 function(j) {
                     var ch = ColHeader.make(j, ss);
                     return ch;
                 });
*/

    var getName = function() {return this.name;}

	var setHeading = function (isAutoSave) {
		var nam = this.name;
		if (nam == "")
			nam = "untitled"
		var str = "File Name : <big>\" "+nam+" \"</big>";

		if (isAutoSave){
			var d= new Date();
			var autoStr = " ( Auto Saved at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" Hrs )"
			
			document.getElementById("heading").innerHTML = str + "<blink>"+autoStr+"</blink>"
			heading = str+autoStr;
			setTimeout(function() {
				document.getElementById("heading").innerHTML = heading;
			}, 3000);//Blink for 3 secs and then stop, this interval shld be less than autoSave interval
		} else {
			//store the heading in global variable, so that if heading changes, the timeout does not reset it back
			heading = str;
			document.getElementById("heading").innerHTML = str;

		}

	}

    var setName = function(nam) { 

		this.name = nam;
		this.setHeading(false);
	}

    var getNoRows = function() {
        return rowHeaders.length;
    };

    var getNoCols = function() {
		if (rowHeaders.length == 0)//if there are no rows then there can be no cols
			return 0;
        return rowHeaders[0].cells.length;
    };

    var getCell = function(r,c) {
        return rowHeaders[r].cells[c];
    };

// return the index of c in this spreadsheet, null otherwise
    var indexOf = function(cell) {
        for (var i  = 0; i < rowHeaders.length; i++) {
            var ans = rowHeaders[i].cells.indexOf(cell);
            if (ans !== -1) {
                return [i, ans];
            };
        };
        return null;
    };

// return the index of row header, null otherwise
    var indexOfRowHeader = function(rh) {
        var ans =  rowHeaders.indexOf(rh);
        if (ans !== -1)
            return ans;
        return null;
    };


// return the index of col header, null otherwise
//Not sure where it is used, hence commented
/*    var indexOfColHeader = function(ch) {
    var ans =  colHeaders.indexOf(ch);
    if (ans !== -1)
	return ans;
    return null;
    };*/

	//Insert a row so that its position in the modified spreadsheet is i, where 0 <=i <= noRows
	var insertRow = function (i) {
		//First create an array of cells of size ncols
		var nCols = this.getNoCols();

		var rh = RowHeader.make(i);
		rh.cells = createColumns(ss, nCols);
		//The amazing splice method ==> splice : [index, no_to_remove, [element1][, ..., elementN]]
		//If 2nd arg is 0, then it inserts the given elements before the index.
		rowHeaders.splice(i,0,rh);
	}


	//Insert a col so that its position in the modified spreadsheet is i, where 0 <=j<= noCols
	var insertCol = function (j) {
		//Here it is slightly diff from insertRow, for each row we call the splice method
		var nRows = this.getNoRows();
		for (i = 0; i < nRows; ++i) {
			rowHeaders[i].cells.splice(j,0,Cell.make(ss));
		}
	}

	//Delete row at position i, where 0<= i < nRows
	var deleteRow = function (i) {
		if (this.getNoRows() <= i) //trying to delete a non-existing row
			return false;
		//Remove one row at index i
		rowHeaders.splice(i,1);
		return true;
	}

	//Delete col at position j
	var deleteCol = function (j) {
		if (this.getNoCols() <= j )//trying to delete a non-existing col
			return false;
		//For each row we call the splice method to remove a col at jth index
		var nRows = this.getNoRows();
		for (i = 0; i < nRows; ++i) {
			rowHeaders[i].cells.splice(j,1);
		}
		return true;
	}

	//Persistence related
	var getSerialized = function () {
		var nRows = getNoRows(),nCols = getNoCols();
		var tempArr = Array.create(nRows, function (i) {
			var subArr = Array.create(nCols, function (j) {
				return rowHeaders[i].cells[j].getSerializable();
			});
			return subArr;
		});
		return JSON.stringify(tempArr);
	}

    // interface
	ss.name = name;
    ss.getName = getName;
    ss.setName = setName;
	ss.setHeading = setHeading;
	ss.setHeading(false);

    ss.getNoRows = getNoRows;
    ss.getNoCols = getNoCols;
    ss.getCell = getCell;
    ss.indexOf = indexOf;
    ss.indexOfRowHeader = indexOfRowHeader;
//    ss.indexOfColHeader = indexOfColHeader;

	ss.insertRow = insertRow;
	ss.insertCol = insertCol;
	ss.deleteRow = deleteRow;
	ss.deleteCol = deleteCol;


	ss.getSerialized = getSerialized;

    return ss;
};
/*var obj = {name:"ddd"};
function getOb(){
    return {formula : " (2 3)"};
}
var arr = Array.create( 3, function (i){
   var subArr = Array.create(2, function (j) {
        return getOb();
    }); 
    return subArr;
});

var text = JSON.stringify(arr);
JSON.parse(text);
*/

    
    
    
    
