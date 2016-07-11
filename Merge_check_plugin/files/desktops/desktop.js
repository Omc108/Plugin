(function(PLUGIN_ID){
	"use strict";

	var conf = kintone.plugin.app.getConfig(PLUGIN_ID);

	// プラグインの設定値を読み込む
	if(!conf) {
		return false;
	}
	var conf1 = conf.select1;
	var conf2 = conf.select2;
	var conf3 = conf.select3;
	var conf4 = conf.select4;

	var ev1 = ['app.record.create.show','app.record.edit.show'];
	var ev2 = ['app.record.create.change.'+ conf1 ,'app.record.edit.change.' + conf1];

	kintone.events.on (ev1, function(event1) {
		var record = event1.record;

		// チェックボタンを生成
		if (document.getElementById ('mergebtn') !== null) {return;}　// 増殖バグ防止
		var btn = document.createElement('div'); btn.id = 'btn';
		btn.innerHTML =　
		'<button type="button" id="mergebtn" class="kintoneplugin-button-normal" title="重複チェック">\
		 <i class="fa fa-book fa-original" aria-hidden="true"></i></button>';
		kintone.app.record.getSpaceElement(conf2).appendChild(btn);

		mergebtn.onclick = function(){
			var array = [];
			var flug = 0;
			var param = {};
			param.app = conf3;
			param.fields = ['$id',conf4];

			kintone.api('/k/v1/records', "GET", param, function(resp) {
				for(var i=0; i<resp.records.length; i++){
					//　-1 = 一致しない
					if(resp.records[i][conf4].value.indexOf(record[conf1].value) != -1){
						flug = 1;
						var id = resp.records[i].$id.value;
						// リンクを生成（.jsonはカット）
						var uri = kintone.api.url('/k/');
						uri = uri.substr( 0, uri.length - 5 );
						var url = '<br ><a href="' + uri + conf3 + '/show#record=' + id + '" target="_blank">' + resp.records[i][conf4].value + '</a>';
						array.push(url);
					}
				}
				// 該当レコードが一件以上ある場合
				if(flug === 1){
					swal({
						title:"同じレコードかも？",
						text:'過去に以下の登録があります。' + array,
						type:"warning",
						html:true
					});
				// 該当レコードがない場合
				}else if(flug === 0){
					swal("重複と思われるレコードは\nありませんでした。", '', "success");
				}
			});
		};
	});

	kintone.events.on(ev2, function(event2) {
		var record = event2.record;

		mergebtn.onclick = function(){
			var array = [];
			var flug = 0;
			var param = {};
			param.app = conf3;
			param.fields = ['$id', conf4];
			var url = kintone.api.url('/k');

			kintone.api('/k/v1/records', "GET", param, function(resp) {
				for(var i=0; i<resp.records.length; i++){
					//　-1　= 一致しない
					if(resp.records[i][conf4].value.indexOf(record[conf1].value) != -1){
						flug = 1;
						var id = resp.records[i].$id.value;
						// リンクを生成（.jsonはカット）
						var uri = kintone.api.url('/k/');
						uri = uri.substr( 0, uri.length - 5 );
						var url = '<br ><a href="' + uri + conf3 + '/show#record=' + id + '" target="_blank">' + resp.records[i][conf4].value + '</a>';
						array.push(url);
					}
				}
				// 該当レコードが一件以上ある場合
				if(flug === 1){
					swal({
						title:"同じレコードかも？",
						text:'過去に以下の登録があります。' + array,
						type:"warning",
						html:true
					});
				// 該当レコードがない場合
				}else if(flug === 0){
					swal("重複と思われるレコードは\nありませんでした。",　'', "success");
				}
			});
		};
	});
	
})(kintone.$PLUGIN_ID);