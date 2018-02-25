$(function() {
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		const username = $("#enter_username").val().trim();
		const password = $("#enter_password").val().trim();
		if (username && password)
		{
			
		}
		else
		{
			alert("please enter a username and password");
		}
	});
	
	//we will have username and pass created for user
	/*//Need to check if username has already been taken

			var newUser = {
				username: username,
				name: password
			}
			$.ajax("/api/users", {
				type: "POST",
				data: newUser
			}).then(
			function() {
				console.log("user has been created");
				location.reload();
			})
			$("#enter_username").val("");
			window.location.href = "/thankyou";*/


});