const express = require('express');
const Movie = require('../models/schema');
const imdb = require('../imdb');
const router = express.Router();


router.get('/search',async (request, response) => {
  let limit = 5;
  let metascore = 0;
  if(request.query.metascore) metascore = Number(request.query.metascore);
	if(request.query.limit) limit = Number(request.query.limit);
  try{
    const search = await Movie.aggregate([{$match: {metascore: {$gt: metascore}}}, {$sample: {size: limit}}, {$sort: {metascore: -1}}]);
console.log(search);
    response.json(search);
  }
	catch(err) {
		response.json({message: err});
	}
});

router.get('/populate/:id', async (request, response) => {
  let films;

  films = await imdb(request.params.id);

  for (f of films) {
    console.log(f.title);
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
            const specMovie = await Movie.findOne({"id":f.id});
            if(specMovie == null)
            {
              await db.save();
            }
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


router.get('/:id',async (request, response) => {
  try{
    const specMovie = await Movie.findOne({"id":request.params.id});
    console.log(specMovie);
    response.json(specMovie)
  }
	catch(err) {
		response.json({message: err});
	}
});

router.get('/',async (request, response) => {
  try{
    const randMovie = await Movie.aggregate([{ $match: { metascore: { $gt: 77 } } }, { $sample: { size: 1 } }]);
    console.log(randMovie);
    response.json(randMovie)
  }
	catch(err) {
		response.json({message: err});
	}
});

router.post('/:id', async (request, response) => {
	let movie;
	try {
		movie = await Movie.findOne({"id": request.params.id});
		await Movie.updateOne({ _id: movie._id }, {watch_date: request.body.date, review: request.body.review});
		response.send({ _id: movie._id });
	}
	catch(err) {
		response.json({message: err});
	}
});



module.exports = router;
