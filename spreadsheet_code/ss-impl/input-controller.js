var InputController = {};

InputController.parseSSExpr = function(val,ss) {
	//create the ast by parsing it
	var psObj = Formula(ps(val));
	//Second if implies that the val was not fully parsed eg: val = 3a or A1B etc
	if (psObj == false || psObj.remaining.length > 0) {
		return false;
	}
	if (psObj.ast.expType === RangeExp.expType && psObj.ast.dir == -1) {//THis is the case when the range is not coaxial
		alert("ERROR: Either the range is not co-axial or the lower index is greater than the upper index");
		return false;
	}
	//Parsed successfully, so,normalize now
	var normExp = null;
	try {
		normExp = psObj.ast.normalize(ss);
	}catch(e) {
		return false;
	}
	
	return normExp;
}

//Function to check for circular dependencies of the given cell with the set of newParents
InputController.isCircularReference = function (cell, newParents) {
	if (newParents.isEmpty())
		return false;//no problem, as there are no references in the cell
	if (newParents.contains(cell))
		return true; // the cell references itself, hence circular reference
	var isCircRefRecursice = function (children) {

		if (!(newParents.intersection(children)).isEmpty()) {
			return true;
		}
		var len = children.arr.length;
		for (var i =0 ; i< len; ++ i) {
			if (children.arr[i].getChildren().isEmpty())
				continue;
			if (isCircRefRecursice(children.arr[i].getChildren()))
				return true;
		}
		return false;
	}
	var children = cell.getChildren();
	if (children.isEmpty())
		return false;
	return isCircRefRecursice(children);
}

InputController.setAndUpdate = function (cell, newValue) {
	//Computing dependencies
	newParents = newValue.parents().arr;
	len = newParents.length;
	for (var i = 0; i< len; ++i) {
		newParents[i].addChild(cell);
	}

	cell.setFormula(newValue);

	//Now update dependencies
	cell.updateChildren();

}


InputController.make = function(initValue, cell) {
    var a = {};

    var input = CellView.make(initValue, cell);
    var editor = input.getEditor();
	//Remain in error when redrawing
	if (initValue === Cell.ERROR_VALUE) {
		editor.style.backgroundColor=CellView.errorBgColor;
	}
    var getValue = function() {
		return input.getValue();
    };

	var showEditableCell = function () {
	    editor.value = cell.showFormula();
	    editor.readOnly = false;  
	    editor.style.backgroundColor="yellow";
	};

	//Condition added becos, if view is rendered again while any cell is being edited, 
	//then we need to restore in same state
	if (cell.isBeingEdited) {
		showEditableCell();
	}

    var handleDblclick = function(e) {
		if (cell.isBeingEdited) {
			// dblclick on an input already being edited. Ignore.
		}
		else {
			cell.isBeingEdited = true;
			showEditableCell();
		};
    };

    var handleKeypress = function(e) {
	if (e.keyCode == 13) { // newline
		if (cell.isBeingEdited == false)
			return;
		cell.isBeingEdited = false;
		//console.log("prev formula = "+cell.showFormula());

		//This will do parsing and normalization
	    var newValue = InputController.parseSSExpr(editor.value,cell.getSpreadSheet()); 
	    editor.readOnly = true;

		if (cell.getResult() === Cell.ERROR_VALUE)
		    editor.style.backgroundColor=CellView.errorBgColor;
		else
		    editor.style.backgroundColor="white";
	    if (newValue == false) {
			alert("Input is not valid, restoring to " + 
		      cell.getResult());
			editor.value = cell.getResult();
	    }
		//closure analysis and circular referencing
	    else if (InputController.isCircularReference(cell,newValue.parents())){
			alert("Error: Circular dependency, rejecting formula "+newValue.show());
			editor.value = cell.getResult();
		} else {

			//Get the prev parents of formula and remove their child.
			var prevParents = cell.getFormula().parents().arr;
			var len = prevParents.length;
			for (var i = 0; i< len; ++i) {
				prevParents[i].removeChild(cell);
			}
			InputController.setAndUpdate(cell,newValue);

	    };
		//console.log("new formula = "+cell.showFormula());
	};
    };

    var init = function() {
	editor.addEventListener("dblclick", handleDblclick, false);
	editor.addEventListener("keypress", handleKeypress, false);
    };

    var getBeingEdited = function() {
        return cell.isBeingEdited;
    };

    var getEditor  = function() {
        return editor;
    };

    var getValue  = function() {
        return editor.value;
    };


    // API
    a.getEditor = getEditor;
    a.getValue = getValue;

    // Debugging Interface
    a.editor = editor
    a.input  = input
    a.getBeingEdited = getBeingEdited;

    init();

    return a;
};
