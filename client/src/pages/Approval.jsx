import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function Approval() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const ADMIN_PHONE = "9876543210";

const user = JSON.parse(localStorage.getItem("user"));
const userPhone = user?.phoneNumber || "";

  // ✅ remarks per request
  const [remarksMap, setRemarksMap] = useState({});
  if (userPhone !== ADMIN_PHONE) {

    return (

      <MainLayout>

        <div className="bg-white rounded-3xl p-12 text-center shadow-xl">

          <h1 className="text-4xl font-bold text-red-500">

            Admin Access Only

          </h1>

          <p className="mt-4 text-gray-500">

            Only administrator can access

            Approval Management.

          </p>

        </div>

      </MainLayout>

    );

  }

  // FETCH ALL REQUESTS
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await API.get("/bg");

      const data = response?.data?.data || [];

      setRequests(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
      alert("Failed to fetch requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // UPDATE STATUS + REMARKS
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bg/${id}/status`, {
        status,
        remarks: remarksMap[id] || "",
      });

      alert(`Request ${status}`);

      fetchRequests();

    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  // handle remark input
  const handleRemarkChange = (id, value) => {
    setRemarksMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <MainLayout>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-4xl font-bold text-[#5B2EFF]">
              Approval Management
            </h1>

            <p className="text-gray-500 mt-2">
              Review and manage BG requests professionally
            </p>
          </div>

          <div className="bg-[#F3EEFF] px-6 py-4 rounded-2xl">
            <p className="text-sm text-gray-500">Total Requests</p>
            <h2 className="text-3xl font-bold text-[#5B2EFF]">
              {requests.length}
            </h2>
          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading requests...
          </div>
        ) : (

          <>
            {/* TABLE */}
            <div className="overflow-x-auto rounded-3xl border border-gray-100">

              <table className="w-full">

                <thead>
                  <tr className="bg-gradient-to-r from-[#5B2EFF] to-[#7B4DFF] text-white text-left">

                    <th className="p-5">ID</th>
                    <th className="p-5">Department</th>
                    <th className="p-5">Requester</th>
                    <th className="p-5">BG Amount</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Remarks</th>
                    <th className="p-5">Actions</th>

                  </tr>
                </thead>

                <tbody>

                {requests.map((item, index) => (

<React.Fragment key={item._id}>
                      {/* MAIN ROW */}
                      <tr
  key={item._id}
  onClick={() =>
    setExpandedRow(
      expandedRow === item._id
        ? null
        : item._id
    )
  }
  className="border-b border-gray-100 hover:bg-purple-50/40 cursor-pointer"
>

                        <td className="p-5 font-semibold">#{index + 1}</td>
                        <td className="p-5">{item.department}</td>
                        <td className="p-5">{item.requesterName}</td>
                        <td className="p-5 font-bold text-[#5B2EFF]">
                          ₹ {item.bgAmount}
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              item.status === "Approved"
                                ? "bg-green-100 text-green-600"
                                : item.status === "Rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* REMARKS INPUT */}
                        <td className="p-5 min-w-[250px]">

                          <input
                            type="text"
                            placeholder="Add remarks..."
                            value={remarksMap[item._id] || ""}
                            onChange={(e) =>
                              handleRemarkChange(item._id, e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-2xl p-3 bg-gray-50 outline-none focus:border-[#5B2EFF]"
                          />

                        </td>

                        {/* ACTIONS */}
                        <td className="p-5">

                        {item.status === "Pending" ? (

<div className="flex gap-3">

  <button
    onClick={(e) => {
      e.stopPropagation();
      updateStatus(item._id, "Approved");
    }}
    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-sm"
  >
    Approve
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      updateStatus(item._id, "Rejected");
    }}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm"
  >
    Reject
  </button>

</div>

) : (

<span
  className={`font-semibold ${
    item.status === "Approved"
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {item.status} 
</span>

)}

                        </td>

                      </tr>

                     {/* EXTRA DETAILS ROW */}
{expandedRow === item._id && (
  <tr className="bg-gray-50">
    <td colSpan="7" className="p-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <p><b>Location:</b> {item.location}</p>
        <p><b>Work Order:</b> {item.workOrderNo}</p>
        <p><b>Party:</b> {item.partyName}</p>
        <p><b>BG Type:</b> {item.natureOfBG}</p>
        <p><b>Claim Period:</b> {item.claimPeriod}</p>
        <p><b>Expiry:</b> {item.bgExpiryDate}</p>
        <p><b>Request Date:</b> {item.dateOfRequest}</p>
        <p><b>Superior:</b> {item.superiorName}</p>

      </div>

      <div className="mt-5 border-t pt-4">

        <h3 className="font-semibold text-gray-700 mb-3">
          Uploaded Documents
        </h3>

        <div className="flex flex-wrap gap-3">

          {item.bgDraft && (
            <a
              href={`https://bg-system-3.onrender.com/${item.bgDraft}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border rounded-xl shadow-sm"
            >
              📄 BG Draft
            </a>
          )}

          {item.approvalFile && (
            <a
              href={`https://bg-system-3.onrender.com/${item.approvalFile}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border rounded-xl shadow-sm"
            >
              📄 Approval File
            </a>
          )}

          {item.beneficiaryClause && (
            <a
              href={`https://bg-system-3.onrender.com/${item.beneficiaryClause}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border rounded-xl shadow-sm"
            >
              📄 Beneficiary Clause
            </a>
          )}

          {item.bankDetails && (
            <a
              href={`https://bg-system-3.onrender.com/${item.bankDetails}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border rounded-xl shadow-sm"
            >
              📄 Bank Details
            </a>
          )}

        </div>

      </div>

    </td>
  </tr>
)}
                   </React.Fragment>

                  ))}

                </tbody>

              </table>

            </div>

            {/* EMPTY */}
            {requests.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No BG Requests Found
              </div>
            )}

          </>
        )}

      </div>

    </MainLayout>
  );
}

export default Approval;