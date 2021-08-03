/*
  vote Plug-in
  Copyright (c) 2020 Cybozu
  Licensed under the MIT License
*/
jQuery.noConflict();
(function($, PLUGIN_ID) {
	'use strict';

	// 設定情報を取得
	let browserCode;
	if (location.pathname.indexOf('/m/') === -1) {
		console.log('desktop');
		browserCode = '';
	} else {
		console.log('mobile');
		browserCode = 'mobile.'
	}
	let conf = kintone.plugin.app.getConfig(PLUGIN_ID);
	if (Object.keys(conf).length === 0) {
        console.log('設定値なし');
        return;
    }
    let tables = JSON.parse(conf.table).reverse();
    console.log(tables);

	// イベント定義
    let showEvents = [
		'app.record.detail.show',
	];
	let events = [
		browserCode + 'app.record.detail.show',
		browserCode + 'app.record.create.show',
		browserCode + 'app.record.edit.show',
		browserCode + 'app.record.index.edit.show'
	];
	let change_push = [];
	$.each(tables, function(i, row) {
		$.each(row.condition, function(i, conditionRow) {
			change_push.push(conditionRow.condition_field.value);
		});
	});

	// 重複排除
	let change_filter = change_push.filter(function(x, i, self) {
		return self.indexOf(x) === i;
	});

	// changeイベント生成
	$.each(change_filter, function(i, field_code) {
		events.push(browserCode + 'app.record.edit.change.' + field_code);
		events.push(browserCode + 'app.record.create.change.' + field_code);
		events.push(browserCode + 'app.record.index.edit.change.' + field_code);
	});

	kintone.events.on(showEvents, function(event) {
		if (conf.coloring !== 'true') return;
		let param = {};
		param.app = kintone.app.getId();
		kintone.api('/k/v1/app/settings', 'GET', param).then(function(resp) {
			let colorCode;
			switch (resp.theme) {
				case 'RED': 
					colorCode = '#efc7bf';
				break;
				case 'BLUE': 
					colorCode = '#c1ddf7';
				break;
				case 'GREEN': 
					colorCode = '#cce198';
				break;
				case 'YELLOW': 
					colorCode = '#e5d8a1';
				break;
				case 'BLACK':
				case 'WHITE': 
					colorCode = '#c5c9ca';
				break;
			}
			$.each(tables, function(i, row) {
				$.each(row.condition, function(i, conditionRow) {
					$(kintone.app.record.getFieldElement(conditionRow.condition_field.value)).css('background-color', colorCode);
				});
			});	
		});
	});

	// kintone.events.on
	kintone.events.on(events, function(event) {
		let record = event.record;
		console.log(record);
		let lang = kintone.getLoginUser().language;
		let resultArr = [];
		$.each(tables, function(i, row) {
			let rowFlagArr = [];
			let conditionFlagArr;
            $.each(row.condition, function(i, conditionRow) {
                switch (conditionRow.condition_field.type) {
					case 'ALL':
						rowFlagArr.push(true);
					break;
					case 'SINGLE_LINE_TEXT':
						// 値がない場合
						if (!record[conditionRow.condition_field.value].value) {
							switch (conditionRow.inequality) {
								case '=':
									if (conditionRow.input_value[lang] === '') {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									}
								break;
								case '!=':
									if (conditionRow.input_value[lang] === '') {
										rowFlagArr.push(false);
									} else {
										rowFlagArr.push(true);
									}
								break;
								case 'like':
									rowFlagArr.push(false);
								break;
								case 'not like':
									rowFlagArr.push(true);
								break;
							}
							return true;
						}
						switch (conditionRow.inequality) {
							case '=':
								if (record[conditionRow.condition_field.value].value === conditionRow.input_value[lang]) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '!=':
								if (record[conditionRow.condition_field.value].value !== conditionRow.input_value[lang]) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case 'like':
								if (record[conditionRow.condition_field.value].value) {
									if (record[conditionRow.condition_field.value].value.indexOf(conditionRow.input_value[lang]) !== -1) {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									};
								} else {
									rowFlagArr.push(false);
								}
							break;
							case 'not like':
							if (record[conditionRow.condition_field.value].value) {
								if (record[conditionRow.condition_field.value].value.indexOf(conditionRow.input_value[lang]) === -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							} else {
								rowFlagArr.push(true);
							}
							break;
							default: break;
						};
					break;

					case 'NUMBER':
					case 'RECORD_NUMBER':
						// 値がない場合
						if (!record[conditionRow.condition_field.value].value) {
							if (conditionRow.inequality === '=') {
								if (conditionRow.input_value === '') {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								}
							} else if (conditionRow.inequality === '!=') {
								if (conditionRow.input_value === '') {
									rowFlagArr.push(false);
								} else {
									rowFlagArr.push(true);
								}
							} else {
								rowFlagArr.push(false);
							}
							return true;
						}
						switch (conditionRow.inequality) {
							case '=':
								if (Number(record[conditionRow.condition_field.value].value) === Number(conditionRow.input_value)) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '!=':
								if (Number(record[conditionRow.condition_field.value].value) !== Number(conditionRow.input_value)) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '<=':
								if (Number(record[conditionRow.condition_field.value].value) <= Number(conditionRow.input_value)) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '>=':
								if (Number(record[conditionRow.condition_field.value].value) >= Number(conditionRow.input_value)) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
						};
					break;

					case 'CREATOR':
                    case 'MODIFIER':
						switch (conditionRow.inequality) {
							case 'in': 
								if (conditionRow.input_value.indexOf(record[conditionRow.condition_field.value].value.code) !== -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case 'not in':
								if (conditionRow.input_value.indexOf(record[conditionRow.condition_field.value].value.code) === -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
						}
					break;

					case 'STATUS_ASSIGNEE':
					case 'USER_SELECT':
                    case 'ORGANIZATION_SELECT':
                    case 'GROUP_SELECT':
						conditionFlagArr = [];
						switch (conditionRow.inequality) {
							case 'in': 
								$.each(record[conditionRow.condition_field.value].value, function(i, user) {
									if (conditionRow.input_value.indexOf(record[conditionRow.condition_field.value].value[i].code) !== -1) {
										conditionFlagArr.push(true);
									} else {
										conditionFlagArr.push(false);
									};
								});
								if (conditionFlagArr.indexOf(true) !== -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case 'not in':
								$.each(record[conditionRow.condition_field.value].value, function(i, user) {
									if (conditionRow.input_value.indexOf(record[conditionRow.condition_field.value].value[i].code) !== -1) {
										conditionFlagArr.push(true);
									} else {
										conditionFlagArr.push(false);
									};
								});
								if (conditionFlagArr.indexOf(true) === -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
						}
					break;
					case 'DROP_DOWN':
						if (!record[conditionRow.condition_field.value].value) {
							if (conditionRow.inequality === 'not in') {
								rowFlagArr.push(true);
							} else {
								rowFlagArr.push(false);
							}
							return true;
						}
						conditionFlagArr = [];
						switch (conditionRow.inequality) {
							case 'in': 
								$.each(conditionRow.input_value[lang], function(i, item) {
									if (record[conditionRow.condition_field.value].value === item) {
										conditionFlagArr.push(true);
									} else {
										conditionFlagArr.push(false);
									};
								});
								if (conditionFlagArr.indexOf(true) !== -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case 'not in':
								$.each(conditionRow.input_value[lang], function(i, item) {
									if (record[conditionRow.condition_field.value].value !== item) {
										conditionFlagArr.push(true);
									} else {
										conditionFlagArr.push(false);
									};
								});
								if (conditionFlagArr.indexOf(true) === -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
						}
					break;
					case 'STATUS':
					case 'RADIO_BUTTON':
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						conditionFlagArr = [];
						switch (conditionRow.inequality) {
							case 'in': 
								$.each(conditionRow.input_value[lang], function(i, item) {
									if (record[conditionRow.condition_field.value].value.indexOf(item) !== -1) {
										conditionFlagArr.push(true);
									} else {
										conditionFlagArr.push(false);
									};
								});
								if (conditionFlagArr.indexOf(true) !== -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
							case 'not in':
								$.each(conditionRow.input_value[lang], function(i, item) {
									if (record[conditionRow.condition_field.value].value.indexOf(item) !== -1) {
										conditionFlagArr.push(true);
									} else {
										conditionFlagArr.push(false);
									};
								});
								if (conditionFlagArr.indexOf(true) === -1) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
							break;
						}
					break;
                    case 'DATE':
                    case 'DATETIME':
                    case 'CREATED_TIME':
                    case 'UPDATED_TIME':
						if (record[conditionRow.condition_field.value].value === null || !record[conditionRow.condition_field.value].value) {
							if (conditionRow.inequality === '!=') {
								rowFlagArr.push(true);
							} else {
								rowFlagArr.push(false);
							}
							return true;
						}
						let date = moment(record[conditionRow.condition_field.value].value);
						let compareDate;
						switch (conditionRow.input_value.datetime_inequality) {
							case '=':
								compareDate = moment(conditionRow.input_value.value_datetime).format('YYYY-MM-DD');
								switch (conditionRow.inequality) {
									case '=':
										if (date.format('YYYY-MM-DD') === compareDate) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '!=':
										if (date.format('YYYY-MM-DD') !== compareDate) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {x
											rowFlagArr.push(false);
										};
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
								}
							break;
							case 'FROM_TODAY':
								switch(conditionRow.input_value.option_fromToday_2) {
									case 'before':
										compareDate = moment().subtract(Number(conditionRow.input_value.value_fromToday), conditionRow.input_value.option_fromToday_1).format('YYYY-MM-DD');
									break;
									case 'after':
										compareDate = moment().add(Number(conditionRow.input_value.value_fromToday), conditionRow.input_value.option_fromToday_1).format('YYYY-MM-DD');
									break;
								}
								switch (conditionRow.inequality) {
									case '=':
										if (date.format('YYYY-MM-DD') === compareDate) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '!=':
										if (date.format('YYYY-MM-DD') !== compareDate) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
								}
							break;
							case 'NOW':
								compareDate = moment();
								switch (conditionRow.inequality) {
									case '=':
										if (date.format('YYYY-MM-DD hh:mm:ss') === compareDate.format('YYYY-MM-DD hh:mm:ss')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '!=':
										if (date.format('YYYY-MM-DD hh:mm:ss') !== compareDate.format('YYYY-MM-DD hh:mm:ss')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<=':
										if (date.isSameOrBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<':
										if (date.isBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>=':
										if (date.isSameOrAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>':
										if (date.isAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
								}
							break;
							case 'YESTERDAY':
								compareDate = moment().add('days', -1);
								switch (conditionRow.inequality) {
									case '=':
										if (date.format('YYYY-MM-DD') === compareDate.format('YYYY-MM-DD')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '!=':
										if (date.format('YYYY-MM-DD') !== compareDate.format('YYYY-MM-DD')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
								}
							break;
							case 'TODAY':
								compareDate = moment();
								switch (conditionRow.inequality) {
									case '=':
										if (date.format('YYYY-MM-DD') === compareDate.format('YYYY-MM-DD')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '!=':
										if (date.format('YYYY-MM-DD') !== compareDate.format('YYYY-MM-DD')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
								}
							break;
							case 'TOMORROW':
								compareDate = moment().add('days', 1);
								switch (conditionRow.inequality) {
									case '=':
										if (date.format('YYYY-MM-DD') === compareDate.format('YYYY-MM-DD')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '!=':
										if (date.format('YYYY-MM-DD') !== compareDate.format('YYYY-MM-DD')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										};
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate)) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
								}
							break;
							case 'LAST_WEEK':
								switch (conditionRow.input_value.option_week) {
									case 'ALL':
										let compareDate_from = moment().add('isoWeek', -1).startOf('isoWeek').add('days', -1).format('YYYY-MM-DD');
										let compareDate_to = moment().add('isoWeek', -1).endOf('isoWeek').add('days', -1).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.startOf('day').isBetween(compareDate_from, compareDate_to, null, '[]')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (!(date.startOf('day').isBetween(compareDate_from, compareDate_to, null, '[]'))) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate_from)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate_from)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate_to)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate_to)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									default:
										compareDate = moment().add('isoWeek', -1).day(conditionRow.input_value.option_week).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
								}
							break;
							case 'THIS_WEEK':
								switch (conditionRow.input_value.option_week) {
									case 'ALL':
										let compareDate_from = moment().startOf('isoWeek').add('days', -1).format('YYYY-MM-DD');
										let compareDate_to = moment().endOf('isoWeek').add('days', -1).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.startOf('day').isBetween(compareDate_from, compareDate_to, null, '[]')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (!(date.startOf('day').isBetween(compareDate_from, compareDate_to, null, '[]'))) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate_from)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate_from)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate_to)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate_to)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									default:
										compareDate = moment().day(conditionRow.input_value.option_week).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
								}
							break;
							case 'NEXT_WEEK':
								switch (conditionRow.input_value.option_week) {
									case 'ALL':
										let compareDate_from = moment().add('isoWeek', 1).startOf('isoWeek').add('days', -1).format('YYYY-MM-DD');
										let compareDate_to = moment().add('isoWeek', 1).endOf('isoWeek').add('days', -1).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.startOf('day').isBetween(compareDate_from, compareDate_to, null, '[]')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (!(date.startOf('day').isBetween(compareDate_from, compareDate_to, null, '[]'))) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate_from)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate_from)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate_to)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate_to)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									default:
										compareDate = moment().add('isoWeek', 1).day(conditionRow.input_value.option_week).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
								}
							break;
							case 'LAST_MONTH':
								switch (conditionRow.input_value.option_month) {
									case 'ALL':
										compareDate = moment().add('month', -1);
										switch (conditionRow.inequality) {
											case '=':
												if (date.startOf('day').isSame(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (!(date.startOf('day').isSame(compareDate, 'month'))) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									case 'LAST':
										compareDate = moment().add('month', -1).endOf('month').format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									default:
										compareDate = moment().add('month', -1).date(conditionRow.input_value.option_month).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
								}
							break;
							case 'THIS_MONTH':
								switch (conditionRow.input_value.option_month) {
									case 'ALL':
										compareDate = moment();
										switch (conditionRow.inequality) {
											case '=':
												if (date.startOf('day').isSame(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (!(date.startOf('day').isSame(compareDate, 'month'))) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									case 'LAST':
										compareDate = moment().endOf('month').format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									default:
										compareDate = moment().date(conditionRow.input_value.option_month).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
								}
							break;
							case 'NEXT_MONTH':
								switch (conditionRow.input_value.option_month) {
									case 'ALL':
										compareDate = moment().add('month', 1);
										switch (conditionRow.inequality) {
											case '=':
												if (date.startOf('day').isSame(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (!(date.startOf('day').isSame(compareDate, 'month'))) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate, 'month')) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									case 'LAST':
										compareDate = moment().add('month', 1).endOf('month').format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
									default:
										compareDate = moment().add('month', 1).date(conditionRow.input_value.option_month).format('YYYY-MM-DD');
										switch (conditionRow.inequality) {
											case '=':
												if (date.format('YYYY-MM-DD') === compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '!=':
												if (date.format('YYYY-MM-DD') !== compareDate) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												}
											break;
											case '<=':
												if (date.startOf('day').isSameOrBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '<':
												if (date.startOf('day').isBefore(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>=':
												if (date.startOf('day').isSameOrAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
											case '>':
												if (date.startOf('day').isAfter(compareDate)) {
													rowFlagArr.push(true);
												} else {
													rowFlagArr.push(false);
												} 
											break;
										}
									break;
								}
							break;
							case 'LAST_YEAR':
								compareDate = moment().add('years', -1);
								switch (conditionRow.inequality) {
									case '=':
										if (date.startOf('day').isSame(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										}
									break;
									case '!=':
										if (!(date.startOf('day').isSame(compareDate, 'year'))) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										}
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
								}
							break;
							case 'THIS_YEAR':
								compareDate = moment();
								switch (conditionRow.inequality) {
									case '=':
										if (date.startOf('day').isSame(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										}
									break;
									case '!=':
										if (!(date.startOf('day').isSame(compareDate, 'year'))) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										}
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
								}
							break;
							case 'NEXT_YEAR':
								compareDate = moment().add('years', 1);
								switch (conditionRow.inequality) {
									case '=':
										if (date.startOf('day').isSame(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										}
									break;
									case '!=':
										if (!(date.startOf('day').isSame(compareDate, 'year'))) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										}
									break;
									case '<=':
										if (date.startOf('day').isSameOrBefore(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '<':
										if (date.startOf('day').isBefore(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>=':
										if (date.startOf('day').isSameOrAfter(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
									case '>':
										if (date.startOf('day').isAfter(compareDate, 'year')) {
											rowFlagArr.push(true);
										} else {
											rowFlagArr.push(false);
										} 
									break;
								}
							break;
						}
					break;

					case 'TIME':
						if (record[conditionRow.condition_field.value].value === null || !record[conditionRow.condition_field.value].value) {
							if (conditionRow.inequality === '!=') {
								rowFlagArr.push(true);
							} else {
								rowFlagArr.push(false);
							}
							return true;
						}
						switch (conditionRow.inequality) {
							case '=':
								if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) === Number(conditionRow.input_value.split(':')[0]) &&
									Number(record[conditionRow.condition_field.value].value.split(':')[1]) === Number(conditionRow.input_value.split(':')[1])) {
									rowFlagArr.push(true);
								} else {
									rowFlagArr.push(false);
								};
						break;
							case '!=':
								if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) !== Number(conditionRow.input_value.split(':')[0])) {
									rowFlagArr.push(true);
								} else {
									if (Number(record[conditionRow.condition_field.value].value.split(':')[1]) !== Number(conditionRow.input_value.split(':')[1])) {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									}
								};
							break;
							case '<=':
								if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) < Number(conditionRow.input_value.split(':')[0])) {
									rowFlagArr.push(true);
								} else if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) === Number(conditionRow.input_value.split(':')[0])) {
									if (Number(record[conditionRow.condition_field.value].value.split(':')[1]) <= Number(conditionRow.input_value.split(':')[1])) {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									}
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '<':
								if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) < Number(conditionRow.input_value.split(':')[0])) {
									rowFlagArr.push(true);
								} else if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) === Number(conditionRow.input_value.split(':')[0])) {
									if (Number(record[conditionRow.condition_field.value].value.split(':')[1]) < Number(conditionRow.input_value.split(':')[1])) {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									}
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '>=':
								if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) > Number(conditionRow.input_value.split(':')[0])) {
									rowFlagArr.push(true);
								} else if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) === Number(conditionRow.input_value.split(':')[0])) {
									if (Number(record[conditionRow.condition_field.value].value.split(':')[1]) >= Number(conditionRow.input_value.split(':')[1])) {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									}
								} else {
									rowFlagArr.push(false);
								};
							break;
							case '>':
								if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) > Number(conditionRow.input_value.split(':')[0])) {
									rowFlagArr.push(true);
								} else if (Number(record[conditionRow.condition_field.value].value.split(':')[0]) === Number(conditionRow.input_value.split(':')[0])) {
									if (Number(record[conditionRow.condition_field.value].value.split(':')[1]) > Number(conditionRow.input_value.split(':')[1])) {
										rowFlagArr.push(true);
									} else {
										rowFlagArr.push(false);
									}
								} else {
									rowFlagArr.push(false);
								};
							break;
						};
					break;

					default: break;
				};
			});
			console.log(rowFlagArr);
			switch (row.condition_option) {
				case 'and':
					if (rowFlagArr.indexOf(false) === -1) {
						resultArr.push(true)
					} else {
						resultArr.push(false)
					}
				break;
				case 'or':
					if (rowFlagArr.indexOf(true) !== -1) {
						resultArr.push(true)
					} else {
						resultArr.push(false)
					}
				break;
			}
		});
		$.each(resultArr, function(i, result) {
			if (!result) {
				$.each(tables[i].method, function(i, methodRow) {
					switch (methodRow.method) {
						case 'disabled-true':
							record[methodRow.method_field.value].disabled = true;
						break;

						case 'disabled-false':
							record[methodRow.method_field.value].disabled = false;
						break;

						case 'setfieldshown-true':
							if (browserCode === '') {
								kintone.app.record.setFieldShown(methodRow.method_field.value, false);
							} else {
								kintone.mobile.app.record.setFieldShown(methodRow.method_field.value, false);
							}
						break;

						case 'setfieldshown-false':
							if (browserCode === '') {
								kintone.app.record.setFieldShown(methodRow.method_field.value, true);
							} else {
								kintone.mobile.app.record.setFieldShown(methodRow.method_field.value, true);
							}
						break;
					}
				});
			}
		})
		$.each(resultArr, function(i, result) {
			if (result) {
				$.each(tables[i].method, function(i, methodRow) {
					switch (methodRow.method) {
						case 'disabled-true':
							record[methodRow.method_field.value].disabled = false;
						break;

						case 'disabled-false':
							record[methodRow.method_field.value].disabled = true;
						break;

						case 'setfieldshown-true':
							if (browserCode === '') {
								kintone.app.record.setFieldShown(methodRow.method_field.value, true);
							} else {
								kintone.mobile.app.record.setFieldShown(methodRow.method_field.value, true);
							}
						break;

						case 'setfieldshown-false':
							if (browserCode === '') {
								kintone.app.record.setFieldShown(methodRow.method_field.value, false);
							} else {
								kintone.mobile.app.record.setFieldShown(methodRow.method_field.value, false);
							}
						break;
					}
				});
			}				
		})
		return event;
	});
})(jQuery, kintone.$PLUGIN_ID);