'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';

export default function AcademicPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({ courseName: '', schedule: [] });
  const [topicForm, setTopicForm] = useState({ topicTitle: '', weekNumber: 1, course: '' });
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [isDeleteTopicOpen, setIsDeleteTopicOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deletingTopic, setDeletingTopic] = useState(null);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const [coursesRes, topicsRes] = await Promise.all([
        api.get('/academics/courses'),
        api.get('/academics/topics'),
      ]);
      setCourses(coursesRes.data);
      setTopics(topicsRes.data);
    } catch (err) {
      toast.error('Failed to fetch academics');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      const res = await api.post('/academics/courses', courseForm);
      setCourses([...courses, res.data]);
      setIsCourseModalOpen(false);
      setCourseForm({ courseName: '', schedule: [] });
      toast.success('Course created');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create course');
    }
  };

  const createTopic = async () => {
    try {
      const res = await api.post('/academics/topics', topicForm);
      setTopics([...topics, res.data]);
      setIsTopicModalOpen(false);
      setTopicForm({ topicTitle: '', weekNumber: 1, course: '' });
      toast.success('Topic created');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create topic');
    }
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);
    setIsEditCourseOpen(true);
  };

  const openEditTopic = (topic) => {
    setEditingTopic(topic);
    setIsEditTopicOpen(true);
  };

  const updateCourse = async () => {
    if (!editingCourse) return;
    try {
      const payload = { courseName: editingCourse.courseName, schedule: editingCourse.schedule || [] };
      const res = await api.put(`/academics/courses/${editingCourse._id}`, payload);
      setCourses(courses.map((c) => (c._id === res.data._id ? res.data : c)));
      setIsEditCourseOpen(false);
      setEditingCourse(null);
      toast.success('Course updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update course');
    }
  };

  const updateTopic = async () => {
    if (!editingTopic) return;
    try {
      const payload = { topicTitle: editingTopic.topicTitle, weekNumber: editingTopic.weekNumber, course: editingTopic.course };
      const res = await api.put(`/academics/topics/${editingTopic._id}`, payload);
      setTopics(topics.map((t) => (t._id === res.data._id ? res.data : t)));
      setIsEditTopicOpen(false);
      setEditingTopic(null);
      toast.success('Topic updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update topic');
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      setIsDeleting(true);
      await api.delete(`/academics/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      // Optimistically remove topics that belong to this course
      const topicsToDelete = topics.filter((t) => {
        const topicCourseId = typeof t.course === 'object' ? t.course?._id : t.course;
        return topicCourseId === courseId;
      });
      setTopics(topics.filter((t) => {
        const topicCourseId = typeof t.course === 'object' ? t.course?._id : t.course;
        return topicCourseId !== courseId;
      }));

      // Ensure DB cleanup for related topics if backend doesn't cascade
      if (topicsToDelete.length > 0) {
        try {
          await Promise.all(
            topicsToDelete.map((t) => api.delete(`/academics/topics/${t._id}`))
          );
        } catch (innerErr) {
          // Show a non-blocking warning; UI already updated
          toast.error('Some related topics failed to delete on server');
        }
      }
      toast.success('Course deleted');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete course');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      setIsDeleting(true);
      await api.delete(`/academics/topics/${topicId}`);
      setTopics(topics.filter((t) => t._id !== topicId));
      toast.success('Topic deleted');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete topic');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading academic tasks...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academics</h1>
          <p className="text-gray-600 mt-1">Manage your courses and topics</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            onClick={() => setIsCourseModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> Course
          </motion.button>
          <motion.button
            onClick={() => setIsTopicModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" /> Topic
          </motion.button>
        </div>
      </div>

      {/* Topics Matrix: rows=weeks, cols=courses, cells=topics */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4 text-black">Topics Matrix</h2>
        {courses.length === 0 || topics.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
            {courses.length === 0 ? 'Add a course to view the matrix' : 'No topics to display'}
          </div>
        ) : (
          (() => {
            const getCourseId = (c) => (typeof c === 'object' ? c?._id : c);
            const maxWeek = Math.max(1, ...topics.map((t) => Number(t.weekNumber || 1)));
            const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

            return (
              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  <div className="grid" style={{ gridTemplateColumns: `140px repeat(${courses.length}, minmax(180px, 1fr))` }}>
                    <div className="bg-gray-100 border border-gray-200 p-3 font-medium text-gray-700 sticky left-0 z-10">Week / Course</div>
                    {courses.map((course) => (
                      <div key={`ch-${course._id}`} className="bg-gray-100 border border-gray-200 p-3 font-medium text-gray-700 text-center truncate">
                        {course.courseName}
                      </div>
                    ))}

                    {weeks.map((w) => (
                      <>
                        <div key={`rowh-w-${w}`} className="bg-white border border-gray-200 p-3 font-semibold text-gray-900 sticky left-0 z-10">
                          Week {w}
                        </div>
                        {courses.map((course) => {
                          const cellTopics = topics.filter((t) => Number(t.weekNumber || 1) === w && getCourseId(t.course) === course._id);
                          return (
                            <div key={`cell-${w}-${course._id}`} className="bg-white border border-gray-200 p-3">
                              {cellTopics.length === 0 ? (
                                <div className="text-xs text-gray-400 text-center">—</div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {cellTopics.map((t) => (
                                    <div key={t._id} className="group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs border border-indigo-100">
                                      <span className="truncate max-w-[120px]" title={t.topicTitle}>{t.topicTitle}</span>
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        <button className="text-blue-600 hover:text-blue-700" onClick={() => openEditTopic(t)}>Edit</button>
                                        <button className="text-red-600 hover:text-red-700" onClick={() => { setDeletingTopic(t); setIsDeleteTopicOpen(true); }}>Delete</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">Courses</h2>
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c._id} className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{c.courseName}</div>
                    {Array.isArray(c.schedule) && c.schedule.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">Schedule entries: {c.schedule.length}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      onClick={() => openEditCourse(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 text-sm"
                      onClick={() => { setDeletingCourse(c); setIsDeleteCourseOpen(true); }}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">No courses yet</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">Topics</h2>
          <div className="space-y-3">
            {topics.map((t) => (
              <div key={t._id} className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{t.topicTitle}</div>
                    <div className="mt-1 text-xs text-gray-600">Week {t.weekNumber}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      onClick={() => openEditTopic(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 text-sm"
                      onClick={() => { setDeletingTopic(t); setIsDeleteTopicOpen(true); }}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {topics.length === 0 && (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">No topics yet</div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Add New Course"
        size="sm"
      >
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Course name"
            value={courseForm.courseName}
            onChange={(e) => setCourseForm({ ...courseForm, courseName: e.target.value })}
          />
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={createCourse}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </motion.button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title="Add New Topic"
        size="sm"
      >
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Topic title"
            value={topicForm.topicTitle}
            onChange={(e) => setTopicForm({ ...topicForm, topicTitle: e.target.value })}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            type="number"
            min={1}
            placeholder="Week number"
            value={topicForm.weekNumber}
            onChange={(e) => setTopicForm({ ...topicForm, weekNumber: Number(e.target.value) })}
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={topicForm.course}
            onChange={(e) => setTopicForm({ ...topicForm, course: e.target.value })}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => setIsTopicModalOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={createTopic}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create
            </motion.button>
          </div>
        </div>
      </Modal>

      {isEditCourseOpen && editingCourse && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border space-y-4">
          <div className="text-lg font-semibold">Edit Course</div>
          <input
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="Course name"
            value={editingCourse.courseName}
            onChange={(e) => setEditingCourse({ ...editingCourse, courseName: e.target.value })}
          />
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 rounded-lg" onClick={() => setIsEditCourseOpen(false)}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={updateCourse}>Save</button>
          </div>
        </div>
      )}

      {isEditTopicOpen && editingTopic && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border space-y-4">
          <div className="text-lg font-semibold">Edit Topic</div>
          <input
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="Topic title"
            value={editingTopic.topicTitle}
            onChange={(e) => setEditingTopic({ ...editingTopic, topicTitle: e.target.value })}
          />
          <input
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900"
            type="number"
            min={1}
            placeholder="Week number"
            value={editingTopic.weekNumber}
            onChange={(e) => setEditingTopic({ ...editingTopic, weekNumber: Number(e.target.value) })}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900"
            value={editingTopic.course}
            onChange={(e) => setEditingTopic({ ...editingTopic, course: e.target.value })}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 rounded-lg" onClick={() => setIsEditTopicOpen(false)}>Cancel</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={updateTopic}>Save</button>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      <Modal
        isOpen={isDeleteCourseOpen}
        onClose={() => setIsDeleteCourseOpen(false)}
        title="Delete Course"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{deletingCourse?.courseName}</span>? All its topics will also be deleted.</p>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => setIsDeleteCourseOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={async () => { if (deletingCourse) { await deleteCourse(deletingCourse._id); setIsDeleteCourseOpen(false); setDeletingCourse(null); } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Topic Modal */}
      <Modal
        isOpen={isDeleteTopicOpen}
        onClose={() => setIsDeleteTopicOpen(false)}
        title="Delete Topic"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{deletingTopic?.topicTitle}</span>?</p>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => setIsDeleteTopicOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={async () => { if (deletingTopic) { await deleteTopic(deletingTopic._id); setIsDeleteTopicOpen(false); setDeletingTopic(null); } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

