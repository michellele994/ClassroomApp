$(function() {
    //Obtaining user information from address bar
    var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
        userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
        userName = userInfo.substr(0, userInfo.indexOf("/"));
        if (userInfo.indexOf("/") !== -1) {
            var userName = userInfo.substr(0, userInfo.indexOf("/"));
        } else {
            userName = userInfo;
        }

    //WHEN ADDING A NEW ASSIGNMENT
	$("#postNewhw").on("click", function(event) {
        var classid=$(this).attr("data-classid");
        event.preventDefault();
        $.get("/api/classes/"+classid).then(function(thisClass){
            var title = $("#hw_title").val().trim();

            var titleAppropriate = true;
            for (var i = 0; i < title.length; i++)
            {
                if (!title ||
                    title.charCodeAt(i) < 32 ||
                    (title.charCodeAt(i) > 32 && title.charCodeAt(i) < 48) ||
                    (title.charCodeAt(i) > 57 && title.charCodeAt(i) < 65) ||
                    (title.charCodeAt(i) > 90 && title.charCodeAt(i) < 97) ||
                    title.charCodeAt(i) > 122 )
                {
                    titleAppropriate = false;
                    break;
                }
            }

            var duedate = $("#hw_dueDate").val().trim();
            var description = $("#hw_description").val().trim();
            if(titleAppropriate && description)
            {
                var newHomework={
                    homeworkname:title,
                    homeworkdesc:description,
                    hwdue:duedate,
                    ExistingClassId: classid
                }
                if (thisClass.Students.length > 0)
                {
                    console.log(classid);
                    $.get("/api/homework/"+classid+"/"+title).then(function(thisHomework){
                        if(thisHomework === null)
                        {
                            $.ajax("/api/homework/"+classid,{
                                type:"POST",
                                data: newHomework
                            }).then(function(){
                                console.log("posted to all hw");
                                //make association with students
                                $.ajax("/api/assigningHw/"+title, {
                                    type:"POST",
                                    data:
                                    {
                                        students: thisClass.Students
                                    }
                                });
                                $("#alert-message-hwpostfailure").empty();
                                $("#alert-message-hwpostsuccess").text("Homework has been posted");
                                setTimeout(function() {
                                    location.reload();
                                }, 500);
                            });
                        }
                        else
                        {
                            $("#alert-message-hwpostsuccess").empty();
                            $("#alert-message-hwpostfailure").text("This homework already exists");
                        }
                    });
                }
                else if (thisClass.Students.length === 0){
                    $.get("/api/homework/"+classid+"/"+title).then(function(thisHomework){
                        if(thisHomework === null)
                        {
                            $.ajax("/api/homework/"+classid,{
                                type:"POST",
                                data: newHomework
                            });
                            $("#alert-message-hwpostfailure").empty();
                            $("#alert-message-hwpostsuccess").text("Homework has been posted");
                            setTimeout(function() {
                                location.reload();
                            }, 500);
                        }
                        else
                        {
                            $("#alert-message-hwpostsuccess").empty();
                            $("#alert-message-hwpostfailure").text("This homework already exists");
                        }
                    });
                }
            }
            else
            {
                $("#alert-message-hwpostsuccess").empty();
                $("#alert-message-hwpostfailure").text("Homework name cannot contain inappropriate characters. Be sure to add a description.");
            }
        });
    });

    // //WHEN VIEWING HOMEWORK SUBMISSIONS
    $("#see-submission-next-page").on("click", function(event){
        var classid=$(this).attr("data-classid");
        window.location = "/classTeacherview/grading/" + userName + "/" + classid;
    })
    
});