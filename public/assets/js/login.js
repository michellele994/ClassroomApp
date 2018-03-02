$(function() {
	//login
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		//getting information from the form inputs
		const username = $("#enter_username").val().trim();
		const name = $("#enter_name").val().trim();
		if (username && name !="")
		{
			$.get("/api/users/"+username+"/").then(function(response){
				if(response){
					console.log(response);
					//change window location without goback 
					//window.location.replace("/classes/"+username+"/"+name);
					//allows go back
					window.location="/welcome/"+username+"/";
				}
				else{
					alert("Incorrect login");
				}
			});
		}
		else
		{
			alert("please enter a username and password");
		}
	});

	//signup button will take information from form to create data
	$("#signup").on("click", function(event) {
		event.preventDefault();

		//getting information from the form inputs
		const username = $("#enter_username").val().trim();
		const name = $("#enter_name").val().trim();
		var userExists=false;
		var userNameexists=false;

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
		console.log(nameAppropriate);
		//make sure that both required fields have been entered before creating an account
		if (username && name && nameAppropriate)
		{
			//new user to make the post request
			var newUser = {
				username: username,
				name: name
			}
			//before sending post request we must make sure that users dont exist
			$.get("/api/users/",{
				//type:"GET"
		
			}).then(function(response){
				//console.log(response[1].name);
				//go through the api and check if the username and name are taken
				for(var i=0;i<response.length;i++){
					if(response[i].name===name&&response[i].username===username){
						userExists=true;
					}
					if(response[i].username===username){
						userNameexists=true;
					}
				}
				//if both username and name are take userExists already
				if(userExists===true){
					alert("This name already exists!");
				}
				else{
					//if username is taken
					if(userNameexists===true){
						alert("Username is taken");
					}
					else{
						//(userExists===false&&userNameexists===false){
						//Create a new user
						$.ajax("/api/users", {
							type: "POST",
							data: newUser
						}).then(
						function() {
							alert("congrats you have created an account. Enter your information again to log in");
							location.reload();
						});
					}
				}
			})
		}
		else if (!nameAppropriate)
		{
			alert("Your username is inappropraite");
		}
		else
		{
			alert("please enter a username and password");
		}	
	});
});