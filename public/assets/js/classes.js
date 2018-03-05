$(function() {
	var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		if ( userInfo.indexOf("/") !== -1)
		{
			var userName = userInfo.substr(0, userInfo.indexOf("/"));
		}
		else {
			userName = userInfo;
		}

	function populateModal(AvailableClasses){
		for (var i=0;i<AvailableClasses.length;i++){
			var classid=AvailableClasses[i].id;
			var classname=AvailableClasses[i].classname;
			var datas="data-classid="+classid;
			var classDisplay="<div class='availableClass'data-classID="+classid+">"+classname+"<div>"
			var enrollebtn="<button "+datas+" class='Enroll'>Enroll</button>"
			$("#classesAvailableModalbody").append(classDisplay+enrollebtn);
		}
	};

	function whereTeacherDoesNotExist(array, studentResponse, activateModal)
	{
		var classesAvailable = [];
		var classesTeaching = [];
		for (var i = 0; i<array.length; i++)
		{
			classesTeaching.push(array[i]);
		}
		var exists = false;
		$.get("/api/classes/").then(function(allClasses){
			for (var i = 0; i <allClasses.length; i++)
			{
				for (var j = 0; j <classesTeaching.length; j++)
				{
					if (allClasses[i].id === classesTeaching[j].id)
					{
						exists = true;
					}
				}
				if (exists === false)
				{
					classesAvailable.push(allClasses[i]);
				}
				else
				{
					exists = false;
				}
			}
			console.log(classesAvailable)

			if(activateModal)
			{
				populateModal(classesAvailable);
				$("#classesAvailableModal").modal("show");
			}
			else if (!activateModal){
				classesAvailable = whereStudentDoesNotExist(studentResponse, classesAvailable);
				populateModal(classesAvailable);
				$("#classesAvailableModal").modal("show");
			}
			return classesAvailable;
		});

	}

	function whereStudentDoesNotExist(arrayOfStudent, arrayToCompare)
	{
		var enrolledClasses = [];
		var classesNotStudent = [];
		for (var i = 0; i<arrayOfStudent.length; i++)
		{
			enrolledClasses.push(arrayOfStudent[i]);
		}
		var exists = false;
		for (var i = 0; i <arrayToCompare.length; i++)
		{
			for (var j = 0; j <enrolledClasses.length; j++)
			{
				if (arrayToCompare[i].id === enrolledClasses[j].id)
				{
					exists = true;
				}
			}
			if (exists === false)
			{
				classesNotStudent.push(arrayToCompare[i]);
			}
			else
			{
				exists = false;
			}
		}
		return classesNotStudent;
	}
	//POPULATE CLASSES AVAILABLE 
	$("#seeAvailclassesBtn").on("click",function(event){
		//console.log("see avail clicked");
		$("#classesAvailableModalbody").empty();

		//If person is a teacher of their class, do not display that class
		$.get("/api/teachers/"+userName).then(function(teacherResponse){
			$.get("/api/students/"+userName).then(function(studentResponse){

				if ((studentResponse === null || studentResponse.ExistingClasses.length === 0) && (teacherResponse === null || teacherResponse.ExistingClasses.length === 0))
				{
					console.log("User does not have any classes, display all classes");
					$.get("/api/classes/").then(function(allClasses){
						populateModal(allClasses);
						$("#classesAvailableModal").modal("show");
					});
				}
				else if (teacherResponse && (studentResponse === null || studentResponse.ExistingClasses.length === 0))
				{
					//Filter classes that the user is already a teacher
					whereTeacherDoesNotExist(teacherResponse.ExistingClasses,[], true);
				}
				else if (studentResponse && (teacherResponse === null || teacherResponse.ExistingClasses.length === 0))
				{

						//Check through the student's api and see which classes they are already enrolled in
						//If they are enrolled in a class, do not display it.
					$.get("/api/classes/").then(function(allClasses){
						populateModal(whereStudentDoesNotExist(studentResponse.ExistingClasses, allClasses));
						$("#classesAvailableModal").modal("show");
					});

				}
				else if (studentResponse && teacherResponse)
				{
					whereTeacherDoesNotExist(teacherResponse.ExistingClasses, studentResponse.ExistingClasses, false);
				}
			});
		});
	});
	
	//enrolling in class button
	//we need to use event delegation since our buttons do not exist when our document loads
	$("#classesAvailableModalbody").on("click",".Enroll" ,function(event){
	//$(".Enroll").on("click", function(event){
		console.log("enrolled is being clicked");
		var classid = $(this).attr("data-classid");

		$.get("/api/users/"+userName).then(function(userResponse){
			var userId = userResponse.id;
			var nameOfUser = userResponse.name;

			//Look to see if a student is already a student. If not, make them a student.
			$.get("/api/students/"+userName).then(function(studentResponse){
				if (studentResponse === null)
				{
					$.ajax("/api/students", {
						type: "POST",
						data: {
							username: userName,
							name: nameOfUser,
							UserId: userId
						}
					}).then(function(createdSResponse) {
						console.log("student has been created");
						//Now add student to roster
						$.ajax("/api/enrollment/", {
							type: "POST",
							data: {
								classid: classid,
								username: userName
							}
						}).then(function(createdAssociation) {
							console.log("This should have been done");
						})
					})
				}
				//If it already exists, read the information
				else
				{
					var studentID = studentResponse.id;

					var newEnrolled = {
						classid: classid,
						username: userName
					}
					$.ajax("/api/enrollment", {
						type: "POST",
						data: newEnrolled
					}).then(
					function() {
						console.log("enrollment has been created else");
						location.reload();
					})

				}
			});
		});
	});	

	//view class page button clicked
	$(".classPg").on("click", function(event)
	{
		var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		var userName = userInfo.substr(0, userInfo.indexOf("/"));
		var classid=$(this).attr("data-classid");
		$.get("/api/classes/"+classid).then(function(response){
			var teachername = response.Teacher.username;
			if (userName===teachername){
						window.location="/classTeacherview/"+userName+"/";
			}
			else{
				//change window location without goback 
						//window.location.replace("/classes/"+username+"/"+name);
						//allows go back
						window.location="/classStudentview/"+userName+"/";
			}
		})
	})

	//creating new class button
	$("#create-new-class").on("click", function(even)
	{
		event.preventDefault();
		var className = $("#new-class-name").val().trim();
		var classDesc = $("#new-class-desc").val().trim();
		if(className && classDesc)
		{
			$.get("/api/users/"+userName).then(function(response){
				if(response){
					var userID = response.id;
					var nameOfUser = response.name;
					$.get("/api/teachers/"+userName).then(function(tResponse){
						if(tResponse === null)
						{
							$.ajax("/api/teachers", {
								type: "POST",
								data: {
									username: userName,
									name: nameOfUser,
									UserId: response.id
								}
							}).then(
							function() {
								console.log("teacher has been created");
								$.get("/api/teachers/"+userName).then(function(currTResponse){
									if(response){
										var teacherID = response.id;
										var newClass = {
											classname: className,
											classdesc: classDesc,
											TeacherId: currTResponse.id
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
						else
						{
							$.get("/api/teachers/"+userName).then(function(response){
								if(response){
									var newClass = {
										classname: className,
										classdesc: classDesc,
										TeacherId: response.id
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
						}
					});
				}
			});
		}
	});
});