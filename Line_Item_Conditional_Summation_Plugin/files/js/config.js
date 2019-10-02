/* Subtotal Totalization Plug-in
   Copyright (c) 2018 Cybozu
   Licensed under the MIT License */
jQuery.noConflict();
var errorText;
if (kintone.getLoginUser().language === 'ja') {
    errorText = kintone_Conditional_Summation_Plugin.Error.ja;
} else {
    errorText = kintone_Conditional_Summation_Plugin.Error.en;
}
var tr = '.kintoneplugin-table tbody tr';
(function($, PLUGIN_ID) {
    'use strict';
    var conf_table;
    // プラグインIDの設定を取得
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
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
        if ($(tr).length <= 2) {
            $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'none');
        }
    }
   // 過去の設定値を代入
    var setDefault = function() {
        if (conf_table) {
            $('.condition-a').val(conf.condition_a);
            $('.condition-b').val(conf.condition_b);
            $('.subtable-query').val(conf.subtable_query);
            $('.subtable-result').val(conf.subtable_result);
            if (conf.service === 'choice') {
                $('#totalization-type-choice').attr('checked', true);
                $('#totalization-type-subtable').attr('checked', false);
            } else if (conf.service === 'subtable') {
                $('#totalization-type-choice').attr('checked', false);
                $('#totalization-type-subtable').attr('checked', true);
            }
            // サブテーブル内の初期配置
            $.map(conf_table, function(n, i) {
                $(tr).eq(i + 1).find('.condition-a-value').val(n.condition_a_value);
                if (n.condition_b_value !== ' ----- ') {
                    $(tr).eq(i + 1).find('.condition-b-value').val(n.condition_b_value);
                }
                $(tr).eq(i + 1).find('.result-select').val(n.result_select);
                $(tr).eq(i + 1).find('.num-select').val(n.num_select);
            });
        }
        return;
    };
    // 選択肢の設定
    var setValues = function() {
        var param = {};
        param.app = kintone.app.getId();
        // フォームの設計情報を取得し、選択項目に代入
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            $.each(resp.properties, function(i) {
                var prop = resp.properties[i];
                var $option = $('<option>');
                switch (prop.type) {
                    case 'NUMBER':
                        $option.attr('value', prop.code);
                        $option.text(prop.label);
                        $('.result-select').append($option.clone());
                    break;

                    case 'SUBTABLE':
                        var subtable_code = prop.code;
                        // condition A を持つサブテーブルなら
                        if (subtable_code === conf.condition_a_table) {
                            $.each(prop.fields, function(i, val) {
                            $option.attr('value', val.code);
                            $option.attr('subtable', subtable_code);
                            if (val.expression) {
                                $option.attr('formula', val.expression);
                            }
                            $option.text(val.label);
                            switch (val.type) {
                                case 'DROP_DOWN':
                                case 'RADIO_BUTTON':
                                case 'CHECK_BOX':
                                case 'MULTI_SELECT':
                                        // 条件項目で選択しているコードならOptionを取得
                                    if (val.code === conf.condition_a) {
                                        $('.condition-a').append($option.clone());
                                        $.each(val.options, function(i, v) {
                                            $option.attr('value', v);
                                            $option.text(v);
                                            $('.condition-a-value').append($option.clone());
                                        });
                                    } else if (val.code === conf.condition_b) {
                                        $('.condition-a').append($option.clone());
                                        $('.condition-b').append($option.clone());
                                        $.each(val.options, function(i, v) {
                                            $option.attr('value', v);
                                            $option.text(v);
                                            $('.condition-b-value').append($option.clone());
                                        });
                                    } else {
                                        $('.condition-a').append($option.clone());
                                        $('.condition-b').append($option.clone());
                                    }
                                break;
                                case 'NUMBER':
                                case 'CALC':
                                    $('.num-select').append($option.clone());
                                break;
                                default : break;
                            }
                        });
                    // じゃなければ
                    } else {
                        $.each(prop.fields, function(i, val) {
                            $option.attr('value', val.code);
                            $option.attr('subtable', subtable_code);
                            $option.text(val.label);
                            switch (val.type) {
                                case 'DROP_DOWN':
                                case 'RADIO_BUTTON':
                                case 'CHECK_BOX':
                                case 'MULTI_SELECT':
                                    $('.condition-a').append($option.clone());
                                break;
                                default : break;
                            }
                        });
                    }
                    break;
                    default : break;
                }
            });
           setDefault();
        }, function(e) {
            swal('Error', errorText.e1 + '\n' +  e, 'error');
        });
    };

    // 条件項目の変更時に、テーブル内の値を取得、反映
    var reloadConditionValueA = function(this_value) {
        var $option = $('<option>');
        var changevalue = $(this_value).val();
        // 初期化
        $option.attr('value', '');
        $option.text(' ----- ');
        $('.condition-b option').remove();
        $('.condition-b').append($option.clone());
        $('.condition-b').val('');
        $(tr).each(function() {
            $(this).find('.num-select option').remove();
            $(this).find('.condition-a-value option').remove();
            $(this).find('.condition-b-value option').remove();
            $(this).find('.num-select').append($option.clone());
            $(this).find('.condition-a-value').append($option.clone());
            $(this).find('.condition-b-value').append($option.clone());
            $('.num-select').val(' ----- ');
            $('.condition-a-value').val('');
            $('.condition-b-value').val('');
        });

        var param = {};
        param.app = kintone.app.getId();
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            $.each(resp.properties, function(i, v) {
                var prop = resp.properties[i];
                switch (prop.type) {
                    case 'SUBTABLE':
                        var subtable_code = prop.code;
                        // Condition A を持つサブテーブルなら
                        if (v.code === $(this_value).find('option:selected').attr('subtable')) {
                            $.each(v.fields, function(i, v) {
                                // Condition A の option を抽出、格納
                                if (v.code === changevalue) {
                                    var optionArr = v.options;
                                    $(tr).each(function() {
                                        var this_tr = this;
                                        $.each(optionArr, function(i, v) {
                                            $option.attr('value', v);
                                            $option.text(v);
                                            $(this_tr).find('.condition-a-value').append($option.clone());
                                        });
                                    });
                                // 同じサブテーブル内のNumberだけ抽出、格納
                                } else if (
                                    v.type === 'NUMBER' ||
                                    v.type === 'CALC'
                                ) {
                                    $(tr).each(function() {
                                        $option.attr('value', v.code);
                                        $option.text(v.label);
                                        if (v.expression) {
                                            $option.attr('formula', v.expression);
                                        }
                                        $(this).find('.num-select').append($option.clone());
                                    });
                                // 同じサブテー(ry
                                } else if (
                                    v.type === 'DROP_DOWN' ||
                                    v.type === 'RADIO_BUTTON' ||
                                    v.type === 'CHECK_BOX' ||
                                    v.type === 'MULTI_SELECT'
                                ) {
                                    $option.attr('value', v.code);
                                    $option.text(v.label);
                                    $option.attr('subtable', subtable_code);
                                    if (v.expression) {
                                        $option.attr('formula', v.expression);
                                    }
                                    $('.condition-b').append($option.clone());
                                }
                            });
                        }
                        break;
                    default: break;
                }
            });
        });
    };

    var reloadConditionValueB = function(this_value) {
        var $option = $('<option>');
        var changevalue = $(this_value).val();
        $option.attr('value', ' ----- ');
        $option.text(' ----- ');
        $(tr).each(function() {
            $(this).find('.condition-b-value option').remove();
            $(this).find('.condition-b-value').append($option.clone());
        });
        var param = {};
        param.app = kintone.app.getId();
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            $.each(resp.properties, function(i, v) {
                $.each(v.fields, function(i, v) {
                    if (v.code === changevalue) {
                        var optionArr = v.options;
                        $(tr).each(function() {
                            var this_tr = this;
                            $.each(optionArr, function(i, v) {
                                $option.attr('value', v);
                                $option.text(v);
                                $(this_tr).find('.condition-b-value').append($option.clone());
                            });
                        });
                    }
                });
            });
        });
    };

    $(document).on('change', '.condition-a', function(event) {
        reloadConditionValueA(this);
    });
    $(document).on('change', '.condition-b', function(event) {
        reloadConditionValueB(this);
    });

    //「＋」ボタンを押下した際に行を増やす
    $(document).on('click', '.kintoneplugin-button-add-row-image', function(event) {
        if ($(tr).length <= 30) {
            $(tr).eq(0).clone().insertAfter($(event.currentTarget).parent().parent());
            if ($(tr).length >= 3) {
                $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'inline');
            }
        } else {
            swal('Error', errorText.e2, 'error');
        }
    });

    //「－」ボタンを押下した際に行を減らす
    $(document).on('click', '.kintoneplugin-button-remove-row-image', function(event) {
        $(event.currentTarget).parent().parent().remove();
        if ($(tr).length <= 2) {
            $(tr).eq(1).find('.kintoneplugin-button-remove-row-image').css('display', 'none');
        }
    });

    // エラー処理まとめ
    var checkError = function(table) {
        var error_word = [];
        var deplicate_check = [];
        if ($('.condition-a').val() === '') error_word.push(errorText.e3);
        if ($('.condition-a').val() === $('.condition-b').val()) error_word.push(errorText.e4);
        if ($('.condition-b').val() !== '' && $('.condition-a option:selected').attr('subtable') !== $('.condition-b option:selected').attr('subtable')) error_word.push(errorText.e5);
        // テーブル内
        $.each(table, function(i, row) {
            i = i + 1;
            if (row.condition_a_value === '') error_word.push( i + errorText.e6);
            if (row.num_select === '') error_word.push( i + errorText.e7);
            if (row.num_select_formula && row.num_select_formula.indexOf('^') !== -1) error_word.push( i + errorText.e8);
            if (row.num_select_formula && row.num_select_formula.indexOf('SUM') !== -1) error_word.push( i + errorText.e9);
            // 集計先系
            if (row.result_select === '') error_word.push( i + errorText.e10);
            else if (deplicate_check.indexOf(row.result_select) !== -1) error_word.push(i + errorText.e11);
            else deplicate_check.push(row.result_select);
        });
        // 5件以上あるなら略す
        if (error_word.length !== 0) {
            if (error_word.length > 5) {
                var other_num = error_word.length - 5;
                error_word = error_word.slice(0, 5);
                error_word.push(errorText.hoka + other_num + errorText.ken);
            }
            swal('Error', error_word.join('\n'), 'error');
        }
        else return true;
    };
    //「保存する」ボタン押下時に入力情報を設定
    $('.category-summarization-submit').click(function() {
        var config = {};
        var table = [];
        config.condition_a = $('.condition-a').val();
        config.condition_a_table = $('.condition-a option:selected').attr('subtable');
        config.condition_b = $('.condition-b').val();
        if ($('.condition-b').val() !== '') config.condition_b_table = $('.condition-b option:selected').attr('subtable');
        $(tr).each(function() {
            var obj = {};
            obj.condition_a_value = $(this).find('.condition-a-value').val();
            obj.condition_b_value = $(this).find('.condition-b-value').val();
            obj.result_select = $(this).find('.result-select').val();
            obj.num_select = $(this).find('.num-select').val();
            obj.num_select_table = $(this).find('.num-select option:selected').attr('subtable');
            obj.num_select_formula = $(this).find('.num-select option:selected').attr('formula');
            table.push(obj);
        });
        table.shift();
        if (checkError(table)) {
            config.table = JSON.stringify(table);
            kintone.plugin.app.setConfig(config);
        }
   });
    //「キャンセル」ボタン押下時の処理
    $('.category-summarization-cancel').click(function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);