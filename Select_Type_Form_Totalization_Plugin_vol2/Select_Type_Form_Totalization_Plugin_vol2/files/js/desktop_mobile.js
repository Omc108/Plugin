jQuery.noConflict();
(function($, PLUGIN_ID) {
	'use strict';
	let record;

	// 設定情報を取得
	const conf = kintone.plugin.app.getConfig(PLUGIN_ID);
	if (Object.keys(conf).length === 0) return;
	const tables = JSON.parse(conf.table);

	// 計算式
	const calculator = function(value, type, word) {
		let counter = 0;
		if (value instanceof Array === true) {
			if (type === 'count') {
				if (value.indexOf(word) !== -1) counter += 1;
			} else {
				$.each(value, function(i, val) {
					if (isFinite(val) && val !== '') {
						if (type === 'sum') counter += parseInt(val);
						else if (type === 'average') counter += 1;
					}
				});
			}
		} else {
			if (type === 'count') {
				if (value === word) counter += 1;
			} else {
				if (isFinite(value) && value !== '') {
					if (type === 'sum') counter += parseInt(value);
					else if (type === 'average') counter += 1;
				}
			}
		}
		return counter;
	};

	// 各行の集計
	const calcValue = function(row) {
		let fields = row.totalization_fields;
		let method = row.totalization_method;
		let word = row.totalization_word;
		let num = row.totalization_num;
		switch (method) {
    		// count
    		case 'count':
				let count = 0;
				$.each(fields, function(i, value) {
					if (!value.subtable_code) {
						count += calculator(record[value.code].value, method, word);
					} else {
						$.each(record[value.subtable_code].value, function(i, row) {
							count += calculator(row.value[value.code].value, method, word);
						});
					}
				});
				record[num].disabled = true;
				record[num].value = count;
			break;
			// sum
			case 'sum':
				let sum = 0;
				$.each(fields, function(i, arr) {
					if (!arr.subtable_code) {
						sum += calculator(record[arr.code].value, method);
					} else {
						$.each(record[arr.subtable_code].value, function(i, row) {
							sum += calculator(row.value[arr.code].value, method);
						});
					}
				});
				record[num].disabled = true;
				record[num].value = sum;
			break;
			// average
			case 'average':
				let avesum = 0;
				let avecount = 0;
				$.each(fields, function(i, arr) {
					if (!arr.subtable_code) {
						avesum += calculator(record[arr.code].value, 'sum');
						avecount += calculator(record[arr.code].value, method);
					} else {
						$.each(record[arr.subtable_code].value, function(i, row) {
							avesum += calculator(row.value[arr.code].value, 'sum');
							avecount += calculator(row.value[arr.code].value, method);
						});
					}
				});
				record[num].disabled = true;
				if (avesum !== 0) record[num].value = avesum / avecount;
				else record[num].value = 0;
			break;
			default: break;
		}
	};

	// イベント定義
	const events = ['mobile.app.record.create.show', 'mobile.app.record.edit.show',
					'mobile.app.record.create.submit', 'mobile.app.record.edit.submit'];
	let change_push = [];
	$.each(tables, function(i, row) {
		$.each(row.totalization_fields, function(i, val) {
			change_push.push(val.code);
		});
	});

	// 重複排除
	const change_filter = change_push.filter(function(x, i, self) {
		return self.indexOf(x) === i;
	});

	// changeイベント生成
	$.each(change_filter, function(i, val) {
		events.push('mobile.app.record.edit.change.' + val);
		events.push('mobile.app.record.create.change.' + val);
	});

	// kintone.event.on
	kintone.events.on(events, function(event) {
		record = event.record;
		$.each(tables, function(i, row) {
			calcValue(row);
		});
		return event;
	});
})(jQuery, kintone.$PLUGIN_ID);