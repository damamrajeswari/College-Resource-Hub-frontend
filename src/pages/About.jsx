import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Upload, 
  Download, 
  Star, 
  Users, 
  Shield, 
  Search,
  Award,
  Code,
  Database,
  Smartphone,
  ArrowRight,
  Heart,
  Github,
  Mail,
  Linkedin,
  Globe
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Resource Upload",
      description: "Share notes, study materials, and documents with a quick, drag-and-drop upload."
    },
    {
      icon: Download,
      title: "Instant Downloads",
      description: "Grab resources shared by students in just one click."
    },
    {
      icon: Search,
      title: "Smart Search & Filters",
      description: "Find what you need quickly with subject, semester, and keyword filters."
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Highlight the most useful resources through community ratings."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Protected with JWT authentication and safe file handling."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built for students — knowledge sharing made easy."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              College Resource Hub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A space where students can share, discover, and collaborate through study materials. 
              Built as a personal project to explore full-stack development and solve a real problem faced in college life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                to="/resources"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
              >
                Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Vision Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Project Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sharing study resources in college is often messy — scattered links, lost files, endless forwards. 
              This project creates a clean, simple hub where everything is organized and accessible.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Student-Centered</h3>
                <p className="text-gray-600">
                  Features designed around real student needs — quick access, easy uploads, and collaboration.
                </p>
              </div>
              <div>
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Full-Stack Build</h3>
                <p className="text-gray-600">
                  Covers everything from database design to responsive frontend and API integration.
                </p>
              </div>
              <div>
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Practices</h3>
                <p className="text-gray-600">
                  Built with JWT auth, secure file handling, and React best practices for reliability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600">
              A snapshot of the functionality included in the hub
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tech Stack
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern, industry-ready technologies for scalability and performance
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Frontend</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">React</span>
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">TailwindCSS</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Vite</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Axios</span>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Database className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Backend</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Express</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">MongoDB</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">JWT Auth</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex items-center justify-center text-gray-600">
                <Smartphone className="h-5 w-5 mr-2" />
                <span>Responsive by design — works smoothly on all devices</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">About Me</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Hi, I'm Rajeswari — a passionate developer who enjoys building practical and impactful projects. 
                This project reflects my interest in solving real-world student problems while sharpening my 
                full-stack development skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <a
                  href="https://github.com/damamrajeswari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/rajeswaridamam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
                <a
                  href="https://rajeswaridamam.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center border border-gray-600"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Portfolio
                </a>
                <a
                  href="mailto:rajeswaridamam007@gmail.com"
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center border border-gray-600"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Give It a Try
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore the hub and see how sharing resources can be made simple
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Try the App
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-200"
              >
                Demo Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
