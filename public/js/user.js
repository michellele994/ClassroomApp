$(function() {
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		const name = $("#enter_name").val().trim();
		const username = $("#enter_username").val().trim();
		if (username)
		{
			//Need to check if username has already been taken

			var newUser = {
				username: username,
				name: name
			}
			$.ajax("/api/users", {
				type: "POST",
				data: newUser
			}).then(
			function() {
				console.log("user has been created");
				location.reload();
			})
			$("#enter_name").val("");
			window.location.href = "/thankyou";
		}
		else
		{
			alert("please enter a username");
		}
	});


});