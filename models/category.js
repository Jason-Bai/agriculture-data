var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var CategorySchema = Schema({
	c_name: String,
	level: {
		type: Number,
		default: 1
	},
	parentId: Schema.Types.ObjectId,
	creatorId: Schema.Types.ObjectId,
	isDelete: Number,
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

module.exports = mongoose.model('Category', CategorySchema);