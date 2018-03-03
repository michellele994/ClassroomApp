$(function() {

	//avialable classes if classes doesnt update
	function comparingArrays(teachersnotuser,classesnotEnrolled,callback){
		var AvailableClasses=[];
		if (classesnotEnrolled.length===0){
			populateModal(teachersnotuser);
		}
		else{
			for(var i=0;i<teachersnotuser.length;i++){
				for(var j=0;j<classesnotEnrolled.length;j++){
					if(teachersnotuser[i].classname===classesnotEnrolled[j].classname){
						console.log(teachersnotuser[i].classname);
						console.log(classesnotEnrolled[j].classname);
						AvailableClasses.push(teachersnotuser[i]);
					}
				}
			}
			populateModal(AvailableClasses);
		}
	}

	function populateModal(AvailableClasses){
		for (var i=0;i<AvailableClasses.length;i++){
			console.log("im here 333");
			var classid=AvailableClasses[i].id;
			var classname=AvailableClasses[i].classname;
			var datas="data-classid="+classid;
			var classDisplay="<div class='availableClass'data-classID="+classid+">"+classname+"<div>"
			var enrollebtn="<button "+datas+" class='Enroll'>Enroll</button>"
			$("#classesAvailableModalbody").append(classDisplay+enrollebtn);
		}
	};
	//POPULATE CLASSES AVAILABLE 
	$("#seeAvailclassesBtn").on("click",function(event){
		//console.log("see avail clicked");
		var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		var userName = userInfo.substr(0, userInfo.indexOf("/"));
		$("#classesAvailableModalbody").empty();
		$.get("/api/classes").then(function(allClasses){
			//var AvailableClasses=[];
			var teachersnotuser=[];
			for(var i=0;i<allClasses.length;i++){
				var teacher=allClasses[i].Teacher.username;
				//where user is not a teacher
				if(teacher !== userName ){
					//console.log(teacher);
					var classes={
						id:allClasses[i].id,
						classname:allClasses[i].classname
					}
					teachersnotuser.push(classes);
				}
			}
			console.log(teachersnotuser[0]);
			console.log(teachersnotuser.length);
			//if classes dont update use this get returns where user is not a student
			$.get("/api/availableClasses/"+userName).then(function(classesnotEnrolled){
			//console.log("classeLength: "+AvailableClasses.length);
			//we send the array with the available classes to a function to populate our modal 
			comparingArrays(teachersnotuser,classesnotEnrolled);
			//console.log(AvailableClasses);
			//populateModal(AvailableClasses);
			$("#classesAvailableModal").modal("show");
			});
		});	
	});
	
	//enrolling in class button
	//we need to use event delegation since our buttons do not exist when our document loads
	$("#classesAvailableModalbody").on("click",".Enroll" ,function(event){
	//$(".Enroll").on("click", function(event){
		console.log("enrolled is being clicked");
		var classid = $(this).attr("data-classid");
		//Look through the current class information
		$.get("/api/classes/"+classid).then(function(response){
			var classname = response.classname;
			var classdesc = response.classdesc;
			var teacherid = response.TeacherId;
			var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
			userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
			if ( userInfo.indexOf("/") !== -1)
			{
				var userName = userInfo.substr(0, userInfo.indexOf("/"));
			}
			else {
				userName = userInfo;
			}
			//Look at current user's information
			$.get("/api/users/"+userName).then(function(uResponse){
				var userID = uResponse.id;
				var nameOfUser = uResponse.name;
				//look to see if user already exists as students
				$.get("/api/students/"+userName).then(function(sResponse){
					//If user is not yet a student, make them a student
					if(sResponse === null)
					{
						$.ajax("/api/students", {
							type: "POST",
							data: {
								username: userName,
								name: nameOfUser,
								TeacherId: teacherid,
								MadeClassId: classid
							}
						}).then(
						function(createdSResponse) {
							console.log("student has been created");
							$.get("/api/students/"+userName).then(function(studentsResponseWithNew){
								if(studentsResponseWithNew){
									var studentID = studentsResponseWithNew.id;
									var newClass = {
										classname: classname,
										classdesc: classdesc,
										UserId: userID,
										StudentId: studentID
									}
								$.ajax("/api/enrollment", {
									type: "POST",
									data: newClass
									}).then(
									function(createdEResponse) {
										console.log("enrollment has been createdif");
										location.reload();
									})
								}
							});
						})
					}
					//If it already exists, read the information
					else
					{
						var studentID = sResponse.id;

						var newEnrolled = {
							classname: classname,
							classdesc: classdesc,
							UserId: userID,
							StudentId: studentID
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
			})
		});
		// var newStudent={
		// 	username:userName,
		// 	name:studentName
		// }	
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
		var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
		userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
		if ( userInfo.indexOf("/") !== -1)
		{
			var userName = userInfo.substr(0, userInfo.indexOf("/"));
		}
		else {
			userName = userInfo;
		}
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
									name: nameOfUser
								}
							}).then(
							function() {
								console.log("teacher has been created");
								$.get("/api/teachers/"+userName).then(function(response){
									if(response){
										var teacherID = response.id;
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
						else
						{
							$.get("/api/teachers/"+userName).then(function(response){
								if(response){
									var teacherID = response.id;
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
						}
					});
				}
			});
		}
	});
});