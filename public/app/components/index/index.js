angular.module('app').component("index",{
bindings:{},
templateUrl:'/app/components/index/index.html?t='+Date.now(),
controller:['$scope','$http','$timeout','$element',
function($scope,$http,$timeout,$element){
	$scope.list=[];
	var socket = io.connect(location.href);
	socket.on('system', function (msg) {
		$scope.list.push("系統:"+msg);
		$scope.$apply();		
	});
	socket.on('world', function (msg) {
		$scope.list.push("陌生人:"+msg);
		$scope.$apply();		
	});
	$scope.$ctrl.$onInit=function(){
		$scope.$watch("list",function(){
			var el=$element[0].querySelector("#msg_list")
			$timeout(function(){
				el.scrollTop =el.scrollHeight
			},50)
		},1)
	}
	
	$element[0].querySelector("textarea").focus()
	$element[0].querySelector("textarea").onkeyup=function(e){
		if(e.keyCode==13){
			$scope.send();
			$scope.msg=""
		}
		$scope.$apply();
	}
	
	$scope.send=function(){
		var msg=angular.copy($scope.msg)
		if(msg){
			
			socket.emit('world', msg);
			$scope.list.push("你:"+msg);
		}
	}
	socket.on('count', function (count) {
		$scope.count=count;
		$scope.$apply();
		// console.log('count',count);
	});
}],
})
