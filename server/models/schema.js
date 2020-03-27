const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  actor: {
		type: String
	},
	link: {
		type: String
	},
	id: {
		type: String
	},
	metascore: {
		type: Number
	},
	poster: {
		type: String
	},
	rating: {
		type: Number
	},
	synopsis: {
		type: String
	},
	title: {
		type: String
	},
	votes: {
		type: Number
	},
	year: {
		type: Number
	},
	date: {
		type: String
	},
	review: {
		type: String
	}
});

module.exports = mongoose.model('movie',movieSchema);
