
var SSView = {};
SSView.rowContextMenu = null;
SSView.colContextMenu = null;

SSView.make = function(ss) {

    var a = {};

    var noRows = ss.getNoRows();
    var noCols = ss.getNoCols();

    var table = DOM.tableWithGenerator(
		noRows, 
                noCols,
                function(i) {return RowHeaderView.make(i);},
                function(j) {return ColHeaderView.make(j);},
                function(i,j) {
                    return InputController.make(ss.getCell(i,j).getResult(), ss.getCell(i,j)).getEditor();},
                                     {id:"ss-table"}  );

    document.body.appendChild(table);

	if (SSView.colContextMenu != null) {
		SSView.colContextMenu.destroy();
		SSView.colContextMenu = null;
	}
	if (SSView.rowContextMenu != null) {
		SSView.rowContextMenu.destroy();
		SSView.rowContextMenu = null;
	}
	SSView.rowContextMenu = createRowContextMenu(table);
	SSView.colContextMenu = createColContextMenu(table);

    a.table = table;

    // for debugging
    a.ss = ss;
    return a;
};
SSView.reDrawImmediate = function () {
	document.body.removeChild(document.getElementById("ss-table"));
	SSView.make(System.ss);
}

SSView.reDraw = function() {
	setTimeout(SSView.reDrawImmediate,200);
}
SSView.alertNothingDel = function () {
	alert("Error: Nothing to delete. ");
}

SSView.deleteRow = function(index) {
	if (index == -1) {
		SSView.alertNothingDel();
		return false;
	}
	var nCols = System.ss.getNoCols();
	//Remove the ref of each element in the row in the children of its parents
	for (var j = 0; j< nCols; ++j) {
		var deletableCell = System.ss.getCell(index,j);
		var parents = deletableCell.getFormula().parents().arr;
		for (var i = 0; i< parents.length; ++i){
			parents[i].removeChild(deletableCell);
		}
	}

	var toUpdate = Set.mkSet();

	//Updating the children before actually deleting the col
	for (var j = 0; j< nCols; ++j) {
		var children = System.ss.getCell(index,j).getChildren().arr;
		for (var i = 0;i< children.length; ++i) {
			if (children[i].getFormula().expType == RangeRefExp.expType)
				toUpdate.add(children[i]);
			else {
				children[i].setErrorResult();
				children[i].updateChildren();
			}
		}
	}

	if (!System.ss.deleteRow(index)){
		SSView.alertNothingDel();
		return false;
	}	

	toUpdate = toUpdate.arr;
	for (var i = 0;i< toUpdate.length; ++i) {
		var newValue = InputController.parseSSExpr(toUpdate[i].showFormula(),System.ss);
		if (newValue != false)
			InputController.setAndUpdate(toUpdate[i],newValue);
		else
			toUpdate[i].setErrorResult();
	}

	return true;
}

SSView.deleteCol = function(index) {
	if (index == -1) {
		SSView.alertNothingDel();
		return false;
	}
	var nRows = System.ss.getNoRows();

	//Remove the ref of each element in the row in the children of its parents
	for (var i = 0; i< nRows; ++i) {
		var deletableCell = System.ss.getCell(i,index);
		var parents = deletableCell.getFormula().parents().arr;
		for (var k = 0; k< parents.length; ++k){
			parents[k].removeChild(deletableCell);
		}
	}
	var toUpdate = Set.mkSet();

	//Updating the children before actually deleting the col
	for (var i = 0; i< nRows; ++i) {
		var children = System.ss.getCell(i,index).getChildren().arr;
		for (var k = 0;k< children.length; ++k) {
			if (children[k].getFormula().expType == RangeRefExp.expType)
				toUpdate.add(children[k]);
			else {
				children[k].setErrorResult();
				children[k].updateChildren();
			}
		}
	}
	if (!System.ss.deleteCol(index)){
			SSView.alertNothingDel();
			return false;
	}

	toUpdate = toUpdate.arr;
	for (var i = 0;i< toUpdate.length; ++i) {
		var newValue = InputController.parseSSExpr(toUpdate[i].showFormula(),System.ss);
		if (newValue != false)
			InputController.setAndUpdate(toUpdate[i],newValue);
		else
			toUpdate[i].setErrorResult();

	}
	return true;
}

