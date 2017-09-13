var View = {};

var Editor = {};

Editor.make = function(initVal) {

    var editor = DOM.dom("input",
                {type     : "text", 
		 readOnly : false,
		 size : 15,
		 style    : "text-align: center;background-color: white;font-size:11pt",
		 value    : initVal}, []);

    return editor;
};


    
