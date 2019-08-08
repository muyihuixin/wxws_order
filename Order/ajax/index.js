openIndexedDB(loadTableData);
function loadTableData() {

}

function delById(id) {
	console.log(id)
	if (!db || !id) {
	    return;
	}
	// 创建一个事务
	var transaction = db.transaction(personStore, 'readwrite');
	
	// 通过事务来获取store
	var store = transaction.objectStore(personStore);
	
	// 删除请求
	var index = store.index('name');
	var delPersonRequest = store.delete(id);
	delPersonRequest.onsuccess = function (e) {
	    loadTableData(); // 删除成功后，重新加载数据
	    console.log('清除数据成功')
	}
	delPersonRequest.onerror = function (e) {
	   console.log('清除数据失败')
	}
}
var dataLength = 100
var time = 0
function getallTable(){
	return new Promise((resolve, reject) => {

		repcall('order/dishes/getAllTableList','',res=>{
			console.log(res)
			var arrTableList = []
			if(res.code==0){
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name:'allTable',data:res.data,id:6});
				addPersonRequest.onsuccess = function (e) {
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据
				}
				addPersonRequest.onerror = function (e) {
					console.log('更新成功');
				    console.log(e.target.error);
				}
				resolve(res)
			}else{
				mui.toast('请求失败')
			}
		})
	})
}
function getallWaiter(){
	return new Promise((resolve, reject) => {
		repcall('order/dishes/getWaiterList','',res=>{
			console.log(res)
			
			if(res.code==0){
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name: 'allWaiter',data:res.data,id:2});
				addPersonRequest.onsuccess = function (e) {
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据 
				}
				addPersonRequest.onerror = function (e) {
				    console.log('更新失败');
				}
				resolve(res)

			}
		})
	})
}
function getallBigDishesList(){
	return new Promise((resolve, reject) => {
		repcall('order/dishes/getDishBigKindList','',res=>{
			console.log(res)
			if(res.code==0){
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name: 'allBigDishesList',data:res.data,id:3});
				addPersonRequest.onsuccess = function (e) {
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据 
				}
				addPersonRequest.onerror = function (e) {
				    console.log('更新失败');
				}
				resolve(res)

			}
		})
	})
}
function getallSmallDishesList(){
	return new Promise((resolve, reject) => {
		repcall('order/dishes/getDishkindList','',res=>{
			console.log(res)
			if(res.code==0){
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name: 'allSmallDishesList',data:res.data,id:4});
				addPersonRequest.onsuccess = function (e) {
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据 
				}
				addPersonRequest.onerror = function (e) {
				    console.log('更新失败');
				}
				resolve(res)

			}
		})
	})
}
function getallDishes(){
	return new Promise((resolve, reject) => {
		repcall('order/dishes/getDishList','',res=>{
			console.log(res)
			
			if(res.code==0){
				resolve(res)
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name: 'allDishes',data:res.data,id:5});
				addPersonRequest.onsuccess = function (e) {
					//初始化//显示进度条//进度条加10
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据 
				}
				addPersonRequest.onerror = function (e) {
				    console.log('更新失败');
				}
				
			}
		})
	})
}
function getallTaste(){//获取菜品口味
	return new Promise((resolve, reject) => {
		repcall('order/dishes/tasteList','',res=>{
			console.log(res)
			
			if(res.code==0){
				resolve(res)
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name: 'allTaste',data:res.data,id:8});
				addPersonRequest.onsuccess = function (e) {
					//初始化//显示进度条//进度条加10
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据 
				}
				addPersonRequest.onerror = function (e) {
				    console.log('更新失败');
				}
				
			}
		})
	})
}
function getalloperatorList(){//获取操作员列表
	return new Promise((resolve, reject) => {
		repcall('order/dishes/operatorList','',res=>{
			console.log(res)
			
			if(res.code==0){
				resolve(res)
				time++
		 		let lineProgress = (time/dataLength).toFixed(2)*100;
		 		vm.lineProgress = lineProgress.toFixed(0)
				console.log(vm.lineProgress)
				 // 创建一个事务
		 	 	var transaction = db.transaction(personStore, 'readwrite');
		  		// 通过事务来获取store
		  		var store = transaction.objectStore(personStore);
				var addPersonRequest = store.put({ name: 'alloperatorList',data:res.data,id:7});
				addPersonRequest.onsuccess = function (e) {
					//初始化//显示进度条//进度条加10
				    console.log('更新成功');
				    loadTableData(); // 添加成功后重新加载数据 
				}
				addPersonRequest.onerror = function (e) {
				    console.log('更新失败');
				}
				
			}
		})
	})
}
// 添加用户--获取所有得数据进行存储
function addPerson() {
	  if (!db) {
	    return;
	  }

 	//获取所有餐桌信息

	 	 
	 //获取所有服务员
	 	
	 //获取菜品类别列表---大类
	 	
	
	 //获取菜品类别列表--小类
	 	
	 //获取所有菜品列表
	 	
//	})
}

function addPersonImg(){
	if (!db) {
	    return;
	}
//			return new Promise((resolve, reject) => {
	//获取所有获取资源名称--菜品图片dish/11/11003.jpg   视频av/1.mp4   类别图片kind/"0301.jpg
 	repcall2('order/download/getResourceName','',res=>{
		console.log(res)
		if(res.code==0){
//						resolve(res)
			var length = res.data.dish.length +  res.data.av.length +  res.data.kind.length 
			var time = 0
			if(res.data.dish.length>0){
				console.log(res.data.dish.length)
				res.data.dish.forEach((res)=>{
				 	getBase64('dish/'+res,length).then(res=>{
				 		time++
				 		let lineProgress = (time/length).toFixed(2)*100;
				 		vm.lineProgress = lineProgress.toFixed(0)
		 				console.log(vm.lineProgress)
				 	})
				})
			}
			
			if(res.data.av.length>0){
				res.data.av.map((res)=>{
					getBase64('av/'+res,length).then(res=>{
				 		time++
				 		let lineProgress = (time/length).toFixed(2)*100;
				 		vm.lineProgress = lineProgress.toFixed(0)
				 		console.log(vm.lineProgress)
				 	})
				})
			}
			if(res.data.kind.length>0){
				res.data.kind.map((res,index)=>{
					getBase64('kind/'+res,length).then(res=>{
				 		time++
				 		let lineProgress = (time/length).toFixed(2)*100;
				 		vm.lineProgress = lineProgress.toFixed(0)
				 		console.log(vm.lineProgress)
				 	})
				})
			}
		}
	})		
//			})		
}
//转换为base64格式
function getBase64(imgsrc,index,length){
	return new Promise((resolve, reject) => {
		repcall2('order/download/staticResource',{'str':imgsrc},res=>{
//					console.log(res)
		if(res.code==0){
			 // 创建一个事务
	 	 	var transaction = db.transaction(personStore2, 'readwrite');		
	  		// 通过事务来获取store
	  		var store = transaction.objectStore(personStore2);
			var addPersonRequest = store.put({ name: imgsrc.split('.')[0],data:res.data});
			addPersonRequest.onsuccess = function (e) {
				//初始化//显示进度条//进度条加10
			    console.log('更新成功');
			    loadTableData(); // 添加成功后重新加载数据 
			    resolve(res)
			}
			addPersonRequest.onerror = function (e) {
			    console.log('更新失败');
				    resolve(res)
				}
			}else{
				
			}
		})
	})
}


// 打开数据库
function openIndexedDB(callback) {
	
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
//	delById(1)//清除之前的数据
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
}

