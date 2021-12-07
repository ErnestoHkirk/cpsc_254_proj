console.log("Background.js is running");

// Receives the correct url + search terms from contentscript.js / ratemyprofessor
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log(request);

        // Remove professor name from URL
        request_url = request.split('%20');
        prof_name = request_url[1].split(' ');
        prof_last_name = prof_name[0];
        prof_first_name = prof_name[1];
        prof_name = prof_last_name + prof_first_name;

        // Send fetch request for gradetier for GPA information
        fetch(request_url[0]) 
    		.then(function(response) {
    		return response.text()
    		})
    	    .then(function(html) {
			    var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
                
                // Store all rows containing GPA data into a list
                row_list = doc.querySelectorAll("tr");
                row_list_length = row_list.length;
                response_list = [];
                href_list = [];

                // Search each row element for instances of professor's name
                for (i = 0; i < row_list_length; i++){
                    row_text = row_list[i].innerText;
                    row_HTML = row_list[i].children[0].children[0];

                    // if professor's name found in row, save info to arrays
                    if(row_text.includes(prof_name)){
                        // Add GPA info to list
                        row_text = row_text.replace(/(\r\n|\n|\r)/gm, "");
                        row_text = row_text.replace(/\s\s+/g, ' ');
                        response_list[response_list.length] = row_text;

                        // Add URL to list
                        row_HTML = String(row_HTML);
                        row_HTML = row_HTML.split("fullerton");
                        row_HTML = row_HTML[1];
                        href_list[href_list.length] = "https://gradetier.com/fullerton" + row_HTML;
                    }
                }

                // Create 2D array to store GPA and URl gradetier data
                var two_d_array = [];
                i = -1;
                while ( response_list[++i] ) { 
                    two_d_array.push( [ response_list[i], href_list[i] ] );
                }

                // Return 2D array to contentscript.js
                sendResponse(two_d_array);
                })
            .catch(function(err) {  
            console.log('Failed to fetch page: ', err);  
            });
    return true;
    }
    
);