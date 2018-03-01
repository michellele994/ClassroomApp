
$(function() {
	//enrolling in class button
	$(".Enroll").on("click", function(event){
		var studentName=$(this).attr("data-studentname");
		var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		var userName = userInfo.substr(0, userInfo.indexOf("/"));

		var newStudent={
			username:userName,
			name:studentName
		}
		
	});
	//view class page button clicked
	$(".classPg").on("click", function(event)
	{
		var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		var userName = userInfo.substr(0, userInfo.indexOf("/"));
		var classTeacher=$(this).attr("data-classTeacherusername");
		//console.log(userName);
		//console.log(classTeacher);
		if (userName===classTeacher){
			//change window location without goback 
					//window.location.replace("/classes/"+username+"/"+name);
					//allows go back
					window.location="/classTeacherview/"+userName+"/";
		}
		else{
			//change window location without goback 
					//window.location.replace("/classes/"+username+"/"+name);
					//allows go back
					window.location="/classStudentview/"+userName+"/";
		}
		
	})

	//creating new class button
	$("#create-new-class").on("click", function(even)
	{
		event.preventDefault();
		const className = $("#new-class-name").val().trim();
		const classDesc = $("#new-class-desc").val().trim();
		var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		var userName = userInfo.substr(0, userInfo.indexOf("/"));
		var userID;
		var nameOfUser;
		var teacherID;
		if(className && classDesc)
		{
			$.get("/api/users/"+userName).then(function(response){
				if(response){
					userID = response.id;
					nameOfUser = response.name;
					$.ajax("/api/teachers", {
						type: "POST",
						data: {
							username: userName,
							name: nameOfUser
						}
					}).then(
					function() {
						console.log("teacher has been created");
						$.get("/api/teachers/"+userName).then(function(response){
							if(response){
								teacherID = response.id;
								var newClass = {
									classname: className,
									classdesc: classDesc,
									UserId: userID,
									TeacherId: teacherID
								}
								$.ajax("/api/classes", {
									type: "POST",
									data: newClass
								}).then(
								function() {
									console.log("class has been created");
									location.reload();
								})
							}
						});
					})
				}
			});
		}
	});
});
