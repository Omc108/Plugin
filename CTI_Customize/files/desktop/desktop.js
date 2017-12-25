jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    var ShowSweetAlert = function(resultParam) {
        var Options = {};
        // 検索結果リストを作る
        $.each(resultParam, function(i, record){
            Options[record.$id.value] =  '<h1 class="list-main">' + record[conf.list_main].value + '</h1>';
            if (conf.list_sub1) Options[record.$id.value] += '<h2 class="list-sub"> ' + record[conf.list_sub1].value + '</h2>';
            if (conf.list_sub2) Options[record.$id.value] += '<h2 class="list-sub"> ' + record[conf.list_sub2].value + '</h2>';
        });        
        // 検索結果を Sweet Alert2 表示
        swal({
            title: '検索結果が複数あります。',
            html: 'いずれか一つを選択ください。',
            type: 'info',
            input: 'radio',
            width: '600px',
            inputOptions: Options,
            inputValidator: function (result) {
                return new Promise(function (resolve, reject) {
                    if (result) {
                        resolve();
                    } else {
                        resolve('エラー：いずれかを選択ください。');
                    }
                });
            },
            inputClass: 'custom-radio',
            confirmButtonText: 'Select',
            showCancelButton: true
        }).then(function(result) {
            if (result.value) {
                location.href = '/k/' + kintone.app.getId() + '/show#record=' + result.value;
            }
        });
    }

    var SearchForQuery = function() {
        var query = kintone.app.getQuery();
        var param = {};
        param.app = kintone.app.getId();
        param.query = query;
        kintone.api('/k/v1/records', 'GET', param).then(function(resp) {
            if (resp.records.length !== 1) {
                ShowSweetAlert(resp.records);
            } else {
                location.href = '/k/' + kintone.app.getId() + '/show#record=' + resp.records[0].$id.value;
            }
        });
    };

    kintone.events.on('app.record.index.show', SearchForQuery);
})(jQuery, kintone.$PLUGIN_ID);