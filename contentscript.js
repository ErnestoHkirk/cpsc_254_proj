// On page load listener, when page fully loaded, this stuff will start
window.addEventListener('load', (event) => {
	// Searching DOM for Professor's name and saving in a text variable
	var prof_name = document.getElementsByClassName("NameTitle__Name-dowf0z-0 cfjPUG")[0];
	var text_prof_name1 = prof_name.children[0].innerText;
	var text_prof_name2 = prof_name.children[1].innerText;
	var full_prof_name = text_prof_name1 + " " + text_prof_name2;
	console.log(full_prof_name);

	// Searching DOM for the Department and savng in a text variable
	var dept_name = document.getElementsByClassName("NameTitle__Title-dowf0z-1 iLYGwn")[0];
	var text_dept_name = dept_name.children[0].children[0].innerText;
	var full_dept_name = text_dept_name;
	console.log(full_dept_name);
	
	// Searching DOM for School Name and saving as a text variable
	var school_name = document.getElementsByClassName("NameTitle__Title-dowf0z-1 iLYGwn")[0];
	var full_school_name = school_name.children[1].innerText;
	console.log(full_school_name);
	
	// Check if school is CSUF, if it is, program will continue
	if(full_school_name == "California State University Fullerton"){
		console.log("RMP Page == CSUF.");
		
		// Locate correct location for gradetier element placement(s)
		var parent_class = document.getElementsByClassName("TeacherFeedback__StyledTeacherFeedback-gzhlj7-0 cxVUGc")[0];
		parent_class_last_child = parent_class.lastChild;

		// Check for existing gradetier parent element, if it already
		// exists, program will not add another copy.
		bool_break = false;
		if(parent_class_last_child.className == "gradetier"){
			bool_break = true;
		}
		if(!bool_break){
			// Department name formatting
			full_dept_name = full_dept_name.split('department');
			formatted_dept_name = full_dept_name[0].split(' ').join('+');
			formatted_dept_name = formatted_dept_name.slice(0, -1);
			console.log(formatted_dept_name);

			// Create URL from department scraped from RMP
			var url = "https://gradetier.com/fullerton?department=" + formatted_dept_name + "&term=Fall&year=2018&course_number=" + "%20";
			
			// Concatenate Professor name to end of URL
			url = url + text_prof_name2 + "," + text_prof_name1;
			console.log(url);

			// Send gradetier url to background.js fetch function
			chrome.runtime.sendMessage(
				url,
				function (response) {
					// Return GPA data and corresponding URL's as a 2D array
					console.log('correct info + hyperlinked returned');
					console.log(response);

					// Add padding to RMP difficulty rating
					var difficulty_level = document.getElementsByClassName("FeedbackItem__StyledFeedbackItem-uof32n-0 dTFbKx")[1];
					difficulty_level.style.padding = "0px 12px 16px 12px";

					// Access each element of response 2D array
					// in order to create/add gradetier element(s)
					for(i = 0; i < response.length; ++i){
						// Creates a grade_tier_span page element
						var grade_tier_span = document.createElement('span');		
						grade_tier_span.className = "gradetier";

						// Adds grade_tier_span to parent element
						parent_class.appendChild(grade_tier_span);
							
						// Formats and adds GPA data onto RMP
						formatted_line = response[i][0].split(' ');
						console.log(formatted_line);
						var gpa_num;
						if(isNaN(formatted_line[4])) {
							gpa_num = formatted_line[5];
						}
						else{
							gpa_num = formatted_line[4];
						}
						var course_gpa_span = document.createElement('span');
						course_gpa_span.innerText = gpa_num;
						console.log(gpa_num);
						course_gpa_span.className = "courseGpa";
						grade_tier_span.style.color = "black";
						grade_tier_span.style.marginBottom = "4px";
						grade_tier_span.style.fontSize = "32px";
						grade_tier_span.style.fontFamily = "Poppins, sans-serif";
						grade_tier_span.style.fontWeight = "900";
						grade_tier_span.style.borderLeft = "1px solid black";
						grade_tier_span.style.padding = "0px 12px 16px 12px";
						grade_tier_span.style.display = "flex";
						grade_tier_span.style.display = "block";
						grade_tier_span.style.flexDirection = "column";
						grade_tier_span.style.textAlign = "center";
						grade_tier_span.style.boxSizing = "border-box";
						grade_tier_span.appendChild(course_gpa_span);

						// Formats and adds course number data and gradetier hyperlink onto RMP 
						var course_num_span = document.createElement('span');
						var course_num = formatted_line[1];
						var someText = "Course Number " + course_num;
						var someUrl = response[i][1];
						let result = someText.link(someUrl);
						course_num_span.innerHTML = result;
						course_num_span.className = "courseNum";
						course_num_span.style.color = "black";
						course_num_span.style.padding = "5px 0px 0px 0px";
						course_num_span.style.fontFamily = "HelveticaNeue, arial";
						course_num_span.style.fontSize = "14px";
						course_num_span.style.display = "flex";
						course_num_span.style.display = "block";
						course_num_span.style.flexDirection = "column";
						course_num_span.style.textAlign = "center";
						course_num_span.style.fontWeight = "450";
						grade_tier_span.appendChild(course_num_span);
					}
				}
			);
		}
	}
});


