import http from "http";
import MMedia from "../models/MMedia";
import VTVShow from "../views/VTVShow";


class CTVShow {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }
  static async getTVShows(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      VTVShow.getTVShows(res);
    } catch (error) {
      console.log("[TVShowS_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getTVShowById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    try {
      const TVShow = new MMedia({ id: id });
      VTVShow.getTVShowById(TVShow, res);
    } catch (error) {
      console.log("[TVShow_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getTVShowsByFilter(
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
        const TVShow = new MMedia({
          title:title,
          genreIds:genreIds,
          releasedDayEnd:releasedDayEnd,
          releasedDayStart:releasedDayStart,
          pageNumber:pageNumber,
          pageSize:pageSize
        });
        VTVShow.getTVShowsByFilter(TVShow, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async createTVShow(
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
        const TVShow = new MMedia({
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
        VTVShow.createTVShow(TVShow, res);
      } catch (error) {
        console.log("[TVShow_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async patchTVShowById(
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
        const TVShow = new MMedia({
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
        VTVShow.patchTVShowById(TVShow, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteTVShowsByIds(
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
        const TVShow = new MMedia({ mediaIds: ids });
        VTVShow.deleteTVShowsByIds(TVShow, res);
      } catch (error) {
        console.log("[TVShow_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteTVShowById(
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
        const TVShow = new MMedia({ id: id });
        VTVShow.deleteTVShowById(TVShow, res);
      } catch (error) {
        console.log("[TVShow_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }
}

export default CTVShow;
