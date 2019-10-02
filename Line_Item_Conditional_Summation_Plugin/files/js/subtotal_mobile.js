// Subtable Summarize Plug-in Copyright (c) 2018 Cybozu Licensed under the MIT License
jQuery.noConflict();
(function(pluginId, $) {
    'use strict';

    var conf = kintone.plugin.app.getConfig(pluginId);
    var table = JSON.parse(conf.table);

    // 計算式の分解
    var numArr = [];
    var formulaArr = [];
    $.each(table, function(i, v) {
        if (numArr.indexOf(v.num_select) === -1) numArr.push(v.num_select);
        if (v.num_select_formula) {
            var cleansingArr = [];
            var cleansing_formula = v.num_select_formula.replace(/\s+/g, '');
            cleansing_formula = cleansing_formula.replace(/SUM\(/g, '');
            cleansing_formula = cleansing_formula.replace(/[\+\-\*\/\^\(\)]/g, '%');
            cleansingArr = cleansing_formula.split('%');
            $.each(cleansingArr, function(i, v) {
                if (v === '' || isNaN(v) === false) return true;
                if (formulaArr.indexOf(v) === -1) formulaArr.push(v);
            });
        }
    });

    // 入力された金額から項目ごとに集計
    var disabledFields = function(event) {
        $.each(table, function(i, row) { // ここちがう
            event.record[row.result_select].disabled = true;
        });
    };

    // 上パターンの集計
    var normalSummrized = function(event) {
        var record = event.record;
        // result fieldだけのarr
        var resultArr = [];
        $.each(table, function(i, v) {
            resultArr.push(v.result_select);
        });
        resultArr = resultArr.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        $.each(resultArr, function(i, v) {
            var totalization = 0;
            $.each(table, function(i, setting_row) {
                var convertformula;
                if (setting_row.result_select === v) {
                    $.each(record[conf.condition_a_table].value, function(i, subtable_row) {
                        if (setting_row.condition_a_value === subtable_row.value[conf.condition_a].value) {
                            if (setting_row.condition_b_value !== '') {
                                var fieldflag = false
                                // 単選択肢フィールドの場合
                                if (
                                    subtable_row.value[conf.condition_b].type === 'CHECK_BOX' ||
                                    subtable_row.value[conf.condition_b].type === 'MULTI_SELECT'
                                ) {
                                    if (subtable_row.value[conf.condition_b].value.indexOf(setting_row.condition_b_value) !== -1) fieldflag = true;
                                // 複数選択士肢フィールドの場合
                                } else {
                                    if (setting_row.condition_b_value === subtable_row.value[conf.condition_b].value) fieldflag = true;
                                }
                                if (fieldflag === true) {
                                    // 集計値が計算パーツなら
                                    if (setting_row.num_select_formula) {
                                        $.each(formulaArr, function(i, v) {
                                            var regexp = new RegExp(v, 'g');
                                            if (i === 0) {
                                                convertformula = setting_row.num_select_formula.replace(regexp, subtable_row.value[v].value);
                                            } else {
                                                convertformula = convertformula.replace(regexp, subtable_row.value[v].value);
                                            }
                                        });
                                        totalization += eval(convertformula);
                                        // 数値パーツなら
                                    } else {
                                        totalization += parseFloat(subtable_row.value[setting_row.num_select].value);
                                    }
                                    return true;
                                } else {
                                    return true;
                                }
                            }
                            // 集計値が計算パーツなら
                            if (setting_row.num_select_formula) {
                                $.each(formulaArr, function(i, v) {
                                    var regexp = new RegExp(v, 'g');
                                    if (i === 0) {
                                        convertformula = setting_row.num_select_formula.replace(regexp, subtable_row.value[v].value);
                                    } else {
                                        convertformula = convertformula.replace(regexp, subtable_row.value[v].value);
                                    }
                                });
                                totalization += eval(convertformula);
                            // 数値パーツなら
                            } else {
                                totalization += parseFloat(subtable_row.value[setting_row.num_select].value);
                            }
                        }
                    }.bind(conf));
                }
            });
            record[v].value = totalization;
        });
    };

    var editEvents = ['mobile.app.record.create.show', 'mobile.app.record.edit.show'];
    kintone.events.on(editEvents, function(event) {
        disabledFields(event);
        return event;
    });

    var changeEvents = ['mobile.app.record.edit.show', 'mobile.app.record.create.submit', 'mobile.app.record.edit.submit'];
    var changeField = [conf.condition_a, conf.condition_b];
    changeField = changeField.concat(numArr);
    changeField = changeField.concat(formulaArr);
    $.each(changeField, function(i, v) {
        if (v !== '') {
            changeEvents.push('mobile.app.record.create.change.' + v);
            changeEvents.push('mobile.app.record.edit.change.' + v);
        }
    });
    changeEvents.push('mobile.app.record.create.change.' + conf.condition_a_table);
    changeEvents.push('mobile.app.record.edit.change.' + conf.condition_a_table);
    if (conf.condition_b !== '') {
        changeEvents.push('mobile.app.record.create.change.' + conf.condition_b_table);
        changeEvents.push('mobile.app.record.edit.change.' + conf.condition_b_table);
    }
    kintone.events.on(changeEvents, function(event) {
        normalSummrized(event);
        return event;
    });
})(kintone.$PLUGIN_ID, jQuery);