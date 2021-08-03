/*  vote Plug-in
    Copyright (c) 2020 Cybozu
    Licensed under the MIT License  */
jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    let tr = '.kintoneplugin-table tbody tr';
    let conf_table;
    let partsHTML = kintoneplugin_partsHTML;
    let langText = kintoneplugin_lang[kintone.getLoginUser().language];

    // プラグインIDの設定取得
    let conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (!conf || Object.keys(conf).length !== 0) conf_table = JSON.parse(conf.table);
    console.log(conf_table);

    // エスケープ処理
    let escapeStr = function(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/'/g, '&quot;')
                  .replace(/'/g, '&#39;');
    };

    // テーブル行を生成
    if (!conf.table || Object.keys(conf).length === 0) {
        $('.kintoneplugin-table tbody').append($(tr).eq(0).clone());
        $(tr).eq(1).find('.kintoneplugin-condition-list').append($('.kintoneplugin-condition-container').eq(0).clone());
        $(tr).eq(1).find('.kintoneplugin-method-list').append($('.kintoneplugin-method-container').eq(0).clone());
        $(tr).eq(1).find('.table-remove-low').css('display', 'none');
        $(tr).eq(1).find('.condition-remove-low').eq(1).css('display', 'none');
        $(tr).eq(1).find('.method-remove-low').eq(1).css('display', 'none');
    } else {
        $.each(conf_table, function(tableRow) {
            $('.kintoneplugin-table tbody').append($(tr).eq(0).clone());
            $.each(conf_table[tableRow].condition, function(conditionRow, conditionValue) {
                $(tr).eq(tableRow + 1).find('.kintoneplugin-condition-list').append($(tr).eq(tableRow + 1).find('.kintoneplugin-condition-container').eq(0).clone());
                switch (conditionValue.condition_field.type) {
                    case 'SINGLE_LINE_TEXT':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.textInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.textInputBox);
                    break;

                    case 'NUMBER':
                    case 'RECORD_NUMBER':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.numInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.numInputBox);
                    break;

                    case 'DROP_DOWN':
                    case 'RADIO_BUTTON':
                    case 'CHECK_BOX':
                    case 'MULTI_SELECT':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.userInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.selectInputBox);
                        function setSelectValue(lang) {
                            let sortArr = [];
                            let param = {};
                            param.app = kintone.app.getId();
                            param.lang = lang;
                            kintone.api('/k/v1/preview/app/form/fields', 'GET', param, function(resp) {
                                $.each(resp.properties, function(i, prop) {
                                    if (prop.code === conditionValue.condition_field.value) {
                                        $.each(prop.options, function(i, option) {
                                            let obj = {};
                                            obj.label = option.label;
                                            obj.index = option.index;
                                            sortArr.push(obj);
                                        });
                                        sortArr.sort(function (a, b) {
                                            return (a.index - b.index);
                                        });
                                        $.each(sortArr, function(i, option) {
                                            let $div = $('<div class="kintoneplugin-dropdown-list-item">');
                                            let $span = $('<span class="kintoneplugin-dropdown-list-item-name">');
                                            $span.attr('value', option.label);
                                            $span.text(option.label);
                                            $div.append($span.clone());
                                            $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-select-' + lang).append($div.clone());
                                        });
                                    }
                                });
                            });    
                        }
                        setSelectValue('ja');
                        setSelectValue('en');
                        setSelectValue('zh');
                    break;

                    case 'STATUS':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.userInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.selectInputBox);
                        function setStatusValue(lang) {
                            let param = {};
                            param.app = kintone.app.getId();
                            param.lang = lang;
                            kintone.api('/k/v1/preview/app/status', 'GET', param, function(resp) {
                                $.each(resp.states, function(i, state) {
                                    let $div = $('<div class="kintoneplugin-dropdown-list-item">');
                                    let $span = $('<span class="kintoneplugin-dropdown-list-item-name">');
                                    $span.attr('value', state.name);
                                    $span.text(state.name);
                                    $div.append($span.clone());
                                    $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-select-' + lang).append($div.clone());
                                });
                            });    
                        }
                        setStatusValue('ja');
                        setStatusValue('en');
                        setStatusValue('zh');
                    break;

                    case 'CREATOR':
                    case 'MODIFIER':
                    case 'STATUS_ASSIGNEE':
                    case 'USER_SELECT':
                    case 'ORGANIZATION_SELECT':
                    case 'GROUP_SELECT':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.userInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.userInputBox);
                    break;

                    case 'TIME':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInputBox);
                    break;

                    case 'DATE':
                    case 'DATETIME':
                    case 'CREATED_TIME':
                    case 'UPDATED_TIME':
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInequalityBox);
                        $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInequalityBox_1);
                        switch (conditionValue.input_value.datetime_inequality) {
                            case '=' :
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select').nextAll().remove();
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.numInputBox);
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input').datepicker({dateFormat: 'yy-mm-dd'});
                            break;

                            case 'FROM_TODAY' :
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select').nextAll().remove();
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInequalityBox_2);
                            break;

                            case 'LAST_WEEK' :
                            case 'THIS_WEEK' : 
                            case 'NEXT_WEEK' : 
                            $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select').nextAll().remove();
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInequalityBox_3);
                            break;

                            case 'LAST_MONTH' : 
                            case 'THIS_MONTH' :
                            case 'NEXT_MONTH' : 
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select').nextAll().remove();
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).append(partsHTML.timeInequalityBox_4);
                            break;

                            default :
                                $(tr).eq(tableRow + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select').nextAll().remove();
                            break;
                        }
                    break;
                }
            });
            $.each(conf_table[tableRow].method, function(methodRow) {
                $(tr).eq(tableRow + 1).find('.kintoneplugin-method-list').append($(tr).eq(tableRow + 1).find('.kintoneplugin-method-container').eq(0).clone());
            });
            if ($(tr).eq(tableRow + 1).find('.kintoneplugin-condition-container').length <= 2) {
                $(tr).eq(tableRow + 1).find('.kintoneplugin-condition-container').eq(1).find('.condition-remove-low').css('display', 'none');
            }        
            if ($(tr).eq(tableRow + 1).find('.kintoneplugin-method-container').length <= 2) {
                $(tr).eq(tableRow + 1).find('.kintoneplugin-method-container').eq(1).find('.method-remove-low').css('display', 'none');
            }        
        });
        if ($(tr).length <= 2) {
            $(tr).eq(1).find('.table-remove-low').css('display', 'none');
        }
    }

    // 保存値をHTMLにSETする
    function setDefault() {
        if (conf) {
            if (conf.coloring === 'true') {
                $('#coloring-condition-field').attr('checked', true);
            } else {
                $('#coloring-condition-field').attr('checked', false);
            }
            // サブテーブル内の初期値配置
            if (conf.table) {
                $.map(conf_table, function(n, i) {
                    $.each(conf_table[i].condition, function(conditionRow, conditionValue) {
                        $(tr).eq(i + 1).find('.kintoneplugin-condition-container').eq(conditionRow + 1).find('.condition-field-select').val(conditionValue.condition_field.value);
                        switch (conditionValue.condition_field.type) {
                            case 'SINGLE_LINE_TEXT':
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-inequality-select').val(conditionValue.inequality);
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input-ja').val(conditionValue.input_value.ja);
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input-en').val(conditionValue.input_value.en);
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input-zh').val(conditionValue.input_value.zh);
                            break;

                            case 'NUMBER':
                            case 'RECORD_NUMBER':
                            case 'TIME':
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-inequality-select').val(conditionValue.inequality);
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input').val(conditionValue.input_value);
                            break;

                            case 'DROP_DOWN':
                            case 'RADIO_BUTTON':
                            case 'CHECK_BOX':
                            case 'MULTI_SELECT':
                            case 'STATUS':
                                $.each(conditionValue.input_value.ja, function(j, val) {
                                    $.each($(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.kintoneplugin-dropdown-list-item'), function(i, item) {
                                        if (val === $(item).find('span').attr('value')) {
                                            $(item).addClass('kintoneplugin-dropdown-list-item-selected');
                                            $(item).siblings('.kintoneplugin-dropdown-list-default').find('.kintoneplugin-dropdown-list-item-name-blue').text($(item).siblings('.kintoneplugin-dropdown-list-default').siblings('.kintoneplugin-dropdown-list-item-selected').length);
                                        };
                                    });
                                });
                                $.each(conditionValue.input_value.en, function(j, val) {
                                    $.each($(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.kintoneplugin-dropdown-list-item'), function(i, item) {
                                        if (val === $(item).find('span').attr('value')) {
                                            $(item).addClass('kintoneplugin-dropdown-list-item-selected');
                                            $(item).siblings('.kintoneplugin-dropdown-list-default').find('.kintoneplugin-dropdown-list-item-name-blue').text($(item).siblings('.kintoneplugin-dropdown-list-default').siblings('.kintoneplugin-dropdown-list-item-selected').length);
                                        };
                                    });
                                });
                                $.each(conditionValue.input_value.zh, function(j, val) {
                                    $.each($(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.kintoneplugin-dropdown-list-item'), function(i, item) {
                                        if (val === $(item).find('span').attr('value')) {
                                            $(item).addClass('kintoneplugin-dropdown-list-item-selected');
                                            $(item).siblings('.kintoneplugin-dropdown-list-default').find('.kintoneplugin-dropdown-list-item-name-blue').text($(item).siblings('.kintoneplugin-dropdown-list-default').siblings('.kintoneplugin-dropdown-list-item-selected').length);
                                        };
                                    });
                                });
                            break;

                            case 'CREATOR':
                            case 'MODIFIER':
                            case 'STATUS_ASSIGNEE':
                            case 'USER_SELECT':
                            case 'ORGANIZATION_SELECT':
                            case 'GROUP_SELECT':
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-inequality-select').val(conditionValue.inequality);
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input').val(conditionValue.input_value.join(','));
                            break;
                                
                            case 'DATE':
                            case 'DATETIME':
                            case 'CREATED_TIME':
                            case 'UPDATED_TIME':
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-inequality-select').val(conditionValue.inequality);
                                $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select').val(conditionValue.input_value.datetime_inequality);
                                switch (conditionValue.input_value.datetime_inequality) {
                                    case '=' :
                                        $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input').val(conditionValue.input_value.value_datetime);
                                    break;

                                    case 'FROM_TODAY' :
                                        $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-word-input').val(conditionValue.input_value.value_fromToday);
                                        $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-inequality-select-fromToday-1').val(conditionValue.input_value.option_fromToday_1);
                                        $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.condition-inequality-select-fromToday-2').val(conditionValue.input_value.option_fromToday_2);
                                    break;

                                    case 'LAST_WEEK' :
                                    case 'THIS_WEEK' :
                                    case 'NEXT_WEEK' : 
                                        $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select-week').val(conditionValue.input_value.option_week);
                                    break;

                                    case 'LAST_MONTH' : 
                                    case 'THIS_MONTH' :
                                    case 'NEXT_MONTH' : 
                                        $(tr).eq(i + 1).find('.kintoneplugin-additional-condition-container').eq(conditionRow + 1).find('.datetime-inequality-select-month').val(conditionValue.input_value.option_month);
                                    break;

                                    default : break;
                                }
                            break;
                        }
                    });
                    $.each(conf_table[i].method, function(methodRow, methodValue) {
                        $(tr).eq(i + 1).find('.kintoneplugin-method-container').eq(methodRow + 1).find('.method-field-select').val(methodValue.method_field.value);
                        $(tr).eq(i + 1).find('.kintoneplugin-method-container').eq(methodRow + 1).find('.method-select').val(methodValue.method);                        
                    });
                    if (n.condition_option === 'and') {
                        $(tr).eq(i + 1).find('.terms-select-and').addClass('terms-select-selected');
                        $(tr).eq(i + 1).find('.terms-select-or').removeClass('terms-select-selected');
                    } else if (n.condition_option === 'or') {
                        $(tr).eq(i + 1).find('.terms-select-and').removeClass('terms-select-selected');
                        $(tr).eq(i + 1).find('.terms-select-or').addClass('terms-select-selected');
                    }
                });
            }
        }
        return;
    }

    // フォーム設計情報を取得し、各ドロップダウンに代入
    function setValues() {
        let conditionArr = [];
        let methodArr = [];
        let $option = $('<option>');
        let param = {};
        param.app = kintone.app.getId();
        param.lang = kintone.getLoginUser().language;
        kintone.api('/k/v1/preview/app/form/fields', 'GET', param, function(resp) {
            for (let key in resp.properties) {
                let prop = resp.properties[key];
                switch (prop.type) {
                    case 'SINGLE_LINE_TEXT':

                    case 'NUMBER':
                    case 'RECORD_NUMBER':

                    case 'CREATOR':
                    case 'MODIFIER':
                    case 'USER_SELECT':
                    case 'ORGANIZATION_SELECT':
                    case 'GROUP_SELECT':

                    case 'CREATED_TIME':
                    case 'UPDATED_TIME':
                    case 'DATE':
                    case 'TIME':
                    case 'DATETIME':

                    case 'MULTI_SELECT':
                    case 'CHECK_BOX':
                    case 'DROP_DOWN':
                    case 'RADIO_BUTTON':
                        conditionArr.push(prop);
                        methodArr.push(prop);
                    break;

                    case 'CALC':
                    case 'MULTI_LINE_TEXT':
                    case 'RICH_TEXT':
                    case 'LINK':
                    case 'FILE':
                    case 'GROUP':
                        methodArr.push(prop);
                    break;

                    case 'STATUS':
                    case 'STATUS_ASSIGNEE':
                        conditionArr.push(prop);
                    break;
                    case 'SUBTABLE':
                        methodArr.push(prop);
                        $.each(prop.fields, function(i, field) {
                            field.insubtable = true;
                            methodArr.push(field);
                        });
                    break;
                    default : break;
                }
            }

            conditionArr.sort(function(a, b) {
                return a.label > b.label ? 1 : -1;
            });
            methodArr.sort(function(a, b) {
                return a.label > b.label ? 1 : -1;
            });

            $.each(conditionArr, function(i, prop) {
                $option = $('<option>');
                $option.attr('value', prop.code);
                $option.attr('field-type', prop.type);
                $option.text(escapeStr(prop.label + ' [' + prop.code + ']'));
                $('.condition-field-select').append($option.clone());
            });
            $.each(methodArr, function(i, prop) {
                $option = $('<option>');
                $option.attr('value', prop.code);
                $option.attr('field-type', prop.type);
                $option.text(escapeStr(prop.label + ' [' + prop.code + ']'));
                if (prop.insubtable) $option.attr('in-subtable', 'true');
                $('.method-field-select').append($option.clone());
            });
            setDefault();
        });
    }

    // フィールドタイプごとに条件のボックスを出す
    $(document).on('change', '.condition-field-select', function(event) {
        $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').empty();
        let _self = this;
        let select_code = $('option:selected', _self).val();
        switch ($('option:selected', this).attr('field-type')) {
            case 'SINGLE_LINE_TEXT':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.textInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.textInputBox);
            break;

            case 'NUMBER':
            case 'RECORD_NUMBER':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.numInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.numInputBox);
            break;

            case 'DROP_DOWN':
            case 'RADIO_BUTTON':
            case 'CHECK_BOX':
            case 'MULTI_SELECT':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.userInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.selectInputBox);

                function setSelectValue(lang) {
                    let sortArr = [];
                    let param = {};
                    param.app = kintone.app.getId();
                    param.lang = lang;
                    kintone.api('/k/v1/preview/app/form/fields', 'GET', param, function(resp) {
                        $.each(resp.properties, function(i, prop) {
                            if (prop.code === select_code) {
                                $.each(prop.options, function(i, option) {
                                    let obj = {};
                                    obj.label = option.label;
                                    obj.index = option.index;
                                    sortArr.push(obj);
                                });
                                sortArr.sort(function (a, b) {
                                    return (a.index - b.index);
                                });
                                $.each(sortArr, function(i, option) {
                                    let $div = $('<div class="kintoneplugin-dropdown-list-item">');
                                    let $span = $('<span class="kintoneplugin-dropdown-list-item-name">');

                                    $span.attr('value', option.label);
                                    $span.text(option.label);
                                    $div.append($span.clone());
                                    $(_self).parents('.kintoneplugin-condition-container').find('.condition-word-select-' + lang).append($div.clone());
                                });
                            }
                        });
                    });    
                }
                setSelectValue('ja');
                setSelectValue('en');
                setSelectValue('zh');
            break;

            case 'STATUS':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.userInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.selectInputBox);

                function setStatusValue(lang) {
                    let param = {};
                    param.app = kintone.app.getId();
                    param.lang = lang;
                    kintone.api('/k/v1/preview/app/status', 'GET', param, function(resp) {
                        $.each(resp.states, function(i, state) {
                            let $div = $('<div class="kintoneplugin-dropdown-list-item">');
                            let $span = $('<span class="kintoneplugin-dropdown-list-item-name">');

                            $span.attr('value', state.name);
                            $span.text(state.name);
                            $div.append($span.clone());
                            $(_self).parents('.kintoneplugin-condition-container').find('.condition-word-select-' + lang).append($div.clone());
                        });
                    });    
                }
                setStatusValue('ja');
                setStatusValue('en');
                setStatusValue('zh');
            break;

            case 'CREATOR':
            case 'MODIFIER':
            case 'STATUS_ASSIGNEE':
            case 'USER_SELECT':
            case 'ORGANIZATION_SELECT':
            case 'GROUP_SELECT':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.userInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.userInputBox);
            break;

            case 'TIME':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInputBox);
            break;

            case 'DATE':
            case 'DATETIME':
            case 'CREATED_TIME':
            case 'UPDATED_TIME':
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInequalityBox);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInequalityBox_1);
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.numInputBox);
                $(this).parents('.kintoneplugin-condition-container').find('.condition-word-input').datepicker({dateFormat: 'yy-mm-dd'});
            break;
        }
    });

    // フィールドタイプごとに条件のボックスを出す(日時の細かいやつ)
    $(document).on('change', '.datetime-inequality-select', function(event) {
        switch ($(this).val()) {
            case '=' :
                $(this).parents('.kintoneplugin-select-outer').nextAll().remove();
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.numInputBox);
                $(this).parents('.kintoneplugin-condition-container').find('.condition-word-input').datepicker({dateFormat: 'yy-mm-dd'});
            break;

            case 'FROM_TODAY' :
                $(this).parents('.kintoneplugin-select-outer').nextAll().remove();
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInequalityBox_2);
            break;

            case 'LAST_WEEK' :
            case 'THIS_WEEK' :
            case 'NEXT_WEEK' : 
                $(this).parents('.kintoneplugin-select-outer').nextAll().remove();
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInequalityBox_3);
            break;

            case 'LAST_MONTH' : 
            case 'THIS_MONTH' :
            case 'NEXT_MONTH' : 
                $(this).parents('.kintoneplugin-select-outer').nextAll().remove();
                $(this).parents('.kintoneplugin-condition-container').find('.kintoneplugin-additional-condition-container').append(partsHTML.timeInequalityBox_4);
            break;

            default :
                $(this).parents('.kintoneplugin-select-outer').nextAll().remove();
            break;
        }
    });

    //「＋」ボタンを押下した際に行を増やす
    // table
    $(document).on('click', '.table-add-low', function(event) {
        let trEq = $(event.currentTarget).parents('tr').prevAll().length + 1;
        $(tr).eq(0).clone().insertAfter($(event.currentTarget).parent().parent());
        $(tr).eq(trEq).find('.kintoneplugin-condition-list').append($('.kintoneplugin-condition-container').eq(0).clone());
        $(tr).eq(trEq).find('.kintoneplugin-method-list').append($('.kintoneplugin-method-container').eq(0).clone());
        $(tr).eq(trEq).find('.condition-remove-low').eq(1).css('display', 'none');
        $(tr).eq(trEq).find('.method-remove-low').eq(1).css('display', 'none');
        if ($(tr).length >= 3) {
            $(tr).eq(1).find('.table-remove-low').css('display', 'inline');
        }
    });

    // condition
    $(document).on('click', '.condition-add-low', function(event) {
        $(event.currentTarget).parent().parent().find('.kintoneplugin-condition-list').append($(event.currentTarget).parent().parent().parent().find('.kintoneplugin-condition-container').eq(0).clone());
        if ($(event.currentTarget).parent().parent().find('.kintoneplugin-condition-container').length >= 3) {
            $(event.currentTarget).parent().parent().find('.kintoneplugin-condition-container').eq(1).find('.condition-remove-low').css('display', 'inline');
        }
    });

    // method
    $(document).on('click', '.method-add-low', function(event) {
        $(event.currentTarget).parent().parent().find('.kintoneplugin-method-list').append($(event.currentTarget).parent().parent().parent().find('.kintoneplugin-method-container').eq(0).clone());
        if ($(event.currentTarget).parent().parent().find('.kintoneplugin-method-container').length >= 3) {
            $(event.currentTarget).parent().parent().find('.kintoneplugin-method-container').eq(1).find('.method-remove-low').css('display', 'inline');
        }
    });


    //「－」ボタンを押下した際に行を減らす
    // table
    $(document).on('click', '.table-remove-low', function(event) {
        $(event.currentTarget).parent().parent().remove();
        if ($(tr).length <= 2) {
            $(tr).eq(1).find('.table-remove-low').css('display', 'none');
        }
    });

    // condition
    $(document).on('click', '.condition-remove-low', function(event) {
        if ($(event.currentTarget).parent().parent().parent().find('.kintoneplugin-condition-container').length <= 3) {
            let trEq = $(event.currentTarget).parents('tr').prevAll().length;
            $(event.currentTarget).parent().parent().remove();
            $(tr).eq(trEq).find('.kintoneplugin-condition-list .kintoneplugin-condition-container').eq(1).find('.condition-remove-low').css('display', 'none');
        } else {
            $(event.currentTarget).parent().parent().remove();
        }
    });

    // method
    $(document).on('click', '.method-remove-low', function(event) {
        if ($(event.currentTarget).parent().parent().parent().find('.kintoneplugin-method-container').length <= 3) {
            let trEq = $(event.currentTarget).parents('tr').prevAll().length;
            $(event.currentTarget).parent().parent().remove();
            $(tr).eq(trEq).find('.kintoneplugin-method-list .kintoneplugin-method-container').eq(1).find('.method-remove-low').css('display', 'none');
        } else {
            $(event.currentTarget).parent().parent().remove();
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
        $(event.currentTarget).parent('.kintoneplugin-dropdown-list').find('.kintoneplugin-dropdown-list-item').slideToggle();
    });

    // ラジオボタンのToggle動作
    $(document).on('click', '.terms-select-label', function(event) {
        $(event.currentTarget).siblings().addClass('terms-select-selected');
        $(event.currentTarget).parent().siblings().find('span').removeClass('terms-select-selected');
    });

    // 言語切り替え（テキスト）
    $(document).on('click', '.lang-btn-text', function(event) {
        switch ($(this).val()) {
            case 'ja':
                $(this).parent().find('.condition-word-input-ja').css('display', 'inline-block');
                $(this).parent().find('.condition-word-input-en').css('display', 'none');
                $(this).parent().find('.condition-word-input-zh').css('display', 'none');
            break;
            case 'en': 
                $(this).parent().find('.condition-word-input-ja').css('display', 'none');
                $(this).parent().find('.condition-word-input-en').css('display', 'inline-block');
                $(this).parent().find('.condition-word-input-zh').css('display', 'none');
            break;
            case 'zh': 
                $(this).parent().find('.condition-word-input-ja').css('display', 'none');
                $(this).parent().find('.condition-word-input-en').css('display', 'none');
                $(this).parent().find('.condition-word-input-zh').css('display', 'inline-block');
            break;
        };
        $(event.currentTarget).addClass('lang-btn-text-selected');
        $(event.currentTarget).siblings('.lang-btn-text-selected').removeClass('lang-btn-text-selected').addClass('lang-btn-text');
    });

    // 言語切り替え（選択肢）
    $(document).on('click', '.lang-btn-select', function(event) {
        switch ($(this).val()) {
            case 'ja':
                $(this).parent().find('.condition-word-select-ja').css('display', 'inline-block');
                $(this).parent().find('.condition-word-select-en').css('display', 'none');
                $(this).parent().find('.condition-word-select-zh').css('display', 'none');
            break;
            case 'en': 
                $(this).parent().find('.condition-word-select-ja').css('display', 'none');
                $(this).parent().find('.condition-word-select-en').css('display', 'inline-block');
                $(this).parent().find('.condition-word-select-zh').css('display', 'none');
            break;
            case 'zh': 
                $(this).parent().find('.condition-word-select-ja').css('display', 'none');
                $(this).parent().find('.condition-word-select-en').css('display', 'none');
                $(this).parent().find('.condition-word-select-zh').css('display', 'inline-block');
            break;
        };
        $(event.currentTarget).addClass('lang-btn-select-selected');
        $(event.currentTarget).siblings('.lang-btn-select-selected').removeClass('lang-btn-select-selected').addClass('lang-btn-select');
    });

    // エラーチェック関数
    function checkErrors(table) {
        let errorFlag = true;
        $.each(table, function(i, row) {
            $.each(row.method, function(i, methodRow) {
                // 空methodチェック
                if (methodRow.method_field.value === '' || methodRow.method === '') {
                    Swal.fire('Error', langText.error1, 'error');
                    errorFlag = false;
                }
                // disabled出来ないフィールドのチェック
                switch (methodRow.method_field.type) {
                    case 'CALC':
                    case 'GROUP':
                    case 'SUBTABLE':
                    case 'RECORD_NUMBER':
                    case 'CREATOR':
                    case 'MODIFIER':
                    case 'CREATED_TIME':
                    case 'UPDATED_TIME':
                        if (methodRow.method === 'disabled-false' || methodRow.method === 'disabled-true') {
                            Swal.fire('Error', langText.error2, 'error');
                            errorFlag = false;
                        }
                    break;
                }
                // サブテーブル内フィールドのdisabledチェック
                if (methodRow.method_field.subtable === true) {
                    if (methodRow.method === 'disabled-false' || methodRow.method === 'disabled-true') {
                        Swal.fire('Error', langText.error3, 'error');
                        errorFlag = false;
                    }
                }
            });
        });
        return errorFlag;
    }

    // 保存ボタン押下時に入力情報を保存
    $('#kintoneplugin-submit').on('click', function() {
        let config = {};
        let tableArr = [];
        if ($('#coloring-condition-field:checked').val()) {
            config.coloring = 'true';
        } else {
            config.coloring = 'false';
        }
        $(tr).each(function() {
            let obj = {};
            let conditionArr = [];
            let methodArr = [];
            $.each($(this).find('.kintoneplugin-condition-container'), function(i, container) {
                if (i === 0) return true;
                let obj = {};
                obj.condition_field = {
                    value: $(this).find('.condition-field-select').val(),
                    type: $(container).find('option:selected', '.condition-field-select').attr('field-type')
                }
                switch ($(container).find('option:selected', '.condition-field-select').attr('field-type')) {
                    case 'SINGLE_LINE_TEXT':
                        obj.inequality = $(this).find('.condition-inequality-select').val();
                        obj.input_value = {
                            ja: $(this).find('.condition-word-input-ja').val(),
                            en: $(this).find('.condition-word-input-en').val(),
                            zh: $(this).find('.condition-word-input-zh').val()
                        };
                    break;

                    case 'NUMBER':
                    case 'RECORD_NUMBER':
                        obj.inequality = $(this).find('.condition-inequality-select').val();
                        obj.input_value = $(this).find('.condition-word-input').val();
                    break;

                    case 'STATUS':
                    case 'DROP_DOWN':
                    case 'RADIO_BUTTON':
                    case 'CHECK_BOX':
                    case 'MULTI_SELECT':
                        obj.inequality = $(this).find('.condition-inequality-select').val();
                        let _self = this;
                        function collectSelectValue (lang, _self) {
                            let itemArr = [];
                            $.each($(_self).find('.condition-word-select-' + lang).find('.kintoneplugin-dropdown-list-item-selected'), function(i, item) {
                                itemArr.push($(item).find('span').attr('value'));
                            });
                            return itemArr;
                        }
                        obj.input_value = {
                            ja: collectSelectValue('ja', _self),
                            en: collectSelectValue('en', _self),
                            zh: collectSelectValue('zh', _self)
                        };
                    break;

                    case 'DATE':
                    case 'DATETIME':
                    case 'CREATED_TIME':
                    case 'UPDATED_TIME':
                        obj.inequality = $(this).find('.condition-inequality-select').val();
                        obj.input_value = {
                            datetime_inequality: $(this).find('.datetime-inequality-select').val()
                        };
                        switch ($(this).find('.datetime-inequality-select').val()) {
                            case '=':
                                obj.input_value.value_datetime = $(this).find('.condition-word-input').val();
                            break;

                            case 'FROM_TODAY':
                                obj.input_value.value_fromToday = $(this).find('.condition-word-input').val();
                                obj.input_value.option_fromToday_1 = $(this).find('.condition-inequality-select-fromToday-1').val();
                                obj.input_value.option_fromToday_2 = $(this).find('.condition-inequality-select-fromToday-2').val();
                                
                            break;

                            case 'LAST_WEEK':
                            case 'THIS_WEEK':
                            case 'NEXT_WEEK' : 
                                obj.input_value.option_week = $(this).find('.datetime-inequality-select-week').val();
                            break;

                            case 'LAST_MONTH':
                            case 'THIS_MONTH':
                            case 'NEXT_MONTH' : 
                                obj.input_value.option_month = $(this).find('.datetime-inequality-select-month').val();
                            break;
                        }
                    break;

                    case 'CREATOR':
                    case 'MODIFIER':
                    case 'STATUS_ASSIGNEE':
                    case 'USER_SELECT':
                    case 'ORGANIZATION_SELECT':
                    case 'GROUP_SELECT':
                        obj.inequality = $(this).find('.condition-inequality-select').val();
                        obj.input_value = $(this).find('.condition-word-input').val().replace(/\s+/g, '').split(',');
                    break;

                    case 'TIME':
                        obj.inequality = $(this).find('.condition-inequality-select').val();
                        obj.input_value = $(this).find('.condition-word-input').val();
                    break;
                }
                conditionArr.push(obj);
            });
            $.each($(this).find('.kintoneplugin-method-container'), function(i, container) {
                if (i === 0) return true;
                let obj = {};
                obj.method_field = {
                    value: $(container).find('.method-field-select').val(),
                    type: $(container).find('option:selected', '.method-field-select').attr('field-type')
                }
                if ($(container).find('option:selected', '.method-field-select').attr('in-subtable') === 'true') {
                    obj.method_field.subtable = true;
                }
                obj.method = $(container).find('.method-select').val();
                methodArr.push(obj);
            });
            obj.condition = conditionArr;
            obj.condition_option = $(this).find('.terms-select-selected').attr('value');
            obj.method = methodArr;
            tableArr.push(obj);
        });
        tableArr.shift();
        if (checkErrors(tableArr)) {
            config.table = JSON.stringify(tableArr);
            kintone.plugin.app.setConfig(config);
        }
    });

    //「キャンセル」ボタン押下時の処理
    $('#kintoneplugin-cancel').on('click', function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);