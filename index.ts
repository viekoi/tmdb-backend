import http from "http";

import CGenre from "./controllers/CGenre";
import CMovie from "./controllers/CMovie";
import CTVShow from "./controllers/CTVShow";
import CPerson from "./controllers/CPerson";
import CCast from "./controllers/CCast";
import CUser from "./controllers/CUser";

const PORT = process.env.PORT || 5050;

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-auth-password"
    );
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === `GET`) {
    //GET

    //movies
    if (req.url === `/api/movies`) {
      //get all movies
      CMovie.getMovies(req, res);
    } else if (req.url!.match(/\/api\/movies\/\w+/)) {
      const id = req.url!.split("/")[3];
      CMovie.getMovieById(req, res, id);
    }

    //tv shows
    if (req.url === `/api/tvs`) {
      //get all tv  shows
      CTVShow.getTVShows(req, res);
    } else if (req.url!.match(/\/api\/tvs\/\w+/)) {
      const id = req.url!.split("/")[3];
      CTVShow.getTVShowById(req, res, id);
    }

    //people
    if (req.url === `/api/people`) {
      //get all people
      CPerson.getAllPeople(req, res);
    } else if (req.url!.match(/\/api\/people\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CPerson.getPersonById(req, res, id);
    } else if (req.url!.match(/\/api\/people\?(\w+)=([^&]*)/)) {
      const parts = req.url!.split("?");

      // Get query string
      const queryString = parts[1];

      // Split query string into parts
      const queryParams = queryString.split("&");

      const params: any = {};
      for (let param of queryParams) {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
      }
      console.log(params);
      CPerson.getPersonByFullName(req, res, params["fullName"]);
    }

    //genres
    if (req.url === "/api/genres") {
      // Get all genres

      CGenre.getAllGenres(req, res);
    } else if (req.url!.match(/\/api\/genres\/\w+/)) {
      // Get genre by ID
      const id = req.url!.split("/")[3];
      CGenre.getGenreById(req, res, id);
    } else if (req.url!.match(/\/api\/genres\?(\w+)=([^&]*)/)) {
      const parts = req.url!.split("?");

      // Get query string
      const queryString = parts[1];

      // Split query string into parts
      const queryParams = queryString.split("&");

      const params: any = {};
      for (let param of queryParams) {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
      }
      console.log(params);
      CGenre.getGenreByName(req, res, params["name"]);
    }
  } else if (req.method === `POST`) {
    //POST

    //Users
    if (req.url === `/api/register`) {
      //create person
      CUser.register(req, res);
    }

    //users
    if (req.url === `/api/login`) {
      CUser.login(req, res);
    }

    if (req.url === `/api/resign`) {
      CUser.resign(req, res);
    }

    //movies
    if (req.url === `/api/movies`) {
      //create person
      CMovie.createMovie(req, res);
    } else if (req.url === `/api/moviesbyfilter`) {
      CMovie.getMoviesByFilter(req, res);
    }

    //tvs
    if (req.url === `/api/tvs`) {
      //create person
      CTVShow.createTVShow(req, res);
    } else if (req.url === `/api/showsbyfilter`) {
      CTVShow.getTVShowsByFilter(req, res);
    }

    //people
    if (req.url === `/api/people`) {
      //create person
      CPerson.createPerson(req, res);
    }
    //genres
    if (req.url === `/api/genres`) {
      //create person

      CGenre.createGenre(req, res);
    }

    //casts
    if (req.url === `/api/casts`) {
      //create person
      CCast.createCast(req, res);
    }
  } else if (req.method === `DELETE`) {
    //DELETE

    //movies
    if (req.url === `/api/movies`) {
      //create person
      CMovie.deleteMoviesByIds(req, res);
    } else if (req.url!.match(/\/api\/movies\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CMovie.deleteMovieById(req, res, id);
    }

    //tvs
    if (req.url === `/api/tvs`) {
      //create person
      CTVShow.deleteTVShowsByIds(req, res);
    } else if (req.url!.match(/\/api\/tvs\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CTVShow.deleteTVShowById(req, res, id);
    }

    //people
    if (req.url === `/api/people`) {
      //create person
      CPerson.deleteGroupOfPeopleByIds(req, res);
    } else if (req.url!.match(/\/api\/people\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CPerson.deletePersonById(req, res, id);
    }
    //genres
    if (req.url === `/api/genres`) {
      //create person
      CGenre.deleteGenresByIds(req, res);
    } else if (req.url!.match(/\/api\/genres\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CGenre.deleteGenreById(req, res, id);
    }

    //casts
    if (req.url!.match(/\/api\/casts\/\w+/)) {
      const id = req.url!.split("/")[3];
      CCast.deleteCastById(req, res, id);
    }
  } else if (req.method === `PATCH`) {
    //PATCH

    //person
    if (req.url!.match(/\/api\/people\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CPerson.patchPersonById(req, res, id);
    }

    //tvs
    if (req.url!.match(/\/api\/tvs\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CTVShow.patchTVShowById(req, res, id);
    }

    //genres
    if (req.url!.match(/\/api\/genres\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CGenre.patchGenreById(req, res, id);
    }

    //movies
    if (req.url!.match(/\/api\/movies\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CMovie.patchMovieById(req, res, id);
    }

    //casts
    if (req.url!.match(/\/api\/casts\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      CCast.patchCastById(req, res, id);
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Route Not Found: Please use the api/movies endpoint",
      })
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
