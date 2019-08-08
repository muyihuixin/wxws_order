mui.init({
    beforeback: function() {
	 //获得父页面的webview
	var list = plus.webview.currentWebview().opener();
	 //触发父页面的自定义事件(refresh),从而进行刷新
	mui.fire(list, 'open');
	//返回true,继续页面关闭逻辑
	 return true;
    }
});
var data = new Date();
var month = data.getMonth()+1<10?'0'+(data.getMonth()+1):data.getMonth()
+1;	
var year = data.getFullYear();
var day = data.getDate()<10?'0'+data.getDate():data.getDate();
var newDay = year + '-' + month + '-' + day;
window.addEventListener('refresh',function(e){//执行刷新
	console.log('刷新')
	location.reload()
})
var vm = new Vue({ 
	"el":'#vm',
	data:{
		newDay:'',
		RoomName:'金雅阁',//包间名称
		dishesNum:'20',//包间人数
		tableNo:'',//包间代码
		dishesClassify:[],//大类
		cityClassify:[],//小类
		cityClassify2:[],//小类
		dishesList:[],//菜品
		dishesListArr:[],//根据大类id查询所有菜品
		dishesList2:[],
		dishesList22:[],
		allSmall:-1,//点击颜色
		allBig:-1,//点击颜色
		num:0,
		heightChange:{height:''},
		heightChange2:{height:''},
		searchText:'',//搜索值
		totalNumber:0,
		totalNum:0,
		takeOrderDtos:[],//点菜列表
		remark:'',//口味备注
		flag:1,//排序
		pageNo:1,
		pageSize:8,
		totalPage:'',
        searchText:'',    //输入的值
	},
	created(){
		openIndexedDB(this.loadTableData);
		var takeOrderDtos = localStorage.getItem('takeOrderDtos')
		if(takeOrderDtos!=''){
			let takeOrderDtosObj = JSON.parse(takeOrderDtos)
			this.takeOrderDtos = takeOrderDtosObj
			this.takeOrderDtos.map(res=>{
				this.totalNumber += res.amount
			})
			
			console.log(this.totalNumber)
		}
		let room = localStorage.getItem('room')//查单look页面传进来的
		if(room!=''){
			let rooms = JSON.parse(room)
			console.log(JSON.stringify(rooms))
			this.RoomName = rooms.name
			this.dishesNum = rooms.maxGuestAmount
			this.tableNo = rooms.no
		}
		var openInfo = localStorage.getItem('openInfo')//点餐open页面传进来的
		
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
	mounted () {
	    
		this.newDay = newDay
	},
	methods:{
		closeKey(){
			this.isKeybox=false
			this.searchText=''
		},
		keyDown(item){
			
			if(item=='OK'){
				this.dishesList = this.dishesList2
				let arr = []
				let filter = this.searchText.toUpperCase(); 
				this.dishesList.map(res=>{
					if(res.findCode.indexOf(filter)>-1 || res.name.indexOf(filter)>-1){
						arr.push(res)
					}
				})
				this.dishesList = arr
			}else if(item=='Del'){
				if(this.searchText.length>0){
					console.log(this.searchText)
					this.searchText = this.searchText.substring(0,this.searchText.length-1)
					console.log(this.searchText)
				}else{
					return
				}
			}else{
				if(!this.searchText){
					this.searchText = item
				}else{
					this.searchText += item	
				}
			}
		},
		//获取本地数据
		loadTableData() {
			var trans = db.transaction(personStore, 'readonly');
			var store = trans.objectStore(personStore);
			var index = store.index('name');
			//所有的菜品
			var request = index.get("allDishes");
			request.onsuccess = function (e) {
			  var result = e.target.result;
			  if (result) {
				for(let item of result.data){
					Object.assign(item,{src:'',num:0})
				}
				result.data.map(res=>{
					
					let trans2 = db.transaction(personStore2, 'readonly');
					let store2 = trans2.objectStore(personStore2);
					let index2 = store2.index('name');
					let str = 'dish/'+res.kindNo+'/'+res.no
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
				vm.dishesList22 = result.data.slice(0,vm.pageSize)
				vm.totalPage = Math.ceil(result.data.length/vm.pageSize)
				vm.dishesList2 = result.data
				vm.dishesList = result.data
				vm.dishesListArr = result.data
//				console.log(vm.dishesList)
			  } else {
			    // ...
			  }
			}
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
				console.log(result)
			  } else {
			    // ...
			  }
			}
		},
		reduction(i,index) {//菜品--
			if(i.num<=0){
				return
			}
			i.num--	
			this.totalNumber = 0;
			let paramss = {}
			paramss.src = i.src
			paramss.kindNo = i.kindNo
			paramss.bigKindno = i.bigKindno
			paramss.amount = i.num
			paramss.dishName = i.name
			paramss.dishNo  = i.no
			paramss.money = i.price
			paramss.remark = this.remark//口味
			paramss.sendBillSign = 0// 2 即单，3 叫单 ,
			paramss.tableNo = this.tableNo//餐桌代码
			this.takeOrderDtos.push(paramss);
			console.log(this.takeOrderDtos)
			if(this.takeOrderDtos.length > 0) {
				for(var i = 0; i < this.takeOrderDtos.length; i++) {
					for(var j = i + 1; j < this.takeOrderDtos.length; j++) {
						if(this.takeOrderDtos[i].dishName == this.takeOrderDtos[j].dishName) {
							this.takeOrderDtos.splice(i, 1);
							i = 0;
						}
					}
				}
				for(var i = 0; i < this.takeOrderDtos.length; i++) {
					if(this.takeOrderDtos[i].amount == 0) {
						this.takeOrderDtos.splice(i, 1);
					}
				}
				console.log(this.takeOrderDtos)
				localStorage.setItem('takeOrderDtos',JSON.stringify(this.takeOrderDtos))
				this.takeOrderDtos.map(res=>{
					this.totalNumber += res.amount
				})
			}
		},
		add(i,index){//菜品++
			console.log(this.takeOrderDtos.length)
			i.num++
			this.totalNumber = 0;
			let paramss = {}
			paramss.src = i.src
			paramss.kindNo = i.kindNo
			paramss.bigKindno = i.bigKindno
			paramss.amount = i.num
			paramss.dishName = i.name
			paramss.dishNo  = i.no
			paramss.money = i.price
			paramss.remark = this.remark//口味
			paramss.sendBillSign = 0// 2 即单，3 叫单 ,
			paramss.tableNo = this.tableNo//餐桌代码
			console.log(this.takeOrderDtos.length)
			this.takeOrderDtos.push(paramss);
			console.log(this.takeOrderDtos.length)
			if(this.takeOrderDtos.length > 0) {
				for(var i = 0; i < this.takeOrderDtos.length; i++) {
					for(var j = i + 1; j < this.takeOrderDtos.length; j++) {
						if(this.takeOrderDtos[i].dishName == this.takeOrderDtos[j].dishName) {
							this.takeOrderDtos.splice(i, 1);
							i = 0;
						}
					}
				}
				console.log(this.takeOrderDtos)
				localStorage.setItem('takeOrderDtos',JSON.stringify(this.takeOrderDtos))
				let num = 0
				this.takeOrderDtos.map(res=>{
					num += res.amount
				})
				this.totalNumber = num
				console.log(this.totalNumber)
			}
		},
		jump(index,item){//跳转至菜品详情
			localStorage.setItem('id',index)
			localStorage.setItem('lunboObj',JSON.stringify(item))

			if(this.allBig!=-1&&this.allSmall==-1){
				console.log(this.allBig)//根据大类查找菜品
				var bigKindno = this.dishesClassify[this.allBig].no
				var kindNo = ''
				
			}else if(this.allBig!=-1&&this.allSmall!=-1){
				console.log(this.allSmall)//根据小类查找菜品
				var kindNo = this.cityClassify[this.allSmall].no
				var bigKindno = ''
			}
			if(this.allBig==-1&&this.allSmall==-1){
				var kindNo = ''
				var bigKindno = ''
			}else if(this.allBig==-1&&this.allSmall!=-1){
				console.log(this.allSmall)//根据小类查找菜品
				var kindNo = this.cityClassify[this.allSmall].no
				var bigKindno = ''
			}
			localStorage.setItem('kindNo',kindNo)//小类
			localStorage.setItem('bigKindno',bigKindno)//大类
			 mui.openWindow({
				url:'dishesDetail.html',
				id:'dishesDetail',
//				extras:{
//					index:index,
//					item:item
//				},
				createNew:false,
			})

		},
		already(){//跳转到已点页面
			if(this.takeOrderDtos.length>0){
				mui.openWindow({
					url:'alreadyDishes.html',
					id:'alreadyDishes',
					createNew:true
				})
			}else{
				mui.toast('请先点菜~')
			}
			
		},
		allBigClassify(){//获取全部菜品---大类
			if(this.allBig == -1){
				return
			}
			this.dishesList = this.dishesList2
			this.dishesListArr = this.dishesList2
			this.cityClassify = this.cityClassify2
			this.allBig = -1
			this.allSmall = -1
			this.pageNo = 1
			this.totalPage = Math.ceil(this.dishesList.length/vm.pageSize)
			this.dishesList22 = this.dishesList.slice(0,vm.pageSize)
			console.log(this.dishesListArr.length+'////'+this.totalPage )
			mui('.dishes_rList').pullRefresh().refresh(true);
		},
		allSmallClassify(){//获取全部菜品---小类
			if(this.allSmall == -1){
				return
			}
			this.dishesList=this.dishesListArr
			this.allSmall = -1
			this.pageNo = 1
			this.totalPage = Math.ceil(this.dishesListArr.length/vm.pageSize)
			this.dishesList22 = this.dishesListArr.slice(0,vm.pageSize)
			console.log(this.dishesListArr.length+'////'+this.totalPage+'////'+this.pageNo)
			mui('.dishes_rList').pullRefresh().refresh(true);
		},
		chooseBigClassify(no,index){//根据大类id获取小类
			if(this.allBig == index){
				return
			}
			this.cityClassify = this.cityClassify2
			this.allBig = index
			let arr = []
			this.cityClassify.map(res=>{
				if(res.bigKindNo==no){
					arr.push(res)
				}
			})
			this.cityClassify = arr//所有的小类
			let arr2 = []
			this.dishesList = this.dishesList2
			this.dishesList.map(res=>{
				if(res.bigKindno==no){//根据大类id查找全部菜品
					arr2.push(res)
				}
			})
			this.allSmall = -1
			this.dishesList = arr2//根据大类id查找全部菜品
			this.dishesListArr = arr2//根据大类id查找全部菜品
			this.pageNo = 1
			this.totalPage = Math.ceil(arr2.length/vm.pageSize)
			this.dishesList22 = arr2.slice(0,vm.pageSize)
			mui('.dishes_rList').pullRefresh().refresh(true);
		},
		chooseSmallClassify(no,index){//根据小类id获取菜品
			if(this.allSmall == index){
				return
			}
			this.allSmall = index
			let arr = []
			this.dishesListArr.map(res=>{
				if(res.kindNo==no){
					arr.push(res)
				}
			})
			this.dishesList = arr
			console.log(arr)
			this.pageNo = 1
			this.totalPage = Math.ceil(arr.length/vm.pageSize)
			this.dishesList22 = arr.slice(0,vm.pageSize)
			console.log(arr.length+'////'+this.totalPage)
			if(this.totalPage<=1){
				mui('.dishes_rList').pullRefresh().refresh(false);
			}else{
				mui('.dishes_rList').pullRefresh().refresh(true);
			}
		},
		inputChange(){//模糊查询菜品
			console.log(this.searchText)
//			this.isKeybox = true
//			keyShow()
			let filter = this.searchText.toUpperCase(); 
			let arr = []
			this.dishesList.map(res=>{
				if(res.findCode.indexOf(filter)>-1 || res.name.indexOf(filter)>-1){
					arr.push(res)
				}
			})
			this.dishesList22 = arr
		},
		orderIndex(){//paixu排序
			this.flag = parseInt(Math.random()*3)
			if(this.flag==1){
				this.dishesList22.sort((a,b)=>{//价格
					return a.price - b.price 
				})
				
			}else if(this.flag==2){
				this.dishesList22.sort((a,b)=>{//销量
					return  b.saleAmount - a.saleAmount 
				})
				
			}else{
				this.dishesList22.sort((a,b)=>{//名称
					return a.name.localeCompare(b.name, 'zh-Hans-CN', {sensitivity: 'accent'});
//					return (a.findCode + '').localeCompare(b.findCode + '')
				})
			}
			mui('.dishes_rList').pullRefresh().refresh(false);
		}
	}
})
mui.init({
  pullRefresh : {
    container:'.dishes_rList',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
    up : {
      height:50,//可选.默认50.触发上拉加载拖动距离
      auto:false,//可选,默认false.自动上拉加载一次
      contentrefresh : "上拉加载更多...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
      contentnomore:'客官~没有更多数据了！',//可选，请求完毕若没有更多数据时显示的提醒内容；
      callback :pullfresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }
  }
});
function pullfresh(){
	console.log(vm.pageNo+'////'+vm.totalPage)
	if(vm.pageNo >= vm.totalPage) {
		mui('.dishes_rList').pullRefresh().endPullupToRefresh(vm.pageNo >= vm.totalPage);
	} else {
		mui('.dishes_rList').pullRefresh().endPullupToRefresh(vm.pageNo >= vm.totalPage);
		vm.pageNo++
		vm.dishesList22=vm.dishesList.slice(0,vm.pageNo*vm.pageSize)
	}
}
//js判断屏幕横竖屏：
$(function(){
    orient();
});
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
        vm.heightChange.height = tt - 80 +'px'
		vm.heightChange2.height = tt-55+'px'
        return false;
    }
}




$(window).bind( 'orientationchange', function(e){
    orient();
});
