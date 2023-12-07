import prismadb from "../lib/prismadb";
import MGenre from "../models/MGenre";
import http from "http";

class VGenre {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async getAllGenres(res: http.ServerResponse) {
    try {
  
      const genres = await prismadb.genre.findMany({
        where: {},
        include: {
          medias: true,
        },
      });
     
      this.resHandler(res, genres !== null ? 200 : 404, genres);
    } catch (error) {
      console.log("[genres_GET]", error);
      this.resHandler(res, 404, { message: "genre Not Found" });
    }
  }

  static async getGenreById(genre: MGenre, res: http.ServerResponse) {
    try {
      const prismaGenre = await prismadb.genre.findUnique({
        where: {
          id: genre.id,
        },
        include: {
          medias: true,
        },
      });

      this.resHandler(res, prismaGenre !== null ? 200 : 404, prismaGenre);
    } catch (error) {
      console.log("[genre_GET]", error);
      this.resHandler(res, 404, { message: "genre Not Found" });
    }
  }

  static async getGenreByName(genre: MGenre, res: http.ServerResponse) {
    try {
      const prismaGenre = await prismadb.genre.findUnique({
        where: { name: genre.name },
        include: {
          medias: true,
        },
      });
      this.resHandler(res, prismaGenre !== null ? 200 : 404, prismaGenre);
    } catch (error) {
      console.log("[genre_GET_NAME]", error);
      this.resHandler(res, 404, { message: "genre Not Found" });
    }
  }

  static async createGenre(genre: MGenre, res: http.ServerResponse) {
    try {
      const prismaGenre = await prismadb.genre.create({
        data: {
          name: genre.name!,
        },
      });
      this.resHandler(res, prismaGenre !== null ? 200 : 404, prismaGenre);
    } catch (error) {
      console.log("[genre_POST]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async patchGenreById(genre: MGenre, res: http.ServerResponse) {
    try {
      const prismaGenre = await prismadb.genre.update({
        where: {
          id: genre.id,
        },
        data: {
          name: genre.name,
        },
      });

      this.resHandler(res, prismaGenre !== null ? 200 : 404, prismaGenre);
    } catch (error) {
      console.log("[genre_PATCH]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteGenresByIds(genre: MGenre, res: http.ServerResponse) {
    try {
      const prismaGenres = await prismadb.genre.deleteMany({
        where: {
          id: {
            in: genre.genreIds,
          },
        },
      });

      this.resHandler(res, prismaGenres !== null ? 200 : 404, prismaGenres);
    } catch (error) {
      console.log("[genres_delete]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteGenreById(genre: MGenre, res: http.ServerResponse) {
    try {
      const prismaGenre = await prismadb.genre.delete({
        where: {
          id: genre.id,
        },
      });

      this.resHandler(res, prismaGenre !== null ? 200 : 404, prismaGenre);
    } catch (error) {
      console.log("[genre_DELETE]", error);
      this.resHandler(res, 404, { message: "genre Not DElETE" });
    }
  }
}

export default VGenre;
