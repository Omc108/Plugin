
(　function(PLUGIN_ID){
	"use strict"

	var detailEvents = ['app.record.detail.show']
	var deleteEvents = ['app.record.detail.delete.submit']
	var length; // コメントの個数チェック関数

	kintone.events.on(detailEvents, function(event){
		var record = event.record;
		var recNo = event.recordId;
		var appId = event.appId;
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
			getData(formtemp, appId, recNo);
		});

		//最新のコメントが無くなるまでコメントを取得する。(とりあえず30件。くそきもい)
		var offset = 0;
		getComment(appId, recNo, offset).done(function(newer){
			if(newer == true){
				offset += 10;
				getComment(appId, recNo, offset).done(function(newer){
					if(newer == true){
						offset += 10;
						getComment(appId, recNo, offset);
					}
				});
			}
		});
	});

kintone.events.on(deleteEvents, function(event){
		
		//　設定値読み込み用変数を作り、ゴミ箱のAppIdを読み込む		
		var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
		var appNo = conf.appNo;

		postRecord(appNo).done(function(appNo, comrecNo){
			for(var i=0; i<length; i++){
				//Local Storageの値を読み込み
				var commentparams = JSON.parse(localStorage.getItem('comment'+i));
				var param = {};
				param.app = appNo;
				param.record = comrecNo;
				param.comment = commentparams;
				var url = '/k/v1/record/comment';
				kintone.api(url, "POST", param);
			}
		});
	});	

	//　項目値読み込み関数
	function getData(formtemp, appId, recNo){	
		var url = '/k/v1/records';
		var param = {};
			param.app = appId;
			param.query = '$id='　+ recNo; 
			param.fields = formtemp;

		kintone.api(url, 'GET', param, function(resp) {
			var jsonresp = JSON.stringify(resp);
			localStorage.setItem('temp', jsonresp);
		});
	};

	//　コメント読み込み関数
	function getComment(appId, recNo, offset){

		var deferred = new $.Deferred();

		var url = "/k/v1/record/comments";
		var param = {};
		param["app"] = appId;
		param["record"] = recNo;
		param["order"] = "asc";
		param["offset"] = offset;
		param["limit"] = 10;

		kintone.api(url, "GET", param, function(resp){
			length = resp.comments.length;
			for(var i=0; i<resp.comments.length; i++){
				var commentparam = {};
				commentparam.comment = {};
				commentparam.text = resp.comments[i].text;
				localStorage.setItem('comment'+ i, JSON.stringify(commentparam));
			}
			var newer = resp.newer;
	        deferred.resolve(newer);
		});
    return deferred.promise();
	}

	// レコード登録
	function postRecord(appNo){
		var deferred = new $.Deferred();
		//Local Storageから項目値を読み込む
		var data = JSON.parse(localStorage.getItem('temp'));

		var body = {"app": appNo, "record": data.records[0]};
		var postUrl = '/k/v1/record';

		kintone.api(postUrl, "POST", body, function(resp) {
			var comrecNo = resp.id;
			deferred.resolve(appNo, comrecNo);
		});
		return deferred.promise();
	}

})(kintone.$PLUGIN_ID);
