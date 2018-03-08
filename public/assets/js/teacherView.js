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
                                $("#alert-message-hwpostsuccess").text("Hw has been posted");
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
                            $("#alert-message-hwpostsuccess").text("Hw has been posted");
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
                $("#alert-message-hwpostfailure").text("The name of hw is not appropraite or check if you had written a description");
            }
        });
    });

    //WHEN VIEWING HOMEWORK SUBMISSIONS
    $(".seeHwsubmissions").on("click",function(event){
        $("#submittedBody").empty();
        var hwid=$(this).attr("data-hwid");
        console.log(hwid);
       $.get("/api/Teacherclassinfo/"+hwid,function(studentsSubmitted){
            for(var i=0;i<studentsSubmitted.length;i++){
                if(studentsSubmitted[i].hwlink.substr(0,6) === "http://")
                {
                    var studentSubmission="<div class='text-capitalize'>"+studentsSubmitted[i].name+": <a href='"+studentsSubmitted[i].hwlink+"' target='_blank'>View</a></div>";
                    $("#submittedBody").append(studentSubmission);
                }
                else
                {
                    var studentSubmission="<div class='text-capitalize'>"+studentsSubmitted[i].name+": <a href='http://"+studentsSubmitted[i].hwlink+"' target='_blank'>View</a></div>";
                    $("#submittedBody").append(studentSubmission);
                }

            }
            $("#showSubmissionsModal").modal("show");
        });
    })
    
});