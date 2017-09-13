var CellView = {};
CellView.errorBgColor = "#FFBBAA";
CellView.make = function(initValue, cell) {

    var a = {};

    var editor = Editor.make(initValue);
    
    var wireHandler = function() {
	var redisplayHandler = 
	Handler.make("redisplay-" + "cell",
		     function() { 
			 	editor.value = cell.getVar("result").show();
		     });
        cell.getVar("result").addHandler("recomputed", redisplayHandler);

	var errorDisplayHandler = 
	Handler.make("error-display" + "cell",
		     function() { 
			 editor.style.backgroundColor= CellView.errorBgColor;
		     });
        cell.getVar("result").addHandler(Cell.ERROR_VALUE, errorDisplayHandler);

		var reChangeHandler = 
		Handler.make("reChanged", function () {
			if (cell.getVar("result").getValue != Cell.ERROR_VALUE)
				editor.style.backgroundColor="white";
		});
        cell.getVar("result").addHandler("change", reChangeHandler);
    };


    var getEditor = function() {
	return editor;
    };


    var getValue = function() {
	return editor.value;
    };

    wireHandler();


    a.getEditor = getEditor
    a.getValue = getValue; 
    return a;
};


    
