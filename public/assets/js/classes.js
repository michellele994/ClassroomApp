$(function() {
    //Extract unique username from the URL
    var userInfo = window.location.pathname.substr(1, window.location.pathname.length);
    userInfo = userInfo.substr(userInfo.indexOf("/") + 1, userInfo.length);
    if (userInfo.indexOf("/") !== -1) {
        var userName = userInfo.substr(0, userInfo.indexOf("/"));
    } else {
        userName = userInfo;
    }

    //POPULATE CLASSES AVAILABLE 
    $("#seeAvailclassesBtn").on("click", function(event) {
        $("#classesAvailableModalbody").empty();
        //If person is a teacher of their class, do not display that class
        $.get("/api/teachers/" + userName).then(function(teacherResponse) {
            $.get("/api/students/" + userName).then(function(studentResponse) {
                if ((studentResponse === null || studentResponse.ExistingClasses.length === 0) && (teacherResponse === null || teacherResponse.ExistingClasses.length === 0)) {
                    $.get("/api/classes/").then(function(allClasses) {
                        populateModal(allClasses);
                        $("#classesAvailableModal").modal("show");
                    });
                } else if (teacherResponse && (studentResponse === null || studentResponse.ExistingClasses.length === 0)) {
                    //Filter classes that the user is already a teacher
                    whereTeacherDoesNotExist(teacherResponse.ExistingClasses, [], true);
                } else if (studentResponse && (teacherResponse === null || teacherResponse.ExistingClasses.length === 0)) {
                    //Check through the student's api and see which classes they are already enrolled in
                    //If they are enrolled in a class, do not display it.
                    $.get("/api/classes/").then(function(allClasses) {
                        populateModal(whereStudentDoesNotExist(studentResponse.ExistingClasses, allClasses));
                        $("#classesAvailableModal").modal("show");
                    });

                } else if (studentResponse && teacherResponse) {
                    whereTeacherDoesNotExist(teacherResponse.ExistingClasses, studentResponse.ExistingClasses, false);
                }
            });
        });
    });

    //ENROLLING IN A CLASS
    //we need to use event delegation since our buttons do not exist when our document loads
    $("#classesAvailableModalbody").on("click", ".Enroll", function(event) {
        var classid = $(this).attr("data-classid");
        //Obtain user information
        $.get("/api/users/" + userName).then(function(userResponse) {
            var userId = userResponse.id;
            var nameOfUser = userResponse.name;

            //Look to see if a user is already a student. If not, make them a student.
            $.get("/api/students/" + userName).then(function(studentResponse) {
                //If a student does not exist
                if (studentResponse === null) {
                    $.ajax("/api/students", {
                        type: "POST",
                        data: {
                            username: userName,
                            name: nameOfUser,
                            UserId: userId
                        }
                    }).then(function(createdSResponse) {
                        $.ajax("/api/enrollment/", {
                            type: "POST",
                            data: {
                                classid: classid,
                                username: userName
                            }
                        });
                        //For some reason using ".then" doesnt work here.
                        setTimeout(function() {
                            location.reload();
                        }, 500);
                    })
                }
                //If it already exists, read the information
                else {
                    var newEnrolled = {
                        classid: classid,
                        username: userName
                    }
                    $.ajax("/api/enrollment", {
                        type: "POST",
                        data: newEnrolled
                    });
                    //For some reason using ".then" doesnt work here.
                    setTimeout(
                        function() {
                            location.reload();
                        }, 500);
                }
            });
        });
    });

    //WHEN CLICKING ON A CLASS
    $(".classPg").on("click", function(event) {
        var classid = $(this).attr("data-classid");
        //Determine whether the user is a teacher or student and direct them as appropriate
        $.get("/api/classes/" + classid).then(function(response) {
            var teachername = response.Teacher.username;
            if (userName === teachername) {
                window.location = "/classTeacherview/" + userName + "/" + classid;
            } else {
                window.location = "/classStudentview/" + userName + "/" + classid;
            }
        })
    })

    //WHEN CREATING A NEW CLASS
    $("#create-new-class").on("click", function(event) {
        event.preventDefault();
        var className = $("#new-class-name").val().trim();
        var classDesc = $("#new-class-desc").val().trim();

        //Determine if the name of the class is appropriate.
        var nameAppropriate = true;
        for (var i = 0; i < className.length; i++)
        {
            if (!className ||
                className.charCodeAt(i) < 32 ||
                (className.charCodeAt(i) > 32 && className.charCodeAt(i) < 47) ||
                (className.charCodeAt(i) >57 && className.charCodeAt(i) < 65) ||
                (className.charCodeAt(i) > 90 && className.charCodeAt(i) < 97) ||
                className.charCodeAt(i) > 122) {
                nameAppropriate = false;
                break;
            }
        }

        if (nameAppropriate) {
            if (className) {
                if (classDesc) {
                    //Obtain user information to create class
                    $.get("/api/users/" + userName).then(function(response) {
                        var userID = response.id;
                        var nameOfUser = response.name;

                        //Determine if the user is already made a teacher. If not, create a teacher.
                        $.get("/api/teachers/" + userName).then(function(tResponse) {
                            if (tResponse === null) {
                                $.ajax("/api/teachers", {
                                    type: "POST",
                                    data: {
                                        username: userName,
                                        name: nameOfUser,
                                        UserId: response.id
                                    }
                                }).then(
                                    function() {
                                        //Then create a new class!
                                        $.get("/api/teachers/" + userName).then(function(currTResponse) {
                                            var newClass = {
                                                classname: className,
                                                classdesc: classDesc,
                                                TeacherId: currTResponse.id
                                            }
                                            $.ajax("/api/classes", {
                                                type: "POST",
                                                data: newClass
                                            }).then(
                                                function() {
                                                    location.reload();
                                                })
                                        });
                                    })
                            }
                            //If user has already been a teacher, then just add a new class
                            else {
                                $.get("/api/teachers/" + userName).then(function(response) {
                                    var newClass = {
                                        classname: className,
                                        classdesc: classDesc,
                                        TeacherId: response.id
                                    }
                                    $.ajax("/api/classes", {
                                        type: "POST",
                                        data: newClass
                                    }).then(
                                        function() {
                                            location.reload();
                                        });
                                });
                            }
                        });
                    });
                } else {
                    $("#cannot-create-error").text("You must enter a description for your class");
                }
            } else {
                $("#cannot-create-error").text("You must enter a class name");
            }
        } else {
            $("#cannot-create-error").text("Your class name can only contain letters and numbers");
        }
    });



//FUNCTIONS
//========================================================================================================================
    //To render the available classes (Used by whereTeacherDoesNotExist and by whereStudentDoesNotExist)
    function populateModal(AvailableClasses) {
        for (var i = 0; i < AvailableClasses.length; i++) {
            var classid = AvailableClasses[i].id;
            var classname = AvailableClasses[i].classname;
            var datas = "data-classid=" + classid;
            var classDisplay = "<div class= 'col-8 text-center'><div class='text-capitalize availableClass'data-classID=" + classid + ">" + classname + "</div></div>"
            var enrollebtn = "<div class = 'col-4'><button " + datas + " class='btn btn-success badge-pill Enroll'>Enroll</button></div>"
            $("#classesAvailableModalbody").append("<div class='row'>"+classDisplay + enrollebtn+"</div>");
        }
    };

    function whereTeacherDoesNotExist(array, studentResponse, activateModal) {
        var classesAvailable = [];
        var classesTeaching = [];
        for (var i = 0; i < array.length; i++) {
            classesTeaching.push(array[i]);
        }
        var exists = false;
        $.get("/api/classes/").then(function(allClasses) {
            for (var i = 0; i < allClasses.length; i++) {
                for (var j = 0; j < classesTeaching.length; j++) {
                    if (allClasses[i].id === classesTeaching[j].id) {
                        exists = true;
                    }
                }
                if (exists === false) {
                    classesAvailable.push(allClasses[i]);
                } else {
                    exists = false;
                }
            }

            if (activateModal) {
                populateModal(classesAvailable);
                $("#classesAvailableModal").modal("show");
            } else if (!activateModal) {
                classesAvailable = whereStudentDoesNotExist(studentResponse, classesAvailable);
                populateModal(classesAvailable);
                $("#classesAvailableModal").modal("show");
            }
            return classesAvailable;
        });

    }

    function whereStudentDoesNotExist(arrayOfStudent, arrayToCompare) {
        var enrolledClasses = [];
        var classesNotStudent = [];
        for (var i = 0; i < arrayOfStudent.length; i++) {
            enrolledClasses.push(arrayOfStudent[i]);
        }
        var exists = false;
        for (var i = 0; i < arrayToCompare.length; i++) {
            for (var j = 0; j < enrolledClasses.length; j++) {
                if (arrayToCompare[i].id === enrolledClasses[j].id) {
                    exists = true;
                }
            }
            if (exists === false) {
                classesNotStudent.push(arrayToCompare[i]);
            } else {
                exists = false;
            }
        }
        return classesNotStudent;
    }
});