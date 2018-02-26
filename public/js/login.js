$(function() {
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		const username = $("#enter_username").val().trim();
		const name = $("#enter_name").val().trim();
		if (username && name)
		{
			
		}
		else
		{
			alert("please enter a username and password");
		}
	});

	$("#signup").on("click", function(event) {
		event.preventDefault();
		const username = $("#enter_username").val().trim();
		const name = $("#enter_name").val().trim();
		var newUser = {
			username: username,
			name: name
		}

		if (username && name)
		{
			$.ajax("/api/users", {
				type: "POST",
				data: newUser
			}).then(
			function() {
				alert("congrats you have created an account.Enter your inforamtion again to log in");
				location.reload();
			});
		}
		else
		{
			alert("please enter a username and password");
		}
	});
	

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
			window.location.href = "/thankyou";
		}
		else
		{
			alert("please enter a username");
		}
	});*/

