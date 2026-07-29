import ErrorPage from '../../../public/illustrations/404.svg';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
      <img
        src={ErrorPage}
        alt="Page not found"
        className="w-72 md:w-96 mb-8"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Oops! Page not found
      </h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or something went wrong.
      </p>
      <button
        onClick={() => (window.location.href = '/dashboard-admin')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Go to Homepage
      </button>
    </div>
  );
};
