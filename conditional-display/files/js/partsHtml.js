/*  vote Plug-in
    Copyright (c) 2020 Cybozu
    Licensed under the MIT License  */
let langText = kintoneplugin_lang[kintone.getLoginUser().language];
let partsHTML = {
    textInequalityBox : `<div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select-inequality">\
                            <select class="condition-inequality-select">\
                                <option value="=">${langText.equal_to}</option>\
                                <option value="!=">${langText.not_equal_to}</option>\
                                <option value="like">${langText.contain}</option>\
                                <option value="not like">${langText.not_contain}</option>\
                            </select>\
                        </div>\
                        </div>`,

    numInequalityBox : `<div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select-inequality">\
                                <select class="condition-inequality-select">\
                                    <option value="=">${langText.equal_to}</option>\
                                    <option value="!=">${langText.not_equal_to}</option>\
                                    <option value="<=">${langText.less_than}</option>\
                                    <option value=">=">${langText.greater_than}</option>\
                                </select>\
                            </div>\
                        </div>`,

    userInequalityBox : `<div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select-inequality">\
                                <select class="condition-inequality-select">\
                                    <option value="in">${langText.select_in}</option>\
                                    <option value="not in">${langText.select_notin}</option>\
                                </select>\
                            </div>\
                        </div>`,

    timeInequalityBox : `<div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select-inequality">\
                                <select class="condition-inequality-select">\
                                    <option value="=">${langText.equal_to}</option>\
                                    <option value="!=">${langText.not_equal_to}</option>\
                                    <option value="<=">${langText.on_or_before}</option>\
                                    <option value="<">${langText.before}</option>\
                                    <option value=">=">${langText.on_or_after}</option>\
                                    <option value=">">${langText.after}</option>\
                                </select>\
                            </div>\
                        </div>`,

    timeInequalityBox_1 : `<div class="kintoneplugin-select-outer">\
                                <div class="kintoneplugin-select-inequality">\
                                    <select class="condition-inequality-select datetime-inequality-select">\
                                        <option value="=">${langText.specify_date}</option>\
                                        <option value="FROM_TODAY">${langText.specify_from_date}</option>\
                                        <option value="NOW">${langText.current}</option>\
                                        <option value="YESTERDAY">${langText.yesterday}</option>\
                                        <option value="TODAY">${langText.today}</option>\
                                        <option value="TOMORROW">${langText.tomorrow}</option>\
                                        <option value="LAST_WEEK">${langText.last_week}</option>\
                                        <option value="THIS_WEEK">${langText.this_week}</option>\
                                        <option value="NEXT_WEEK">${langText.next_week}</option>\
                                        <option value="LAST_MONTH">${langText.last_month}</option>\
                                        <option value="THIS_MONTH">${langText.this_month}</option>\
                                        <option value="NEXT_MONTH">${langText.next_month}</option>\
                                        <option value="LAST_YEAR">${langText.last_year}</option>\
                                        <option value="THIS_YEAR">${langText.this_year}</option>\
                                        <option value="NEXT_YEAR">${langText.next_year}</option>\
                                    </select>\
                                </div>\
                            </div>`,

    timeInequalityBox_2 : `<div class="kintoneplugin-input-outer">\
                                <input class="kintoneplugin-input-text-fromToday condition-word-input" type="text">\
                            </div>\
                            <div class="kintoneplugin-select-outer">\
                                <div class="kintoneplugin-select-inequality-fromToday">\
                                    <select class="condition-inequality-select-fromToday-1">\
                                        <option value="days">${langText.day}</option>\
                                        <option value="weeks">${langText.week}</option>\
                                        <option value="months">${langText.month}</option>\
                                        <option value="years">${langText.year}</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <div class="kintoneplugin-select-outer">\
                                <div class="kintoneplugin-select-inequality-fromToday">\
                                    <select class="condition-inequality-select-fromToday-2">\
                                        <option value="before">${langText.before_today}</option>\
                                        <option value="after">${langText.after_today}</option>\
                                    </select>\
                                </div>\
                            </div>`,

    timeInequalityBox_3 : `<div class="kintoneplugin-select-outer">\
                                <div class="kintoneplugin-select-inequality">\
                                    <select class="condition-inequality-select datetime-inequality-select-week">\
                                        <option value="ALL">${langText.all_days}</option>\
                                        <option value="0">${langText.sunday}</option>\
                                        <option value="1">${langText.monday}</option>\
                                        <option value="2">${langText.tuesday}</option>\
                                        <option value="3">${langText.wednesday}</option>\
                                        <option value="4">${langText.thursday}</option>\
                                        <option value="5">${langText.friday}</option>\
                                        <option value="6">${langText.saturday}</option>\
                                    </select>\
                                </div>\
                            </div>`,

    timeInequalityBox_4 : `<div class="kintoneplugin-select-outer">\
                                <div class="kintoneplugin-select-inequality">\
                                    <select class="condition-inequality-select datetime-inequality-select-month">\
                                        <option value="ALL">${langText.all}</option>\
                                        <option value="1">1${langText.date}</option>\
                                        <option value="2">2${langText.date}</option>\
                                        <option value="3">3${langText.date}</option>\
                                        <option value="4">4${langText.date}</option>\
                                        <option value="5">5${langText.date}</option>\
                                        <option value="6">6${langText.date}</option>\
                                        <option value="7">7${langText.date}</option>\
                                        <option value="8">8${langText.date}</option>\
                                        <option value="9">9${langText.date}</option>\
                                        <option value="10">10${langText.date}</option>\
                                        <option value="11">11${langText.date}</option>\
                                        <option value="12">12${langText.date}</option>\
                                        <option value="13">13${langText.date}</option>\
                                        <option value="14">14${langText.date}</option>\
                                        <option value="15">15${langText.date}</option>\
                                        <option value="16">16${langText.date}</option>\
                                        <option value="17">17${langText.date}</option>\
                                        <option value="18">18${langText.date}</option>\
                                        <option value="19">19${langText.date}</option>\
                                        <option value="20">20${langText.date}</option>\
                                        <option value="21">21${langText.date}</option>\
                                        <option value="22">22${langText.date}</option>\
                                        <option value="23">23${langText.date}</option>\
                                        <option value="24">24${langText.date}</option>\
                                        <option value="25">25${langText.date}</option>\
                                        <option value="26">26${langText.date}</option>\
                                        <option value="27">27${langText.date}</option>\
                                        <option value="28">28${langText.date}</option>\
                                        <option value="29">29${langText.date}</option>\
                                        <option value="30">30${langText.date}</option>\
                                        <option value="31">31${langText.date}</option>\
                                        <option value="LAST">${langText.last_day}</option>\
                                    </select>\
                                </div>\
                            </div>`,

    textInputBox : '<div class="kintoneplugin-input-outer">\
                        <input class="kintoneplugin-input-text condition-word-input-ja" type="text">\
                        <input class="kintoneplugin-input-text condition-word-input-en" type="text" style="display:none;">\
                        <input class="kintoneplugin-input-text condition-word-input-zh" type="text" style="display:none;">\
                        <button class="lang-btn-text-selected" value="ja">Ja</button>\
                        <button class="lang-btn-text" value="en">En</button>\
                        <button class="lang-btn-text" value="zh">Zh</button>\
                    </div>',

    numInputBox : '<div class="kintoneplugin-input-outer">\
                        <input class="kintoneplugin-input-text-short condition-word-input" type="text">\
                    </div>',

    userInputBox : `<div class="kintoneplugin-input-outer">\
                        <input class="kintoneplugin-input-text condition-word-input" type="text" placeholder="${langText.user_placeholder}">\
                    </div>`,

    timeInputBox : '<div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-select">\
                        <select name="condition-inequality-select" class="condition-word-input">\
                            <option value="00:00">00:00</option>\
                            <option value="00:30">00:30</option>\
                            <option value="01:00">01:00</option>\
                            <option value="01:30">01:30</option>\
                            <option value="02:00">02:00</option>\
                            <option value="02:30">02:30</option>\
                            <option value="03:00">03:00</option>\
                            <option value="03:30">03:30</option>\
                            <option value="04:00">04:00</option>\
                            <option value="04:30">04:30</option>\
                            <option value="05:00">05:00</option>\
                            <option value="05:30">05:30</option>\
                            <option value="06:00">06:00</option>\
                            <option value="06:30">06:30</option>\
                            <option value="07:00">07:00</option>\
                            <option value="07:30">07:30</option>\
                            <option value="08:00">08:00</option>\
                            <option value="08:30">08:30</option>\
                            <option value="09:00">09:00</option>\
                            <option value="09:30">09:30</option>\
                            <option value="10:00">10:00</option>\
                            <option value="10:30">10:30</option>\
                            <option value="11:00">11:00</option>\
                            <option value="11:30">11:30</option>\
                            <option value="12:00">12:00</option>\
                            <option value="12:30">12:30</option>\
                            <option value="13:00">13:00</option>\
                            <option value="13:30">13:30</option>\
                            <option value="14:00">14:00</option>\
                            <option value="14:30">14:30</option>\
                            <option value="15:00">15:00</option>\
                            <option value="15:30">15:30</option>\
                            <option value="16:00">16:00</option>\
                            <option value="16:30">16:30</option>\
                            <option value="17:00">17:00</option>\
                            <option value="17:30">17:30</option>\
                            <option value="18:00">18:00</option>\
                            <option value="18:30">18:30</option>\
                            <option value="19:00">19:00</option>\
                            <option value="19:30">19:30</option>\
                            <option value="20:00">20:00</option>\
                            <option value="20:30">20:30</option>\
                            <option value="21:00">21:00</option>\
                            <option value="21:30">21:30</option>\
                            <option value="22:00">22:00</option>\
                            <option value="22:30">22:30</option>\
                            <option value="23:00">23:00</option>\
                            <option value="23:30">23:30</option>\
                        </select>\
                        </div>\
                    </div>',

    selectInputBox : `<div class="kintoneplugin-dropdown-list condition-word-select-ja">\
                        <div class="kintoneplugin-dropdown-list-default">\
                            <span class="kintoneplugin-dropdown-list-item-name">${langText.selected} </span>\
                            <span class="kintoneplugin-dropdown-list-item-name-blue">0</span>\
                            <span class="kintoneplugin-dropdown-list-item-name"> ${langText.ken}</span>\
                        </div>\
                        <div class="kintoneplugin-dropdown-list-toggle">\
                            <div class="kintoneplugin-dropdown-list-toggle-icon" title="Show fields"></div>\
                        </div>\
                    </div>\
                    <div class="kintoneplugin-dropdown-list condition-word-select-en" style="display:none">\
                        <div class="kintoneplugin-dropdown-list-default">\
                            <span class="kintoneplugin-dropdown-list-item-name">${langText.selected} </span>\
                            <span class="kintoneplugin-dropdown-list-item-name-blue">0</span>\
                            <span class="kintoneplugin-dropdown-list-item-name"> ${langText.ken}</span>\
                        </div>\
                        <div class="kintoneplugin-dropdown-list-toggle">\
                            <div class="kintoneplugin-dropdown-list-toggle-icon" title="Show fields"></div>\
                        </div>\
                    </div>\
                    <div class="kintoneplugin-dropdown-list condition-word-select-zh" style="display:none">\
                        <div class="kintoneplugin-dropdown-list-default">\
                            <span class="kintoneplugin-dropdown-list-item-name">${langText.selected} </span>\
                            <span class="kintoneplugin-dropdown-list-item-name-blue">0</span>\
                            <span class="kintoneplugin-dropdown-list-item-name"> ${langText.ken}</span>\
                        </div>\
                    <div class="kintoneplugin-dropdown-list-toggle">\
                        <div class="kintoneplugin-dropdown-list-toggle-icon" title="Show fields"></div>\
                    </div>\
                </div>\
                <button class="lang-btn-select-selected" value="ja">Ja</button>\
                <button class="lang-btn-select" value="en">En</button>\
                <button class="lang-btn-select" value="zh">Zh</button>`
};
window.kintoneplugin_partsHTML = partsHTML;