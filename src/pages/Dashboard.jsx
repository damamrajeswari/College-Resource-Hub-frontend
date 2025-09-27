import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Upload, 
  TrendingUp, 
  Download, 
  Star, 
  Clock, 
  Users,
  FileText,
  Award,
  Activity
} from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    topRated: [],
    mostDownloaded: [],
    recent: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchUserProfile();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [topRatedRes, mostDownloadedRes, recentRes] = await Promise.all([
        api.get('/resources/dashboard/top-rated'),
        api.get('/resources/dashboard/most-downloaded'),
        api.get('/resources/dashboard/recent')
      ]);

      setDashboardData({
        topRated: topRatedRes.data || [],
        mostDownloaded: mostDownloadedRes.data || [],
        recent: recentRes.data || []
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  const ResourceCard = ({ resource }) => (
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
            <Clock className="h-3 w-3 mr-1" />
            Sem {resource.semester}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {/* Always render 5 stars */}
            <div className="flex mr-2">
              {Array.from({ length: 5 }, (_, i) => {
                const ratingValue = i + 1;
                if (resource.averageRating >= ratingValue) {
                  return <span key={i} className="text-yellow-400">★</span>; // Full star
                }
                if (resource.averageRating >= ratingValue - 0.5) {
                  return <span key={i} className="text-yellow-400">⯨</span>; // Half star
                }
                return <span key={i} className="text-gray-300">☆</span>; // Empty star
              })}
            </div>
            <span className="ml-1">{resource.averageRating?.toFixed(1) || "0.0"}</span>
            <span className="text-gray-400 ml-1">({resource.ratingCount || 0})</span>
          </div>
          <div className="flex items-center">
            <Download className="h-4 w-4 text-green-500 mr-1" />
            <span>{resource.downloads || 0} downloads</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 text-gray-400 mr-1" />
          <span>by {resource.uploadedBy?.name || 'Anonymous'}</span>
        </div>
        <Link
          to={`/resources`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded ml-3"></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Activity className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover and share academic resources with your college community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/upload"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Resource
              </Link>
              <Link
                to="/resources"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center border border-blue-500"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse All Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Award}
            title="Top Rated Resources"
            value={dashboardData.topRated.length}
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            title="Most Downloaded"
            value={dashboardData.mostDownloaded.length}
            color="green"
          />
          <StatCard
            icon={Clock}
            title="Recent Uploads"
            value={dashboardData.recent.length}
            color="purple"
          />
        </div>

        {/* Top Rated Resources */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Top Rated Resources</h2>
            </div>
            <Link
              to="/resources"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : dashboardData.topRated.length > 0 ? (
              dashboardData.topRated.slice(0, 3).map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  showRating={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No top-rated resources yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Most Downloaded Resources */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Most Downloaded</h2>
            </div>
            <Link
              to="/resources"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : dashboardData.mostDownloaded.length > 0 ? (
              dashboardData.mostDownloaded.slice(0, 3).map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  showDownloads={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No downloads yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Uploads */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
            </div>
            <Link
              to="/resources"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : dashboardData.recent.length > 0 ? (
              dashboardData.recent.slice(0, 3).map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent uploads</p>
                <Link
                  to="/upload"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Be the first to upload →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;