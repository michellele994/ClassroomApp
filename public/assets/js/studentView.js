$(function() {
    //global so submit modal has access
    var hwid;

    //logic for supmiting hw
    $(".hwModalopen").on("click",function(event){
        hwid=$(this).attr("data-hwid");
    });
    $("#submitHw").on("click",function(event){
       //console.log("im here"); 
        var studentid=$(this).attr("data-studentid")
        //console.log(studentid);
        var hwLink=$("#hwLink").val().trim();
        //console.log(hwLink);
        var comment=$("#hwComment").val().trim();
        //PERLA:SHOULD WE INCLUDE A LINK ATTRIBUTE IN THE DATATABLE TO STORE THE LINK?
        //post to database happens here
        if(hwLink){
            $("#alert-message-submithwfailure").empty();
            $("#alert-message-submithwsuccess").text("Hw has been submitted");
        }
        else{
            $("#alert-message-submithwsuccess").empty();
            $("#alert-message-submithwfailure").text("Provide a valid link");
        }   
    })
});