/* 
 * Functions for constructing and manipulating DOM nodes.
 * Adapted from http://eloquentjavascript.net
 * 
 * node:      Node
 * attribute: String
 * value:     String OR Object (of name-value pairs)
 * 
 */

/*
 * setNodeAttribute : (node?,string?,(or/c string,object)?) -> null
 * 
 * setNodeAttribute adds an attribute to a node given the node,attribute
 * and the value
 *
 * attribute class,checked,for,and style has special meaning in javascript
 * and so need to have special adjustments
 *
 * example:
 * setNodeAttribute(input,"type","text") -> adds attribute type="text" to 'input' node 
 */


var DOM = {};

DOM.setNodeAttribute = function(node, attribute, value) {
  if (attribute == "class")
    node.className = value;
  else if (attribute == "checked")
    node.defaultChecked = value;
  else if (attribute == "for")
    node.htmlFor = value;
  else if (attribute == "style")
      DOM.setStyle(node, value);
  else node.setAttribute(attribute, value);
}


/* setNodeAttributes : (node?,object?) -> null?
 * 
 * example:
 * setNodeAttributes(input,{type:"text",value:"Hello"}) 
 *       => Sets the type and value attributes to the input node
 * 
 */

DOM.setNodeAttributes = function(node, attributes) {
    attributes.forEachOwnProperty(function(name, value) {
	    DOM.setNodeAttribute(node, name, value);});
};

/* 
 * setStyle :(node?,(or/c object,string)?) -> null
 * 
 * example: 
 * setStyle(node, {color: "green"});
 * setStyle(node, "color: green; margin-left: 10%");
 */

DOM.setStyle = function(node, attributes) {
    if (typeof attributes == "string") {
        node.style.cssText = attributes;
    }
    else {
        attributes.forEachOwnProperty(function(name, value) {
                node.style[name] = value;});
    };
};

/* 
 * dom : (string?,object?,(or/c array? string?)) -> DOM
 * dom function creates a dom node with the given name 
 * attributes and children nodes.
 *   
 * name: String
 * attributes: Object OR null
 * children: array(Node OR String)
 *  
 */

DOM.dom = function(name, attributes, children) {
  var node = document.createElement(name);

  if (attributes) {
      DOM.setNodeAttributes(node, attributes);
  };
  children.forEach(function(child) {
	  if (typeof child == "string")
	      child = document.createTextNode(child);
	  node.appendChild(child);
      });
  return node;
};

// tableDataGenerator= function(i,j) {return tableData[i][j];}



DOM.tableWithGenerator = 
    function(noRows, noCols, 
	     rowHeaderGenerator, colHeaderGenerator, 
	     tableDataGenerator, style) {
    var colHeaderRow = null;
    var tbody = null;
    var table = null;

	//Used to add the context menu
    var rowHeaders = [], colHeaders =[];

    var colHeader = Array.create(noCols, function(j) {
		var bgCol ;
		if (j%2 == 0)
			bgCol = "#4ff";
		else
			bgCol = "#f7f";
		var colHeadText = colHeaderGenerator(j);
		var obj = DOM.dom("th", {id: j,style : "background-color: "+bgCol+";font-size:12pt;"}, [colHeadText]);
		colHeaders.push(obj);
	    return obj
	});

    
    var rows = Array.create(noRows, 
			    function(i) {
				var bgCol ;
				if (i%2 == 0)
					bgCol = "#f7f";
				else
					bgCol = "#4ff";
				var rowHeadText = rowHeaderGenerator(i);
				var th  = DOM.dom("th", {id: rowHeadText, style : "background-color: "+bgCol+";font-size:14pt;width:18pt"}, [rowHeadText]);
				rowHeaders.push(th);
				var tds = Array.create(noCols, function(j) {
					var td = DOM.dom("td", null, 
						     [tableDataGenerator(i,j)])
					return td;
				    });
				var row = tds;
				row.insert(0, th);
				return DOM.dom("tr", null, row);
			    });

    // 0th column of colHeader should be empty
    colHeader.insert(0, DOM.dom("th", null, []));
    colHeaderRow = DOM.dom("tr", null, colHeader);
    rows.insert(0, colHeaderRow);
    tbody = DOM.dom("tbody", null, rows);
	//Add the two array to table attribs, so that we can add context menus to it

    table = DOM.dom("table", style, [tbody]);
	table.rowHeaders = rowHeaders;
	table.colHeaders = colHeaders;
    return table;
};

    
DOM.table = function(rowHeaderData, colHeaderData, tableData, style) {
    return  DOM.tableWithGenerator(rowHeaderData.length, 
				   colHeaderData.length,
				   function(i) {return rowHeaderData[i];},
				   function(j) {return colHeaderData[j];},
				   function(i,j) {return tableData[i][j];},
				   style);
};
    

