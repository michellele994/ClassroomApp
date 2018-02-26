$(function() {
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		const username = $("#enter_username").val().trim();
		const name = $("#enter_name").val().trim();
		if (username&&name)
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
			$("#enter_username").val("");
			window.location.href = "/thankyou";
		}
		else
		{
			alert("please enter a username");
		}
	});


});