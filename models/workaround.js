var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var workaroundSchema = new Schema({
    id_num: { type: Number, unique: true },
    procedure: { type: String, Required: 'Procedure cannot be left blank.' },
    workaround: { type: String, Required: 'Workaround cannot be left blank.' }
});

autoIncrement.initialize(mongoose.connection);
workaroundSchema.plugin(autoIncrement.plugin, { model: 'Workaround', field: 'id_num', startAt: 1, incrementBy: 1 });

var workaround = mongoose.model('workaround', workaroundSchema, 'workaround');
module.exports = workaround;