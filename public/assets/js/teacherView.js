$(function() {
    var userInfo = window.location.pathname.substr(1,window.location.pathname.length);
        userInfo = userInfo.substr(userInfo.indexOf("/")+1, userInfo.length);
        userName = userInfo.substr(0, userInfo.indexOf("/"));
	//postHw
	$("#postNewhw").on("click", function(event) {
        var classid=$(this).attr("data-classid");
        event.preventDefault();

        //Create class 
        alert("hw ass has been submitted");
        //get homeworkid
        $.get("/api/classes/"+classid).then(function(thisClass){
            var title = $("#hw_title").val().trim();

            var titleAppropriate = true;

            for (var i = 0; i < title.length; i++)
            {
                if (!title ||
                    title.charAt(i) === " " ||
                    title.charCodeAt(i) < 47 ||
                    (title.charCodeAt(i) >57 && title.charCodeAt(i) < 65) ||
                    (title.charCodeAt(i) > 90 && title.charCodeAt(i) < 97) ||
                    title.charCodeAt(i) > 122 )
                {
                    titleAppropriate = false;
                    break;
                }
            }

            var duedate = $("#hw_dueDate").val().trim();
            var description = $("#hw_description").val().trim();
            if(titleAppropriate && description) //&& duedate
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
                                }).then(function()
                                {
                                    location.reload();
                                })
                            });
                        }
                        else
                        {
                            alert("Thishomework already existed!!!!");
                        }
                    });
                }
                else if (thisClass.Students.length === 0){
                    alert("You have posted homework, but you dont have any students. Future students will not be assigned this homework.")
                    $.get("/api/homework/"+classid+"/"+title).then(function(thisHomework){
                        if(thisHomework === null)
                        {
                            $.ajax("/api/homework/"+classid,{
                                type:"POST",
                                data: newHomework
                            }).then(function(){
                                console.log("posted to all hw");
                                location.reload();
                            });
                        }
                        else
                        {
                            alert("Thishomework already existed!!!!");
                        }
                    });
                }
            }
            else
            {
                alert("the name of hw is not appropraite or check if you had written a description")
            }
        });
    });
});