import prismadb from "../lib/prismadb";
import {Cast } from "@prisma/client";
import http from "http";

const resHandler = (res: http.ServerResponse, status: number, data: any) => {
  res.writeHead(status, {
    "Content-Type": "application/json,",
  });

  res.end(JSON.stringify(data));
};

async function createCast(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";
  
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
  
    req.on("end", async () => {
      const { character,personId,mediaId }: Cast = JSON.parse(body);
  
      try {
        const cast = await prismadb.cast.create({
          data: {
            character,
            personId,
            mediaId
          },
        });
        resHandler(res, cast !== null ? 200 : 404, cast);
      } catch (error) {
        console.log("[cast_POST]", error);
        resHandler(res, 404, error);
      }
    });
  }

  async function patchCastById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id:string
  ) {
    let body = "";
  
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
  
    req.on("end", async () => {
      const { character,personId,mediaId }: Cast = JSON.parse(body);
  
      try {
        
        const cast = await prismadb.cast.update({
          where:{
            id:id
          },data:{
            character,
            personId,
            mediaId
          }
        })


        resHandler(res, cast !== null ? 200 : 404, cast);
      } catch (error) {
        console.log("[cast_PATCH]", error);
        resHandler(res, 404, error);
      }
    });
  }

export {
    createCast,
    patchCastById

};