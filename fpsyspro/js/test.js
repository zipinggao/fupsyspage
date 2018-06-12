window.onload = function () {
    var arr = [55, 30, 25, 60, 650, 40, "示例用户"];
    Checklogin();
    echartRadar(arr);
};

//创建ajax通信服务器对象
function getHTTPObject(){
  "use strict"; //注意使用严格模式
  var xhr;
  //使用主流的XMLHttpRequest通信服务器对象
  if(window.XMLHttpRequest){
    xhr = new window.XMLHttpRequest();
  //如果是老版本ie，则只支持Active对象
  } else if(window.ActiveXObject){
    xhr = new window.ActiveXObject("Msxml2.XMLHTTP");
  }
  //将通信服务器对象返回
  return xhr;
}

//登录成功返回true,失败返回false
function login() {
    //登录userName,userPass
    var userName = document.getElementById("userid");
    var userPass = document.getElementById("passwordinput");
	var request = new getHTTPObject();
	data={
	"user_name": userName.value,
	"user_pass": userPass.value
	};
	request.open('POST', '/login', false);
	request.setRequestHeader('content-type', 'application/json');
	request.send(JSON.stringify(data));
	//alert("ok4");  
	if(request.readyState ===4 || request.status ===200){
		//将request.responseText返回的数据转化成JSON格式
		console.log(request.responseText);
		var contacts = JSON.parse(request.responseText);
		if (contacts.error == false) {
		    saveCookie(userName, userPass);
		    Checklogin();
		    $('#myModal').modal('hide');
		}
		else
		    alert("用户名或密码错误！");
		return;
	}
}

function score() {
	//获得分数
	var request = new getHTTPObject();
	var overAllScore; 
	var identityScore; 
	var performanceScore; // 履约能力
	var stickinessScore; // 用户粘性
	var familyScore; // 家庭关系
	var name; //用户姓名
	if (checkCookie() == false) 
	{
	    alert("请先登录！");
	    return;
	}
	var bt = document.getElementById("search_id");
	if (bt.value == "") {
        alert("不可以为空！")
	    return;
	}
	request.open('GET', '/credit/' + bt.value, true);
	request.setRequestHeader('content-type', 'application/json');
	//如果不用跨域，就要删掉，by Assare
	request.withCredentials = true;
	//！！！！！！！！
	request.onreadystatechange = function () {

	    if ((request.readyState === 4 || request.status === 200) && request.error == false) {
	        //将request.responseText返回的数据转化成JSON格式
	        console.log(request.responseText);
	        var contacts = JSON.parse(request.responseText);
	        var obj = new Object();
	        obj.overAllScore = contacts.values.score; // 综合信用评分
	        obj.identityScore = contacts.values.character; // 身份特质
	        obj.performanceScore = contacts.values.appointment; // 履约能力
	        obj.creditHistory = contacts.values.history; // 信用历史
	        obj.stickinessScore = contacts.values.stickiness; // 用户粘性
	        obj.familyScore = contacts.values.relations; // 家庭关系
	        obj.name = contacts.values.name; //用户姓名

	        console.log('综合信用评分：' + obj.overAllScore);
	        console.log('身份特质：' + obj.identityScore);
	        console.log('履约能力：' + obj.performanceScore);
	        console.log('信用历史：' + obj.creditHistory);
	        console.log('用户粘性：' + obj.stickinessScore);
	        console.log('家庭关系：' + obj.familyScore);
	        console.log('姓名：' + obj.name);
	        echartRadar(obj);
	    } 
		else { alert("用户ID不存在！"); return; }
	};
	request.send();	
}
 
