jQuery.noConflict();
(function($, PLUGIN_ID) {
	'use strict';
        var events = ['app.record.create.show', 'app.record.edit.show'];
	kintone.events.on(events, function(event){
                var conf = kintone.plugin.app.getConfig(PLUGIN_ID);

                // 追加ボタンを表示
                if (document.getElementById ('lookup-plugin-btn') !== null) return;
                var $div = $('<div id="lookup-plugin-btn" style="margin: 34px 0 0 -6px;"></div>');
                var $create_btn =$('<button id="create" type="button">新規</button>');
                var $reload_btn =$('<button id="reload" type="button">更新</button>');
                var btn_style = {
                        'background-color':'transparent',
                        'color':'#3498db',
                        'height': '38px',
                        'box-sizing': 'border-box',
                        'padding': '0 8px',
                        'border': '1px solid transparent'
                };
                $create_btn.css(btn_style);
                $reload_btn.css(btn_style);
                if (conf.create_toggle === 'on') $div.append($create_btn);
                if (conf.reload_toggle === 'on') $div.append($reload_btn);
                var $btn_area = $(kintone.app.record.getSpaceElement(conf.space_selected));
                $btn_area.append($div);

                // 新規登録処理
                var lookupId = kintone.app.getLookupTargetAppId(conf.lookup_selected);
                $('#create').on('click', function(){
                        var newer;
                        var param = {};
                        param.app = lookupId;
                        param.query = 'order by $id desc';
                        // 保存されていない時は自動取得しない
                        kintone.api('/k/v1/records', 'GET', param, function(resp){
                                newer = resp.records[0].$id.value;
                        });
                        var record = kintone.app.record.get();
                        var lookup = record.record[conf.lookup_selected];
                        lity('/k/' + lookupId + '/edit');
                        // 自動取得
                        if (conf.auto_flag) {
                                $(document).on('lity:close', function(){
                                        return kintone.api('/k/v1/records', 'GET', param).then(function(resp){
                                                if (resp.records[0].$id.value !== newer) {
                                                        lookup.value = resp.records[0][conf.lookup_key].value;
                                                        lookup.lookup = true;
                                                        kintone.app.record.set(record);
                                                        $(document).off('lity:close');
                                                }
                                        });
                                });
                        }
                });
                // 更新処理
                $('#reload').on('click', function(){
                        var record = kintone.app.record.get();
                        var lookup = record.record[conf.lookup_selected];
                        // ルックアップに値が入っていない場合
                        if (!lookup.value) {
                                lookup.error = 'Error : No value.';
                                kintone.app.record.set(record);
                                return;
                        }
                        // ルックアップ値がレコード番号
                        if (conf.reload_type === 'RECORD_NUMBER') {
                                lity('/k/' + lookupId + '/show#record=' + lookup.value + '&mode=edit&tab=none');
                        // ルックアップ値が重複禁止フィールド
                        } else { 
                                var param = {};
                                param.app = lookupId;
                                param.query = conf.lookup_key + ' = \"' + lookup.value + '\"';
                                kintone.api('/k/v1/records', 'GET', param, function(resp){
                                        lity('/k/' + lookupId + '/show#record=' + resp.records[0].$id.value + '&mode=edit&tab=none');
                                });
                        }
                        // 自動取得
                        if (conf.auto_flag) {
                                $(document).on('lity:close', function(){
                                        lookup.lookup = true;
                                        kintone.app.record.set(record);
                                        $(document).off('lity:close');
                                });
                        }
                });
	});
})(jQuery, kintone.$PLUGIN_ID);