SSView.insertRow = function (index) {

	var toUpdate = Set.mkSet();

	if (index < System.ss.getNoRows()) {//No need to do ref update for inserting last col
		var nCols = System.ss.getNoCols();
		for (var j = 0; j< nCols; ++j) {
			var children = System.ss.getCell(index,j).getChildren().arr;
			for (var k = 0; k< children.length;++k) {
				//TODO: Check if the dir is column wise, only then add to toUpdate set
				if (children[k].getFormula().expType === RangeRefExp.expType)
					toUpdate.add(children[k]);
			}
		}
	}
	System.ss.insertRow(index);

	//Reset the affected RangeRef cells 
	toUpdate = toUpdate.arr;
	for (var i = 0;i< toUpdate.length; ++i) {
		var newValue = InputController.parseSSExpr(toUpdate[i].showFormula(),System.ss);
		if (newValue != false)
			InputController.setAndUpdate(toUpdate[i],newValue);
		else
			toUpdate[i].setErrorResult();

	}

}

SSView.insertCol = function (index) {

	var toUpdate = Set.mkSet();

	if (index < System.ss.getNoCols()) {//No need to do ref update for inserting last col
		var nRows = System.ss.getNoRows();
		for (var i = 0; i< nRows; ++i) {
			var children = System.ss.getCell(i,index).getChildren().arr;
			for (var k = 0; k< children.length;++k) {
				//TODO: Check if the dir is row wise, only then add to toUpdate set
				if (children[k].getFormula().expType === RangeRefExp.expType)
					toUpdate.add(children[k]);
			}
		}
	}
	System.ss.insertCol(index);

	//Reset the affected RangeRef cells 
	toUpdate = toUpdate.arr;
	for (var i = 0;i< toUpdate.length; ++i) {
		var newValue = InputController.parseSSExpr(toUpdate[i].showFormula(),System.ss);
		if (newValue != false)
			InputController.setAndUpdate(toUpdate[i],newValue);
		else
			toUpdate[i].setErrorResult();

	}

}

function createRowContextMenu(table) {
	var items = ["Insert Row Above ","Insert Row Below ","Delete Row "];
	var rowContextMenu = new YAHOO.widget.ContextMenu(
	    "rowContextMenu", 
	    {
	        trigger: [table.rowHeaders],
	        itemdata: items,
	        lazyload: true          ,                          
			container: document.body
	    } 
    );
	function onRowContextMenuClick(p_sType, p_aArgs) {
		var index = parseInt(rowContextMenu.contextEventTarget.id,10)-1;
		var clickedItem = p_aArgs[1];
		if (!clickedItem)
			return null;

		if(clickedItem.index == 0){//row above
			SSView.insertRow(index);
		}else if(clickedItem.index == 1) {//row below
			SSView.insertRow(index+1);
		}else if(clickedItem.index == 2) {//Delete
			SSView.deleteRow(index);		
		}
		SSView.reDraw();
    }

	//This event is used to dynamically change the menu data
	function onTriggerContextMenu(p_oEvent) { 
		var index = rowContextMenu.contextEventTarget.id;
		rowContextMenu.clearContent();
		rowContextMenu.cfg.owner.itemData = [items[0]+index,items[1]+index,items[2]+index];
	}

	rowContextMenu.subscribe("triggerContextMenu", onTriggerContextMenu); 
	rowContextMenu.subscribe("click", onRowContextMenuClick);
	 return rowContextMenu;
};

function createColContextMenu(table) {
	var items = ["Insert Column to the Left of ","Insert Column to the Right of ","Delete Column "];
	var colContextMenu = new YAHOO.widget.ContextMenu(
	    "colContextMenu", 
	    {
	        trigger: [table.colHeaders],
	        itemdata: items,
	        lazyload: true          ,                          
			container: document.body
	    } 
    );

	function onColContextMenuClick(p_sType, p_aArgs) {
		var clickedItem = p_aArgs[1];
		if (!clickedItem)
			return null;

		var index = parseInt(colContextMenu.contextEventTarget.id,10);

		if(clickedItem.index == 0){//col left
			SSView.insertCol(index);

		}else if(clickedItem.index == 1) {//col right
			SSView.insertCol(index+1);
		}else if(clickedItem.index == 2) {//Delete
			SSView.deleteCol(index);
		}
		SSView.reDraw();
    }
	//This event is used to dynamically change the menu data
	function onTriggerContextMenu(p_oEvent) { 
		var index = parseInt(colContextMenu.contextEventTarget.id,10);
		index = Exp.unparseColNum(index);
		colContextMenu.clearContent();
		//This is the line that gives the cool feature of letting the user know the column name in context menu
		colContextMenu.cfg.owner.itemData = [items[0]+index,items[1]+index,items[2]+index];
	}

	colContextMenu.subscribe("triggerContextMenu", onTriggerContextMenu); 
	colContextMenu.subscribe("click", onColContextMenuClick);
	return colContextMenu;
};


