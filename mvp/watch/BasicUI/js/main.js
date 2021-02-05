
window.onload = function () {
    // TODO:: Do your initialization job
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back"){
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
        }
    });

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	var box = document.querySelector('#textbox');
    	var t = tizen.time.getCurrentDateTime();
    	var xhttp = new XMLHttpRequest();
    	xhttp.open("GET", "http://192.168.202.159:3298", true);
    	xhttp.onreadystatechange = function() {
        	t = tizen.time.getCurrentDateTime().difference(t);
        	if (xhttp.status !== 200) {
        		box.innerHTML = "ERROR: " + xhttp.status
        	} else {
        		box.innerHTML = t.length + "ms";
        	}
    	};
    	xhttp.send();
    });
    
};
