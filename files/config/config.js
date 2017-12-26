jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    // プラグインIDの設定を取得
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    // 設定値を保持する
    function setDefault() {
        if (conf){
            $('#search-key').val(conf.list_main);
            $('#list-main').val(conf.list_main);
            $('#list-sub1').val(conf.list_sub1);
            $('#list-sub2').val(conf.list_sub2);            
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
                        $option.attr('value', escapeHtml(prop.code));
                        $option.text(escapeHtml(prop.label));
                        $('#search-key').append($option.clone());
                        $('#list-main').append($option.clone());
                        $('#list-sub1').append($option.clone());
                        $('#list-sub2').append($option.clone());
                        break;
                    default: break;
                }
            }
            setDefault();
        });
    }
    // エラーチェック
    function checkValues() {
        if ($('#list-main').val() === '') {
            swal('Error!', '必須項目です。', 'error'); 
            return false;
        }
        if ($('#search-key').val() === '') {
            swal('Error!', '必須項目です。', 'error'); 
            return false;
        }
        return true;
    }
    //「保存する」ボタン押下時に入力情報を設定する
    $('#lookup-plugin-submit').click(function() {
        if(!checkValues()) return;
        var config = [];
        config.search_key = $('#search-key').val();
        config.list_main = $('#list-main').val();
        config.list_sub1 = $('#list-sub1').val();
        config.list_sub2 = $('#list-sub2').val();
        kintone.plugin.app.setConfig(config);
    });
    //「キャンセル」ボタン押下時の処理
    $('#lookup-plugin-cancel').click(function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);