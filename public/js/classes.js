$(function() {
<<<<<<< HEAD
	//got to classpage
	$(".classPg").on("click", function(event) {
        event.preventDefault();
        
    });
=======

	$(".classPg").on("click", function(event)
	{
		$('#new-class').modal('show');
		console.log("this has been clicked");
	})

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
>>>>>>> 53d8ebf0628a7efdaaae4b589398f4d361d773c6
});