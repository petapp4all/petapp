import express from "express";
import expressAsyncHandler from "express-async-handler";
import prisma from "../prisma/prisma.js";

const orderRouter = express.Router();

// Create Order
orderRouter.post(
  "/create",
  expressAsyncHandler(async (req, res) => {
    const {
      fuelType,
      litres,
      address,
      total,
      userId,
      userName,
      userPhone,
      stationName,
      stationEmail,
      ownerId,
      expectedDateTime,
    } = req.body;

    // Validate required fields
    if (
      !fuelType ||
      !litres ||
      !address ||
      !total ||
      !userId ||
      !stationName ||
      !stationEmail ||
      !ownerId ||
      !expectedDateTime
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = await prisma.order.create({
      data: {
        fuelType: fuelType.toUpperCase(),
        litres: Number(litres),
        deliveryAddress: address,
        totalAmount: Number(total),
        userId,
        userName: userName || user.name || "Unknown User",
        userPhone: userPhone || user.phone || "N/A",
        stationName,
        stationEmail,
        ownerId,
        expectedDateTime: new Date(expectedDateTime),
        createdAt: new Date(),
      },
    });

    res.status(201).json(order);
  })
);

// Get all orders
orderRouter.get(
  "/all-orders",
  expressAsyncHandler(async (req, res) => {
    const { userId, ownerId } = req.query;

    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (ownerId) whereClause.ownerId = ownerId;

    const queryOptions = {
      orderBy: { createdAt: "desc" },
    };

    // Only include 'where' if there are conditions
    if (userId || ownerId) {
      queryOptions.where = whereClause;
    }

    const orders = await prisma.order.findMany(queryOptions);

    res.status(200).json(orders);
  })
);

export default orderRouter;
