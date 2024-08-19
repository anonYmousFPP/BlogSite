import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      {/* Header Section */}
      <header className="bg-white shadow-md w-full py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Blogify</h1>
          <div>
            <Link
              to="/signin"
              className="text-gray-800 font-semibold hover:text-gray-600 mx-4"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Blogify
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Share your stories, thoughts, and ideas with the world. Start by
          creating or updating your blog.
        </p>
        <div>
          <Link
            to="/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 mr-4"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900"
          >
            Sign Up
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white shadow-md w-full py-4 px-8 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            &copy; 2024 Blogify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
