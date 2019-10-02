(function() {
  'use strict';
  var obj = {};
  obj.Error = {
    ja: {
      e1: 'フィールドの取得に失敗しました。再度読み込んでください。',
      e2: '設定行は30行までです。',
      e3: '条件項目が選択されておりません。',
      e4: '条件項目が重複しています。',
      e5: '条件項目の元サブテーブルが異なります。',
      e6: '行目: 集計条件1が選択されておりません。',
      e7: '行目: 集計元フィールドが選択されておりません。',
      e8: '行目: 集計元フィールドの計算式にべき乗が含まれております。',
      e9: '行目: 集計元フィールドの計算式にSUMが含まれております。',
      e10: '行目: 集計先フィールドが選択されておりません。',
      e11: '行目: 集計先フィールドが他の行と重複しています。',
      hoka: '他',
      ken: '件'
    },
    en: {
      e1: 'Failed to get field. Please reload.',
      e2: 'The setting line is up to 30 lines.',
      e3: 'Condition field is not selected.',
      e4: 'Condition item is duplicated.',
      e5: 'The source sub-table of the condition field is different.',
      e6: ' Row: Condition field 1 is not selected.',
      e7: ' Row: The aggregation source field is not selected.',
      e8: ' Row: The formula of the aggregation source field contains the power.',
      e9: ' Row: SUM is included in the calculation formula of the aggregation source field.',
      e10: ' Row: The aggregation target field is not selected.',
      e11: ' Row: The aggregation target field is duplicated with other rows.',
      hoka: 'Other ',
      ken: ' Errors'
    }
  };
  window.kintone_Conditional_Summation_Plugin = obj;
})();
