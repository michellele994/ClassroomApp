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
		var userExists=false;
		var userNameexists=false;

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
				for(var i=0;i<response.length;i++){
					if(response[i].name===name&&response[i].username===username){
						userExists=true;
					}
					if(response[i].username===username){
						userNameexists=true;
					}
				}
				if(userExists===true){
					alert("This user already exists!");
				}
				if(userNameexists===true){
					alert("Username is taken");
				}
				if(userExists===false&&userNameexists===false){
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

