import express from "express";
import expressAsyncHandler from "express-async-handler";

import { sendMail } from "../utils.js";
import prisma from "../prisma/prisma.js";

const stationRouter = express.Router();

// Create Station
stationRouter.post(
  "/create",
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      logo,
      pms,
      ago,
      address,
      supportedOrdering,
      email,
      operatingHours,
      availableProducts,
      paymentMethods,
      facilities,
      ownerId,
    } = req.body;

    const station = await prisma.station.create({
      data: {
        name,
        logo,
        pms: Number(pms),
        ago: Number(ago),
        address,
        supportedOrdering,
        email,
        operatingHours,
        availableProducts,
        paymentMethods,
        facilities,
        owner: ownerId ? { connect: { id: ownerId } } : undefined,
      },
    });

    res.status(201).json(station);
  })
);

// Get All Station
stationRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const stations = await prisma.station.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(stations);
  })
);

// Get Station By Id
stationRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const station = await prisma.station.findUnique({
      where: { id },
    });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json(station);
  })
);

export default stationRouter;
