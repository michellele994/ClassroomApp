$(function() {
    //global so submit modal has access
    var hwid;

    //logic for supmiting hw
    $(".hwModalopen").on("click",function(event){
        hwid=$(this).attr("data-hwid");
    });
    $("#submitHw").on("click",function(event){
        var studentid=$(this).attr("data-studentid")
        //post to database happens here
    })
});