$(function() {
    
    $(".hw").on("click",function(event){
        var modalid=$(this).attr("id")
        $("#modalid").modal("show");
    });
});