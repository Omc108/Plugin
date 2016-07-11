jQuery.noConflict();
(function($, PLUGIN_ID) {
    "use strict";
 
    // プラグインIDの設定
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (conf){
        $('#appNo').val(conf['appNo']);
    }
      
    //　「保存する」ボタン押下時に入力情報を設定し、
    $('#submit').click(function() {

        if (appNo　==　""){
            swal("Error.", "アプリIDが入力されていません", "error");
            return;
        }

        var config = [];
        config['appNo'] = $('#appNo').val();
        kintone.plugin.app.setConfig(config);
    });
     
    //「キャンセル」ボタン押下時の処理
    $('#cancel').click(function() {
            history.back();
    });
})(jQuery, kintone.$PLUGIN_ID);