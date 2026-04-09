

import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-green-100 flex flex-col justify-center items-center p-10">
        <img
          src="/cinema-movie-premiere.jpg"
          alt="illustration"
          className="w-3/4 mb-6"
        />
        <h1 className="text-2xl font-semibold text-gray-800">
          BingeHere Admin dashboard
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-50">
        <div className="w-87.5">
          {/* LOGO */}
          <h2 className="text-3xl font-semibold text-center mb-6">
            <span className="text-gray-800">Binge</span>{" "}
            <span className="text-green-600">Here</span>
          </h2>

          {/* FORM */}
          <form className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">
                Username or email
              </label>
              <input
                type="text"
                placeholder="johnsmith007"
                className="w-full mt-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full mt-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;