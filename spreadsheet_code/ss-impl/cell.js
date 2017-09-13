var Cell = {};

Cell.ERROR_VALUE = "error";

Cell.make =  function(ss) {

    var a = {};

    // state vector
    var sv = StateVector.make({
	formula : {initValue: numExp(0), 
		   show: function() {return this.getValue().show();}},
	result  : {initValue: 0,
	           show: function() {return this.getValue();}}});

    var formula = sv.formula;
    var result  = sv.result;

	var updateChildren = function() {
		//Loop thru its children and update them
		var childArr = this.children.arr;
		for (var i = 0; i< childArr.length; ++i) {
			//ToDo do these only if isBeingEdited is false for that child
			if (childArr[i].isBeingEdited === false) {
				try {
					childArr[i].result.setValue(childArr[i].getFormula().evalExp(ss));
				}catch (e) {
					childArr[i].setErrorResult();
				}
				childArr[i].updateChildren();//Sort of a DFS (depth first search)
			}
		}
	};


    // initialisation
    var init = function() {

        // conditions

        var errorVal = Condition.make(Cell.ERROR_VALUE, 
                                       function(obj) {
                                           return obj.value === Cell.ERROR_VALUE;
                                       });
        result.setCondition(errorVal);



        var recomputed = Condition.make("recomputed", 
                                       function(obj) {
                                           return true;
                                       });
        result.setCondition(recomputed);


	// handlers
	var recomputeResult = function() {
            var v = null;
            try {
                v = formula.getValue().evalExp(ss);
                result.setValue(v);
            }
            catch (e) {
                setErrorResult();
            }
	};

	var recomputeResultHandler = 
	Handler.make("recomputeResultHandler", recomputeResult);

	// wiring the handler
	formula.addHandler("change", recomputeResultHandler);
    };

    var getResult = function() { 
	return result.getValue();
    };
	
	var setErrorResult = function () {
		result.setValue(Cell.ERROR_VALUE);
	}

    var setFormula = function(f) {
	formula.setValue(f);
    };

    var showFormula = function() {
	return formula.getValue().show();
    };

	var getFormula = function () {
		return formula.getValue();
	}

    var getStateVector = function() {
	return sv;
    };

    var getVar = function(name) {
	return sv[name];
    };

    var getSpreadSheet = function() {
	return ss;
    };

	var addChild = function (cc) {
		this.children.add(cc);
	}

	var removeChild = function (cc) {
		//return this.children.remove(cc);
		for (var i = 0; i < this.children.arr.length;++i) {
			if (this.children.arr[i] == cc) {
				this.children.arr.splice(i,1);
				return true;
			}
		}
		return false;
	}

	var getChildren = function () {
		return this.children;
	}

	//persistence related method
	var getSerializable = function() {
		//dont persist the result because we can re-evaluate the formula
		var form = this.showFormula();
		return {formula : form};
	}

    // interface methods

    a.getVar      = getVar;
    a.getResult   = getResult;
	a.setErrorResult = setErrorResult;
    a.showFormula = showFormula;
    a.setFormula  = setFormula;
	a.getFormula = getFormula;
    a.getSpreadSheet = getSpreadSheet;

    // should be accessible only to controller
    a.getStateVector  = getStateVector;

    // debugging interface
    a.formula = formula;
    a.result = result;
    a.sv   = sv;

	//Dependencies maintained using the set of children
	a.children = Set.mkSet();
	a.addChild = addChild;
	a.removeChild = removeChild;
	a.getChildren = getChildren;
	a.updateChildren = updateChildren;

	a.getSerializable = getSerializable;

	//This has been removed from input-controller and added here,
	//becos only the model shld have all the state vars of the cell
	//TOdo: make it a state variable
	a.isBeingEdited = false;

    init();
    return a;
};



