/*
  vote Plug-in
  Copyright (c) 2020 Cybozu
  Licensed under the MIT License
*/

jQuery.noConflict();
(function($) {
    'use strict';
    // html create
    let createhtml = function(lang) {
          let langText = kintoneplugin_lang[lang];
          $('.kintone-plugin-setting').html(
            `<!-- MAIN TABLE -->\
            <div class="block">\
              <label class="kintoneplugin-label">\
                <span id ="container_label">${langText.label_1}</span>\
              </label>\
              <br >\
              <div class="kintoneplugin-row">${langText.description_1}</div>\
              <table class="kintoneplugin-table">\
                <thead>\
                  <tr>\
                    <th class="kintoneplugin-table-th">\
                      <span class="title">\
                        <label class="kintoneplugin-row"><span id ="container_label">${langText.table_th_1}</span></label><br >\
                      </span>\
                    </th>\
                    <th class="kintoneplugin-table-th">\
                      <span class="title">\
                        <label class="kintoneplugin-row"><span id ="container_label">${langText.table_th_2}</span></label><br >\
                      </span>\
                    </th>\
                    <th class="kintoneplugin-table-th-blankspace"></th>\
                  </tr>\
                </thead>\
                <tbody>\
                  <tr>\
                    <td class="kintoneplugin-table-td-condition">\
                      <div class="kintoneplugin-condition-list">\
                        <div class="kintoneplugin-condition-container">\
                          <div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select">\
                              <select name="condition-field-select" class="condition-field-select">\
                                <option value="ALL"> ${langText.condition_all} </option>\
                              </select>\
                            </div>\
                          </div>\
                          <span class="kintoneplugin-additional-condition-container"></span>\
                          <span class="kintoneplugin-condition-low-operation float-right">\
                            <button type="button" class="kintoneplugin-button-remove-row-image condition-remove-low" title="${langText.button_dalete}"></button>\
                          </span>\
                        </div>\
                      </div>\
                      <div class="kintoneplugin-condition-low-operation">\
                        <button type="button" class="kintoneplugin-button-add-row-image condition-add-low" title="${langText.button_add}"></button>\
                      </div>\
                      <div class="kintoneplugin-input-radio">\
                        <span class="kintoneplugin-input-radio-item">\
                            <span class="terms-select terms-select-and terms-select-selected" value="and"></span>\
                            <label class="terms-select-label">${langText.condition_option_1}</label>\
                        </span>\
                        <span class="kintoneplugin-input-radio-item">\
                            <span class="terms-select terms-select-or" value="or"></span>\
                            <label class="terms-select-label">${langText.condition_option_2}</label>\
                        </span>\
                      </div>\
                    </td>\
                    <td class="kintoneplugin-table-td-method">\
                      <div class="kintoneplugin-method-list">\
                        <div class="kintoneplugin-method-container">\
                          <div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select">\
                              <select name="method-field-select" class="method-field-select">\
                                <option value=""> ----- </option>\
                              </select>\
                            </div>\
                          </div>\
                          <div class="kintoneplugin-select-outer">\
                            <div class="kintoneplugin-select">\
                              <select name="method-select" class="method-select">\
                                <option value=""> ----- </option>\
                                <option value="disabled-true"> ${langText.method_item_1} </option>\
                                <option value="disabled-false"> ${langText.method_item_2} </option>\
                                <option value="setfieldshown-true"> ${langText.method_item_3} </option>\
                                <option value="setfieldshown-false"> ${langText.method_item_4} </option>\
                              </select>\
                            </div>\
                          </div>\
                          <span class="kintoneplugin-method-low-operation">\
                            <button type="button" class="kintoneplugin-button-remove-row-image method-remove-low" title="${langText.button_dalete}"></button>\
                          </span>\
                        </div>\
                      </div>\
                      <div class="kintoneplugin-method-low-operation">\
                        <button type="button" class="kintoneplugin-button-add-row-image method-add-low" title="${langText.button_add}"></button>\
                      </div>\
                    </td>\
                    <td class="kintoneplugin-table-td-operation">\
                      <button type="button" class="kintoneplugin-button-add-row-image table-add-low" title="${langText.button_add}"></button>\
                      <button type="button" class="kintoneplugin-button-remove-row-image table-remove-low" title="${langText.button_dalete}"></button>\
                    </td>\
                  </tr>\
                </tbody>\
              </table>\
            </div>\
            <!-- OPTION -->\
            <div class="block">\
              <div class="kintone-content-block">\
                <label class="kintoneplugin-label">\
                    <span>${langText.label_2}</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">${langText.description_2}</div>\
                <div class="kintoneplugin-input-checkbox">\
                  <span class="kintoneplugin-input-checkbox-item">\
                    <input type="checkbox" name="coloring-condition-field" value="true" id="coloring-condition-field">\
                    <label for="coloring-condition-field">${langText.coloring_option}</label>\
                  </span>\
                </div>\
              </div>\
            </div>\
            <br >\
            <div class="kintone-content-clear"/>\
            <!-- SAVE/CANCEL BUTTON -->\
            <div class="kintone-content-btn"> \
                <button type="button" id="kintoneplugin-submit" class="kintoneplugin-button-dialog-ok">${langText.button_submit}</button>\
                <span class="kintoneplugin-button-between"/>\
                <button type="button" id="kintoneplugin-cancel" class="kintoneplugin-button-dialog-cancel">${langText.button_cancel}</button>\
            </div>`
        ); 
    }
    createhtml(kintone.getLoginUser().language);
})(jQuery);