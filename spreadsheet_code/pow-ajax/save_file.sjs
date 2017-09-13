<?sjs 

filename   =  pow_server.POST['file_name']; 
filename =  unescape(filename.replace(/\+/g," "));

filedata   =  pow_server.POST['file_data']; 

pow_file_put_contents(filename, filedata, "w" );


?>
