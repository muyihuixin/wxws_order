mui.init();
var data = new Date();
var month = data.getMonth()+1<10?'0'+(data.getMonth()+1):data.getMonth()+1;	
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
		newDay:'',
		RoomName:'',//包间名称
		dishesNum:'',//包间人数
		dishesClassify:[],
		cityClassify:[],
		dishesList:[],
		dishesList2:[],
		totalPrice:0,
		totalNum:0,
		remark:'不想要了',//退菜原因
		tuicaiNumber:1,//退菜数量
		isDialog:false,//弹框显示
		tableNo:'',
		allBig:-1,
		heightChange:'',
		heightChange2:'',
		localNo:'031',
		operatorNo:'',
		operatorList:[],//操作员列表
		operatorPW:'',
		dishNo:''
	},
	created(){
		this.openIndexedDB(this.loadTableData);
		this.newDay = newDay
		let room = localStorage.getItem('room')
		if(room!=''){
			let rooms = JSON.parse(room)
			console.log(JSON.stringify(rooms))
			this.RoomName = rooms.name
			this.dishesNum = rooms.maxGuestAmount
			this.tableNo = rooms.no
		}
		repcall('order/dishes/checkList',{
			tableNo:this.tableNo
		},res=>{
			console.log(JSON.stringify(res))
			//wt.close()
			if(res.code==0){
				if(!res.data.checkSummary){
					return
				}
				vm.dishesList = res.data.checkDetail
				vm.dishesList2 = res.data.checkDetail
				vm.RoomName = res.data.checkSummary.tableName
				res.data.checkSummary.no=res.data.checkSummary.tableName
				//localStorage.setItem('takeOrderDtos','')
//				let roomObj = JSON.stringify(res.data.checkSummary).replace(/guestAmount/g,'maxGuestAmount').replace(/tableName/g,'name')
//				localStorage.setItem('room',roomObj)
				vm.dishesNum = res.data.checkSummary.guestAmount
				vm.totalPrice = res.data.checkSummary.sumMoney
				vm.dishesList.map(res=>{
					vm.totalNum += Math.floor(res.amount)
				})
				
			}else{
				//localStorage.setItem('takeOrderDtos','')
				mui.toast(res.msg)
			}
		})
	},
	mounted(){
		
		
	},
	filters: {
      /* 格式化时间戳 */
      formatDate (val) {
      	let arr = []
		vm.dishesList2.map(res=>{
			arr.push(res.bigkindNo)
		})
        processArr = arr.filter(function(value) {
            return value == val;
        })
        return processArr.length;
        
      }
   	},
	methods:{
		chooseBigClassify(no,index){//根据大类id获取所点菜品
			console.log(no)
			if(this.allBig == index){
				return
			}
			this.allBig = index
			let arr2 = []
			this.dishesList = this.dishesList2
			this.dishesList.map(res=>{
				if(res.bigkindNo==no){
					arr2.push(res)
				}
			})			
			this.dishesList = arr2
		},
		classifyActive(index){//点击选择菜品分类 （上）
			console.log(index)
			this.i == index
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
		},
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
		okTap(){//确定退菜
			if(this.operatorNo==''||this.operatorPW==''){
				mui.toast('请输入操作员编码和密码~')
				return
			}
			mui('.dialog_bl').button('loading');//切换为loading状态
			let data = {
				  "amount": this.tuicaiNumber,
				  "dishNo": this.dishNo,
				  "localNo": localNo,
				  "operatorNo":this.operatorNo,//操作员
				  "operatorPW": this.operatorPW,//密码
				  "remark": this.remark,
				  "tableNo":this.tableNo
			}
			console.log(JSON.stringify(data))
			repcallPost('order/dishes/foodBack',data,res=>{
				console.log(JSON.stringify(res))
				mui('.dialog_bl').button('reset');//切换为loading状态
				if(res.code==0){
					this.isDialog=false
					mui.toast(res.msg)
					location.reload()
				}else{
					if(res.data){
						mui.toast(res.data)
					}else{
						mui.toast(res.msg)
					}
				}
			})
		},
		tuicai(item){//点击退菜
			this.dishNo=item
			console.log(item)
			this.isDialog = true
		},
		addOrder(){//加菜
			mui.openWindow({
				url:'orderDishes.html',
				id:'orderDishes'
			})
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
