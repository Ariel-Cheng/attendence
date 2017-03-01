/**
 * Created by Aqua on 2016/7/2.
 */
$(function() {

    var courseid, stuNum = 0;
    var onTime = 0, //准时签到人数
        late = 0, //迟到人数
        leave = 0, //请假人数
        absent = 0; //缺席人数

    //获取从上一个页面传过来的参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }

    var roomid = decodeURI(GetQueryString("roomid"));
    var roomname = decodeURI(GetQueryString("roomname"));
    $('#roomname').html(roomname);



    //显示课程表

    function getcourse() {
        $.ajax({
            url: '/iBeaconServer/iBeacon/Server/getcourse.php?roomname=' + roomname,
            type: 'get',
            datatype: 'json',
            success: function(msg) {
                var msg = JSON.parse(msg); //将msg解析为一个JSON对象
                /*获取表格内行和列的内容*/
                var tr = document.getElementsByClassName("courseRow");
                var td = document.getElementsByClassName("courseData");
                /*定义一个k*l长度的二维数组*/
                var depData = new Array();
                for (var k = 0; k < tr.length - 1; k++) {
                    depData[k] = new Array();
                    for (var l = 0; l < td.length / (tr.length - 1); l++)
                        depData[k][l] = " "; /*此处初始化二维数组为空字符串*/
                }

                // var str = mes.data;
                for (var k = 0; k < 5; k++) {
                    var h = '' + (k + 1);
                    try {
                        var num = msg.data[h].length;
                    } catch (err) {
                        num = 0; // 可执行

                    }
                    if (num != 0) {
                        for (var i = 0, j = 0; j < num; i++) {
                            if (msg.data[h][j].flag - 1 == i) {
                                depData[i][k] = msg.data[h][j].cname;
                                j++;
                            } else {
                                depData[i][k] = '';
                            }

                        }
                    }

                }

                /*将表格内数据写入二维数组*/
                for (var i = 0; i < tr.length - 1; i++) {
                    for (var j = 0; j < td.length / (tr.length - 1); j++) {
                        td[i * (td.length / (tr.length - 1)) + j].innerText = depData[i][j];
                    }

                }
            }
        })

    }

    getcourse(); //页面加载完就执行一次



    //显示当前课程信息

    function getcurrentCourse() {
        $.ajax({
            url: '/iBeaconServer/iBeacon/Server/getcourrentcourse.php?roomname=' + roomname,
            type: 'GET',
            datatype: 'json',
            success: function(msg) {
                //var h = eval(ms);
               var msg = JSON.parse(msg);

                if (msg.data == 'NULL' || msg.data.length == 0) {
                    $('#classcontent').html(" <font color='#999'>当前时间段本教室无课程安排</font>");
                    $('#coursenameNow').html("");

                    courseid = '0000';

                } else {
                    var temp = '';
                    temp += " <p>任课教师：<span id='teachername'></span></p><p><a><i class='fa fa-comments'></i>教学评价：任教10年，特级教师</a></p><p><a><i class='fa icon-phone'></i>电话：<span id='teacherphonenum'></span></a></p><p><a><i class='fa icon-time'></i>开课时间：<span id='coursetime'></span></a></p>"
                        // $('#classcontent').append(temp);
                    $('#classcontent').html(temp);

                    $('#coursenameNow').html(msg.data.cname);
                    $('#teachername').html(msg.data.teachername);
                    $('#teacherphonenum').html(msg.data.teachernum);

                    courseid = msg.data.courseid;
                    stuNum = msg.data.stuNum;

                    var coursetime = msg.data.beginTime + ' - ' + msg.data.endTime;
                    $('#coursetime').html(coursetime);

                }

            }
        })
        setTimeout(getcurrentCourse, 3000);
    }
    getcurrentCourse(); //首次立即加载



    //显示当前课程签到记录

    function getsinRecord() {
        $.ajax({
            url: '/iBeaconServer/iBeacon/Server/sinrecord.php?courseid=' + courseid,
            type: 'GET',
            datatype: 'json',
            success: function(msg) {
                var msg = JSON.parse(msg); //将msg解析为一个JSON对象

                /*获取签到记录个数*/
                var tr = msg.data.length;

                if (msg.data == 'NULL' || msg.data.length == 0) {
                    $('#sinrecord').html(" <p color='#999 fontsize='60px'>当前时间段本教室无课程安排</p>");

                } else {
                    /*定义一个k*l长度的二维数组*/
                    var depData = new Array();
                    for (var k = 0; k < tr; k++) {
                        depData[k] = new Array();
                        for (var l = 0; l < 5; l++) {
                            depData[k][l] = " "; /*此处初始化二维数组为空字符串*/

                        }
                        depData[k][0] = k + 1;
                        depData[k][1] = msg.data[k].stuid;
                        depData[k][2] = msg.data[k].stuname;
                        depData[k][3] = msg.data[k].sintime;
                        depData[k][4] = msg.data[k].lateinterval;
                    }

                    /*将二维数组内数据写入表格*/
                    var temp = '';
                    onTime = 0;
                    late = 0;
                    for (var k = 0; k < tr; k++) {
                        var className = "";
                        if (depData[k][4] == 0) {
                            onTime++;
                        } else {
                            className = "danger";
                            late++;
                        }
                        temp += '<tr class="'+className+'"><td>' + depData[k][0] + '</td><td>' + depData[k][1] + '</td><td>' + depData[k][2] + '</td><td>' + depData[k][3] + '</td><td>' + depData[k][4] + '</td></tr>';
                        // $(‘tr:nth-child(3n)’)—选择tr父标签中的第3的倍数位置上的tr 孩子标签元素。
                    }

                    $('#sinrecord').html(temp);
                }
            }

        })

        setTimeout(getsinRecord, 3000);
    }
    getsinRecord(); //首次立即加载



    //显示当前课程到课情况

    function gettotalSign() {

        $('#totalSign li:nth-child(1)').children().html('应到 ：'+stuNum+'人');
        var signNum = onTime + late;
        absent = stuNum - signNum - leave;

        var a = parseFloat(stuNum);
        var b = parseFloat(signNum);
        var attendanceRate;
        if(isNaN(Math.round(b * 100)/a)){
            attendanceRate = 0 + '%';
        }else{
         attendanceRate = (Math.round(b * 100)/a).toFixed(2) + '%';//两数相除 百分比 保留两位小数
        }

        $('#totalSign li:nth-child(2)').children().html('实到 ：'+signNum+'人');
        $('#totalSign li:nth-child(3)').children().html('迟到 ：'+late+'人');
        $('#totalSign li:nth-child(4)').children().html('请假 ：'+leave+'人');
        $('#totalSign li:nth-child(5)').children().html('旷课 ：'+absent+'人');
        $('#totalSign li:nth-child(6)').children().html('出勤率 ：'+attendanceRate);

        setTimeout(gettotalSign, 3000);

    }
    gettotalSign(); //首次立即加载

})
