/**
 * Created by Aqua on 2016/7/20.
 */
$(function(){

    $("#submit").click(
        function(e){
            e.preventDefault();
            var username = document.getElementById("classname");
            var password = document.getElementById("classid");
            if(username.value==""){
                alert("请输入用户名...");
                username.focus();
                return;
            };
            if(password.value==""){
                alert("请输入密码...");
                password.focus();
                return;
            }else{
                $.ajax( {
                    url:'/iBeaconServer/iBeacon/Server/classLogin.php?username=%27'+username.value+'%27',// 跳转到 action
                    data:{
                      password:password.value,
                    },
                    type:'GET',
                    datatype:'json',
                    success:function(msg){
                            if(msg.code==200){
                                var r= encodeURI(username.value);
                                var adr='../attendence.html?roomid='+password.value+'&roomname='+r;
                                window.location.href=adr;
                                //document.form.submit();
                            }else{
                                alert(msg.info);
                            }

                    },
                    error:function(){

                        alert("登录验证失败...请重新登录...");
                    }
                });
            }
        }
    )


})