import http from "http";
import MMedia from "../models/MMedia";
import VMovie from "../views/VMovie";


class CMovie {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }
  static async getMovies(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      VMovie.getMovies(res);
    } catch (error) {
      console.log("[MOVIES_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getMovieById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    try {
      const movie = new MMedia({ id: id });
      VMovie.getMovieById(movie, res);
    } catch (error) {
      console.log("[movie_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getMoviesByFilter(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const {
          title,
          genreIds,
          releasedDayStart,
          releasedDayEnd,
          pageNumber,
          pageSize,
        }: {
          title: string | undefined;
          genreIds: string[] | undefined;
          releasedDayStart: Date | undefined;
          releasedDayEnd: Date | undefined;
          pageNumber: number | undefined;
          pageSize: number | undefined;
        } = JSON.parse(body);
        const movie = new MMedia({
          title:title,
          genreIds:genreIds,
          releasedDayEnd:releasedDayEnd,
          releasedDayStart:releasedDayStart,
          pageNumber:pageNumber,
          pageSize:pageSize
        });
        VMovie.getMoviesByFilter(movie, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async createMovie(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const {
          title,
          originalLanguage,
          imageUrl,
          backDropImageUrl,
          trailerUrl,
          runTime,
          overview,
          budget,
          revenue,
          status,
          releasedDay,
          genreIds,
          directorId,
        } = JSON.parse(body);
        const movie = new MMedia({
          title: title,
          originalLanguage: originalLanguage,
          imageUrl: imageUrl,
          backDropImageUrl: backDropImageUrl,
          trailerUrl: trailerUrl,
          runTime: runTime,
          overview: overview,
          budget: budget,
          revenue: revenue,
          status: status,
          releasedDay: releasedDay,
          genreIds: genreIds,
          directorId: directorId,
        });
        VMovie.createMovie(movie, res);
      } catch (error) {
        console.log("[movie_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async patchMovieById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const {
          title,
          originalLanguage,
          imageUrl,
          backDropImageUrl,
          trailerUrl,
          runTime,
          overview,
          budget,
          revenue,
          status,
          releasedDay,
          genreIds,
          directorId,
        } = JSON.parse(body);
        const movie = new MMedia({
          id: id,
          title: title,
          originalLanguage: originalLanguage,
          imageUrl: imageUrl,
          backDropImageUrl: backDropImageUrl,
          trailerUrl: trailerUrl,
          runTime: runTime,
          overview: overview,
          budget: budget,
          revenue: revenue,
          status: status,
          releasedDay: releasedDay,
          genreIds: genreIds,
          directorId: directorId,
        });
        VMovie.patchMovieById(movie, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteMoviesByIds(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const ids: string[] = JSON.parse(body);
        const movie = new MMedia({ mediaIds: ids });
        VMovie.deleteMoviesByIds(movie, res);
      } catch (error) {
        console.log("[movie_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteMovieById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const movie = new MMedia({ id: id });
        VMovie.deleteMovieById(movie, res);
      } catch (error) {
        console.log("[movie_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }
}

export default CMovie;
