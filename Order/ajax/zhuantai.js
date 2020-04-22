mui.init();
var data = new Date();
var month = data.getMonth()+1<10?'0'+(data.getMonth()+1):data.getMonth()
+1;	
var year = data.getFullYear();
var day = data.getDate()<10?'0'+data.getDate():data.getDate();
var newDay = year + '-' + month + '-' + day;

		var vm = new Vue({ 
			"el":'#vm',
			data:{
				roomColor:[],
				roomList:[],
				roomList2:[],
				roomname_zhanyong:'',
				roomname_kongxian:'',
				isDialog:false,//弹框显示隐藏
				dishesNum:'',//用餐人数
				waiter:'',//服务员
				newDay:'',
				isorient:'',//默认竖屏0，横屏1
				roomList_kongxian:[],
				roomList_zhanyong:[],
				i:-1,
				ii:-1,
				operatorNo:'',
				operatorPW:'',
				localNo:'031',
				oldTableNo:'',
				newTableNo:'',
			},
			created(){
//				mui.ajax(baseUrl+'order/dishes/getAllTableList',{
//					data:'',
//					dataType:'json',
//					type:'get',
//					success:function(res){
//						console.log(JSON.stringify(res))
//						if(res.code==0){
//							vm.roomList = res.data
//							vm.roomList2 = res.data
//							let arr2 = []
//							res.data.map(res=>{
//								if(arr2.indexOf(res.status) < 0){
//						  			arr2.push(res.status)
//						  		}
//								if(res.status=='空闲'){
//									vm.roomList_kongxian.push(res)
//								}else if(res.status=='占用'){
//									vm.roomList_zhanyong.push(res)
//								}
//							})
//							vm.roomColor = arr2
//						}else{
//							vm.openIndexedDB(vm.loadTableData);
//						}
//					},
//					error:function(err){
//						vm.openIndexedDB(vm.loadTableData);
//					}
//				})
				this.openIndexedDB(this.loadTableData);
				this.newDay = newDay
			},
			mounted () {
			},
			methods:{
			    //打开本地数据库
				openIndexedDB(callback) {
				  // 打开一个数据库
				  var request = indexedDB.open(dbName, dbVersion);
				
				  // 打开失败
				  request.onerror = function (e) {
				    console.log(e.currentTarget.error.message);
				  };
				
				  // 打开成功！
				  request.onsuccess = function (e) {
				    db = e.target.result;
				    console.log('成功打开DB');
				    callback();
				  };
				
				  // 打开成功后，如果版本有变化自动执行以下事件
				  request.onupgradeneeded = function (e) {
				    var db = e.target.result;
				    if (!db.objectStoreNames.contains(personStore)) {
				      console.log("我需要创建一个新的存储对象");
				      //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
				      //数据库新建成功以后，新增一张叫做person的表格，主键是id
				      var objectStore = db.createObjectStore(personStore, {
				        keyPath: "id",
				        autoIncrement: true
				      });
				  
				      //指定可以被索引的字段，unique字段是否唯一, 指定索引可以加快搜索效率。
				      objectStore.createIndex("name", "name", {
				        unique: true
				      });
				      objectStore.createIndex("phone", "phone", {
				        unique: false
				      });
				 
				    }
				    if (!db.objectStoreNames.contains(personStore2)) {
				      console.log("我需要创建一个新的存储对象personStore2");
				      //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
				      //数据库新建成功以后，新增一张叫做personimg的表格，主键是id
				      var objectStore2 = db.createObjectStore(personStore2, {
				        keyPath: "id",
				        autoIncrement: true
				      });
				
				      //指定可以被索引的字段，unique字段是否唯一, 指定索引可以加快搜索效率。
				      objectStore2.createIndex("name", "name", {
				        unique: true
				      });
				      objectStore2.createIndex("phone", "phone", {
				        unique: false
				      });
				    }
				    console.log('数据库版本更改为： ' + dbVersion);
				  };
				},
				//获取本地数据
				loadTableData() {
					var trans = db.transaction(personStore, 'readonly');
					var store = trans.objectStore(personStore);
					//所有的餐桌
					var index = store.index('name');
					var request = index.get('allTable');
					request.onsuccess = function (e) {
					  var result = e.target.result;
					  if (result) {
						vm.roomList = result.data
						vm.roomList2 = result.data
						console.log(result)//所有餐桌
						let arr2 = []
						result.data.map(res=>{
							if(arr2.indexOf(res.status) < 0){
					  			arr2.push(res.status)
					  		}
							if(res.status=='空闲'){
								vm.roomList_kongxian.push(res)
							}else if(res.status=='占用'){
								vm.roomList_zhanyong.push(res)
							}
						})
						vm.roomColor = arr2
					  } else {
					    // ...
					  }
					}
					//所有的服务员
					var request_allWaiter = index.get('allWaiter');
					
					request_allWaiter.onsuccess = function (e) {
					  var result = e.target.result;
					  
					  if (result) {
						vm.userName = result.data
						console.log(vm.roomList)//所有服务员
						
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
				//转台
				showDialog(item,index){
					console.log(index)
					if(item.status=='占用'){
						this.i=index
						this.roomname_zhanyong = item.name
						this.newTableNo = item.no
					}else if(item.status=='空闲'){
						this.ii=index
						if(this.roomname_zhanyong==''){
							mui.alert('请选择需要转移的包间~')
						}else{
							this.roomname_kongxian = item.name
							this.oldTableNo = item.no
							this.isDialog = true
						}
					}
				},
				getAllTable(){
					//获取所有餐桌信息
				 	repcall('order/dishes/getAllTableList','',res=>{
						console.log(res)
						var arrTableList = []
						if(res.code==0){
							this.roomList = res.data
							this.roomList2 = res.data2
							this.putData(personStore, res.data)
							window.location.reload()
						}
					})
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
				okTap(){//跳转到点菜页面
					if(this.operatorNo==''||this.operatorPW==''){
						mui.toast('请输入用户名和密码~')
						return
					}
					//开台
					var data = {
					  "localNo":localNo,//手持设备编号 ,
					  "newTableNo":this.oldTableNo,//新餐桌代码 ,
					  "oldTableNo":this.newTableNo,//原餐桌代码 ,
					  "operatorNo":this.operatorNo,//操作员代码 ,
					  "operatorPW":this.operatorPW// 操作员密码
					}
					console.log(data)
					repcallPost('order/dishes/changeChannels',data,res=>{
						console.log(JSON.stringify(res))
						if(res.code==0){
							this.getAllTable()
							this.isDialog = false
							mui.toast(res.msg)
//							mui.openWindow({
//								url:'orderDishes.html',
//								id:'orderDishes',
//								extras:{
//									RoomName:this.RoomName,
//									dishesNum:this.dishesNum
//								}
//							})
						}else if(res.code==-1){
							mui.toast(res.data)
							this.isDialog = false
						}else{
							mui.toast('转台失败')
							this.isDialog = false
						}
					})
				}
			}
		})

	//js判断屏幕横竖屏：
	$(function(){
        orient();
   });
	function orient() {

		console.log(window.orientation)
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
