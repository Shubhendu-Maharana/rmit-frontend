import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
        <p className="text-gray-600 mt-2">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
