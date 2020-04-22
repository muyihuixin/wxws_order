mui.init({
    beforeback: function() {
	 //获得父页面的webview
	var list = plus.webview.currentWebview().opener();
	 //触发父页面的自定义事件(refresh),从而进行刷新
	mui.fire(list, 'detail');
	//返回true,继续页面关闭逻辑
	 return true;
    }
});
var data = new Date();
var month = data.getMonth()+1<10?'0'+(data.getMonth()+1):data.getMonth()+1;	
var year = data.getFullYear();
var day = data.getDate()<10?'0'+data.getDate():data.getDate();
var newDay = year + '-' + month + '-' + day;
var vm = new Vue({ 
	"el":'#vm',
	data:{
		num:1,
		newDay:'',
		tableNo:'001',//包间代码
		RoomName:'',
		remark:'',//口味备注
		dishesList:[],//所属菜品列表{bigKindno: "01",
		dishesLists:[],
		dishesDetail:{},//当前菜品详情
		index:'',
		index2:'',
		isBigImg:false,//点击放大
		radioList:[],//视频
		takeOrderDtos:[],
		swiper1:null,
		tasteList:[],//所有口味列表
		tasetAllArr:[],//公共口味列表
		tasetOneArr:[],//私有口味列表
		diff:0,
		kindNo:'',//小类
		bigKindno:'',//大类
		bodyHeight:{height:''},
	},
	created(){
		openIndexedDB(this.loadTableData)////获取本地数据---所有菜品
//		openIndexedDB(this.loadTableDataLunboObj)//获取本地数据--上一个页面传过来的数据
		//判断有没有视频
		var str = this.dishesDetail.kindNo+'/'+this.dishesDetail.no
		this.getRangeDataRadio("personImg","name", IDBKeyRange.bound("av/"+str,"av/"+str+'-9',false,false));

		this.newDay = newDay
		openIndexedDB(this.loadTableDataTeast)////获取本地数据--口味
		
		this.index = localStorage.getItem('id')
		this.dishesDetail = JSON.parse(localStorage.getItem('lunboObj'))
		//根据id对菜品列表进行筛选
		this.kindNo = localStorage.getItem('kindNo')//小类
		this.bigKindno = localStorage.getItem('bigKindno')//大类
		console.log(this.kindNo+'///'+this.bigKindno)

		this.$nextTick(()=>{
			this.swiper1 = new Swiper('.swiper1.swiper-container', {//再获取到数据之后初始化swiper
		      spaceBetween: 30,
		      effect: 'fade',
		      loop: false, 
		      direction: 'horizontal',
		      observer:false,//修改自己或子元素时自动初始化
			  observerParents:true,//修改父元素时自动初始化
			  on: {
	             touchEnd:function(event){
	             	console.log(vm.diff +'///'+vm.swiper1.touches.diff)
	             	if(vm.diff == vm.swiper1.touches.diff){
	             		 var d = 0
	             	}else{
	             		 var d = vm.swiper1.touches.diff
	             		 vm.diff = d
	             		 vm.radioList = []
	             	}
					if(d<-200){
					 	//左滑
					 	if(vm.index==vm.dishesList.length){
					 		vm.index=1
					 	}else{
					 		vm.index++
					 	}
					 }else if(d>200){
					 	//右滑
					 	if(vm.index==0){
					 		vm.index=vm.dishesList.length-1
					 	}else{
					 		vm.index--
					 	}
					 }else{
					 	return
					 }
					vm.dishesDetail = vm.dishesList[vm.index]
					
					vm.tasetAllArr.map(res=>{
						Vue.set(res,'isTaste',false)
					})
					vm.tasetOneArr.map(res=>{
						Vue.set(res,'isTaste',false)
					})
					var onearr = []
					vm.tasteList.map(res=>{
						if(res.dishNo == vm.dishesDetail.no){
							onearr.push(res)
						}						
					})
					vm.tasetOneArr = onearr
					var str = vm.dishesDetail.kindNo+'/'+vm.dishesDetail.no
					vm.getRangeDataRadio("personImg","name", IDBKeyRange.bound("av/"+str,"av/"+str+'-9',false,false));
					console.log(vm.index)					
		       }, 
		     },
		      pagination: { // 如果需要分页器
		        el: '.swiper-pagination1',
		        dynamicBullets: true,
		      },
		  });
		})
	},
	mounted(){
		var room = localStorage.getItem('room')//查单look页面传进来的
		if(room!=''){
			console.log('点菜页面进来的')
			let rooms = JSON.parse(room)
			this.tableNo = rooms.no
			console.log(JSON.stringify(rooms))
			this.RoomName = rooms.name
			//一个包间对应一个菜单---只要之前点过菜，但是没有提交都存在
			var takeOrderDtos = localStorage.getItem(this.RoomName)?localStorage.getItem(this.RoomName):''
			let takeOrderDtosObj = takeOrderDtos?JSON.parse(takeOrderDtos):[]
			this.takeOrderDtos = takeOrderDtosObj
		}
		var openInfo = localStorage.getItem('openInfo')//点餐open页面传进来的
		
		if(openInfo!=''){
			let openInfObj = JSON.parse(openInfo)
			console.log(JSON.stringify(openInfObj))
			console.log('开台页面进来的')
			this.tableNo = openInfObj.tableNo
			this.RoomName = openInfObj.RoomName
			//一个包间对应一个菜单---只要之前点过菜，但是没有提交都存在
			var takeOrderDtos = localStorage.getItem(this.RoomName)?localStorage.getItem(this.RoomName):''
			let takeOrderDtosObj = takeOrderDtos?JSON.parse(takeOrderDtos):[]
			this.takeOrderDtos = takeOrderDtosObj
		}
	},
	methods:{
		keyup(){//监听键盘弹起  
			 this.bodyHeight.height ='100%'
		},
		getRangeDataRadio(storeName, index, range) { //存储空间名，索引，检索范围---查找视频
		    indexedDB.open("demoDb").onsuccess = function (e) {
		        var db = e.target.result;
		        var objectStore = db.transaction(storeName).objectStore(storeName).index(index);
		        objectStore.openCursor(range).onsuccess = function (e) {//使用游标
		            var cursor = e.target.result;
		            if (cursor) {
		                console.log(cursor.value)
		                vm.radioList.push(cursor.value.data)
		                cursor.continue(); //游标移动到下一个位置
		            }
		        }
		    }
		},
		changeColor(index){
			this.tasetAllArr[index].isTaste=!this.tasetAllArr[index].isTaste
		},
		changeColorOne(index){
			this.tasetOneArr[index].isTaste=!this.tasetOneArr[index].isTaste
		},
		//获取本地数据---所有菜品
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
						}
					}
				})
				vm.dishesList = result.data
				console.log(vm.dishesList.length)
				if(vm.kindNo){
					let arr = []
					vm.dishesList.map(res=>{
						if(res.kindNo == vm.kindNo){
							arr.push(res)
						}
					})
					vm.dishesList = arr
				}else if(vm.bigKindno){
					let arr = []
					vm.dishesList.map(res=>{
						if(res.bigKindno == vm.bigKindno){
							arr.push(res)
						}
					})
					vm.dishesList = arr
				}
				console.log(vm.dishesList.length)
			  }
			}
		},
		//获取本地数据--口味
		loadTableDataTeast() {
			var trans = db.transaction(personStore, 'readonly');
			var store = trans.objectStore(personStore);
			var index = store.index('name');
			//所有的口味
			var requestTaste = index.get("allTaste");
			requestTaste.onsuccess = function (e) {
			  var result = e.target.result;
			  if (result) {
				vm.tasteList = result.data//所有口味
				
				let tasetArr1 = []
				let tasetArr2 = []
				vm.tasteList.map(res=>{
//					Object.assign(res,{isTaste:false})
					Vue.set(res,'isTaste',false)
				})
				vm.tasteList.map(res=>{
					if(res.dishNo==vm.dishesDetail.no){
						tasetArr1.push(res)
					}
					if(res.dishNo==''){
						tasetArr2.push(res)
					}
				})
				vm.tasetAllArr = tasetArr2//公共的
				vm.tasetOneArr = tasetArr1//私有的
			  } else {
			    // ...
			  }
			}
		},
		loadTableDataLunboObj() {//获取本地数据--上一个页面传过来的数据
			var trans = db.transaction(personStore, 'readonly');
			var store = trans.objectStore(personStore);
			var index = store.index('name');
			//所有的口味
			var requestTaste = index.get("lunboObj");
			requestTaste.onsuccess = function (e) {
			  var result = e.target.result;
			  if (result) {
			  	console.log(result)
			  	vm.dishesDetail = result.data
//				vm.tasteList = result.data//所有口味
				
			  } else {
			    // ...
			  }
			}
		},
		reduction() {//菜品--
			var i = this.dishesDetail
			
			if(i.num<=0){
				return
			}else{
				i.num--
			}
		},
		addBtn(){//点击添加
			var i = this.dishesDetail
			var index = this.index
			if(i.num==0){
				mui.toast('请先点餐~')
				return
			}else{
				//获取口味
				var orderTeastArr = []
				this.tasetOneArr.map(res=>{
					if(res.isTaste){
						orderTeastArr.push(res.name)
					}
				})
				this.tasetAllArr.map(res=>{
					if(res.isTaste){
						orderTeastArr.push(res.name)
					}
				})
				if(this.remark){
					orderTeastArr.push(this.remark)
				}
				console.log(JSON.stringify(orderTeastArr))
				//获取对象
				let paramss = {}
				paramss.src = i.src
				paramss.kindNo = i.kindNo
				paramss.bigKindno = i.bigKindno
				paramss.amount = i.num
				paramss.dishName = i.name
				paramss.dishNo  = i.no
				paramss.money = i.price
				paramss.remark = orderTeastArr//口味
				paramss.sendBillSign = 0// 2 即单，3 叫单 ,
				paramss.tableNo = this.tableNo//餐桌代码
				console.log(this.takeOrderDtos.length)
				this.takeOrderDtos.push(paramss);
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
					this.takeOrderDtos.map(res=>{
						res.src = ''
					})
					localStorage.setItem(this.RoomName,JSON.stringify(this.takeOrderDtos))
				}
				mui.back()
			}
		},
		add(){//菜品++
			var i = this.dishesDetail
			i.num++
		},
		tupian(){
			
		},
		getBigImg(src,kindNo,no){//点击放大进行轮播
			if(src){
				var str = kindNo+'/'+no
				mui.openWindow({
					url:'imgDetail.html',
					id:'imgDetail',
					extras:{str:str}
				})
			}else{
				return
			}
			
		},
	}
})

//js判断屏幕横竖屏：
function orient() {
//	console.log(window.orientation)
    //;
    if (window.orientation == 0 || window.orientation == 180) {
        $("body").attr("class", "portrait");  //当竖屏的时候为body增加一个class
        orientation = 'portrait';
        return false;
    }
    else if (window.orientation == 90 || window.orientation == -90) {
        $("body").attr("class", "landscape"); //当横屏的时候为body移除这个class
        orientation = 'landscape';
            return false;
        }
    }
   
   
    $(function(){
        orient();
    });

    $(window).bind( 'orientationchange', function(e){
    orient();
});
