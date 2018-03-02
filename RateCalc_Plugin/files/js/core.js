jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';
  var editEvents = ['app.record.create.show', 'app.record.edit.show'];

  // get rate from "currencylayer" or "open exchange rates"
  var FuncRateCalc = function(conf) {
    if (conf.service === 'ocr') {
      var url = 'https://openexchangerates.org/api/latest.json?app_id=' + conf.apikey + '&base=' + conf.crrFrom;
      kintone.proxy(url, 'GET', {}, {}, function(resp) {
        var parse_resp = JSON.parse(resp);
        if (!parse_resp.status) {
          $.each(parse_resp.rates, function(rule, value) {
            if (rule === conf.crrTo) {
              var record = kintone.app.record.get();
              record.record[conf.num].value = value;
              kintone.app.record.set(record);
            }
          });
        } else {
          if (kintone.getLoginUser().language === 'ja') {
            swal('Error', '処理に失敗しました。=> ' + parse_resp.description, 'error'); 
          } else {
            swal('Error', 'Processing failed. => ' + parse_resp.description, 'error'); 
          }
        }
      });
    } else if (conf.service === 'cl') {
      var url = 'http://www.apilayer.net/api/live?access_key=' + conf.apikey + '&source=' + conf.crrFrom;
      kintone.proxy(url, 'GET', {}, {}, function(resp) {
        var parse_resp = JSON.parse(resp);
        if (parse_resp.success !== false) {
          $.each(parse_resp.quotes, function(rule, value) {
            if (rule === conf.crrFrom + conf.crrTo) {
              var record = kintone.app.record.get();
              record.record[conf.num].value = value;
              kintone.app.record.set(record);
            }
          });
        } else {
          if (kintone.getLoginUser().language === 'ja') {
            swal('Error', '処理に失敗しました。=> ' + parse_resp.error.info, 'error'); 
          } else {
            swal('Error', 'Processing failed. => ' + parse_resp.description, 'error');             
          }
        }
      });
    }
  };

  // get button create
  var FuncCreateBtn = function() {
    var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (document.getElementById ('getbtn') !== null) return;
    var $div = $('<div id="getbtn"></div>');
    $div.append('<button id="getRate" class="kintoneplugin-button-dialog-ok" type="submit" value="Get Rate">Get Rate</button>');
    var space = kintone.app.record.getSpaceElement(conf.space);
    $(space).append($div);

    $('#getbtn').on('click', function() {
      FuncRateCalc(conf);
    });
  };

  kintone.events.on(editEvents, function(event) {
    FuncCreateBtn();
  });
})(jQuery, kintone.$PLUGIN_ID);