function echartRadar(data) {
    var arr = new Array(6);
    if (data.constructor === Array) {
        arr = data;
    } else {
        arr[0] = ~~(data.identityScore * 100);
        arr[1] = ~~(data.performanceScore*100);
        arr[2] =~~(data.stickinessScore*100);
        arr[3] = ~~(data.familyScore*100);
        arr[4] = data.overAllScore;
        arr[5] = ~~(data.creditHistory*100);
        arr[6] = data.name;
    }   
    if (arr[4] > 750)
        arr[7]="信用优秀";
    else if (arr[4] <= 750 && arr[4] > 600)
        arr[7]="信用良好";
    else
        arr[7]="信用一般";

    var myChart = echarts.init(document.getElementById('chart1'));
    option = {
        title: {
            text: arr[6] + '，该用户综合评分为：' + arr[4] + '分' + '(' + arr[7] + ')',
            left: 'center',
            textStyle: {
                fontSize:30
            }
        },
        tooltip: {
            trigger: 'axis',
            "textStyle": {
                "fontSize": 20
            }
        },
        legend: {
            x: 'center',
            data:['用户各项评分']
        },
        radar: [
            {
            indicator: [
               { name: '身份特质', max: 100 },
               { name: '履约能力', max: 100 },
               { name: '用户粘性', max: 100 },
               { name: '家庭关系', max: 100 },
               { name: '信用历史', max: 100 },
            ],
            name: {
                fontSize:24,
                textStyle: {
                    color: '#72ACD1'
                }
            },
            center: ['40%','50%'],
            radius: 270
            },
        ],
        series: [{
            name: '信用评分',
            type: 'radar',
            tooltip: {
                trigger: 'item'
            },
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
                {
                    value: [arr[0], arr[1], arr[2], arr[3], arr[5]],
                    name: '用户各项指标得分'
                }
            ]
        }],
        graphic: [
            {
                type: 'group',
                left: '51%',
                top: '10%',
                children: [
                    {
                        type: 'rect',
                        z: 100,
                        left: 'center',
                        top: 'middle',
                        shape: {
                            width: 630,
                            height: 150
                        },
                        style: {
                            fill: '#fff',
                            stroke: '#555',
                            lineWidth: 1,
                            shadowBlur: 8,
                            shadowOffsetX: 3,
                            shadowOffsetY: 3,
                            shadowColor: 'rgba(0,0,0,0.3)'
                        }
                    },
                    {
                        type: 'text',
                        z: 100,
                        left: 'center',
                        top: 'middle',
                        style: {
                            fill: '#333',
							
                            text: [
                                '850-750（优秀）,750-600（良好）,600-300（一般）',
                                '身份特质：用户的基本身份信息，如年龄、性别、婚姻状况、学历等',
                                '履约能力：用户的资产信息，包括薪资、动产及不动产等',
                                '信用历史：用户的历史履约记录、失信行为等',
                                '用户粘性：用户的注册信息、平台使用记录等',
                                '家庭关系：用户家庭成员信息'
                            ].join('\n'),
                            font: '20px Microsoft YaHei'
                        }
                    }
                ]
            }
        ]
    };
    myChart.setOption(option);
}

function setCookie(name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays); //创建cookie
    document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());//创建cookie
}

function saveCookie(UName, PName) {//保存cookie
    if (UName.value == "") {
        alert("请输入用户名！");
		return;
    }
    else if (PName.value == "") {
        alert("请输入密码！");
		return;
    }
	
        setCookie(UName.id, UName.value, 30);
        setCookie(PName.id, PName.value, 30);
}

