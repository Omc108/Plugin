jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    // プラグインIDの設定を取得
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    // 設定値を保持する
    function setDefault() {
        if (conf){
            $('#lookup-select').val(conf.lookup_selected);
            $('#space-select').val(conf.space_selected);
            if (conf.auto_flag === 'on') $('#auto-flag').attr('checked', true);
            else $('#auto-flag').attr('checked', false);
            if (conf.create_toggle === 'on') $('#create-toggle').attr('checked', true);
            else $('#create-toggle').attr('checked', false);
            if (conf.reload_toggle === 'on') $('#reload-toggle').attr('checked', true);
            else $('#reload-toggle').attr('checked', false);
        }
        return;
    }
    // エスケープ処理
    function escapeHtml(htmlstr) {
        return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    // フォーム設計情報を取得し、選択ボックスに代入する
    function setValues(){
        var param = {};
        param.app = kintone.app.getId();
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            for (var key in resp.properties) {
                var prop = resp.properties[key];
                var $option = $('<option>');

                switch (prop.type) {
                    case 'SINGLE_LINE_TEXT':
                    case 'NUMBER':
                        if (!prop.relatedApp) break;
                        $option.attr('value', escapeHtml(prop.code));
                        $option.text(escapeHtml(prop.label));
                        $('#lookup-select').append($option.clone());
                    break;

                    case 'SPACER':
                        $option.attr('value', escapeHtml(prop.elementId));
                        $option.text(escapeHtml(prop.elementId));
                        $('#space-select').append($option.clone());
                        break;

                    default :
                        break;
                }
            }
            setDefault();
        });
    }
    // エラーチェック
    function checkValues() {
        if ($('#lookup-select').val() === '') {
            swal('Error!', 'ルックアップフィールドは必須です。', 'error'); 
            return false;
        }
        if ($('#space-select').val() === '') {
            swal('Error!', 'スペースフィールドは必須です。', 'error');
            return false;
        }
        return true;
    }
    //「保存する」ボタン押下時に入力情報を設定する
    $('#lookup-plugin-submit').click(function() {
        var config = [];
        var param = {};
        param.app = kintone.app.getId();

        // ルックアップ元のフィールドタイプを判別
        return kintone.api('/k/v1/preview/app/form/fields', 'GET', param).then(function(resp){
            config.lookup_key = resp.properties[$('#lookup-select').val()].lookup.relatedKeyField;
            param.app = resp.properties[$('#lookup-select').val()].lookup.relatedApp.app;

            return kintone.api('/k/v1/preview/app/form/fields', 'GET', param);
        }).then(function(resp){
            var key_param = resp.properties[config.lookup_key];
            config.lookup_selected = $('#lookup-select').val();
            config.space_selected = $('#space-select').val();
            if ($('#auto-flag:checked').val()) config.auto_flag = $('#auto-flag:checked').val();
            if ($('#create-toggle:checked').val()) config.create_toggle = $('#create-toggle:checked').val();
            // 更新機能のエラーチェック
            if ($('#reload-toggle:checked').val()){
                if (key_param.type === 'RECORD_NUMBER' || key_param.unique === true) {
                     config.reload_toggle = $('#reload-toggle:checked').val();
                     config.reload_type = key_param.type;
                } else {
                    swal({
                        title: 'Error!',
                        text: '更新機能が有効化出来ない設定です。<br >ルックアップの設定をご確認ください。',
                        type: 'error',
                        html: true
                    });
                    return;
                }
            }
            if (checkValues()) {
                kintone.plugin.app.setConfig(config);
            }
        });
    });
    //「キャンセル」ボタン押下時の処理
    $('#lookup-plugin-cancel').click(function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);