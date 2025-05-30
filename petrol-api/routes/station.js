import express from "express";
import expressAsyncHandler from "express-async-handler";
import { deleteImageByPublicId } from "../utils.js";
import prisma from "../prisma/prisma.js";

const stationRouter = express.Router();

// Create Station
stationRouter.post(
  "/create",
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      logo,
      image,
      imageId,
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
        image,
        imageId,
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

// Update Station
stationRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      name,
      image,
      imageId,
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
    } = req.body;

    const existingStation = await prisma.station.findUnique({
      where: { id },
    });

    if (!existingStation) {
      return res.status(404).json({ message: "Station not found" });
    }

    const updatedStation = await prisma.station.update({
      where: { id },
      data: {
        name,
        image,
        imageId,
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
      },
    });

    res.json(updatedStation);
  })
);

// Delete Station By ID
stationRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the station exists and get imageId
    const station = await prisma.station.findUnique({
      where: { id },
      select: { imageId: true }, // only select what's needed
    });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Delete image from Cloudinary if it exists
    if (station.imageId) {
      try {
        await deleteImageByPublicId(station.imageId);
      } catch (err) {
        console.error("Failed to delete station image from Cloudinary:", err);
        // Optional: continue or abort depending on importance
      }
    }

    // Delete the station
    await prisma.station.delete({
      where: { id },
    });

    res.json({ message: "Station and image deleted successfully" });
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

// Get Stations By Owner ID
stationRouter.get(
  "/by-owner/:ownerId",
  expressAsyncHandler(async (req, res) => {
    const { ownerId } = req.params;
    const station = await prisma.station.findFirst({
      where: { ownerId },
    });
    res.json(station);
  })
);

// Get Stations Details
stationRouter.get(
  "/details/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const stations = await prisma.station.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            phone: true,
            country: true,
            address: true,
          },
        },
      },
    });

    if (!stations || stations.length === 0) {
      return res
        .status(404)
        .json({ message: "No stations found for this owner." });
    }

    res.json(stations);
  })
);

// POST /api/petrolprice

stationRouter.post(
  "/price",
  expressAsyncHandler(async (req, res) => {
    const { stationName, price } = req.body;

    if (!stationName || price == null) {
      return res
        .status(400)
        .json({ message: "stationName and price are required" });
    }

    // Check if a price already exists for the station
    const existingPrice = await prisma.petrolPrice.findFirst({
      where: {
        stationName: {
          equals: stationName,
          mode: "insensitive", // optional: ignores case
        },
      },
    });

    if (existingPrice) {
      return res.status(400).json({
        message: `Price for station "${stationName}" already exists.`,
      });
    }

    const newPrice = await prisma.petrolPrice.create({
      data: {
        stationName,
        price: Number(price),
      },
    });

    res.status(201).json(newPrice);
  })
);

// PUT /api/petrolprice/:id
stationRouter.put(
  "/price/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { stationName, price } = req.body;

    const existing = await prisma.petrolPrice.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "PetrolPrice entry not found" });
    }

    const updated = await prisma.petrolPrice.update({
      where: { id },
      data: {
        stationName,
        price: Number(price),
      },
    });

    res.json(updated);
  })
);

// GET /api/petrolprice
stationRouter.get(
  "/price",
  expressAsyncHandler(async (req, res) => {
    const prices = await prisma.petrolPrice.findMany({
      orderBy: {
        stationName: "asc",
      },
    });

    res.json(prices);
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
