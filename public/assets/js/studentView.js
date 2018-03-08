$(function() {
    //global so submit modal has access
    var hwid;

    //logic for supmiting hw
    $(".hwModalopen").on("click",function(event){
        hwid=$(this).attr("data-hwid");
    });
    $("#submitHw").on("click",function(event){
        var studentUsername=$(this).attr("data-student-username")
        var classid = $(this).attr("data-classid");
        var hwLink=$("#hwLink").val().trim();
        var comment=$("#hwComment").val().trim();
        //post to database happens here
        $.get("/api/students/"+studentUsername).then(function(thisStudent){
            {
                // //Check to see the validity of the homework link
                if(hwLink === null || hwLink === "")
                {
                    $("#alert-message-submithwsuccess").empty();
                    $("#alert-message-submithwfailure").text("You did not submit anything for your homework. Please ensure that your link works.");
                }
                else
                {
                    $.ajax("/api/submitted/"+studentUsername+"/"+hwid,{
                        type:"POST",
                        data: {
                            submitlink: hwLink,
                            comment: comment,
                            complete: true
                        }
                    }).then(function(){
                        $("#alert-message-submithwfailure").empty();
                        $("#alert-message-submithwsuccess").text("You have submitted your homework!");
                        location.reload();
                    });
                }

                // $.get("/api/homework/"+classid).then(function(thisClassHomework){

                // })
                // var dbLink = thisStudent.Homework
                // var dbComment = thisHomework.comment;
                // var dbComplete = thisHomework.complete;
            }
        });
        if(hwLink){
            $("#alert-message-submithwfailure").empty();
            $("#alert-message-submithwsuccess").text("Your homework has been successfully submitted");
        }  
    })
});