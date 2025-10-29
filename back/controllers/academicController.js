const Course = require('../models/Course');
const CourseTopic = require('../models/CourseTopic');

// Courses CRUD
async function createCourse(req, res) {
  try {
    const { courseName, schedule } = req.body;
    const course = await Course.create({ user: req.user.id, courseName, schedule });
    return res.status(201).json(course);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create course', error: err.message });
  }
}

async function getCourses(req, res) {
  try {
    const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user.id });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json(course);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to fetch course', error: err.message });
  }
}

async function updateCourse(req, res) {
  try {
    const updated = await Course.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update course', error: err.message });
  }
}

async function deleteCourse(req, res) {
  try {
    const deleted = await Course.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to delete course', error: err.message });
  }
}

// CourseTopics CRUD
async function createCourseTopic(req, res) {
  try {
    const { course, weekNumber, topicTitle, isCompleted } = req.body;
    const topic = await CourseTopic.create({
      user: req.user.id,
      course,
      weekNumber,
      topicTitle,
      isCompleted,
    });
    return res.status(201).json(topic);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create course topic', error: err.message });
  }
}

async function getCourseTopics(req, res) {
  try {
    const filter = { user: req.user.id };
    if (req.query.course) filter.course = req.query.course;
    const topics = await CourseTopic.find(filter).sort({ weekNumber: 1, createdAt: -1 });
    return res.status(200).json(topics);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch course topics', error: err.message });
  }
}

async function getCourseTopicById(req, res) {
  try {
    const topic = await CourseTopic.findOne({ _id: req.params.id, user: req.user.id });
    if (!topic) return res.status(404).json({ message: 'Course topic not found' });
    return res.status(200).json(topic);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to fetch course topic', error: err.message });
  }
}

async function updateCourseTopic(req, res) {
  try {
    const updated = await CourseTopic.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course topic not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update course topic', error: err.message });
  }
}

async function deleteCourseTopic(req, res) {
  try {
    const deleted = await CourseTopic.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Course topic not found' });
    return res.status(200).json({ message: 'Course topic deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to delete course topic', error: err.message });
  }
}

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createCourseTopic,
  getCourseTopics,
  getCourseTopicById,
  updateCourseTopic,
  deleteCourseTopic,
};


