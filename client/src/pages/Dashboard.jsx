import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0,
    totalBGAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD STATS
  const fetchDashboardStats = async () => {

    try {

      const response = await API.get("/bg/stats/dashboard");

      setStats(response.data.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load dashboard data");

    } finally {

      setLoading(false);

    }

  };

  // LOAD DATA
  useEffect(() => {

    fetchDashboardStats();

  }, []);

  return (
    <MainLayout>

      {/* PAGE HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-[#5B2EFF]">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of BG requests and approvals
        </p>

      </div>

      {loading ? (

        <div className="bg-white rounded-3xl p-10 shadow-sm text-center text-gray-500">
          Loading dashboard...
        </div>

      ) : (

        <>
          {/* TOP STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

            {/* TOTAL */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100">

              <h3 className="text-gray-500 font-medium">
                Total Requests
              </h3>

              <h1 className="text-4xl font-bold mt-4 text-[#5B2EFF]">
                {stats.totalRequests}
              </h1>

            </div>

            {/* APPROVED */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100">

              <h3 className="text-gray-500 font-medium">
                Approved
              </h3>

              <h1 className="text-4xl font-bold mt-4 text-green-500">
                {stats.approvedRequests}
              </h1>

            </div>

            {/* PENDING */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">

              <h3 className="text-gray-500 font-medium">
                Pending
              </h3>

              <h1 className="text-4xl font-bold mt-4 text-orange-500">
                {stats.pendingRequests}
              </h1>

            </div>

            {/* REJECTED */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">

              <h3 className="text-gray-500 font-medium">
                Rejected
              </h3>

              <h1 className="text-4xl font-bold mt-4 text-red-500">
                {stats.rejectedRequests}
              </h1>

            </div>

            {/* TOTAL BG AMOUNT */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">

              <h3 className="text-gray-500 font-medium">
                Total BG Amount
              </h3>

              <h1 className="text-3xl font-bold mt-4 text-blue-500">
                ₹ {stats.totalBGAmount}
              </h1>

            </div>

          </div>

          {/* SUMMARY SECTION */}
          <div className="mt-10 bg-white rounded-3xl shadow-sm p-8 border border-purple-100">

            <h2 className="text-2xl font-bold text-[#5B2EFF] mb-6">
              System Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-[#F7F4FF] rounded-2xl p-6">

                <h3 className="text-lg font-semibold text-[#5B2EFF]">
                  Approval Rate
                </h3>

                <p className="text-4xl font-bold mt-4 text-green-500">
                  {stats.totalRequests > 0
                    ? Math.round(
                        (stats.approvedRequests /
                          stats.totalRequests) *
                          100
                      )
                    : 0}
                  %
                </p>

              </div>

              <div className="bg-[#FFF7ED] rounded-2xl p-6">

                <h3 className="text-lg font-semibold text-orange-500">
                  Pending Workload
                </h3>

                <p className="text-4xl font-bold mt-4 text-orange-500">
                  {stats.pendingRequests}
                </p>

              </div>

            </div>

          </div>
        </>

      )}

    </MainLayout>
  );
}

export default Dashboard;