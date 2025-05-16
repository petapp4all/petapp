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
      image,
      imageId,
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
        image,
        imageId,
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

// Mark order as completed
orderRouter.put(
  "/:id/complete",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order's completed status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { completed: true },
    });

    res.status(200).json(updatedOrder);
  })
);

//create-review
orderRouter.post(
  "/create-review",
  expressAsyncHandler(async (req, res) => {
    const { userId, content, rating } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: "User and content are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const review = await prisma.review.create({
      data: {
        userId,
        content,
        rating: rating || 5,
      },
    });

    res.status(201).json(review);
  })
);

// get-review
orderRouter.get(
  "/get-review",
  expressAsyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    res.status(200).json(reviews);
  })
);

export default orderRouter;
