<?sjs 

filename   =  pow_server.POST['file_name']; 
filename =  unescape(filename.replace(/\+/g," "));
if (!pow_file_exists(filename)) {
document.write("error");
} else {
document.write(pow_file(filename));
}


?>
