$(function() {
	//postHw
	$("#postNewhw").on("click", function(event) {
        event.preventDefault();
        var title = $("#hw_title").val().trim();
        var duedate = $("#hw_dueDate").val().trim();
        var description = $("#hw_description").val().trim();
        var classid=$(this).attr("data-classid");
        var newAssignment={
            hwname:title,
            hwdesc:description,
            hwdue:duedate
        }
        $.ajax("api/hw/"+classid,{
            type:"POST",
            data:newAssignment
        }).then(function(){
            alert("hw ass has been submitted");
        }); 
    });
});