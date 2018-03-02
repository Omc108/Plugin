jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    // プラグインIDの設定を取得
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    // html create
    var createhtml = function() {
        if (kintone.getLoginUser().language === 'ja') {
          $('.kintone-plugin-setting').html(
            '<div class="block">\
              <label class="kintoneplugin-label">\
                  <span>レート表示項目</span>\
                  <span class="kintoneplugin-require">必須</span>\
              </label>\
              <br >\
              <div class="kintoneplugin-row">レート情報を表示する数値フィールドを選択してください。</div>\
              <div class="kintoneplugin-select-outer">\
                  <div class="kintoneplugin-select">\
                      <select name="num-select" id= "num-select">\
                          <option value="">-----</option>\
                      </select>\
                  </div>\
              </div>\
            </div>\
            <br >\
            <!--スペース設定-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>ボタン表示項目</span>\
                    <span class="kintoneplugin-require">必須</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">追加ボタンを表示するスペースフィールドを選択してください。\
                <br >スペースフィールドは数値フィールドの右隣りに設置すると見た目が良いです。</div>\
                <div class="kintoneplugin-select-outer">\
                    <div class="kintoneplugin-select">\
                        <select name="space-select" id="space-select">\
                            <option value="">-----</option>\
                        </select>\
                    </div>\
                </div>\
            </div>\
            <br >\
            <!--通貨設定-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>通貨設定</span>\
                    <span class="kintoneplugin-require">必須</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">変換する通貨を選択してください。左側がベース通貨となります。<br >\
                ※Free Planではベース通貨は米ドルしか選べません。</div>\
                <div class="kintoneplugin-select-outer">\
                    <div class="kintoneplugin-select">\
                        <select name="currency-from-select" id="currency-from-select">\
                            <option value="">-----</option>\
                            <option value="JPY">日本円</option>\
                            <option value="USD">米ドル</option>\
                            <option value="EUR">ユーロ</option>\
                            <option value="AUD">豪ドル</option>\
                            <option value="CAD">カナダドル</option>\
                            <option value="GBP">英ポンド</option>\
                            <option value="CNY">中国元</option>\
                            <option value="MXN">メキシコペソ</option>\
                        </select>\
                    </div>\
                </div>\
                <span style="padding: 0 8px;"><i class="fa fa-lg fa-exchange" aria-hidden="true"></i></span>\
                <div class="kintoneplugin-select-outer">\
                    <div class="kintoneplugin-select">\
                        <select name="currency-to-select" id="currency-to-select">\
                            <option value="">-----</option>\
                            <option value="JPY">日本円</option>\
                            <option value="USD">米ドル</option>\
                            <option value="EUR">ユーロ</option>\
                            <option value="AUD">豪ドル</option>\
                            <option value="CAD">カナダドル</option>\
                            <option value="GBP">英ポンド</option>\
                            <option value="CNY">中国元</option>\
                            <option value="MXN">メキシコペソ</option>\
                    </select>\
                    </div>\
                </div>\
            </div>\
            <br >\
            <!--サービスチェック-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>為替取得サービス選択</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">有効にするサービスを選択してください。各サービスの詳細は下記になります。<br >\
                <a href="https://currencylayer.com" target="_blank">currencylayer official site</a> , <a href="https://openexchangerates.org" target="_blank">open exchange rates official site</a></div>\
                <div class="kintoneplugin-input-radio">\
                    <span class="kintoneplugin-input-radio-item">\
                        <input type="radio" id="currencylayer" name="service-select" value="cl">\
                        <label for="currencylayer">currencylayer</label>　\
                    </span>\
                    <span class="kintoneplugin-input-radio-item">\
                        <input type="radio" id="open-exchange-rates" name="service-select" value="ocr">\
                        <label for="open-exchange-rates">open exchange rates</label>\
                    </span>\
                </div>\
            </div>\
            <br >\
            <!--APIキー-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>Access Key, App ID設定</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">選択したサービスのキー情報を設定ください。</div>\
                <div class="kintoneplugin-input-outer">\
                    <input id="api-key" class="kintoneplugin-input-text word-input" type="text">\
                </div>\
            </div>\
            <br >\
            <!--保存・キャンセルボタン-->\
            <div class="block"> \
                <button type="button" id="rate-plugin-submit" class="kintoneplugin-button-dialog-ok">保存する</button>\
                <span class="kintoneplugin-button-between"/>\
                <button type="button" id="rate-plugin-cancel" class="kintoneplugin-button-dialog-cancel">キャンセル</button>\
            </div>'
          )      
        } else {
          $('.kintone-plugin-setting').html(
            '<div class="block">\
              <label class="kintoneplugin-label">\
                  <span>Set Value Field</span>\
                  <span class="kintoneplugin-require">Require</span>\
              </label>\
              <br >\
              <div class="kintoneplugin-row">Please select a number field to set rate value.</div>\
              <div class="kintoneplugin-select-outer">\
                  <div class="kintoneplugin-select">\
                      <select name="num-select" id= "num-select">\
                          <option value="">-----</option>\
                      </select>\
                  </div>\
              </div>\
            </div>\
            <br >\
            <!--スペース設定-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>Shown Button Field</span>\
                    <span class="kintoneplugin-require">Require</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">Please select a space field to display the button.\
                <br >Space field should be placed on the right side of number field</div>\
                <div class="kintoneplugin-select-outer">\
                    <div class="kintoneplugin-select">\
                        <select name="space-select" id="space-select">\
                            <option value="">-----</option>\
                        </select>\
                    </div>\
                </div>\
            </div>\
            <br >\
            <!--通貨設定-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>Set Convert Currency</span>\
                    <span class="kintoneplugin-require">Require</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">Please select the currencies to convert. Left side is the based currency.<br >※In the Free Plan, the based currency can only select in US dollar.</div>\
                <div class="kintoneplugin-select-outer">\
                    <div class="kintoneplugin-select">\
                        <select name="currency-from-select" id="currency-from-select">\
                            <option value="">-----</option>\
                            <option value="JPY">Japanese Yen</option>\
                            <option value="USD">US Dollar</option>\
                            <option value="EUR">Euro</option>\
                            <option value="AUD">Australian Dollar</option>\
                            <option value="CAD">Canadian Dollar</option>\
                            <option value="GBP">British Pound</option>\
                            <option value="CNY">Chinese Yuan</option>\
                            <option value="MXN">Mexican Peso</option>\
                        </select>\
                    </div>\
                </div>\
                <span style="padding: 0 8px;"><i class="fa fa-lg fa-exchange" aria-hidden="true"></i></span>\
                <div class="kintoneplugin-select-outer">\
                    <div class="kintoneplugin-select">\
                        <select name="currency-to-select" id="currency-to-select">\
                            <option value="">-----</option>\
                            <option value="JPY">Japanese Yen</option>\
                            <option value="USD">US Dollar</option>\
                            <option value="EUR">Euro</option>\
                            <option value="AUD">Australian Dollar</option>\
                            <option value="CAD">Canadian Dollar</option>\
                            <option value="GBP">British Pound</option>\
                            <option value="CNY">Chinese Yuan</option>\
                            <option value="MXN">Mexican Peso</option>\
                    </select>\
                    </div>\
                </div>\
            </div>\
            <br >\
            <!--サービスチェック-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>Select Exchange Rate Service</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">Please select a exchange rate service of available. Each detail of services are below.<br >\
                <a href="https://currencylayer.com" target="_blank">currencylayer official site</a> , <a href="https://openexchangerates.org" target="_blank">open exchange rates official site</a></div>\
                <div class="kintoneplugin-input-radio">\
                    <span class="kintoneplugin-input-radio-item">\
                        <input type="radio" id="currencylayer" name="service-select" value="cl">\
                        <label for="currencylayer">currencylayer</label>　\
                    </span>\
                    <span class="kintoneplugin-input-radio-item">\
                        <input type="radio" id="open-exchange-rates" name="service-select" value="ocr">\
                        <label for="open-exchange-rates">open exchange rates</label>\
                    </span>\
                </div>\
            </div>\
            <br >\
            <!--APIキー-->\
            <div class="block">\
                <label class="kintoneplugin-label">\
                    <span>Set Access Key / App ID</span>\
                </label>\
                <br >\
                <div class="kintoneplugin-row">Pselase set information for key selected service</div>\
                <div class="kintoneplugin-input-outer">\
                    <input id="api-key" class="kintoneplugin-input-text word-input" type="text">\
                </div>\
            </div>\
            <br >\
            <!--保存・キャンセルボタン-->\
            <div class="block"> \
                <button type="button" id="rate-plugin-submit" class="kintoneplugin-button-dialog-ok">Submit</button>\
                <span class="kintoneplugin-button-between"/>\
                <button type="button" id="rate-plugin-cancel" class="kintoneplugin-button-dialog-cancel">Cancel</button>\
            </div>'
            )
        }
    }
    // 設定値を保持する
    function setDefault() {
        if (conf) {
            $('#num-select').val(conf.num);
            $('#space-select').val(conf.space);
            $('#currency-from-select').val(conf.crrFrom);
            $('#currency-to-select').val(conf.crrTo);
            $('#api-key').val(conf.apikey);
            if (conf.service === 'cl') {
                $('#currencylayer').attr('checked', true);
                $('#open-exchange-rates').attr('checked', false);
            } else if (conf.service === 'ocr') {
                $('#currencylayer').attr('checked', false);
                $('#open-exchange-rates').attr('checked', true);
            }
        }
        return;
    }
    // フォーム設計情報を取得し、選択ボックスに代入する
    function setValues() {
        var param = {};
        param.app = kintone.app.getId();
        kintone.api('/k/v1/preview/form', 'GET', param, function(resp) {
            for (var key in resp.properties) {
                var prop = resp.properties[key];
                var $option = $('<option>');

                switch (prop.type) {
                    case 'NUMBER':
                        $option.attr('value', prop.code);
                        $option.text(prop.label);
                        $('#num-select').append($option.clone());
                    break;

                    case 'SPACER':
                        $option.attr('value', prop.elementId);
                        $option.text(prop.elementId);
                        $('#space-select').append($option.clone());
                        break;

                    default :
                        break;
                }
            }
            setDefault();
        });
    }
    // エラーチェック
    function checkValues() {
        if ($('#num-select').val() === '') {
            if (kintone.getLoginUser().language === 'ja') {
                swal('Error!', '数値項目を選択してください。', 'error'); 
            } else {
                swal('Error!', 'Please select the number field', 'error'); 
            }
            return false;
        }
        if ($('#space-select').val() === '') {
            if (kintone.getLoginUser().language === 'ja') {
                swal('Error!', 'スペース項目を選択してください。', 'error');
            } else {
                swal('Error!', 'Please select the space field', 'error'); 
            }
            return false;
        }
        if ($('#currency-from-select').val() === '') {
            if (kintone.getLoginUser().language === 'ja') {
                swal('Error!', '通貨設定は必須です。', 'error');
            } else {
                swal('Error!', 'Please setting the currency', 'error'); 
            }
            return false;
        }
        if ($('#currency-to-select').val() === '') {
            if (kintone.getLoginUser().language === 'ja') {
                swal('Error!', '通貨設定は必須です。', 'error');
            } else {
                swal('Error!', 'Please setting the currency', 'error'); 
            }
            return false;
        }
        return true;
    }
    createhtml();
    //「保存する」ボタン押下時に入力情報を設定する
    $('#rate-plugin-submit').on('click', function() {
        if(!checkValues()) return;
        var config = [];
        config.num = $('#num-select').val();
        config.space = $('#space-select').val();
        config.crrFrom = $('#currency-from-select').val();
        config.crrTo = $('#currency-to-select').val();
        config.apikey = $('#api-key').val();
        if ($('#currencylayer:checked').val()) config.service = $('#currencylayer:checked').val();
        if ($('#open-exchange-rates:checked').val()) config.service = $('#open-exchange-rates:checked').val();
        kintone.plugin.app.setConfig(config);
    });
    //「キャンセル」ボタン押下時の処理
    $('#rate-plugin-cancel').on('click', function() {
        window.history.back();
    });
    setValues();
})(jQuery, kintone.$PLUGIN_ID);