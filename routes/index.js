var express = require('express');
var router = express.Router();

var UrlMapping = require("../models/urlmapping");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:urlcode', function(req, res, next) {
	var urlcode = Number(req.params.urlcode);
	if (!Number.isInteger(urlcode)) {
		return res.json({
			error: "This URL does not exist in database"
  	});
	}
	UrlMapping.findOne({code: urlcode}, function(err, url) {
		if (err) throw err;
		if (url) { // URL exists in database
			return res.redirect(url.original_url);
		}
		else {
			return res.json({
				error: "This URL does not exist in database"
	  	});			
		}
	});
});

router.get('/new/:url*', function(req, res, next) {

	var matcher = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; // Regular Expression for URL validation

	var original_url = req.url.slice(5);

	if (!matcher.test(original_url)) {
		return res.json({
			error: "Invalid URL"
  	});
	}

	UrlMapping.findOne({original_url: original_url}, function(err, url) {
		if (err) throw err;
		if (url) { // URL already in database
		  return res.json({
		  	original_url: original_url, 
		  	short_url: (req.headers.host.indexOf("https") < 0 && req.headers.host.indexOf("localhost") < 0 ? "https://"+req.headers.host : req.headers.host) + "/" + url.code
		  });			
		}
		else { // New URL
			UrlMapping.count({}, function(err, currentEntries) {
				if (err) throw err;
				var newUrlMapping = new UrlMapping({
					original_url: original_url,
					code: currentEntries + 1
				});
				newUrlMapping.save(function(err, newEntry) {
					if (err) throw err;
				  return res.json({
				  	original_url: original_url, 
				  	short_url: (req.headers.host.indexOf("https") < 0 && req.headers.host.indexOf("localhost") < 0 ? "https://"+req.headers.host : req.headers.host) + "/" + newEntry.code
				  });							
				});	
      });					
		}
	});

});


module.exports = router;