require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose    
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
    
const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
});
const Student = mongoose.model("Student", StudentSchema);

app.post("/create/students", async (req, res) => {
    try {
      const { name, age, gender } = req.body;
  
      // Validate required fields
      if (!name || !age || !gender) {
        return res.status(400).json({ message: "Student details are required" });
      }
  
      // Create new student document
      const newStudent = new Student({ name, age, gender });
      await newStudent.save();
  
      // Return response
      res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Error creating student" });
    }
  });

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
