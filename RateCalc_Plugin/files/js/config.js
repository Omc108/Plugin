jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    // プラグインIDの設定を取得
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    // 設定値を保持する
    function setDefault() {
        if (conf) {
            $('#num-select').val(conf.num);
            $('#space-select').val(conf.space);
            $('#api-key').val(conf.apikey);
            if (conf.service === 'cl') {
                $('#currencylayer').attr('checked', true);
                $('#open-exchange-rates').attr('checked', false);
            } else if (conf.service === 'ocr') {
                $('#currencylayer').attr('checked', false);
                $('#open-exchange-rates').attr('checked', true);
            }
        }
        return;
    }
    // フォーム設計情報を取得し、選択ボックスに代入する
    function setValues() {
        var param = {};
        param.app = kintone.app.getId();
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            for (var key in resp.properties) {
                var prop = resp.properties[key];
                var $option = $('<option>');

                switch (prop.type) {
                    case 'NUMBER':
                        $option.attr('value', prop.code);
                        $option.text(prop.label);
                        $('#num-select').append($option.clone());
                    break;

                    case 'SPACER':
                        $option.attr('value', prop.elementId);
                        $option.text(prop.elementId);
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
        if ($('#num-select').val() === '') {
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
    $('#rate-plugin-submit').on('click', function() {
        if(!checkValues()) return;
        var config = [];
        config.num = $('#num-select').val();
        config.space = $('#space-select').val();
        config.apikey = $('#api-key').val();
        if ($('#currencylayer:checked').val()) config.service = $('#currencylayer:checked').val();
        if ($('#open-exchange-rates:checked').val()) config.service = $('#open-exchange-rates:checked').val();
        kintone.plugin.app.setConfig(config);
    });
    //「キャンセル」ボタン押下時の処理
    $('#rate-plugin-cancel').on('click', function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);