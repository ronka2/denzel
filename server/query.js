const Movie = require('./models/schema');
const imdb = require('./imdb');
const { GraphQLObjectType,GraphQLString, GraphQLInt,GraphQLList} = require('graphql');
const { popType, movieType, searchType, movieIdType } = require('./type.js');



//Define the Query
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        populate: {
            type: popType,
            args:{
              id: {type: GraphQLString}
            },
            resolve: async (_,args) => {
              try{
                let idFilms = args.id;
                let films = await imdb(idFilms);
                for (f of films) {
                  console.log(f.title);
                    const db = new Movie({
                      actor: id,
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
                    console.log(db);
                    const specMovie = await Movie.findOne({"id":f.id});
                    console.log(specMovie);
                    if(specMovie == null)
                    {
                      await db.save();
                    }
              }
              const movCount =Movie.countDocuments({ actor:request.params.id });
              console.log(movCount);
              return {total: movCount};
            }
              catch(err)
              {
                return {error: err.message};
              }
        }
    },
    randomMov: {
              type: movieType,
              resolve: async () => {
                try{

                  const randMovie = await Movie.aggregate([{ $match: { metascore: { $gt: 77 } } }, { $sample: { size: 1 } }]);
                  const { link, id, metascore, poster, rating, synopsis, title, votes, year } = randMovie[0];
                  return {
              			link,
              			id,
              			metascore,
              			poster,
              			rating,
              			synopsis,
              			title,
              			votes,
              			year
              		};
                }
                catch(err)
                {
                  return {error: err.message};
                }
              }
            },
      specMovie:{
        type: movieType,
        args:{
          id: {type: GraphQLString}
        },
        resolve: async (_,args) => {
          try{
            const specId = args.id;
            const specMovie = await Movie.findOne({"id":specId});
            const { link, id, metascore, poster, rating, synopsis, title, votes, year } = specMovie;
            return {
              link,
              id,
              metascore,
              poster,
              rating,
              synopsis,
              title,
              votes,
              year
            };
          }
          catch(err)
          {
            return {error: err.message};
          }
        }
      },
      searchMov:{
        type: searchType,
        args:{
          limit: { type: GraphQLInt, defaultValue: 5 },
				  metascore: { type: GraphQLInt, defaultValue: 0 }
        },
        resolve: async (_,args) => {
          try
          {
            const limitInput = parseInt(args.limit);
		        const metascoreInput = parseInt(args.metascore);
            const movies = await Movie.aggregate([{$match: {metascore: {$gt: metascoreInput}}}, {$sample: {size: limitInput}}, {$sort: {metascore: -1}}]);
            return {movies};
          }
          catch(err)
          {
            return {error: err.message};
          }
        }
      },
      postReview: {
			type: movieIdType,
			args: {
				id: { type: GraphQLString },
				date: { type: GraphQLString, defaultValue: null },
				review: { type: GraphQLString, defaultValue: null }
			},
			resolve: async (_,args) => {
        try
        {
          const { id, date, review } = args;
          movie = await Movie.findOne({"id": id});
      		await Movie.updateOne({ _id: movie._id }, {watch_date: date, review: review});
          return { _id: movie._id };
        }
        catch(err)
        {
          return {error: err.message};
        }
      }
		}
  }
});

exports.queryType = queryType;
