var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var Schema = new mongoose.Schema({
	original_url: String,
	code: Number
});

module.exports = mongoose.model("UrlMapping", Schema);