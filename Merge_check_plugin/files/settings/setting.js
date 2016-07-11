jQuery.noConflict();
(function($, PLUGIN_ID) {
    "use strict"; 
    // プラグインIDの設定
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);

    // 既存値のセット
    function setDefault() {
        if (conf){
            $("#select1").val(conf.select1);
            $("#select2").val(conf.select2);
            $("#select3").val(conf.select3);
        }
        return;
    }

    // 既存値のセット
    function setDefault4() {
        if (conf){
            $("#select4").val(conf.select4);
        }
        return;
    }

    //　レコード情報のドロップダウンセット
    function setDropdown_records() {
        // フォーム設計情報を取得し、選択ボックスに代入する
        var url = kintone.api.url("/k/v1/preview/form", true);
        kintone.api(url, "GET", {"app": kintone.app.getId()}, function(resp) {
            var $option_status = $("<option>");
            
            for (var j = 0; j < resp.properties.length; j++) {
                var prop = resp.properties[j];
                var $option = $("<option>");

                switch (prop.type) {
                //文字列1行は1つ目のフィールドに適用
                case "SINGLE_LINE_TEXT":
                        $option.attr("value", escapeHtml(prop.code));
                        $option.text(escapeHtml(prop.label));
                        $("#select1").append($option.clone());
                break;

                //スペースは２つ目のフィールドに適用
                case "SPACER":
                        $option.attr("value", escapeHtml(prop.elementId));
                        $option.text(escapeHtml(prop.elementId));
                        $("#select2").append($option.clone());
                break;
                default : break;
                }
            }
        });
    }

    // 全てのアプリ情報を取得
    function get_apps(ord_offset, ord_limit, ord_records) {
        var offset = ord_offset || 0;
        var limit = ord_limit || 100; 
        var allapps = ord_records || [];
        var url = kintone.api.url("/k/v1/apps", true);

        // アプリ情報を取得し、選択ボックスに代入する
        return kintone.api(url, "GET", {"offset": offset}).then(function(resp){
            allapps = allapps.concat(resp.apps);
            if(resp.apps.length === limit){
                return get_apps(offset + limit, limit, allapps);
            }
            return allapps;
            });
    }

    //　エスケープ処理
    function escapeHtml(htmlstr) {
        return htmlstr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    //　アプリ情報のドロップダウンセット    
    function setDropdown_apps(allapps){

        var $option_status = $("<option>");
        
        for (var j = 0; j < allapps.length; j++) {
            var prop = allapps[j];
            var $option = $("<option>");
            $option.attr("value", escapeHtml(prop.appId));
            $option.text(escapeHtml(prop.name));
            $("#select3").append($option.clone());
        }
    }

    // 「取得」ボタン押下時に指定したアプリのレコード情報をドロップダウンセット
    $('#lookup').click(function setDropdown_lookup() {
        var slct4 = document.getElementById('select4');
        var list = slct4.getElementsByTagName('option');
        
        for(var i =list.length-1;i>=1; i--){　　//　末尾から順にすべて削除
            slct4.removeChild(list[i]);
        }
        // フォーム設計情報を取得し、選択ボックスに代入する
        var url = kintone.api.url("/k/v1/preview/form", true);
        kintone.api(url, "GET", {"app":$("#select3").val()}, function(resp) {
            var $option_status = $("<option>");
            
            for (var j = 0; j < resp.properties.length; j++) {
                var prop = resp.properties[j];
                var $option = $("<option>");

                switch (prop.type) {
                //　文字列1行は1つ目のフィールドに適用
                case "SINGLE_LINE_TEXT":
                        $option.attr("value", escapeHtml(prop.code));
                        $option.text(escapeHtml(prop.label));
                        $("#select4").append($option.clone());
                break;
                default : break;
                }
            }
        });
    });

    //　「保存する」ボタン押下時に入力情報を設定し、
    $('#submit').click(function() {
        var config = [];
        config.select1 = $('#select1').val();
        config.select2 = $('#select2').val();
        config.select3 = $('#select3').val();
        config.select4 = $('#select4').val();
        
        kintone.plugin.app.setConfig(config);
    });
     
    //　「キャンセル」ボタン押下時の処理
    $('#cancel').click(function() {
        history.back();
    });

    setDropdown_records();

    get_apps().then(function(allapps){
        setDropdown_apps(allapps);
    
    }).then(function(){
        setDefault();
    
    }).then(function(){
        // フォーム設計情報を取得し、選択ボックスに代入する
        if($("#select3").val()){
            var url = kintone.api.url("/k/v1/preview/form", true);
            kintone.api(url, "GET", {"app":$("#select3").val()}).then(function(resp) {
                var $option_status = $("<option>");
                
                for (var j = 0; j < resp.properties.length; j++) {
                    var prop = resp.properties[j];
                    var $option = $("<option>");

                    switch (prop.type) {
                    //　文字列1行は1つ目のフィールドに適用
                    case "SINGLE_LINE_TEXT":
                            $option.attr("value", escapeHtml(prop.label));
                            $option.text(escapeHtml(prop.label));
                            $("#select4").append($option.clone());
                    break;
                    default : break;
                    }
                }

            }).then(function(){
                setDefault4();
            
            });
        }
    });

})(jQuery, kintone.$PLUGIN_ID);