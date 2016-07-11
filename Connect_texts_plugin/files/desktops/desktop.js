(function(PLUGIN_ID){
	"use strict"

	var confevents = ['app.record.create.show',
					  'app.record.edit.show']

	kintone.events.on(confevents, function event_create(event){
		var conf = kintone.plugin.app.getConfig(PLUGIN_ID);
		//設定値読み込み
		if(!conf) {
			return false;
		}
		var evselect1 = conf.select1;
		var evselect2 = conf.select2;
		var evselect3 = conf.select3;
		var evselect4 = conf.select4;
		var evselect5 = conf.select5;
		var lineNumber = conf.line_number;

		var valevents = ['app.record.edit.change.'+ evselect1,
			   			 'app.record.edit.change.'+ evselect2,
				 		 'app.record.edit.change.'+ evselect3,
				 		 'app.record.edit.change.'+ evselect4,
						 'app.record.edit.change.'+ evselect5,

						 'app.record.create.change.'+ evselect1,
						 'app.record.create.change.'+ evselect2,
						 'app.record.create.change.'+ evselect3,
						 'app.record.create.change.'+ evselect4,
						 'app.record.create.change.'+ evselect5]

		kintone.events.on(valevents, function connect_texts(event){

			var cdconf = kintone.plugin.app.getConfig(PLUGIN_ID);
			var record = event.record;

			var cdselect1 = cdconf.select1;
			var cdselect2 = cdconf.select2;
			var cdselect3 = cdconf.select3;
			var cdselect4 = cdconf.select4;
			var cdselect5 = cdconf.select5;
			var cdcopyfield = cdconf.copyfield;
			var cdbetween = cdconf.between;
			if(cdbetween == "space"){
				cdbetween = "\u0020";
			}

			var jointext = [];
			for(var j=1; j<=lineNumber; j++){
				if(!(record[String(conf["select"+j])]['value'] == "") | !(record[String(conf["select"+j])]['value'] == "undefined")){
					jointext.push(record[String(conf["select"+j])]['value'])
				}
			}
			console.log(jointext);
			record[String(cdcopyfield)]['value'] = String(jointext.join(cdbetween));
			return event;			
		});
	});
})(kintone.$PLUGIN_ID);