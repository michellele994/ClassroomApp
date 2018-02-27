$(function() {
	//login
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		//getting information from the form inputs
		const username = $("#enter_username").val().trim();
		const name = $("#enter_name").val().trim();
		//make sure that both required fields have been entered before login in
		if (username && name)
		{
			alert("you've logged in");
			window.location.href = "/welcome";
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

		//new user to make the post request
		var newUser = {
			username: username,
			name: name
		}
		//make sure that both required fields have been entered before creating an account
		if (username && name)
		{
			//before sending post request we must make sure that users dont exist
			$.ajax("api/users/",{
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
					alert("This user already exists!");
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
							alert("congrats you have created an account.Enter your inforamtion again to log in");
							location.reload();
						});
					}
				}
			});
		}
		else
		{
			alert("please enter a username and password");
		}	
	});
});

