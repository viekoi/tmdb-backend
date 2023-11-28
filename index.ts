import http from "http";

import {
  getMovies,
  getMovieById,
  createMovie,
  deleteMoviesByIds,
  patchMovieById,
  deleteMovieById,
} from "./controllers/movieController";

import {
  getTVShows,
  getTVShowById,
  createTVShow,
  deleteTVShowsByIds,
  patchTVShowById,
  deleteTVShowById,
} from "./controllers/tvShowController";
import {
  createPerson,
  getAllPeople,
  getPersonById,
  deleteGroupOfPeopleByIds,
  patchPersonById,
  deletePersonById,
  getPeopleByFullName,
} from "./controllers/personController";

import {
  getAllGenres,
  createGenre,
  deleteGenresByIds,
  patchGenreById,
  deleteGenreById,
  getGenreById,
  getGenreByName,
} from "./controllers/genreController";
import { createCast, patchCastById } from "./controllers/castController";

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
      "Content-Type, Authorization"
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
      getMovies(req, res);
    } else if (req.url!.match(/\/api\/movies\/\w+/)) {
      const id = req.url!.split("/")[3];
      getMovieById(req, res, id);
    }

    //tv shows
    if (req.url === `/api/tvs`) {
      //get all tv  shows
      getTVShows(req, res);
    } else if (req.url!.match(/\/api\/tvs\/\w+/)) {
      const id = req.url!.split("/")[3];
      getTVShowById(req, res, id);
    }

    //people
    if (req.url === `/api/people`) {
      //get all people
      getAllPeople(req, res);
    } else if (req.url!.match(/\/api\/people\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      getPersonById(req, res, id);
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
      getPeopleByFullName(req, res, params["fullName"]);
    }

    //genres
    if (req.url === "/api/genres") {
      // Get all genres
      getAllGenres(req, res);
    } else if (req.url!.match(/\/api\/genres\/\w+/)) {
      // Get genre by ID
      const id = req.url!.split("/")[3];
      getGenreById(req, res, id);
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
      getGenreByName(req, res, params["name"]);
    }
  } else if (req.method === `POST`) {
    //POST

    //movies
    if (req.url === `/api/movies`) {
      //create person
      createMovie(req, res);
    }

    //tvs
    if (req.url === `/api/tvs`) {
      //create person
      createTVShow(req, res);
    }

    //people
    if (req.url === `/api/people`) {
      //create person
      createPerson(req, res);
    }
    //genres
    if (req.url === `/api/genres`) {
      //create person
      createGenre(req, res);
    }

    //casts
    if (req.url === `/api/casts`) {
      //create person
      createCast(req, res);
    }
  } else if (req.method === `DELETE`) {
    //DELETE

    //movies
    if (req.url === `/api/movies`) {
      //create person
      deleteMoviesByIds(req, res);
    } else if (req.url!.match(/\/api\/movies\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      deleteMovieById(req, res, id);
    }

    //tvs
    if (req.url === `/api/tvs`) {
      //create person
      deleteTVShowsByIds(req, res);
    } else if (req.url!.match(/\/api\/tvs\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      deleteTVShowById(req, res, id);
    }

    //people
    if (req.url === `/api/people`) {
      //create person
      deleteGroupOfPeopleByIds(req, res);
    } else if (req.url!.match(/\/api\/people\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      deletePersonById(req, res, id);
    }
    //genres
    if (req.url === `/api/genres`) {
      //create person
      deleteGenresByIds(req, res);
    } else if (req.url!.match(/\/api\/genres\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      deleteGenreById(req, res, id);
    }
  } else if (req.method === `PATCH`) {
    //PATCH

    //person
    if (req.url!.match(/\/api\/people\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      patchPersonById(req, res, id);
    }

    //tvs
    if (req.url!.match(/\/api\/tvs\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      patchTVShowById(req, res, id);
    }

    //genres
    if (req.url!.match(/\/api\/genres\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      patchGenreById(req, res, id);
    }

    //movies
    if (req.url!.match(/\/api\/movies\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      patchMovieById(req, res, id);
    }

    //casts
    if (req.url!.match(/\/api\/casts\/\w+/)) {
      //get person by id
      const id = req.url!.split("/")[3];
      patchCastById(req, res, id);
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

server.listen(5050, () => {
  console.log("Server running on http://localhost:5050");
});

