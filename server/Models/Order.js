import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      pic: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  tableNumber: {
    type: Number,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
