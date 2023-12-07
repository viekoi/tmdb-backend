import http from "http";
import MGenre from "../models/MGenre";
import VGenre from "../views/VGenre";
import { Genre } from "@prisma/client";

class CGenre {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }
  static async getAllGenres(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      VGenre.getAllGenres(res);
    } catch (error) {
      console.log("[genres_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getGenreById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    try {
      const genre = new MGenre({ id: id });
      VGenre.getGenreById(genre, res);
    } catch (error) {
      console.log("[genre_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getGenreByName(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    name: string
  ) {
    try {
      const genre = new MGenre({ name: name });
      VGenre.getGenreByName(genre, res);
    } catch (error) {
      console.log("[genre_GET_NAME]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async createGenre(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { name }: Genre = JSON.parse(body);
        const genre = new MGenre({ name: name });
        VGenre.createGenre(genre, res);
      } catch (error) {
        console.log("[genre_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async patchGenreById(
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
        const { name }: Genre = JSON.parse(body);
        const genre = new MGenre({ name: name, id: id });
        VGenre.patchGenreById(genre, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteGenresByIds(
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
        const genre = new MGenre({ genreIds: ids });
        VGenre.deleteGenresByIds(genre, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteGenreById(
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
        const genre = new MGenre({ id: id });
        VGenre.deleteGenreById(genre, res);
      } catch (error) {
        console.log("[genre_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }
}

export default CGenre;
