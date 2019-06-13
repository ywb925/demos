export default  {
    getMenuView: function(userId:string,operateId?:string) {
        // use "GET" method and "json" dataType
        let def = $.Deferred();
        var data:{userId?:string;operateId?:string;}={};
        if(typeof userId == 'string'){
            data.userId = userId;
        }
        if(typeof operateId == 'string'){
            data.operateId = operateId;
        }
        $.ajax({
            url:'/security/services/security/menuTreeJson',
            type:'GET', 
            dataType: "json",
            contentType:"application/json",
            data:data
        }).done((res)=>{
            def.resolve(res);
        })
        return def.promise();
    }
}