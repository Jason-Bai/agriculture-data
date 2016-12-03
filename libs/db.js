var mongoose = require('mongoose'),
    configs = require('../configs');

var mongodbUrl = "mongodb://" + configs.db.user + ':' + configs.db.pass + '@' + configs.db.host + ":" + configs.db.port + "/" + configs.db.name;

module.exports = function () {
  mongoose.connect(mongodbUrl);
}
