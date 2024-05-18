import mongoose from "mongoose";

const StaffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
});

const StaffModel = mongoose.model("StaffProfile", StaffSchema,"StaffProfile");

export default StaffModel;
