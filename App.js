// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB using mongoose
mongoose.connect('mongodb+srv://aravindhselvam3:aravindh@cluster0.acezmo2.mongodb.net/Studentsdb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to the MongoDB database');
})
.catch((error) => {
  console.error('Failed to connect to the MongoDB database:', error);
});

// Create Mentor and Student schemas
const mentorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  email: String,
});

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  major: String,
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
  },
});

const Mentor = mongoose.model('Mentor', mentorSchema);
const Student = mongoose.model('Student', studentSchema);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create a new mentor
app.post('/api/mentors', async (req, res) => {
  try {
    const mentorData = req.body;
    const mentor = new Mentor(mentorData);
    await mentor.save();
    res.json(mentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new student
app.post('/api/students', async (req, res) => {
  try {
    const studentData = req.body;
    const student = new Student(studentData);
    await student.save();
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assign a student to a mentor
app.post('/api/assign-mentor', async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    await Student.updateMany({ _id: { $in: studentIds } }, { mentor: mentorId });
    res.json({ message: 'Students assigned to mentor successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get students by mentor
app.get('/api/students-by-mentor/:mentorId', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
