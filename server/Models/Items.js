import mongoose from "mongoose";

const ItemSchema = mongoose.Schema({
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
});

const ItemModel = mongoose.model("MenuItems", ItemSchema);

export default ItemModel;
