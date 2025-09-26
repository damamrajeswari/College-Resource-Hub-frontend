import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, BookOpen, Calendar, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import api from '../utils/api';

const UploadResource = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    file: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const subjects = [
  // Computer Science & IT
  'Programming Languages', 'Data Structures & Algorithms', 'Object-Oriented Programming', 
  'Operating Systems', 'Database Management Systems', 'Computer Networks', 
  'Software Engineering', 'Web Development', 'Mobile Development', 
  'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 
  'Natural Language Processing', 'Computer Vision', 'Cloud Computing', 
  'Cybersecurity', 'Internet of Things', 'Embedded Systems', 'Blockchain Technology',
  
  // Core Sciences & Mathematics
  'Mathematics', 'Discrete Mathematics', 'Linear Algebra', 'Probability & Statistics', 
  'Calculus', 'Graph Theory', 'Physics', 'Chemistry', 'Engineering Mechanics', 
  'Thermodynamics', 'Material Science', 'Fluid Mechanics', 'Electrical & Electronics Fundamentals',

  // General Engineering
  'Circuit Theory', 'Control Systems', 'Mechanical Design', 'Manufacturing Processes', 
  'Signals & Systems', 'Microprocessors & Microcontrollers', 'Renewable Energy', 
  'Robotics', 'VLSI Design', 'Mechatronics', 'Aerodynamics', 'Automotive Engineering',

  // Management & Business
  'Principles of Management', 'Organizational Behavior', 'Business Communication', 
  'Human Resource Management', 'Marketing Management', 'Financial Accounting', 
  'Managerial Economics', 'Operations Management', 'Business Law', 'Strategic Management', 
  'Supply Chain Management', 'Project Management', 'Entrepreneurship', 'International Business', 
  'Leadership & Ethics', 'Risk Management', 'Decision Sciences', 'Digital Marketing', 
  'Brand Management', 'Sales & Distribution Management',

  // Other Subjects
  'Biology', 'English', 'History', 'Economics', 'Psychology', 
  'Philosophy', 'Political Science', 'Sociology', 'Art', 'Music', 'Other'
];


  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          file: 'Please upload a PDF, DOC, DOCX, or TXT file'
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          file: 'File size must be less than 10MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }));
      
      // Clear file error
      if (validationErrors.file) {
        setValidationErrors(prev => ({
          ...prev,
          file: ''
        }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.subject) {
      errors.subject = 'Subject is required';
    }

    if (!formData.semester) {
      errors.semester = 'Semester is required';
    }

    if (!formData.file) {
      errors.file = 'Please select a file to upload';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title.trim());
      uploadData.append('description', formData.description.trim());
      uploadData.append('subject', formData.subject);
      uploadData.append('semester', formData.semester);
      uploadData.append('file', formData.file);

      await api.post('/resources/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
    } catch (error) {
      console.error('Upload error:', error);
      setError(
        error.response?.data?.message || 
        'Upload failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      semester: '',
      file: null
    });
    setSuccess(false);
    setError('');
    setValidationErrors({});
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Resource Uploaded Successfully! 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Your resource has been uploaded and is now available for other students to download.
          </p>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/resources"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View All Resources
            </Link>
            <button
              onClick={resetForm}
              className="block w-full text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Upload Another Resource
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Resource
          </h1>
          <p className="text-gray-600">
            Share your study materials with fellow students
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Data Structures Notes - Chapter 1"
                />
              </div>
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className={`block w-full px-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what this resource covers, topics included, and any important notes..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Subject and Semester Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.subject ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.subject && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="semester"
                    name="semester"
                    required
                    value={formData.semester}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.semester ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        Semester {semester}
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.semester && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.semester}</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : validationErrors.file
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  {formData.file ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-8 w-8 text-green-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileChange(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Drop files here or{' '}
                            <span className="text-blue-600 hover:text-blue-500">browse</span>
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT up to 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {validationErrors.file && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.file}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </>
                )}
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResource;