$(function() {
    var hwid;
    //OPENING MODAL TO SUBMIT HOMEWORK
    $(".hwModalopen").on("click",function(event){
        hwid=$(this).attr("data-hwid");
    });

    //WHEN SUBMITTING HOMEWORK
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
                    });

                    $("#alert-message-submithwfailure").empty();
                    $("#alert-message-submithwsuccess").text("Your homework has been successfully submitted.");
                    setTimeout(function(){
                        location.reload();
                    }, 1000);
                }
            }
        }); 
    })
    //WHEN CLICKING TO SEE LAST HOMEWORK SUBMISSION
    $(".lastHw").on("click",function(event){
        var hwid=$(this).attr("data-hwid");
        var studentid=$("#s-name-test").attr("data-studentid");
       $.get("/api/Studenthwinfo/"+studentid+"/"+hwid,function(lastSub){
            if (lastSub !== null)
            {
                if (lastSub.Homework.length !== 0 ||
                lastSub.Homework[0].AssignedHomework !== null ||
                lastSub.Homework[0].AssignedHomework.submitlink !== null)
                {
                    $("#lastHwSubmission").empty();
                    var subLink="<div>Link: "+lastSub.Homework[0].AssignedHomework.submitlink+"</div>";

                    if (lastSub.Homework[0].AssignedHomework.comment !== "")
                    {
                        var subcomment="<div id='linksubtest'>Comment: "+lastSub.Homework[0].AssignedHomework.comment+"</div>";
                    }
                    else
                    {
                        var subcomment = "<div id='commentsubtest'>Comment: You did not leave a comment</div>"
                    }
                    $("#lastHwSubmission").append(subLink+subcomment);

                    $("#lastHwModal").modal("show");
                }
            }
            else
            {
                $("#error-message-lastsub").text("Looks like you did not submit anything yet!")
                $("#lastHwModal").modal("show");

            }
        });
    })
});