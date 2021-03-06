$(function() {
	//Used to obtain the username and classid in the browser
	var urlInfo = window.location.pathname.substr(1,window.location.pathname.length);
    urlInfo = urlInfo.substr(urlInfo.indexOf("/")+1, urlInfo.length);
    urlInfo = urlInfo.substr(urlInfo.indexOf("/")+1, urlInfo.length);
    userName = urlInfo.substr(0, urlInfo.indexOf("/"));
    if (urlInfo.indexOf("/") !== -1) {
        var userName = urlInfo.substr(0, urlInfo.indexOf("/"));
    } else {
        var userName = urlInfo;
    }
    urlInfo = urlInfo.substr(urlInfo.indexOf("/")+1, urlInfo.length);
    if (urlInfo.indexOf("/") !== -1) {
        var classid = urlInfo.substr(0, urlInfo.indexOf("/"));
    } else {
        var classid = urlInfo;
    }

    //If there are no classes, populate message
    $.get("/api/classTeacherview/grading/"+userName+"/"+classid).then(function(classGrading)
    {
        if (classGrading.Homework.length === 0 || classGrading.Homework.length === null)
        {
            $("#no-assignment-message").text("You did not assign any homework, yet. Go back and add some!");
        }
    });

    $(".clicking-collapse-homework").on("click", function(event){
    	$.get("/api/classTeacherview/grading/"+userName+"/"+classid).then(function(classGrading)
    	{
    		for (var i = 0; i < classGrading.Homework.length; i++)
    		{
                if(classGrading.Students.length === 0)
                {
                    $("#no-students-submit-"+classGrading.Homework[i].id).text("You currently have no students.")
                }
                else
                {
                    for(var j = 0; j < classGrading.Homework[i].Students.length; j++)
                    {
                        var assignedHw = classGrading.Homework[i].Students[j].AssignedHomework;
                        if(assignedHw.submitlink !== null)
                        {
                            $("#student-"+classGrading.Homework[i].Students[j].id+"-sublink-"+classGrading.Homework[i].id).text("Link: "+assignedHw.submitlink);
                            if(assignedHw.comment !== null)
                            {
                                if(assignedHw.comment.trim() === "")
                                {
                                    $("#student-"+classGrading.Homework[i].Students[j].id+"-comment-"+classGrading.Homework[i].id).text("Comment: No comment");
                                }
                                else
                                {
                                    $("#student-"+classGrading.Homework[i].Students[j].id+"-comment-"+classGrading.Homework[i].id).text("Comment: "+assignedHw.comment);
                                }
                            }
                            else if (assignedHw.comment === null || assignedHw.comment === "")
                            {
                                $("#student-"+classGrading.Homework[i].Students[j].id+"-comment-"+classGrading.Homework[i].id).text("Comment: No comment");
                            }
                        }
                        else if(assignedHw.submitlink === null || assignedHw.submitlink === "")
                        {
                            $("#error-submission-message-"+classGrading.Homework[i].Students[j].id+"-"+classGrading.Homework[i].id).text("This person did not submit this homework");
                            
                        }

                        if(assignedHw.grade !== null && assignedHw.grade !== "")
                        {
                            $("#student-"+classGrading.Homework[i].Students[j].id+"-grade-"+classGrading.Homework[i].id).text(assignedHw.grade)
                        }
                        else if(assignedHw.grade === null || assignedHw.grade === "")
                        {
                            $("#student-"+classGrading.Homework[i].Students[j].id+"-grade-"+classGrading.Homework[i].id).text("N/A");
                        }
                    }
                }
    		}
    	});
    });

    $("#postGrade").on("click", function(event){
    	event.preventDefault();
    	var urlInfo = window.location.hash.substr(1);
    	var stuId = urlInfo.substr(0, urlInfo.indexOf("+"));
    	if (urlInfo.indexOf("/") === -1)
    	{
    		var hwId = urlInfo.substr(urlInfo.indexOf("+")+1,urlInfo.length);
    	}
    	else
    	{
    		var hwId = urlInfo.substr(urlInfo.indexOf("+")+1,urlInfo.indexOf("/"))
    	}
    	var chosenGrade = $("#select-grade option:selected").val();
    	$.ajax("/api/grading",{
            type:"POST",
            data: {
            	hwId: hwId,
            	stuId: stuId,
            	grade: chosenGrade 
            }
        })
        setTimeout(function(){
        	location.reload();
        },500);


    });



});

