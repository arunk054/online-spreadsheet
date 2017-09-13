/** Some string functions
*
*  Javascript trim, ltrim, rtrim
*  http://www.webtoolkit.info/
*
**/
 
function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}
/********************************************************************/

var fileDialog = null;
var isFileDialogEmpty = true;
var okHandler;

var cancelHandler = function () {
	this.hide();
}

//This is where we retrieve the existing files from server and display it
var onFileDialogShow = function () {

	//Stop sending Auto save requests when displaying the dialog
	stopAutoSave();

	//Show the loading gif till callback is called
	document.getElementById("loadingDiv").style.display="block";
	isFileDialogEmpty = true;

	fileDialog.form.fileNames.innerHTML = "<option style=\"text-align:center;\" value=\"none\">  -- NONE --  </option>";

	$.post(SJS_CODE_DIR+"retrieve_files.sjs", {default_dir: SAVED_FILES_DIR}, function (data) {
		var filesArr = data.split("\n");

		for(var i=0;i<filesArr.length;++i){
			if (filesArr[i] != "") {
				if (isFileDialogEmpty==true)
					fileDialog.form.fileNames.innerHTML = "<option style=\"text-align:center;\" value=\""+filesArr[i]+"\">"+filesArr[i]+"</option>";
				else
					fileDialog.form.fileNames.innerHTML += "<option style=\"text-align:center;\" value=\""+filesArr[i]+"\">"+filesArr[i]+"</option>";
				isFileDialogEmpty=false;
			}
		}
		document.getElementById("loadingDiv").style.display="none";
		
		//Now add the butts to the dialog...
		var dialogButts = [ { text:"OK",  
	                    handler:okHandler }, 
	                  { text:"Cancel",  
	                    handler:cancelHandler
	                     } ]; 
		fileDialog.cfg.resetProperty("buttons");
		fileDialog.cfg.setProperty("buttons", dialogButts);

	});

}

var AUTO_SAVE_ID;

var autoSave = function () {
	//The commented code will not display the save dialog every time autoSave is called
	/*if (System.ss.getName() != "") {
		performSave();
		System.ss.setHeading(true);
	}*/

	onClickSave();
	fileDialog.setHeader("Save File (AJAX Auto Save)");
	if (System.ss.getName() !== "")
		System.ss.setHeading(true);
}

var startAutoSave = function() {
	//Perform Auto Save every 30 secs
	AUTO_SAVE_ID = setInterval(autoSave,60000);
}

var stopAutoSave = function () {
	clearInterval(AUTO_SAVE_ID);
}

//Just a handler fo the list box, ie set the value in text box of what is selected
var onFileListChange = function () {
	fileDialog.form.newFileName.value = this.options[this.selectedIndex].value;
}

//Create the instance of file open dialog once doms are loaded
YAHOO.util.Event.onDOMReady(function () {

// Remove progressively enhanced content class, just before creating the module
    YAHOO.util.Dom.removeClass("fileOpenDialog", "file-open-dialog");
	// Instantiate the Dialog
	fileDialog = new YAHOO.widget.Dialog("fileOpenDialog", 
							{ width : "30em",
							  fixedcenter : true,
							  visible : true, 
								close: true,
								modal: true,
							  constraintoviewport : true
							});

	fileDialog.setHeader("File Save / Open Dialog");
	fileDialog.subscribe("show", onFileDialogShow);
	fileDialog.subscribe("hide", onFileDialogHide);

	document.getElementById("fileNames").addEventListener("change", onFileListChange, false);

	//Initiate the AJAX AUTO SAVE Funtion
	startAutoSave();
});

var onFileDialogHide = function () {
	//restart the auto save, since it wud have been stopped when dialog was shown
	startAutoSave();
}

