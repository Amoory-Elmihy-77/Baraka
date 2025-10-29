const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/academicController');

const router = express.Router();

router.use(protect);

// Courses
router.route('/courses')
  .post(createCourse)
  .get(getCourses);

router.route('/courses/:id')
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

// Course Topics
router.route('/topics')
  .post(createCourseTopic)
  .get(getCourseTopics);

router.route('/topics/:id')
  .get(getCourseTopicById)
  .put(updateCourseTopic)
  .delete(deleteCourseTopic);

module.exports = router;


