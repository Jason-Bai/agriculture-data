var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    categories1 = require('./data/categories1.json'),
    categories2 = require('./data/categories.json'),
    Category = require('./models/category'),
    Db = require('./libs/db'),
    mongoose = require('mongoose'),
    now = moment().format('YYYY-MM-DD HH:mm:ss');

// connect to Db
Db();

/**
 * sync v1s
 */
function syncV1s(categories, cb) {
    async.mapSeries(categories, function (category, cb1) {
        var v1 = {
          c_name: category,
          level: 1,
          parentId: mongoose.Types.ObjectId('000000000000000000000000'),
          isDelete: 0,
          createdAt: now,
          updatedAt: now
        };
        Category.create(v1, function (err, _v1) {
          if (err) {
            return cb1(err);
          }
          return cb1(null, _v1);
        });
    }, function (err, results) {
        if (err) {
          return cb(err);
        }
        return cb(null, results);
    })
}

/**
 * remove all
 */
function removeAll(cb) {
  Category.remove({}, cb)
}


/**
 * sync v2s
 */
function syncV2s(categories, cb) {
  async.mapSeries(categories, function (category, cb1) {
      var c_name = category.c_name,
          v2s = _.filter(categories2, function (c) {
            return c.v1 === c_name;
          });

      async.map(v2s, function (v2, cb2) {
        var _v2 = {
          c_name: v2.v2,
          level: 2,
          parentId: mongoose.Types.ObjectId(category._id),
          isDelete: 0,
          createdAt: now,
          updatedAt: now
        };

        Category.create(_v2, function (err, __v2) {
          if (err) {
            return cb2(err);
          }
          return cb2(null, __v2);
        });
			}, function (err, results) {
				if (err) {
					return cb1(err);
				}
				return cb1(null, results);
			});
  }, function (err, results) {
      if (err) {
        return cb(err);
      }
      return cb(null, results);
  });
}


/**
 * sync
 */
function sync() {
  async.waterfall([
    // remove all categories
    function (cb) {
      var hook = {};
      removeAll(function (err) {
        if (err) {
          return cb(err);
        }
        return cb(null, hook);
      })
    },
    // sync v1
    function (hook, cb) {
      var v1s = _.chain(categories1).map('v1').map('c_name').uniq().value();
      syncV1s(v1s, function (err, results) {
          if (err) {
            return (err);
          }
          hook.v1s = results
          return cb(null, hook);
      });
    },
    function (hook, cb) {
      syncV2s(hook.v1s, function (err, results) {
        if (err) {
          return cb(err);
        }
        hook.v2s = _.flatten(results);
        return cb(null, hook);
      });
    }
  ], function (err, results) {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    console.log(results);
  })
}

sync();


/**********************************  connect to db **********************************


function buildModels(categories) {

    var models = [],
        now = moment().format('YYYY-MM-DD HH:mm:ss');

    _.each(categories, function (category) {

        var _models = {};

        var _modelV1 = {
            c_name: category.v1,
            level: 1,
            createdAt: now,
            updatedAt: now
        }

        _models.v1 = _modelV1;

        var _modelV2 = {
            c_name: category.v2,
            level: 2,
            createdAt: now,
            updatedAt: now
        }

        _models.v2 = _modelV2;

        _models.v3 = [];

        _.each(category.children, function (childCategory){

            var _modelV3 = {
                c_name: childCategory,
                level: 3,
                createdAt: now,
                updatedAt: now
            }

            _models.v3.push(_modelV3)

        })

        models.push(_models);

    });

    return models;

}

var models = buildModels(categories);

console.log(JSON.stringify(models));
*/
