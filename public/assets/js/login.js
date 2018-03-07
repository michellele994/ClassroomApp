
$(function() {
	//When a user presses the "Log in" button.
	$("#take_user").on("click", function(event)
	{
		event.preventDefault();
		//getting information from the form inputs
		const username = $("#enter_username").val().trim();
		const password = $("#enter_password").val().trim();
		if (username && password)
		{
			$.get("/api/users/"+username+"/").then(function(response)
			{
				if(response){
					//making sure that password matches password in DB
					if (password === response.password)
					{
						window.location="/welcome/"+username+"/";
					}
					else
					{
						$("#alert-message-login").text("Incorrect login, please try again");
					}
				}
				else
				{
					$("#alert-message-login").text("That username does not exist. Sign up!");
				}
			});
		}
		else
		{
			$("#alert-message-login").text("Please enter a username and password");
		}
		$("#enter_username").empty();
		$("#enter_password").empty();
	});

	//When a user presses the "Sign up" button
	$("#create-new-user").on("click", function(event)
	{
		event.preventDefault();
		const username = $("#new_username").val().trim();
		const name = $("#new_name").val().trim();
		const password=$("#new_password").val().trim();

		//Determine if username is appropriate.
		var nameAppropriate = true;
		for (var i = 0; i < username.length; i++)
		{
			if (username.charAt(i) === " " ||
				username.charCodeAt(i) < 47 ||
				(username.charCodeAt(i) >57 && username.charCodeAt(i) < 65) ||
				(username.charCodeAt(i) > 90 && username.charCodeAt(i) < 97) ||
				username.charCodeAt(i) > 122 )
			{
				nameAppropriate = false;
				break;
			}
		}

		//make sure that both required fields have been entered before creating an account
		if (username && name && password && nameAppropriate)
		{
			if (password.length > 5)
			{
				//new user to make the post request
				var newUser = {
					username: username,
					name: name,
					password: password
				}
				//before sending post request we must make sure that users doesnt exist
				$.get("/api/users/"+username).then(function(response){
					//go through the api and check if the username and name are taken
					if (response)
					{
						alert("The username already exists!");
					}
					else
					{
						$.ajax("/api/users/", {
							type: "POST",
							data: newUser
						}).then(
						function() {
							window.location="/welcome/"+username+"/";
						});
					}
				})
			}
			else
			{
				$("#alert-message").text("Your password needs to be 6 characters long.");
			}
		}
		else if (!nameAppropriate)
		{
			$("#alert-message").text("Your username has inappropriate characters. Please try again!");
		}
		else
		{
			$("#alert-message").text("Please enter a username and password");
		}	
	});
});