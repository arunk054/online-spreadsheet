<?sjs 

default_dir   =  pow_server.POST['default_dir']; 
default_dir =  unescape(default_dir.replace(/\+/g," "));

//get the list of files in the dir
var list = pow_file_list_dir(default_dir);
 for(i in list) {
	//basically \n is the delimiter
   document.write(list[i].leafName+"\n");
 }

?>
