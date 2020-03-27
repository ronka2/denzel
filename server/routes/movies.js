const express = require('express');
const Movie = require('../models/schema');
const imdb = require('../imdb');
const router = express.Router();

router.get('/populate/:id', async (request, response) => {
  let films;

  films = await imdb(request.params.id);

  for (f of films) {
      const db = new Movie({
  			actor: request.params.id,
  			id: f.id,
  			link: f.link,
  			metascore: f.metascore,
  			poster: f.poster,
  			rating: f.rating,
  			synopsis: f.synopsis,
  			title: f.title,
  			votes: f.votes,
  			year: f.year
  		})

      try {
            await db.save();
          }
          catch (err) {
            return response.status(500).json(err);
          };
    };

Movie.countDocuments({ actor:request.params.id }, function(err,count){
  if(err)
  {
    response.json({message:err});
  }
  else {
    {
      response.send({'total': count});
    }
  }
})

});

router.get('/',async (request, response) => {
  try{
    const randMovie = await Movie.aggregate([{ $match: { metascore: { $gt: 77 } } }, { $sample: { size: 1 } }]);
    response.json(randMovie)
  }
	catch(err) {
		res.json({message: err});
	}
});

module.exports = router;
