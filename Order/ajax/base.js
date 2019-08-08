var baseUrl = 'http://192.168.10.74:8080/'
//var baseUrl = 'http://192.168.1.105:8080/'

function repcall(url,data,callback){
	mui.ajax(baseUrl+url,{
		data:data,
		dataType:'json',
		type:'get',
//		async:false,//同步，一个一个执行
//		timeout:20000,
		success:callback,
		error:function(err){
			mui.toast('服务器网络错误，请重试')
//			vm.isGengxin = false
//			clearInterval(interval);
//			return
		}
	})
}
function repcallPost(url,data,callback){
	mui.ajax(baseUrl+url,{
		data:data,
		dataType:'json',
		type:'POST',
		headers:{'Content-Type':'application/json'},	 
		timeout:20000,
		success:callback,
		error:function(err){
			mui.toast('服务器网络错误，请重试')
//			wt.close()
			return
		}
	})
}
function repcall2(url,data,callback){
	mui.ajax(baseUrl+url,{
		data:data,
		dataType:'json',
		type:'get',
//		timeout:20000,
		success:callback,
		error:function(err){
			mui.toast('网络错误，请重试')
//			return
		}
	})
}

var db, dbName = 'demoDb', dbVersion =3, personStore = 'person', personStore2 = 'personImg';
// 创建indexedDB对象，兼容各种浏览器
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
if (!indexedDB) {
  mui.alert("你的浏览器不支持IndexedDB");
}
//打开本地数据库
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
}
