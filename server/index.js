import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import StaffModel from "./Models/Staff.js";
import ItemModel from "./Models/Items.js";
import OrderModel from "./Models/Order.js";
import CompletedOrderModel from "./Models/CompletedOrder.js";
import bcrypt from "bcrypt";

let app = express();

app.use(cors());
app.use(express.json());

// ---------------------Login---------------------------
app.post("/login", async (req, res) => {
  try {
    const { remail, rpassword } = req.body;
    const User = await StaffModel.findOne({ email: remail });
    if (!User) {
      return res.status(500).json({ msg: "User not found.." });
    } else {
      const passwordMatch = await bcrypt.compare(rpassword, User.password);
      if (passwordMatch)
        return res.status(200).json({ User, msg: "Success.." });
      else return res.status(401).json({ msg: "Authentication Failed.." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// ---------------------Read Menu---------------------------
app.get("/getItems", async (req, res) => {
  try {
    const items = await ItemModel.aggregate([
      {
        $lookup: {
          from: "MenuItems",
          localField: "name",
          foreignField: "name",
          as: "items",
        },
      },
    ]);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
});

// ---------------------Registration---------------------------
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists in the database
    const existingUser = await StaffModel.findOne({ email: email });
    if (existingUser) {
      // If email already exists, return an error response
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hpassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new StaffModel({
      name: name,
      email: email,
      password: hpassword,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ user: user, msg: "Registration successful." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// ---------------------Add Items---------------------------
app.post("/addItems", async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const pic = req.body.pic;

    // Check if the product already exists in the database

    // const existingProduct = await ItemModel.findOne([{ name: name }]);
    // if (existingProduct) {
    //   // If product already exists, return an error response
    //   return res.status(400).json({ error: "Product already exists" });
    // }

    const items = new ItemModel({
      name: name,
      price: price,
      pic: pic,
    });

    await items.save();
    res.send({ items: items, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// ---------------------Update---------------------------
app.post("/updateItems", async (req, res) => {
  try {
    const itemId = req.body.pid;
    const cname = req.body.name;
    const cprice = req.body.price;

    const items = await ItemModel.findOne({ _id: itemId });
    items.name = cname;
    items.price = cprice;
    await items.save();
    res.send({ items: items, msg: "Updated." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/deleteItems/:pid", async (req, res) => {
  try {
    const itid = req.params.pid;
    await ItemModel.findOneAndDelete({ _id: itid });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// ---------------------Submit Order---------------------------
app.post("/submitOrder", async (req, res) => {
  try {
    const { items, total, tableNumber } = req.body;

    // Create a new order
    const order = new OrderModel({
      items: items,
      total: total,
      tableNumber: tableNumber,
    });

    // Save the order to the database
    await order.save();
    res
      .status(201)
      .json({ order: order, msg: "Order submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// ---------------------Get Orders---------------------------
app.get("/getOrders", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// ---------------------Del/Complete Orders---------------------------
app.post("/completeOrder", async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order by ID??
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create a new completed order+++
    const completedOrder = new CompletedOrderModel({
      items: order.items,
      tableNumber: order.tableNumber,
      total: order.total,
    });

    // Save the completed order and delete the original order**
    await completedOrder.save();
    await OrderModel.findByIdAndDelete(orderId);

    res
      .status(201)
      .json({ msg: "Order completed and moved to Completed Orders" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ---------------------Get Complete Orders---------------------------
app.get("/getCompletedOrders", async (req, res) => {
  try {
    const completedOrders = await CompletedOrderModel.find().sort({
      createdAt: -1,
    });
    res.json({ orders: completedOrders });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// var conn = "mongodb+srv://16s2023410:1234@cluster0.l2cdrtz.mongodb.net/PostDB?retryWrites=true&w=majority";
var conn =
  "mongodb+srv://staff:1234@cluster0.sfz1sy2.mongodb.net/RestuarantDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(conn);

app.listen(3002, () => {
  console.log("Server Connected..");
});
