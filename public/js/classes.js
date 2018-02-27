$(function() {

	$("#add-class").on("click", function(event)
	{
		$('#new-class').modal('show');
		console.log("this has been clicked");
	})

	// $("#new-class").on('shown.bs.modal', function () {
	// 	$('#modal-dialog').trigger('focus')
	// });
	// $('#new-class').on('hidden.bs.modal', function (e) {
	// 	$('.modal-body').empty();
	// });
});
