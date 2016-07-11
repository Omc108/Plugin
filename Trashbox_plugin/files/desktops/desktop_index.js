
(　function(PLUGIN_ID){
	"use strict"

	var indexEvent  = ['app.record.index.show']
	var deleteEvent = ['app.record.index.delete.submit']
	var length; // コメントの個数チェック関数

	kintone.events.on(indexEvent, function(event){

		var formtemp = [];
		//Local Storageを展開
		if(('localStorage' in window) && (window.localStorage !== null)) {
	    	console.log('Local storage is usable.');// ローカルストレージがあるとき
	    	localStorage.clear();
		} else {
    		console.log('Local strage is unusable...');// ないとき
    		return;
		}

		//フォーム情報からtype指定でフィールドコードを取得
        var url = kintone.api.url("/k/v1/preview/form", true);
        kintone.api(url, "GET", {"app": kintone.app.getId()}, function(resp) {
			for(var i = 0; i < resp.properties.length; i++){
				if (resp.properties[i].type !== "LABEL" &
				    resp.properties[i].type !== "SPACER" &
				    resp.properties[i].type !== "HR" &
				    resp.properties[i].type !== "REFERENCE_TABLE" &
				    resp.properties[i].type !== "RECORD_NUMBER" &
				    resp.properties[i].type !== "CREATOR" &
				    resp.properties[i].type !== "CREATED_TIME" &
				    resp.properties[i].type !== "MODIFIER" &
				    resp.properties[i].type !== "UPDATED_TIME" &
				    resp.properties[i].type !== "CALC"){
						formtemp.push(resp.properties[i].code);
				}
			}
		//Local Storageにフォーム情報を保存
		localStorage.setItem('temp', formtemp);
		})
	});

	kintone.events.on(deleteEvent, function(event){

		var record = event.record;
		var recNo = event.recordId;
		var appId = event.appId;

		//Local Storageの値を読み込み
		var data = localStorage.getItem('temp');

		var getUrl = '/k/v1/records';
		var getbody = {};
			getbody.app = appId;
			getbody.query = '$id = '+ recNo; 
			getbody.fields = data;

		kintone.api(getUrl, 'GET', getbody, function(resp) {
			var resp = resp;

			//設定値読み込み変数
			var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
			var appNo = conf.appNo;

			var body = {"app": appNo, "record": resp.records[0]};
			var postUrl = '/k/v1/record';
			kintone.api(postUrl, "POST", body, function(resp) {
			console.log("Complete.");
			});
		});
	});

})(kintone.$PLUGIN_ID);
