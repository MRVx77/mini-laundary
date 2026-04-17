import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    const colors = {
      RECEIVED: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      READY: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Quick Dry Cleaning
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/orders" className="text-gray-600 hover:text-gray-900">
                Orders
              </Link>
              <Link
                to="/create-order"
                className="text-gray-600 hover:text-gray-900"
              >
                New Order
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Dashboard Overview
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Orders
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {stats.totalOrders}
                    </dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      ₹{stats.totalRevenue}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Status Breakdown
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {stats.statusBreakdown &&
                    stats.statusBreakdown.length > 0 ? (
                      stats.statusBreakdown.map((item, index) => (
                        <div
                          key={index}
                          className={`${index !== 0 ? "border-t border-gray-200" : ""} px-4 py-4 sm:px-6`}
                        >
                          <dt className="text-sm font-medium text-gray-500 flex justify-between items-center">
                            <span
                              className={`px-2 py-1 rounded ${getStatusColor(item._id)}`}
                            >
                              {item._id}
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {item.count} orders
                            </span>
                          </dt>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 sm:px-6 text-gray-500">
                        No orders yet
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500">Failed to load dashboard data</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
