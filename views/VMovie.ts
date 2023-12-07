import prismadb from "../lib/prismadb";
import MGenre from "../models/MGenre";
import http from "http";
import MMedia from "../models/MMedia";
import { Media } from "@prisma/client";

class VMovie {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async getMovies(res: http.ServerResponse) {
    try {
      const movies = await prismadb.media.findMany({
        where: {
          mediaType: "movie",
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: {
            include: {
              genre: true,
            },
          },
          director: true,
        },
      });

      this.resHandler(res, movies !== null ? 200 : 404, movies);
    } catch (error) {
      console.log("[movies_GET]", error);
      this.resHandler(res, 404, { message: "Movies Not Found" });
    }
  }

  static async getMovieById(model: MMedia, res: http.ServerResponse) {
    try {
      const movie = await prismadb.media.findUnique({
        where: {
          id: model.id,
          mediaType: "movie",
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: true,
          director: true,
        },
      });

      this.resHandler(res, movie !== null ? 200 : 404, movie);
    } catch (error) {
      console.log("[movie_GET]", error);
      this.resHandler(res, 404, { message: "movie Not Found" });
    }
  }

  static async getMoviesByFilter(model: MMedia, res: http.ServerResponse) {
    try {
      let take;
      let skip;

      if (!model.pageSize) {
        take = 10;
      } else {
        take = model.pageSize;
      }

      if (!model.pageNumber) {
        skip = 0;
      } else {
        skip = (model.pageNumber - 1) * take;
      }

      const movies = await prismadb.media.findMany({
        skip,
        take,
        where: {
          title: {
            contains: model.title?.trim(),
          },
          mediaType: "movie",
          releasedDay: {
            gte: model.releasedDayStart,
            lte: model.releasedDayEnd,
          },
          genres: {
            some: {
              genreId: {
                in: model.genreIds,
              },
            },
          },
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: true,
          director: true,
        },
      });

      const totalCount = await prismadb.media.count({
        where: {
          title: {
            contains: model.title?.trim(),
          },
          mediaType: "movie",
          releasedDay: {
            gte: model.releasedDayStart,
            lte: model.releasedDayEnd,
          },
        },
      });

      const totalPages = Math.ceil(totalCount / take);

      const response = {
        media: movies,
        totalCount,
        totalPages,
      };

      this.resHandler(res, movies !== null ? 200 : 404, response);
    } catch (error) {
      console.log("[movie_POST]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async createMovie(model: MMedia, res: http.ServerResponse) {
    try {
      const movie: Media = await prismadb.media.create({
        data: {
          title: model.title!,
          mediaType: "movie",
          originalLanguage: model.originalLanguage!,
          imageUrl: model.imageUrl!,
          backDropImageUrl: model.backDropImageUrl!,
          trailerUrl: model.trailerUrl!,
          runTime: model.runTime!,
          overview: model.overview!,
          budget: model.budget!,
          revenue: model.revenue!,
          status: model.status!,
          releasedDay: model.releasedDay!,
          genres: {
            createMany: {
              data: model.genreIds!.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId: model.directorId!,
        },
      });

      this.resHandler(res, movie !== null ? 200 : 404, movie);
    } catch (error) {
      console.log("[movie_POST]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async patchMovieById(model: MMedia, res: http.ServerResponse) {
    try {
      const movie: Media = await prismadb.media.update({
        where: {
          id: model.id,
          mediaType: "movie",
        },
        data: {
          title: model.title,
          mediaType: "movie",
          originalLanguage: model.originalLanguage,
          imageUrl: model.imageUrl,
          backDropImageUrl: model.backDropImageUrl,
          trailerUrl: model.trailerUrl,
          runTime: model.runTime,
          overview: model.overview,
          budget: model.budget,
          revenue: model.revenue,
          status: model.status,
          releasedDay: model.releasedDay,
          genres: {
            deleteMany:{},
            createMany: {
              data: model.genreIds!.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId: model.directorId,
        },
      });
      this.resHandler(res, movie !== null ? 200 : 404, movie);
    } catch (error) {
      console.log("[movie_Patch]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteMoviesByIds(model: MMedia, res: http.ServerResponse) {
    try {
      const movies = await prismadb.media.deleteMany({
        where: {
          id: {
            in: model.mediaIds,
          },
        },
      });

      this.resHandler(res, movies !== null ? 200 : 404, movies);
    } catch (error) {
      console.log("[movies_delete]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteMovieById(model: MMedia, res: http.ServerResponse) {
    try {
      const movie = await prismadb.media.delete({
        where: {
          id: model.id,
        },
      });

      this.resHandler(res, movie !== null ? 200 : 404, movie);
    } catch (error) {
      console.log("[movie_DELETE]", error);
      this.resHandler(res, 404, { message: "movie Not DElETE" });
    }
  }
}

export default VMovie;
