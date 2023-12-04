import { Media } from "@prisma/client";
import prismadb from "../lib/prismadb";
import http from "http";

const resHandler = (res: http.ServerResponse, status: number, data: any) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};





async function getMovies(req: http.IncomingMessage, res: http.ServerResponse) {
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

    resHandler(res, movies !== null ? 200 : 404, movies);
  } catch (error) {
    console.log("[movies_GET]", error);
    resHandler(res, 404, { message: "Movies Not Found" });
  }
}

async function getMovieById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const movie = await prismadb.media.findUnique({
      where: {
        id: id,
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

    resHandler(res, movie !== null ? 200 : 404, movie);
  } catch (error) {
    console.log("[movie_GET]", error);
    resHandler(res, 404, { message: "movie Not Found" });
  }
}

// async function getMoviesByFilter(
//   req: http.IncomingMessage,
//   res: http.ServerResponse
// ) {
//   let body = "";

//   req.on("data", (chunk) => {
//     body += chunk.toString();
//   });

//   req.on("end", async () => {
//     const {
//       title,
//       genreIds,
//       releasedDayStart,
//       releasedDayEnd,
//     }: {
//       title: string | undefined;
//       genreIds: string[] | undefined;
//       releasedDayStart: Date | undefined;
//       releasedDayEnd: Date | undefined;
//     } = JSON.parse(body);

//     try {
//       const movies = await prismadb.media.findMany({
//         where: {
//           title:{
//             contains:title?.trim()
//           },
//           mediaType: "movie",
//           releasedDay: {
//             gte: releasedDayStart,
//             lte: releasedDayEnd,
//           },
//         },
//         include: {
//           casts: {
//             include: {
//               person: true,
//             },
//           },
//           genres: {
//             where: {
//               genreId: {
//                 in: genreIds,
//               },
//             },
//           },
//           director: true,
//         },
//       });

//       resHandler(res, movies !== null ? 200 : 404, movies);
//     } catch (error) {
//       console.log("[movie_POST]", error);
//       resHandler(res, 404, error);
//     }
//   });
// }
async function getMoviesByFilter(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
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

    try {
      let take 
      let skip 
     

      if(!pageSize){
        take = 10
      }else{
        take = pageSize
      }

      if(!pageNumber){
        skip = 0
      }else{
        skip = (pageNumber - 1) * take;
      }


     
      const movies = await prismadb.media.findMany({
        skip,
        take,
        where: {
          title: {
            contains: title?.trim(),
          },
          mediaType: "movie",
          releasedDay: {
            gte: releasedDayStart,
            lte: releasedDayEnd,
          },
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: {
            where: {
              genreId: {
                in: genreIds,
              },
            },
          },
          director: true,
        },
      });

      const totalCount = await prismadb.media.count({
        where: {
          title: {
            contains: title?.trim(),
          },
          mediaType: "movie",
          releasedDay: {
            gte: releasedDayStart,
            lte: releasedDayEnd,
          },
        },
      });

      const totalPages = Math.ceil(totalCount / take);

      const response = {
        movies,
        totalCount,
        totalPages,
      };

      resHandler(res, movies !== null ? 200 : 404, response);
    } catch (error) {
      console.log("[movie_POST]", error);
      resHandler(res, 404, error);
    }
  });
}

async function createMovie(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
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
    }: Media & { genreIds: any } = JSON.parse(body);

    try {
      const movie: Media = await prismadb.media.create({
        data: {
          title,
          mediaType: "movie",
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
          genres: {
            createMany: {
              data: genreIds.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId,
        },
      });

      resHandler(res, movie !== null ? 200 : 404, movie);
    } catch (error) {
      console.log("[movie_POST]", error);
      resHandler(res, 404, error);
    }
  });
}

async function patchMovieById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const {
      title,
      imageUrl,
      originalLanguage,
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
    }: Media & { genreIds: any } = JSON.parse(body);

    try {
      console.log(genreIds);
      const movie: Media = await prismadb.media.update({
        where: {
          id: id,
          mediaType: "movie",
        },
        data: {
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
          genres: {
            deleteMany: {},
            createMany: {
              data: genreIds.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId,
        },
      });
      resHandler(res, movie !== null ? 200 : 404, movie);
    } catch (error) {
      console.log("[movie_Patch]", error);
      resHandler(res, 404, error);
    }
  });
}

async function deleteMoviesByIds(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const ids: string[] = JSON.parse(body);

      const movies = await prismadb.media.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      resHandler(res, movies !== null ? 200 : 404, movies);
    });
  } catch (error) {
    console.log("[movies_DELETE]", error);
    resHandler(res, 404, { message: "movies Not DElETE" });
  }
}

async function deleteMovieById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const movie = await prismadb.media.delete({
      where: {
        id: id,
      },
    });

    resHandler(res, movie !== null ? 200 : 404, movie);
  } catch (error) {
    console.log("[movie_DELETE]", error);
    resHandler(res, 404, { message: "movie Not DElETE" });
  }
}



export {
  getMovies,
  getMovieById,
  getMoviesByFilter,
  createMovie,
  deleteMovieById,
  deleteMoviesByIds,
  patchMovieById
};
