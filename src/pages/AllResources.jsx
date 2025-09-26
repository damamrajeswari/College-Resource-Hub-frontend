import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  Calendar, 
  BookOpen, 
  User, 
  FileText,
  ChevronDown,
  X,
  Loader
} from 'lucide-react';
import api from '../utils/api';
import { getUserFromToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AllResources = () => {
  const [user, setUser] = useState(getUserFromToken());
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

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

  useEffect(() => {
    fetchResources();
  }, []);

  // Fetch user ratings for all resources after resources are loaded and user is logged in
  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!user || !resources.length) return;
      const ratings = {};
      await Promise.all(resources.map(async (resource) => {
        try {
          const res = await api.get(`/rating/my/${resource._id}`);
          if (res.data && res.data.value) {
            ratings[resource._id] = res.data.value;
          }
        } catch (err) {
          // ignore if not rated
        }
      }));
      setUserRatings(ratings);
    };
    fetchUserRatings();
    // eslint-disable-next-line
  }, [user, resources]);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedSubject, selectedSemester]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources');
      setResources(response.data || []);
    } catch (error) {
      console.error('Fetch resources error:', error);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject) {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Semester filter
    if (selectedSemester) {
      filtered = filtered.filter(resource => resource.semester === selectedSemester);
    }

    setFilteredResources(filtered);
  };

  const handleDownload = async (resourceId, fileUrl, fallbackTitle) => {
    try {
      setDownloadingIds(prev => new Set([...prev, resourceId]));
      const response = await api.get(`/resources/${resourceId}/download`, {
        responseType: 'blob'
      });
      // Extract filename from fileUrl (e.g., '/uploads/12345-file.pdf' => '12345-file.pdf')
      let filename = 'downloaded-file';
      if (fileUrl) {
        const parts = fileUrl.split('/');
        filename = parts[parts.length - 1];
      } else if (fallbackTitle) {
        filename = fallbackTitle;
      }
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      // Update download count in local state
      setResources(prev => prev.map(resource => 
        resource._id === resourceId 
          ? { ...resource, downloadCount: (resource.downloadCount || 0) + 1 }
          : resource
      ));
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(resourceId);
        return newSet;
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedSemester('');
  };


  // --- Rating UI State ---
  const navigate = useNavigate();

  // Fetch user profile from backend for accurate role info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(getUserFromToken());
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);
  const [userRatings, setUserRatings] = useState({}); // { [resourceId]: value }
  const [ratingLoading, setRatingLoading] = useState({}); // { [resourceId]: boolean }
  const [openRatingResourceId, setOpenRatingResourceId] = useState(null); // which resource's rating UI is open

  // Optionally, fetch user's ratings for all resources on mount (not implemented here for brevity)

  const handleRate = async (resourceId, value) => {
    if (!user) {
      alert('You must be logged in to rate resources.');
      return;
    }
    setRatingLoading(prev => ({ ...prev, [resourceId]: true }));
    try {
      await api.post(`/rating/${resourceId}`, { value });
      setUserRatings(prev => ({ ...prev, [resourceId]: value }));
      // Refresh resource list to update average rating
      fetchResources();
    } catch (err) {
      alert('Failed to submit rating.');
    } finally {
      setRatingLoading(prev => ({ ...prev, [resourceId]: false }));
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) return;
    try {
      await api.delete(`/resources/${resourceId}`);
      setResources(prev => prev.filter(r => r._id !== resourceId));
      setFilteredResources(prev => prev.filter(r => r._id !== resourceId));
    } catch (err) {
      alert('Failed to delete resource. You may not have permission.');
    }
  };


  const ResourceCard = ({ resource }) => {
    const userRating = userRatings[resource._id] || null;
    const userInfo = user;
    const isUploader = userInfo && resource.uploadedBy && (resource.uploadedBy._id === userInfo.id || resource.uploadedBy === userInfo.id);
    const isAdmin = userInfo && userInfo.role === 'admin';
    const isRatingOpen = openRatingResourceId === resource._id;
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {resource.description}
            </p>
          </div>
          <FileText className="h-8 w-8 text-blue-500 ml-3 flex-shrink-0" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {resource.subject}
            </span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Sem {resource.semester}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {/* Show average and user rating always */}
              <div className="flex mr-2">
                {Array.from({ length: 5 }, (_, i) => {
                  const ratingValue = i + 1;
                  const highlight = userRating != null
                    ? ratingValue <= userRating
                    : ratingValue <= Math.round(resource.averageRating || 0);
                  return (
                    <span
                      key={i}
                      className={
                        highlight
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                      style={{ fontSize: '1.2em' }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
              <span className="ml-1">{resource.averageRating?.toFixed(1) || "0.0"}</span>
              <span className="text-gray-400 ml-1">({resource.ratingCount || 0})</span>
              {userRating && (
                <span className="ml-2 text-xs text-blue-600">Your rating: {userRating}</span>
              )}
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-green-500 mr-1" />
              <span>{resource.downloads || 0} downloads</span>
            </div>
          </div>
        </div>

        {/* Rate/Update Rating button and star UI */}
        {user && (
          <div className="mb-4">
            {!isRatingOpen ? (
              <button
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                onClick={() => setOpenRatingResourceId(resource._id)}
                disabled={ratingLoading[resource._id]}
              >
                {userRating ? 'Update Rating' : 'Rate'}
              </button>
            ) : (
              <div className="flex items-center space-x-2 mt-2">
                {Array.from({ length: 5 }, (_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <span
                      key={i}
                      className={
                        ratingValue <= (userRating || 0)
                          ? 'text-yellow-400 cursor-pointer'
                          : 'text-gray-300 cursor-pointer'
                      }
                      onClick={() => !ratingLoading[resource._id] && handleRate(resource._id, ratingValue)}
                      style={{ fontSize: '1.5em', pointerEvents: ratingLoading[resource._id] ? 'none' : 'auto' }}
                      title={`Rate ${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
                    >
                      ★
                    </span>
                  );
                })}
                <button
                  className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setOpenRatingResourceId(null)}
                  disabled={ratingLoading[resource._id]}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 text-gray-400 mr-1" />
            <span>by {resource.uploadedBy?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownload(resource._id, resource.fileUrl, resource.title)}
              disabled={downloadingIds.has(resource._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm font-medium"
            >
              {downloadingIds.has(resource._id) ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              )}
            </button>
            {(isUploader || isAdmin) && (
              <button
                onClick={() => handleDelete(resource._id)}
                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                title="Delete Resource"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };




  const LoadingCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded ml-3"></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Resources</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchResources}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Resources</h1>
              <p className="mt-1 text-sm text-gray-600">
                {loading ? 'Loading...' : `${filteredResources.length} resources available`}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {(searchTerm || selectedSubject || selectedSemester) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Resources
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search by title, description..."
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Semesters</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedSubject || selectedSemester 
                    ? 'No resources match your filters' 
                    : 'No resources available yet'
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedSubject || selectedSemester
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Be the first to upload a resource for your fellow students!'
                  }
                </p>
                {(searchTerm || selectedSubject || selectedSemester) && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllResources;