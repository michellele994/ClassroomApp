$(function() {
	$("#take_user").on("click", function(event) {
		event.preventDefault();
		const username = $("#enter_name").val().trim();

		if (username)
		{
			var newUser = {
				username: username
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
})