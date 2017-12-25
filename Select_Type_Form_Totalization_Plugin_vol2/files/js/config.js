jQuery.noConflict();
const tr = '.kintoneplugin-table tbody tr';
(function($, PLUGIN_ID) {
    'use strict';
    // プラグインIDの設定を取得
    var conf_table;
    const conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (!conf || Object.keys(conf).length !== 0) {
        conf_table = JSON.parse(conf.table);
    }
    // テーブル行を生成
    if (!conf || Object.keys(conf).length === 0) {
        $('.kintoneplugin-table tbody').append($(tr).eq(0).clone());
        $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'none');
    } else {
        $.each(conf_table, function(i) {
            $('.kintoneplugin-table tbody').append($(tr).eq(0).clone());
        });
        if ($(tr).length <= 2) $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'none');
    }
   // 過去の設定値を代入
    const setDefault = function() {
        if (conf) {
            $.map(conf_table, function(n, i) {
                $(tr).eq(i + 1).find('.num-select').val(n.totalization_num);
                $(tr).eq(i + 1).find('.word-input').val(n.totalization_word);
                $(tr).eq(i + 1).find('.method-select').val(n.totalization_method);
                if (n.totalization_method !== 'count') {
                    $(tr).eq(i + 1).find('.word-input').attr('disabled', 'disabled');
                    $(tr).eq(i + 1).find('.word-input').val('');
                    $(tr).eq(i + 1).find('.word-input').css({
                        'background-color': '#E4E6E7',
                        'cursor': 'not-allowed'
                    });
                }
                $(tr).eq(i + 1).find('.kintoneplugin-dropdown-list-item').each(function(){
                    $.each(n.totalization_fields, function(i, val){
                        if (val.code === $(this).children('span').attr('value')) $(this).addClass('kintoneplugin-dropdown-list-item-selected');
                    }.bind(this));
                });
                $(tr).eq(i + 1).find('.kintoneplugin-dropdown-list-item-name-blue').text($(tr).eq(i + 1).find('.kintoneplugin-dropdown-list-default').siblings('.kintoneplugin-dropdown-list-item-selected').length);
            });
        }
        return;
    };
    // エスケープ処理
    const escapeHtml = function(htmlstr) {
        return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };
    // 選択肢の設定
    const setValues = function() {
        let param = {};
        param.app = kintone.app.getId();
        // フォームの設計情報を取得し、選択項目に代入
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            $.each(resp.properties, function(i) {
                const prop = resp.properties[i];
                const $option = $('<option>');
                const $div = $('<div class="kintoneplugin-dropdown-list-item">');
                const $span = $('<span class="kintoneplugin-dropdown-list-item-name">');
                switch (prop.type) {
                    case 'NUMBER':
                        $option.attr('value', escapeHtml(prop.code));
                        $option.text(prop.label);
                        $('.num-select').append($option.clone());
                    break;

                    case 'CHECK_BOX':
                    case 'MULTI_SELECT':
                    case 'DROP_DOWN':
                    case 'RADIO_BUTTON':
                        $span.attr('value', escapeHtml(prop.code));
                        $span.text(prop.label);
                        $div.append($span.clone());
                        $('.totalization-fields').append($div.clone());
                    break;

                    case 'SUBTABLE':
                        let subtable_code = prop.code;
                        $.each(prop.fields, function(i, val) {
                            switch (val.type) {
                                case 'CHECK_BOX':
                                case 'MULTI_SELECT':
                                case 'DROP_DOWN':
                                case 'RADIO_BUTTON':
                                    $span.attr('value', escapeHtml(val.code));
                                    $span.attr('subtable', subtable_code);
                                    $span.text(val.label);
                                    $div.append($span.clone());
                                    $('.totalization-fields').append($div.clone());
                                    $div.empty();
                                break;
                                default : break;
                            }
                        });
                    break;
                    default : break;
                }
            });
            // 複数選択項目で選択した値の横にチェック and カウント
            $(document).on('click', '.kintoneplugin-dropdown-list-item', function(event) {
                let _self = event.currentTarget;
                if ($(_self).hasClass('kintoneplugin-dropdown-list-item-selected')) $(_self).removeClass('kintoneplugin-dropdown-list-item-selected');
                else $(_self).addClass('kintoneplugin-dropdown-list-item-selected');
                $(_self).siblings('.kintoneplugin-dropdown-list-default').find('.kintoneplugin-dropdown-list-item-name-blue').text($(_self).siblings('.kintoneplugin-dropdown-list-default').siblings('.kintoneplugin-dropdown-list-item-selected').length);
            });
            // 複数選択項目を折り畳む
            $(document).on('click', '.kintoneplugin-dropdown-list-toggle', function(event) {
                $(event.currentTarget).prev('.kintoneplugin-dropdown-list').find('.kintoneplugin-dropdown-list-item').slideToggle();
            });
            // 集計方法がCOUNT以外の場合、集計ワードをグレーアウト
            $(document).on('change', '.method-select', function(event) {
                let _self = event.currentTarget;
                const $input = $(_self).parent().parent().parent().parent().parent().next().find('.word-input');
                if ($(_self).val() !== 'count') {
                    $input.attr('disabled', 'disabled');
                    $input.val('');
                    $input.css({
                        'background-color': '#E4E6E7',
                        'cursor': 'not-allowed'
                    });
                } else {
                    $input.removeAttr('disabled');
                    $input.css({
                        'background-color': '#ffffff',
                        'cursor': 'auto'
                    });
                }
            });
           setDefault();
        }, function(e) {
            swal('Error', 'apiの取得に失敗しました。再度読み込んでください。\n' +  e, 'error');
        });
    };
    //「＋」ボタンを押下した際に行を増やす
    $(document).on('click', '.kintoneplugin-button-add-row-image', function(event) {
        if ($(tr).length <= 20) {
            $(tr).eq(0).clone().insertAfter($(event.currentTarget).parent().parent());
            if ($(tr).length >= 3) $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'inline');
        } else {
            swal('Error', '設定行は20行までです。', 'error');
        }
    });
    //「－」ボタンを押下した際に行を減らす
    $(document).on('click', '.kintoneplugin-button-remove-row-image', function(event) {
        $(event.currentTarget).parent().parent().remove();
        if ($(tr).length <= 2) $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'none');
    });
    // エラー処理
    const checkError = function(table) {
        let error_word = [];
        let deplicate_check = [];
        $.each(table, function(i, row) {
            i = i + 1;
            if (row.totalization_num === '') error_word.push( i + '行目の集計結果フィールドが選択されておりません');
            else if (deplicate_check.indexOf(row.totalization_num) !== -1) error_word.push(i + '行目の集計結果フィールドが他の行と重複しています。');
            else deplicate_check.push(row.totalization_num);
            if (row.totalization_method === 'count' && row.totalization_word === '') error_word.push(i + '行目の集計ワードが選択されておりません');
            if (row.totalization_fields.length === 0) error_word.push(i + '行目の集計対象フィールドが選択されておりません');
        });
        if (error_word.length !== 0) {
            if (error_word.length > 5) {
                let other_num = error_word.length - 5;
                error_word = error_word.slice(0, 5);
                error_word.push('他' + other_num + '件');
            }
            swal('Error', error_word.join('\n'), 'error');
        }
        else return true;
    };
    //「保存する」ボタン押下時に入力情報を設定
    $('.totalization-submit').click(function() {
        const config = {};
        const table = [];
        $(tr).each(function(){
            const obj = {};
            obj.totalization_num = $(this).find('.num-select').val();
            obj.totalization_method = $(this).find('.method-select').val();
            obj.totalization_word = $(this).find('.word-input').val();
            obj.totalization_fields = [];
            $.each($(this).find('.kintoneplugin-dropdown-list-item-selected'), function(i){
                obj.totalization_fields[i] = {};
                obj.totalization_fields[i].code = $(this).children('span').attr('value');
                obj.totalization_fields[i].subtable_code = $(this).children('span').attr('subtable');
            });
            table.push(obj);
        });
        table.shift();
        if (checkError(table)) {
            config.table = JSON.stringify(table);
            kintone.plugin.app.setConfig(config);
        }
   });
    //「キャンセル」ボタン押下時の処理
    $('.totalization-cancel').click(function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);