jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';
  // html create
  var createhtml = function() {
    if (kintone.getLoginUser().language === 'ja') {
      $('.kintone-plugin-setting').html(
        '<div class="block">\
          <div class="block">\
          <label class="kintoneplugin-label">\
            <span id ="container_label">条件項目</span>\
          </label>\
          <br >\
          <div class="kintoneplugin-row">条件別で集計したい選択型フィールドを選択下さい。</div>\
          <div class="kintoneplugin-select-outer">\
            <div class="kintoneplugin-row">条件項目１：</div>\
              <div class="kintoneplugin-select">\
                <select name="process-previous" class="condition-a">\
                  <option value=""> ----- </option>\
                </select>\
              </div>\
            </div>\
          <span class="flow-icon" style="padding:0 15px;"> </span>\
          <div class="kintoneplugin-select-outer">\
            <div class="kintoneplugin-row">条件項目２：</div>\
              <div class="kintoneplugin-select">\
                <select name="process-next" class="condition-b">\
                  <option value=""> ----- </option>\
                </select>\
              </div>\
            </div>\
          </div>\
          <br >\
          <div class="block">\
          <label class="kintoneplugin-label">\
            <span id ="container_label">集計項目</span>\
          </label>\
          <br >\
          <div class="kintoneplugin-row">条件別で集計したい選択型フィールドを選択下さい。</div>\
          <br >\
          <div class="kintoneplugin-input-radio">\
            <span class="kintoneplugin-input-radio-item">\
              <input type="radio" id="totalization-type-choice" name="service-select" value="choice" checked="checked">\
              <label for="totalization-type-choice">条件を絞り、格納用フィールドを選択（30件まで）</label>　\
            </span>\
          </div>\
          <table class="kintoneplugin-table">\
            <thead>\
              <tr>\
                <th class="kintoneplugin-table-th">\
                  <span class="title">\
                    <label class="kintoneplugin-row"><span id ="container_label">集計条件 </span></label><br >\
                  </span>\
                </th>\
                <th class="kintoneplugin-table-th">\
                  <span class="title">\
                    <label class="kintoneplugin-row"><span id ="container_label">集計数値 </span></label><br >\
                  </span>\
                </th>\
                <th class="kintoneplugin-table-th">\
                  <span class="title">\
                    <label class="kintoneplugin-row"><span id ="container_label">格納フィールド </span></label><br >\
                  </span>\
                </th>\
                <th class="kintoneplugin-table-th-blankspace"></th>\
              </tr>\
            </thead>\
            <tbody>\
              <tr>\
                <td>\
                  <div class="kintoneplugin-table-td-control">\
                    <div class="kintoneplugin-table-td-control-value">\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">条件項目１：</div>\
                        <div class="kintoneplugin-select">\
                          <select name="process-previous" class="condition-a-value">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                      <span class="flow-icon-cross"> × </span>\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">条件項目２：</div>\
                        <div class="kintoneplugin-select">\
                          <select name="process-next" class="condition-b-value">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </td>\
                <td>\
                  <div class="kintoneplugin-table-td-control">\
                    <div class="kintoneplugin-table-td-control-value">\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">　</div>\
                        <div class="kintoneplugin-select">\
                          <select name="num-select" class="num-select">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </td>\
                <td>\
                  <div class="kintoneplugin-table-td-control">\
                    <div class="kintoneplugin-table-td-control-value">\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">　</div>\
                          <div class="kintoneplugin-select">\
                            <select name="num-select" class="result-select">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </td>\
                <td class="kintoneplugin-table-td-operation">\
                <button type="button" class="kintoneplugin-button-add-row-image" title="Add row"></button>\
                <button type="button" class="kintoneplugin-button-remove-row-image" title="Delete this row"></button>\
                </td>\
              </tr>\
            </tbody>\
          </table>\
          </div>\
          <br >\
          <div class="block" style="margin-top: 20px;"> \
            <button type="button" class="category-summarization-submit kintoneplugin-button-dialog-ok">Submit</button>\
            <span class="kintoneplugin-button-between"/>\
            <button type="button" class="category-summarization-cancel kintoneplugin-button-dialog-cancel">Cancel</button>\
          </div>\
        </div>'
      ); 
    } else {
      $('.kintone-plugin-setting').html(
        '<div class="block">\
          <div class="block">\
          <label class="kintoneplugin-label">\
            <span id ="container_label">Condition</span>\
          </label>\
          <br >\
          <div class="kintoneplugin-row">Choose a dropdown filed used for defining the condition of Sub-Category Calculation.</div>\
          <div class="kintoneplugin-select-outer">\
            <div class="kintoneplugin-row">Condition Field 1:</div>\
              <div class="kintoneplugin-select">\
                <select name="process-previous" class="condition-a">\
                  <option value=""> ----- </option>\
                </select>\
              </div>\
            </div>\
          <span class="flow-icon" style="padding:0 15px;"> </span>\
          <div class="kintoneplugin-select-outer">\
            <div class="kintoneplugin-row">Condition Field 2:</div>\
              <div class="kintoneplugin-select">\
                <select name="process-next" class="condition-b">\
                  <option value=""> ----- </option>\
                </select>\
              </div>\
            </div>\
          </div>\
          <br >\
          <div class="block">\
          <label class="kintoneplugin-label">\
            <span id ="container_label">Calculation</span>\
          </label>\
          <br >\
          <div class="kintoneplugin-row">Select a category in a dropdown filed defined above and its value to calculate.</div>\
          <br >\
          <div class="kintoneplugin-input-radio">\
            <span class="kintoneplugin-input-radio-item">\
              <input type="radio" id="totalization-type-choice" name="service-select" value="choice" checked="checked">\
              <label for="totalization-type-choice">Define the condition and select a filed to display the calculation [Up to 30].</label>　\
            </span>\
          </div>\
          <table class="kintoneplugin-table">\
            <thead>\
              <tr>\
                <th class="kintoneplugin-table-th">\
                  <span class="title">\
                    <label class="kintoneplugin-row"><span id ="container_label">Category to calculate</span></label><br >\
                  </span>\
                </th>\
                <th class="kintoneplugin-table-th">\
                  <span class="title">\
                    <label class="kintoneplugin-row"><span id ="container_label">Value to calculate</span></label><br >\
                  </span>\
                </th>\
                <th class="kintoneplugin-table-th">\
                  <span class="title">\
                    <label class="kintoneplugin-row"><span id ="container_label">Field to display</span></label><br >\
                  </span>\
                </th>\
                <th class="kintoneplugin-table-th-blankspace"></th>\
              </tr>\
            </thead>\
            <tbody>\
              <tr>\
                <td>\
                  <div class="kintoneplugin-table-td-control">\
                    <div class="kintoneplugin-table-td-control-value">\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">Condition Field 1:</div>\
                        <div class="kintoneplugin-select">\
                          <select name="process-previous" class="condition-a-value">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                      <span class="flow-icon-cross"> × </span>\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">Condition Field 2:</div>\
                        <div class="kintoneplugin-select">\
                          <select name="process-next" class="condition-b-value">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </td>\
                <td>\
                  <div class="kintoneplugin-table-td-control">\
                    <div class="kintoneplugin-table-td-control-value">\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">　</div>\
                        <div class="kintoneplugin-select">\
                          <select name="num-select" class="num-select">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </td>\
                <td>\
                  <div class="kintoneplugin-table-td-control">\
                    <div class="kintoneplugin-table-td-control-value">\
                      <div class="kintoneplugin-select-outer">\
                        <div class="kintoneplugin-row-table">　</div>\
                          <div class="kintoneplugin-select">\
                            <select name="num-select" class="result-select">\
                            <option value=""> ----- </option>\
                          </select>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </td>\
                <td class="kintoneplugin-table-td-operation">\
                <button type="button" class="kintoneplugin-button-add-row-image" title="Add row"></button>\
                <button type="button" class="kintoneplugin-button-remove-row-image" title="Delete this row"></button>\
                </td>\
              </tr>\
            </tbody>\
          </table>\
          </div>\
          <br >\
          <div class="block" style="margin-top: 20px;"> \
            <button type="button" class="category-summarization-submit kintoneplugin-button-dialog-ok">Submit</button>\
            <span class="kintoneplugin-button-between"/>\
            <button type="button" class="category-summarization-cancel kintoneplugin-button-dialog-cancel">Cancel</button>\
          </div>\
        </div>'
      )
    }
  }
  createhtml();
})(jQuery, kintone.$PLUGIN_ID);