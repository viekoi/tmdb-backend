import prismadb from "../lib/prismadb";
import { Person } from "@prisma/client";
import http from "http";

const resHandler = (res: http.ServerResponse, status: number, data: any) => {
  res.writeHead(status, {
    "Content-Type": "application/json,",
  });

  res.end(JSON.stringify(data));
};

async function getAllPeople(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    const people = await prismadb.person.findMany({
      where: {},
      include: {
        castIn:{
          include:{
            media:true
          }
        },
        director: true,
      },
    });
    resHandler(res, people !== null ? 200 : 404, people);
  } catch (error) {
    console.log("[people_GET]", error);
    resHandler(res, 404, { message: "people Not Found" });
  }
}

async function getPersonById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const person = await prismadb.person.findUnique({
      where: {
        id: id,
      },
      include: {
        castIn: true,
        director: true,
      },
    });

    resHandler(res, person !== null ? 200 : 404, person);
  } catch (error) {
    console.log("[person_GET]", error);
    resHandler(res, 404, { message: "person Not Found" });
  }
}

async function createPerson(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  console.log(body);

  req.on("end", async () => {
    const {
      fullName,
      biography,
      knownFor,
      dob,
      pob,
      gender,
      imageUrl,
    }: Person = JSON.parse(body);

    try {
      const person = await prismadb.person.create({
        data: {
          imageUrl,
          fullName,
          biography,
          knownFor,
          dob,
          pob,
          gender,
        },
      });

      resHandler(res, person !== null ? 200 : 404, person);
    } catch (error) {
      console.log("[peple_CREATE]", error);
      resHandler(res, 404, { message: "people Not CREATE" });
    }
  });
}

async function getPeopleByFullName(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  fullName: string
) {
  console.log(fullName)
  try {
    const people = await prismadb.person.findMany({
      where: { fullName:{contains:fullName} },
      include: {
        castIn:true,
        director:true
      },
    });
    resHandler(res, people !== null ? 200 : 404, people);
  } catch (error) {
    console.log("[people_GET_NAME]", error);
    resHandler(res, 404, { message: "people Not Found" });
  }
}

async function patchPersonById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { fullName, biography, knownFor, dob, pob, gender }: Person =
      JSON.parse(body);

    try {
      const person = await prismadb.person.update({
        where: {
          id: id,
        },
        data: {
          fullName,
          biography,
          knownFor,
          dob,
          pob,
          gender,
        },
      });

      resHandler(res, person !== null ? 200 : 404, person);
    } catch (error) {
      console.log("[peple_PATCH]", error);
      resHandler(res, 404, { message: "people Not PATCH" });
    }
  });
}

async function deleteGroupOfPeopleByIds(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const ids = JSON.parse(body);

      const person = await prismadb.person.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      resHandler(res, person !== null ? 200 : 404, person);
    });
  } catch (error) {
    console.log("[peple_DELETE]", error);
    resHandler(res, 404, { message: "people Not DElETE" });
  }
}

async function deletePersonById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const person = await prismadb.person.delete({
      where: {
        id: id,
      },
    });

    resHandler(res, person !== null ? 200 : 404, person);
  } catch (error) {
    console.log("[person_DELETE]", error);
    resHandler(res, 404, { message: "person Not DElETE" });
  }
}

export {
  getAllPeople,
  getPersonById,
  getPeopleByFullName,
  createPerson,
  deleteGroupOfPeopleByIds,
  patchPersonById,
  deletePersonById,
  
};