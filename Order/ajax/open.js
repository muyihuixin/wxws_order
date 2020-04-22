mui.init();
var data = new Date();
var month = data.getMonth()+1<10?'0'+(data.getMonth()+1):data.getMonth()
+1;	
var year = data.getFullYear();
var day = data.getDate()<10?'0'+data.getDate():data.getDate();
var newDay = year + '-' + month + '-' + day;
window.addEventListener('open',function(e){//执行刷新
	console.log('刷新')
	location.reload()
})
var vm = new Vue({ 
	"el":'#vm',
	data:{
		roomColor:[],
		roomList:[],
		roomList2:[],
		roomListOpen:'',
		RoomName:'',
		userName:[],
		isDialog:false,//弹框显示隐藏
		isDialog2:false,
		dishesNum:8,//用餐人数
		waiter:'',//服务员
		waiterNo:'',//服务员id
		roominfo:{
			prople:8,
		},//包间信息
		newDay:'',
		isorient:0,//默认竖屏0，横屏1
		operatorList:[],//操作员列表
		operatorNo:'',
		operatorName:'',
		operatorPW:'',//003
		localNo:'031',
		i:-1,
		ii:-1,
	},
	created(){
		this.newDay = newDay
		openIndexedDB(this.loadTableData);//获取数据
		openIndexedDB(this.loadTableData_alltable);//获取所有餐桌数据
		mui.plusReady(res=>{  
			console.log(isNetWork())
			if(!isNetWork()){  
				//mui.toast('没有网络~');  
				openIndexedDB(this.loadTableData_alltable);//获取所有餐桌数据
			}else{
				//获取所有餐桌信息
				repcall('order/dishes/getAllTableList','',res=>{
					console.log(res)
					var arrTableList = []
					if(res.code==0){
						let arr = []
						var arr2 = []
						var arrLook = []
						
						this.roomList = res.data
						this.roomList2 = res.data
						this.putData(personStore, res.data)
						this.roomList2.map(res=>{
							if(arr2.indexOf(res.status) < 0){
								arr2.push(res.status)
							}
							if(res.status=='空闲'){
								arr.push(res)
							}
							if(res.status=='占用'){
								arrLook.push(res)
							}
						})
						vm.roomListOpen = arrLook
						vm.roomColor = arr2//状态分类
						vm.roomList = arr
						console.log(vm.roomList)
					}
				})
			}  
		}); 
	},
	mounted () {

	},
	methods:{
		loadTableData_alltable(){//获取本地数据--所有的餐桌
			var trans = db.transaction(personStore, 'readonly');
			var store = trans.objectStore(personStore);
			//所有的餐桌
			var index = store.index('name');
			var request = index.get('allTable');
			request.onsuccess = function (e) {
			  var result = e.target.result;
			  if (result) {
			  	let arr = []
			  	var arr2 = []
			  	var arrLook = []
			  	
				vm.roomList2 = result.data
				vm.roomList2.map(res=>{
					if(arr2.indexOf(res.status) < 0){
			  			arr2.push(res.status)
			  		}
			  		if(res.status=='空闲'){
			  			arr.push(res)
			  		}
			  		if(res.status=='占用'){
			  			arrLook.push(res)
			  		}
			  	})
				vm.roomListOpen = arrLook
				vm.roomColor = arr2//状态分类
				vm.roomList = arr
				console.log(vm.roomList)
			  } else {
			    // ...
			  }
			}
		},
		//获取本地数据
		loadTableData() {
			var trans = db.transaction(personStore, 'readonly');
			var store = trans.objectStore(personStore);
			var index = store.index('name');
			//所有的服务员
			var request_allWaiter = index.get('allWaiter');
			
			request_allWaiter.onsuccess = function (e) {
			  var result = e.target.result;
			  
			  if (result) {
				vm.userName = result.data
				vm.waiter = vm.userName[0].name
				vm.waiterNo= vm.userName[0].no
			  } else {
			    // ...
			  }
			}
			//所有的操作员
			var request_alloperatorList = index.get('alloperatorList');
			
			request_alloperatorList.onsuccess = function (e) {
			  var result = e.target.result;
			  
			  if (result) {
				vm.operatorList = result.data
				vm.operatorName = vm.operatorList[0].name
				vm.operatorNo= vm.operatorList[0].no
			  } else {
			    // ...
			  }
			}
		},
		// 添加数据，重复添加会更新原有数据
		putData(storename, data) {
			let store = db.transaction(storename, 'readwrite').objectStore(storename);
			var request = store.put({name:'allTable',data:data,id:6});
			// 监听添加成功事件
			request.onsuccess = function(e) {
			  console.log('更新成功');
			  
			};
			// 监听失败事件
			request.onerror = function(e) {
			  console.log(e.target.error);
			  console.log('更新失败');
			};
		},
		getAllTable(){
			//获取所有餐桌信息
		 	repcall('order/dishes/getAllTableList','',res=>{
				console.log(res)
				var arrTableList = []
				if(res.code==0){
					this.roomList = res.data
					this.roomList2 = res.data
					this.putData(personStore, res.data)
				}
			})
		},
		tapRoomColor2(){
			this.roomList = this.roomList2
		},
		tapRoomColor(item){
			console.log(item)
			let arr = []
			this.roomList2.map(res=>{
				if(res.status==item){
					arr.push(res)
				}
			})
			this.roomList = arr
		},
		orderStar(i,index){//点菜
			console.log(i)
			this.ii=index
			localStorage.setItem('openInfo','')
			localStorage.setItem('room',JSON.stringify(i))
			localStorage.setItem('takeOrderDtos','')
			mui.openWindow({
				url:'orderDishes.html',
				id:'orderDishes',
			})
		},
		lookOrder(i,index){//查单
			console.log(i)
			this.ii=index
			localStorage.setItem('openInfo','')
			localStorage.setItem('room',JSON.stringify(i))
			localStorage.setItem('takeOrderDtos','')
			mui.openWindow({
				url:'lookOrder.html',
				id:'lookOrder'
			})
		},
		//开台
		showDialog(item,index){
			this.i=index
			console.log(item)
			item.maxGuestAmount = this.dishesNum
			if(item.status=='空闲'){
				this.isDialog = true
				this.roominfo = item
			}else{
				mui.toast('该包间已占用~')
			}
		},
		diancai(){//跳转到点菜页面---不需要提交开台(包间名字，id,人数，服务员id,)
			if(this.dishesNum==''||this.waiter==''){
				mui.toast('请选择服务员和用餐人数~')
				return
			}
			var obj = {
				RoomName:this.roominfo.name,
				tableNo:this.roominfo.no,
				dishesNum:this.dishesNum,
				waiterNo:this.waiterNo,
				status:this.roominfo.status,
			}
			localStorage.setItem('openInfo',JSON.stringify(obj))
			localStorage.setItem('room','')
			localStorage.setItem('takeOrderDtos','')
			this.isDialog = false//关闭弹框1
			mui.openWindow({
				url:'orderDishes.html',
				id:'orderDishes',
			})
		},
		okTap(){//开台弹框1显示
			console.log(this.dishesNum)
			console.log(this.waiter)
			console.log(this.waiterNo)
			if(this.dishesNum==''||this.waiter==''){
				mui.toast('请选择服务员和用餐人数~')
				return
			}
			this.isDialog2 = true//打开弹框2
			this.isDialog = false//关闭弹框1
		},
		openRoom(){//先开台2---不点菜
			mui('.dialog_bl').button('loading');//切换为loading状态
			if(this.operatorNo==''||this.operatorPW==''){
				mui.toast('请输入操作员编码和密码~')
				return
			}
			//开台
			var data = {
				  "guestAmount": this.dishesNum,//人数 ,
				  "localNo": localNo,//手持设备编号 ,
				  "operatorNo": this.operatorNo,//操作员代码 ,
				  "operatorPW": this.operatorPW,//密码
				  "tableNo": this.roominfo.no,//餐桌代码
				  "waiterNo": this.waiterNo
			}
			console.log(JSON.stringify(data))
			repcallPost('order/dishes/founding',data,res=>{
				console.log(JSON.stringify(res))
				if(res.code==0){
					mui('.dialog_bl').button('reset');//切换为loading状态
					this.getAllTable()
					mui.toast('开台成功')
					this.isDialog2 = false
				}else{
					mui.toast(res.data)
					this.isDialog = false
				}
			})
			
		}
	}
})
function isNetWork() {  
    var NetStateStr = '未知';  
    var types = {};  
    types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";  
    types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";  
    types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";  
    types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";  
    types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";  
    types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";  
    types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";  
    NetStateStr = types[plus.networkinfo.getCurrentType()];  
    return (NetStateStr === "未知") || (NetStateStr === "未连接网络") ? false : true;  
}  
	//js判断屏幕横竖屏：
	$(function(){
        orient();
   });
	function orient() {
        //;
        if (window.orientation == 0 || window.orientation == 180) {
            $("body").attr("class", "portrait");  //当竖屏的时候为body增加一个class
            vm.isorient = 0//默认竖屏0，横屏1
            orientation = 'portrait';
            return false;
        }
        else if (window.orientation == 90 || window.orientation == -90) {
            $("body").attr("class", "landscape"); //当横屏的时候为body移除这个class
            vm.isorient = 1//默认竖屏0，横屏1
            orientation = 'landscape';
            return false;
        }
    }



    $(window).bind( 'orientationchange', function(e){
        orient();
    });
//  ipad： 90 或 -90 横屏
//
//  ipad： 0 或180 竖屏
// 
// Andriod：0 或180 竖屏
// 
//Andriod： 90 或 -90 横屏
//function plusReady(){
//  // 设置系统状态栏背景为蓝色
//  plus.navigator.setStatusBarBackground('#3dadf3');
//  // 设置系统状态栏样式为浅色文字
//  plus.navigator.setStatusBarStyle( "light" );
//  }
//  if(window.plus){
//  plusReady();
//  }else{
//  document.addEventListener("plusready",plusReady,false);
//}