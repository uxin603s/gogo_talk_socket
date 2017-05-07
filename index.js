var express=require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
server.listen(8888);

var tmp={};
io.on('connection', function (socket) {
	var id=socket.id;
	// socket.emit("system",id+"這是你的ID");//自己
	io.clients(function(error,clients){
		if(error)throw error;
		io.sockets.emit("count",clients.length);//回傳線上人數
		var index=clients.indexOf(id);
		clients.splice(index,1);//移除自己
		var len=clients.length;
		if(!tmp[id] && len){//判斷配對
			var rid=Math.floor(Math.random()*len);//抽一個陌生人
			var other_id=clients[rid];
			if(!tmp[other_id]){
				tmp[other_id]=id;
				tmp[id]=other_id;
				socket.emit('system',"找到陌生人，開始聊天");
				socket.to(other_id).emit('system',"找到陌生人");
				return 
			}
			// console.log(id,other_id,"找到對方")
		}
		
		socket.emit('system',"搜尋陌生人中");
		// console.log(id,"搜尋陌生人")
		
		// console.log(tmp)
	});	
	socket.on('world',function (msg) {//接受訊息
		if(tmp[id]){
			socket.to(tmp[id]).emit('world', msg);
		}else{
			socket.emit('system',"搜尋陌生人中");
		}
	});	
	
	socket.on('disconnect',function(){
		var other_id=tmp[id];
		delete tmp[id];
		delete tmp[other_id];
		socket.to(other_id).emit('system',"陌生人離開");
		io.clients(function(error,clients){
			if(error)throw error;
			io.sockets.emit("count",clients.length);//回傳線上人數
		})
	});
});