function getCookie(name)//获取cookie
{
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(name + "=");
        if (c_start != -1) {
            c_start = c_start + name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function checkCookie()//检查cookie是否存在，若存在，读取出来
{
    var userName = document.getElementById("userid");
    var password = document.getElementById("passwordinput");
	
	var user_name = document.getElementById("user_name");
    var user_pass = document.getElementById("user_pass");
	
    var UValue = getCookie(userName.id);
    var PValue = getCookie(password.id);
	var KValue = getCookie(user_name.id);
    var FValue = getCookie(user_pass.id);
	
    if (UValue != null && UValue != "" && PValue != null && PValue != "") {
        return UValue;
    }else if(KValue != null && KValue != "" && FValue != null && FValue != ""){
        return KValue;
	} else {
        return false;
    }
}

function Checklogin() {
    UValue = checkCookie();
    if (UValue != false) {
        registerOrexit = document.getElementById('registerOrexit');
        document.getElementById('loginOruser').innerText = UValue;
        document.getElementById('loginSpan').setAttribute("data-target", "#");
        document.getElementById('registerSpan').setAttribute("data-target", "#");
        registerOrexit.innerText = "退出";
        registerOrexit.setAttribute("onclick", "clearCookie()");
    }
}

function clearCookie() {
    var userName = document.getElementById("userid");
	var regi_name = document.getElementById("user_name");
    setCookie(userName.id, "", -1);
	setCookie(regi_name.id, "", -1);
	/*
	registerOrexit = document.getElementById('registerOrexit');
	document.getElementById('loginOruser').innerText = "登录";
	document.getElementById('loginSpan').setAttribute("data-target", "#myModal");
	document.getElementById('registerSpan').setAttribute("data-target", "#myModal");
	$('#myModal').modal('hide');
	registerOrexit.innerText = "注册";*/
	
	top.location = "index.html";
}

function registerUser() {
    var Stuelements = [];
    var elements = {};
    var request = new getHTTPObject();
    var form = document.getElementById("registerUser");
    var tagElements = form.getElementsByTagName('input');
    for (var i = 0; i < tagElements.length; i++) {
        elements[tagElements[i].id] =tagElements[i].value;
    }
    if (elements["user_pass"] != elements["reenterpassword"]) {
        alert("前后输入密码不一致！");
        return;
    }
    delete elements["reenterpassword"];
    //Stuelements.push(elements);
    var sendata = JSON.stringify(Stuelements);
    //sendata = sendata.substring(1,sendata.length-1);
	alert(sendata);
    request.open('POST', '/register', false);
    request.setRequestHeader('content-type', 'application/json');
    request.send(sendata);
    if (request.readyState === 4 || request.status === 200) {
        //将request.responseText返回的数据转化成JSON格式
        var contacts = JSON.parse(request.responseText);
        if (contacts.error == false) {
            alert("注册成功!");
			saveCookie(tagElements[0], tagElements[1]);
		    Checklogin();
		    $('#myModal').modal('hide');
        }
        else
            alert("注册失败，请重新注册！");
            return;
       }
}

/******server detail with cookie*************/
function serverClearCookie() {
    delcookie = serverCookie();
    var request = new getHTTPObject();
    data = {
        "delCookieId": delcookie,
    };
    request.open('POST', '/login', false);
    request.setRequestHeader('content-type', 'application/json');
    request.send(JSON.stringify(data));
    if (request.readyState === 4 || request.status === 200) {
        //将request.responseText返回的数据转化成JSON格式
        var contacts = JSON.parse(request.responseText);
        if (contacts.error == false) {
            setCookie(delcookie, "", -1);
            alert("退出成功！");
            top.location = "index.html";
        }
        else
            alert("请重新退出！");
        return;
    }
}

function serverCookie()
{
    var Cookie = document.cookie.split(";");
    var aCrumb, nCrumb;
    for (var i = 0; i < Cookie.length; i++) {
         aCrumb = Cookie[i].split("=");
         nCrumb=aCrumb[1].toString().trim();
         if (nCrumb.indexOf("admin") != -1)
            return aCrumb[0].toString().trim();
         else
            return false;
    }
}

/******test part , dalete*****/
function showinfo() {
    var bt = document.getElementById("search_id")
    if (bt.value == "") {
        alert("专家姓名不存在！")
        return;
    }
    var myChart = echarts.init(document.getElementById('chart1'));
    if(bt.value == 1){
        option = {
            title: {
                text: '专家各项指标的评分',
                left: 'center',
            },
            tooltip: {},
            legend: {
                data: ['专家各项评分']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 5,
                        padding: [3, 5]
                    }
                },
                indicator: [
                   { name: '身份特质', max: 5 },
                   { name: '履约能力', max: 5 },
                   { name: '用户粘性', max: 5 },
                   { name: '家庭关系', max: 5 }
                ]
            },
            series: [{
                name: '信用评分',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [3, 4, 2.5, 3.8],
                        name: '综合信用评分: ' + 7
                    }
                ]
            }]
        };
        myChart.setOption(option);
    }
    if (bt.value == 2) {
        option = {
            title: {
                text: '专家各项指标的评分',
                left: 'center',
            },
            tooltip: {},
            legend: {
                data: ['专家各项评分']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 5,
                        padding: [3, 5]
                    }
                },
                indicator: [
                   { name: '身份特质', max: 5 },
                   { name: '履约能力', max: 5 },
                   { name: '用户粘性', max: 5 },
                   { name: '家庭关系', max: 5 }
                ]
            },
            series: [{
                name: '信用评分',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [4, 4, 4, 4],
                        name: '综合信用评分: ' + 7
                    }
                ]
            }]
        };
        myChart.setOption(option);
    }
}

function logininfo() {
    //登录userName,userPass
    var userName = document.getElementById("userid");
    var userPass = document.getElementById("passwordinput");
    var request = new getHTTPObject();
    data = {
        "user_name": userName.value,
        "user_pass": userPass.value
    };
    saveCookie(userName, userPass);
    Checklogin();
    $('#myModal').modal('hide');
}

function registerUserinfo() {
    var Stuelements = [];
    var elements = {};
    var request = new getHTTPObject();
    var form = document.getElementById("registerUser");
    var tagElements = form.getElementsByTagName('input');
    for (var i = 0; i < tagElements.length; i++) {
        elements[tagElements[i].id] = tagElements[i].value;
    }

    if (elements["user_pass"] != elements["reenterpassword"])
    {
        alert("前后输入密码不一致！");
        top.location = "index.html";
    }
    delete elements["reenterpassword"];
    Stuelements.push(elements);
    var sendata = JSON.stringify(Stuelements);
    //alert("注册成功，返回登录！");
	saveCookie(tagElements[0], tagElements[1]);
	Checklogin();
	$('#myModal').modal('hide');
    //return;
  //   top.location = "index.html";

}
