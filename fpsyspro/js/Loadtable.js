window.onload = function () {
	
	$("#testTable").find("tbody td").css("border-top","none");
	var per = [
		{id:111,name:'张珊',type:'学生'},  
		{id:222,name:'张珊',type:'学生'},  
		{id:333,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  		
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  
		{id:444,name:'张珊',type:'学生'},  		
		{id:555,name:'张珊',type:'学生'}
	];
	var tbody = document.getElementById('tbMain');  
	for(var i=0; i<per.length; i++){
		$(tbody).append(Loadtable(per[i],i+1));		
	}
};

function Loadtable(h, index){
	var $tr = $('<tr btnId='+h.id+'>'+
					'<td>'+index+'</td>'+
					'<td>'+h.name+'</td>'+
					'<td>'+h.type+'</td>'+										
				'</tr>');
	var $td1 = $('<td></td>');
	$td1.append($('<input type="button" value="设置" style="background-color: forestgreen;width:50px;color: #FFFFFF;border-radius:8px"/>').click(function(){
		console.log($(this).parent().parent().attr("btnId"));
		console.log($(this).parent().parent().find('td').eq(2).html("老师"));
		/*
		$.ajax({
			type:"post",
			url:"",
			data:{
				'user_id':h.id;
				'operation':'setonormaluser'
			},
			dataType:'JSON',
			success:function(data){
				alert("设置成功！")
				$(this).parent().parent().find('td').eq(2).html("老师");
			},
			error:function(){
				alert(XHR.status);
			}			
		});*/
			
	}));
	$tr.append($td1);

	$td2 = $('<td></td>');
	$td2.append($('<input type="button" value="设置" style="background-color: lightseagreen;width:50px;color: #FFFFFF;border-radius:8px"/>').click(function(){
		console.log($(this).parent().parent().attr('btnId'));
		/*
		$.ajax({
			type:"post",
			url:"",
			data:{
				'user_id':h.id;
				'operation':'setoqueryuser'
			},
			dataType:"JSON",
			success:function(data){
				
			},
			error:function(){
				alert(XHR.status);
			}
		});*/
	}));
	$tr.append($td2);

	$td3 = $('<td></td>');
	$td3.append($('<input type="button" value="删除" style="background-color: red;width:50px;color: #FFFFFF;border-radius:8px"/>').click(function(){
		console.log($(this).parent().parent().attr('btnId'));
		/*
		$.ajax({
			type:"post",
			url:"",
			async:false,
			data:{
				'user_id':h.id;
				'operation':'deluser'
			},
			dataType:'JSON',
			success:function(data){
				
			},
			error:function(){
				alert(XHR.status);
			}
		});*/
	}));
	$tr.append($td3);
   return $tr;
}

//成功返回true,失败返回false
function setonormaluser(id, operation) {
	var request = new getHTTPObject();
	data={
	"user_id": id,
	"operation": operation
	};
	request.open('POST', '/login', false);
	request.setRequestHeader('content-type', 'application/json');
	request.send(JSON.stringify(data)); 
	if(request.readyState ===4 || request.status ===200){
		var contacts = JSON.parse(request.responseText);
		if (contacts.error == false) {
			if(operation == 'deluser')
				alert("删除成功！");
			return true;
		}
		else{
		    alert("操作失败！");
			return false;
		}
	}
}

//成功返回true,失败返回false
function infosetonormaluser(id, operation) {
	data={
	"user_id": id,
	"operation": operation
	};
	alert(data);
}