var showFileDialog = function (header) {

	if (fileDialog == null) {
		alert("ERROR: Dialog not loaded");
	} else {
		if (header != null)
			fileDialog.setHeader(header);
		fileDialog.render();
		fileDialog.show();
	}
}
//////////////// Event Handlets for File menu  /////////////////////////////////////////

		var SAVED_FILES_DIR = "spreadsheet_saved_files";
		var SJS_CODE_DIR = "spreadsheet_code/pow-ajax/";

		var validateDialog = function (data, isSave) {
			//Check the text box only for save operation
			if (!((!data.newFileName || trim(data.newFileName) === ""))) {
				return trim(data.newFileName);
			}


			if (!isSave && isFileDialogEmpty) {// no files to load
				return -1;
				
			}

			if (!((!data.fileNames[0] || data.fileNames[0] === "" || isFileDialogEmpty))) {
				return data.fileNames[0];
			}
			return 1;

		}

		var performSave = function (callback) {
			var fileData = System.ss.getSerialized();
			$.post(SJS_CODE_DIR+"save_file.sjs", {file_name: SAVED_FILES_DIR+"/"+System.ss.getName(), file_data: fileData}, callback);
		}

		var doSaveAs = function() {
			var data = this.getData();
			var fileName = validateDialog(data,true);
			if (fileName == 1) {
				alert ("Please enter a new file name or select an existing file");
				return;
			}

			//Just show the progress gif and remove the buttons
			fileDialog.cfg.setProperty("buttons", []);
			document.getElementById("loadingDiv").style.display="block";

			//Now save the file to the server
			System.ss.setName(fileName);
			performSave(function (data) {
				document.getElementById("loadingDiv").style.display="none";
				fileDialog.hide();
			});
			
		}

		var doOpen = function () {
			var data = this.getData();
			var fileName = validateDialog(data,false);
			if (fileName == 1) {
				alert ("Please select an existing file");
				return;
			} else if (fileName == -1) {
				alert ("No Files to Load");
				fileDialog.hide();
				return;
			}

			//Just show the progress gif and remove the buttons
			fileDialog.cfg.setProperty("buttons", []);
			document.getElementById("loadingDiv").style.display="block";

			//Retrieve the contents of the file
			$.post(SJS_CODE_DIR+"load_file.sjs", {file_name: SAVED_FILES_DIR+"/"+fileName}, function (data) {
				data = trim(data);
				if (data === "error") {
					alert("File does not exist");
					fileDialog.hide();
					return;
				}
				var parsedObj = null;
				try {
					parsedObj = JSON.parse(data);
				}catch(e){}
				if (parsedObj == null) {
					alert("The file is not a valid spread sheet file");
					fileDialog.hide();
					return;
				}
				//Create a new spread sheet first and then populate with the formula
				var nCols = (parsedObj.length > 0)? parsedObj[0].length : 0;
				System.ss = SpreadSheet.make(fileName,parsedObj.length,nCols);
				for(var i = 0;i< parsedObj.length;++i) {
					for(var j = 0;j<nCols;++j) {
						var newValue = InputController.parseSSExpr(parsedObj[i][j].formula,System.ss);
						if (newValue != false) {
							InputController.setAndUpdate(System.ss.getCell(i,j),newValue);
						}
					}
				}
				//finally redraw 
				SSView.reDraw();
				fileDialog.hide();
			});


		}

		var onClickNew = function (p_sType, p_aArgs, p_oItem) {
			System.ss = System.make();
			SSView.reDraw();
		};

		var onClickOpen = function (p_sType, p_aArgs, p_oItem) {
			okHandler= doOpen;
			showFileDialog("Open File");
		};

		var onClickSaveAs = function (p_sType, p_aArgs, p_oItem) {
			okHandler= doSaveAs;
			showFileDialog("Save File");
		};

		var onClickSave = function (p_sType, p_aArgs, p_oItem) {
			if (System.ss.getName() === "") {
				onClickSaveAs();
			} else {
				performSave();
			}

		};


		var onClickExit = function (p_sType, p_aArgs, p_oItem) {
			
			alert("I am sure all browsers come with a close button!");

		};


//////////////// Event Handlets for Ins menu  /////////////////////////////////////////
		var onClickInsRow = function (p_sType, p_aArgs, p_oItem) {
			System.ss.insertRow(System.ss.getNoRows());
			SSView.reDraw();
			//alert("Insert row at end success");
		};

		var onClickInsCol = function (p_sType, p_aArgs, p_oItem) {
			System.ss.insertCol(System.ss.getNoCols());
			//Case when the col cud not be inserted
			if (System.ss.getNoCols() == 0) {
				alert("Please insert a row first.");
				return;
			}
			SSView.reDraw();
		};
		var onClickInsSpecific = function (p_sType, p_aArgs, p_oItem) {			
			alert("Right click the row / column HEADER to perform this operation.");

		};
//////////////// Event Handlets for Del menu  /////////////////////////////////////////
		var onClickDelRow = function (p_sType, p_aArgs, p_oItem) {
			var index = System.ss.getNoRows() -1;
			//del the last row
			if (SSView.deleteRow(index)) {
				SSView.reDraw();
			}	
		};

		var onClickDelCol = function (p_sType, p_aArgs, p_oItem) {
			var index = System.ss.getNoCols()-1;
			if (SSView.deleteCol(index)) {//del the last col
				SSView.reDraw();
			}	

		};

		var onClickDelSpecific = function (p_sType, p_aArgs, p_oItem) {
			
			alert("Right click the row / column HEADER to perform this operation.");

		};
//////////////// Event Handlets for Help menu  /////////////////////////////////////////
		var onClickContents = function (p_sType, p_aArgs, p_oItem) {
			
			alert("You are most welcome to help us document this.");		

		};

		var onClickAbout = function (p_sType, p_aArgs, p_oItem) {
			
			alert("Developer : Arun (arun.k@iiitb.net)");

		};
///////////////////////////////////////////////////////////////////////////////


