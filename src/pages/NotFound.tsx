
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CloudOff } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-blue-50">
            <CloudOff className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h1 className="text-4xl font-light text-gray-800 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Weather forecast not found</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
