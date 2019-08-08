mui.init({
    beforeback: function() {
	 //获得父页面的webview
	var list = plus.webview.currentWebview().opener();
	 //触发父页面的自定义事件(refresh),从而进行刷新
	mui.fire(list, 'refresh');
	//返回true,继续页面关闭逻辑
	 return true;
    }
});
var vm = new Vue({ 
	"el":'#vm',
	data:{
		RoomName:'',//包间名称
		dishesNum:'',//包间人数
		tableNo:'',
		waiterNo:'',
		dishesClassify:[],//大类
		cityClassify:[],//小类
		cityClassify2:[],//小类
		dishesList:[],
		dishesList2:[],
		heightChange:{height:''},
		heightChange2:{height:''},
		allSmall:-1,//点击颜色
		allBig:-1,//点击颜色
		totalNumber:0,
		totalPrice:0,
		num:'',
		checked:false,
		checkboxList:[],
		checkNumber:0,
		localNo:'031',
		operatorNo:'',
		operatorPW:'',
		isDialog2:false,
		operatorList:[],
		dataArr:[],//提交的arr
		isDisabled:false,
		status:'',
	},
	created(){
		openIndexedDB(this.loadTableData);
		let room = localStorage.getItem('room')
		if(room!=''){
			let rooms = JSON.parse(room)
			console.log(JSON.stringify(rooms))
			this.RoomName = rooms.name
			this.dishesNum = rooms.maxGuestAmount
			this.tableNo = rooms.no
		}
		let openInfo = localStorage.getItem('openInfo')//点餐open页面传进来的
		if(openInfo!=''){
			var openInfos = JSON.parse(openInfo)
			console.log(JSON.stringify(openInfos))
			this.RoomName = openInfos.RoomName
			this.dishesNum = openInfos.dishesNum
			this.tableNo = openInfos.tableNo
			this.status = openInfos.status
			this.waiterNo = openInfos.waiterNo
		}
	},
	mounted(){
		let takeOrderDtos = localStorage.getItem('takeOrderDtos')
		if(takeOrderDtos!=''){
			this.dishesList = JSON.parse(localStorage.getItem('takeOrderDtos'))
			this.dishesList2 = JSON.parse(localStorage.getItem('takeOrderDtos'))
			this.dishesList2.map(res=>{
				Object.assign(res,{'checked':false})
			})
			this.dishesList.map(res=>{
				Object.assign(res,{'checked':false})
				this.totalNumber+=res.amount
				let price = res.amount*res.money
				this.totalPrice+=price
			})
		}
		console.log(this.dishesList2)
		
	},
	watch: { //深度 watcher  全选
        checkboxList: {
            handler: function (val, oldVal) { 
                if (this.checkboxList.length == this.dishesList.length) {
                    this.checked=true;
                } else {
                    this.checked=false;
                }
            },
            deep: true
        }
    },
	filters: {
      /* 格式化时间戳 */
      formatDate (val) {
      	let arr = []
		vm.dishesList2.map(res=>{
			arr.push(res.bigKindno)
		})
        processArr = arr.filter(function(value) {
            return value == val;
        })
        return processArr.length;
      }
   	},
	methods:{
		checkedOne(index){
			console.log(index)
			this.dishesList[index].checked=!this.dishesList[index].checked
			let arr = []
			this.dishesList.map(res=>{
				if(res.checked){
					arr.push(res)
				}
			})
			
			this.checkboxList = arr
//			console.log(JSON.stringify(this.checkboxList))
		},
		checkedAll(){//全选
			console.log('执行了没有'+this.checked)
			this.checked=!this.checked
			if (this.checked) {//实现反选---
//      		this.checkboxList = [];
        		let arr1 = []
                this.dishesList.forEach((item) => {
                	Object.assign(item,{'checked':true})
                });
            } else { //实现全选----
                let arr1 = []
                this.dishesList.forEach((item) => {
                	Object.assign(item,{'checked':false})
                });
            }
		},
		allBigClassify(){//获取全部菜品---大类
			if(this.allBig == -1){
				return
			}
			this.dishesList = this.dishesList2
			this.cityClassify = this.cityClassify2
			this.allBig = -1
			this.allSmall = -1
			console.log(this.dishesList)
			console.log(this.dishesList.filter(item => item.checked===false).length)//
			if(this.dishesList.filter(item => item.checked===false).length==0){
				this.checked=true
			}else{
				this.checked=false
			}
		},
		chooseBigClassify(no,index){//根据大类id获取小类
			if(this.allBig == index){
				return
			}
			this.allBig = index
			let arr2 = []
			this.dishesList = this.dishesList2
			this.dishesList.map(res=>{
				if(res.bigKindno==no){
					arr2.push(res)
				}
			})			
//			this.allSmall = 0
			this.dishesList = arr2
			console.log(this.dishesList)
			
			console.log(this.dishesList.filter(item => item.checked===false).length)//
			if(this.dishesList.filter(item => item.checked===false).length==0){
				this.checked=true
			}else{
				this.checked=false
			}
		},
		deleteOrder(item,index){//删除菜品
			
			for(var i = 0; i < this.dishesList.length; i++) {
				if(this.dishesList[i].dishName == item.dishName) {
					this.dishesList.splice(i, 1);
				}
			}
			for(var i = 0; i < this.dishesList2.length; i++) {
				if(this.dishesList2[i].dishName == item.dishName) {
					this.dishesList2.splice(i, 1);
				}
			}
			localStorage.setItem('takeOrderDtos',JSON.stringify(this.dishesList2))
			location.reload()
		},
		reduction(i,index) {//菜品--
			i.amount--	
			
			if(this.allBig == -1){
				console.log(this.dishesList)
				for(var i = 0; i < this.dishesList.length; i++) {
					if(this.dishesList[i].amount == 0) {
						this.dishesList.splice(i, 1);
					}
				}
				localStorage.setItem('takeOrderDtos',JSON.stringify(this.dishesList))
				location.reload()
			}else{
				console.log(this.dishesList2)
				for(var i = 0; i < this.dishesList2.length; i++) {
					if(this.dishesList2[i].amount == 0) {
						this.dishesList2.splice(i, 1);
					}
				}
				
				localStorage.setItem('takeOrderDtos',JSON.stringify(this.dishesList2))
				location.reload()
			}
		},
		add(i,index){//菜品++
			i.amount++
			if(this.allBig == -1){
				localStorage.setItem('takeOrderDtos',JSON.stringify(this.dishesList))
				location.reload()
			}else{
				localStorage.setItem('takeOrderDtos',JSON.stringify(this.dishesList2))
				location.reload()
			}
		},
		addDishes(item){//继续点菜
			mui.back()
		},
		openRoom(){//确定
			mui('.dialog_bl').button('loading');//切换为loading状态
			this.isDisabled = true
			if(this.operatorNo==''||this.operatorPW==''){
				mui.toast('请输入操作员编码和密码~')
				return
			}
			//判断有没有开台
			if(this.status=='空闲'){
				//开台
				var data = {
					  "guestAmount": this.dishesNum,//人数 ,
					  "localNo": this.localNo,//手持设备编号 ,
					  "operatorNo": this.operatorNo,//操作员代码 ,
					  "operatorPW": this.operatorPW,//密码
					  "tableNo": this.tableNo,//餐桌代码
					  "waiterNo": this.waiterNo
				}
				console.log(JSON.stringify(data))
				repcallPost('order/dishes/founding',data,res=>{
					console.log(JSON.stringify(res))
					if(res.code==0){
						repcall('order/dishes/getAllTableList','',res=>{
							console.log(res)
							var arrTableList = []
							if(res.code==0){
								 // 创建一个事务
						 	 	var transaction = db.transaction(personStore, 'readwrite');
						  		// 通过事务来获取store
						  		var store = transaction.objectStore(personStore);
								var addPersonRequest = store.put({ name:'allTable',data:res.data,id:6});
								addPersonRequest.onsuccess = function (e) {
								    console.log('更新成功');
								    vm.xiadan()
								}
							}else{
								mui.toast('请求失败,请退出重试')
							}
						})
					}else{
						mui.toast(res.data)
						return
					}
				})
			}else{
				this.xiadan()
			}
		},
		xiadan(){//下单
			console.log(JSON.stringify(this.dataArr))
			repcallPost('order/dishes/takeYourOrder',{
   				"localNo":this.localNo,//手持设备编号 ,
				"operatorNo":this.operatorNo, //操作员代码 ,
				"operatorPW": this.operatorPW,//操作员密码 ,
				"takeOrderDtos": this.dataArr
   			},res=>{
   				if(res.code==0){
   					mui('.dialog_bl').button('reset');//切换为loading状态
   					mui.toast('下单成功!')
   					localStorage.setItem('takeOrderDtos','')
   					this.isDialog2 = false
   					this.checkboxList = []
// 					for (var i = 0; i < this.dishesList.length; i++) {
//						for (var j = 0; j < this.checkboxList.length; j++) {
//						  if(this.dishesList[i].dishName==this.checkboxList[j].dishName){
//						  	this.dishesList[i].sendBillSign==this.checkboxList[j].sendBillSign
//						  }
//						}
//					}
//					console.log(JSON.stringify(this.dishesList))
//					localStorage.setItem('takeOrderDtos',JSON.stringify(this.dishesList))
   				}else{
   					if(res.data){
   						mui.toast(res.data)
   					}else{
   						mui.toast(res.msg)
   					}
   					return
   				}
   			})
		},
		jidan(){//即单
			if(this.dishesList.filter(item=>item.checked===true).length<1){
				mui.toast('请选择菜品')
				return
			}else{
				this.isDialog2 = true
				this.dishesList.map(res=>{
					if(res.checked){
						this.dataArr.push(res)
					}
				})
				//this.dataArr = this.checkboxList
				this.dataArr.forEach(res=>{
					this.del(res,['src','bigKindno','kindNo'])
					res.sendBillSign=2
				})
				console.log(this.dataArr)
				//bigKindno":"02","amount":1,"dishName":"安吉白茶","dishNo":"21024","money":"68.0000","remark":"","sendBillSign":2,"tableNo":"009
			}
		},
		del(obj,keys){
			keys.map(i=>{
				delete obj[i]
			})
			return obj
		},
//		let obj = {k1:'香蕉', k2:'苹果', k3:'橘子'};
//		obj = del(obj, ['k2', 'k3'])
		jiaodan(){//叫单
			console.log(this.dishesList.filter(item=>item.checked===true).length)
			if(this.dishesList.filter(item=>item.checked===true).length<1){
				mui.toast('请选择菜品')
				return
			}else{
				this.isDialog2 = true
				this.dishesList.map(res=>{
					if(res.checked){
						this.dataArr.push(res)
					}
				})
				//this.dataArr = this.checkboxList
				this.dataArr.forEach(res=>{
					this.del(res,['src','bigKindno','kindNo'])
					res.sendBillSign=3
				})
			}
		},
		closeBox(){
			this.isDialog2=false
			location.reload()
		},
		//获取本地数据
		loadTableData() {
			var trans = db.transaction(personStore, 'readonly');
			var store = trans.objectStore(personStore);
			var index = store.index('name');
			
			//所有的菜品分类--大类
			var request = index.get("allBigDishesList");
			request.onsuccess = function (e) {
			  var result = e.target.result;
			  if (result) {
				for(let item of result.data){
					Object.assign(item,{src:''})
				}
				result.data.map(res=>{
					let trans2 = db.transaction(personStore2, 'readonly');
					let store2 = trans2.objectStore(personStore2);
					let index2 = store2.index('name');
					let str = 'kind/'+res.no
					var requestImg = index2.get(str);
					requestImg.onsuccess = e=> {
						var result = e.target.result;	
						if (result) {
							res.src=result.data
						} else {
							
						    // ...
						}
					}
					
				})
				vm.dishesClassify = result.data
				console.log(vm.dishesClassify)
				
			  } else {
			    // ...
			  }
			}
			//所有的菜品分类--小类
			var request = index.get("allSmallDishesList");
			request.onsuccess = function (e) {
			  var result = e.target.result;
			  if (result) {
				vm.cityClassify = result.data
				vm.cityClassify2 = result.data
				console.log(vm.cityClassify)
				
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
		//获取数组中相同元素的个数
		getSameNum(val,arr){
			newarr = arr.filter(function(value){
				return value == val
			})
			return newarr.length
		}
	}
})
	//js判断屏幕横竖屏：
	function orient() {
		    //;
	    var tt = document.body.clientHeight || document.documentElement.clientHeight
		var tw = document.body.clientWidth || document.documentElement.clientWidth
		console.log(window.orientation)
        //;
        if (window.orientation == 0 || window.orientation == 180) {
            $("body").attr("class", "portrait");  //当竖屏的时候为body增加一个class
            vm.isorient = 0//默认竖屏0，横屏1
            orientation = 'portrait';
            vm.heightChange.height = tt - 55 +'px'
			vm.heightChange2.height = tt-300+'px'
            return false;
        }
        else if (window.orientation == 90 || window.orientation == -90) {
            $("body").attr("class", "landscape"); //当横屏的时候为body移除这个class
            vm.isorient = 1//默认竖屏0，横屏1
            orientation = 'landscape';
            vm.heightChange.height = tt - 55 +'px'
			vm.heightChange2.height = tt-55+'px'
            return false;
        }
    }
   
    $(function(){
        orient();
    });

    $(window).bind( 'orientationchange', function(e){
        orient();
    });