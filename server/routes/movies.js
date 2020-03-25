const express = require('express');
const movie = require('../models/schema');
const imdb = require('../imdb');
const router = express.Router();

router.get('/populate/:id', async (request, response) => {
  let films;

  films = await imdb(request.params.id);
  for (f of films) {
		const db = new movie_item({
			actor: req.params.id,
			id: f.id,
			link: f.link,
			metascore: f.metascore,
			poster: f.poster,
			rating: f.rating,
			synopsis: f.synopsis,
			title: f.title,
			votes: f.votes,
			year: f.year
		});
    try {
  				await db.save();
  			}
  			catch (err) {
  				return res.status(500).json(err);
  			}};
});

router.get('/', (request, response) => {
  response.send({'ack': true});
});

module.exports = router;
