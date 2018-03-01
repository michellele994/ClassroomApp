
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

		$.ajax("/api/students", {
			type: "POST",
			data: newStudent
		}).then(
		function() {
			console.log("student has been created");
			location.reload();
		})

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
		$.get("/api/users/"+userName).then(function(response){
			if(response){
				userID = response.id;
				var newClass = {
				classname: className,
				classdesc: classDesc,
				userTableId: userID
		}
		if(className && classDesc)
		{
			$.ajax("/api/classes", {
				type: "POST",
				data: newClass
			}).then(
			function() {
				console.log("class has been created");
				location.reload();
			})
		}
			}
		});	
	})




	// $("#new-class").on('shown.bs.modal', function () {
	// 	$('#modal-dialog').trigger('focus')
	// });
	// $('#new-class').on('hidden.bs.modal', function (e) {
	// 	$('.modal-body').empty();
	// });
});