import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function Reports() {

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH REPORTS
  // ==========================================
  const fetchReports = async () => {

    try {

      setLoading(true);

      // ✅ FIXED API
      const response = await API.get("/bg");

      console.log("REPORT API:", response.data);

      // ✅ ONLY APPROVED + REJECTED
      const filteredData =
        response?.data?.data?.filter(
          (item) =>
            item.status === "Approved" ||
            item.status === "Rejected"
        ) || [];

      setReportData(filteredData);

    } catch (error) {

      console.log(error);

      alert("Failed to load reports");

      setReportData([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchReports();

  }, []);

  // ==========================================
  // EXPORT PDF
  // ==========================================
  const downloadPDF = () => {

    const doc = new jsPDF("landscape");

    doc.text("BG Reports", 14, 15);

    autoTable(doc, {

      startY: 25,

      head: [[
        "ID",
        "Department",
        "Location",
        "Request Date",
        "Work Order",
        "Type Of Work",
        "Job Value",
        "Requester",
        "Superior",
        "Party Name",
        "Nature",
        "BG Amount",
        "Expiry Date",
        "Claim Period",
        "Remarks",
        "Status",
      ]],

      body: reportData.map((item, index) => [

        index + 1,
        item.department || "-",
        item.location || "-",
        item.requestDate || item.dateOfRequest || "-",
        item.workOrder || item.workOrderNo || "-",
        item.typeOfWork || "-",
        item.jobValue || "-",
        item.requesterName || "-",
        item.superiorName || "-",
        item.partyName || "-",
        item.nature || item.natureOfBG || "-",
        item.bgAmount || "-",
        item.expiryDate || item.bgExpiryDate || "-",
        item.claimPeriod || "-",
        item.remarks || "-",
        item.status || "-",

      ]),

      styles: {
        fontSize: 7,
      },

      headStyles: {
        fillColor: [91, 46, 255],
      },

    });

    doc.save("bg-reports.pdf");

  };

  // ==========================================
  // EXPORT EXCEL
  // ==========================================
  const downloadExcel = () => {

    const excelData = reportData.map((item, index) => ({

      ID: index + 1,
      Department: item.department || "-",
      Location: item.location || "-",
      RequestDate:
        item.requestDate ||
        item.dateOfRequest ||
        "-",
      WorkOrder:
        item.workOrder ||
        item.workOrderNo ||
        "-",
      TypeOfWork:
        item.typeOfWork || "-",
      JobValue:
        item.jobValue || "-",
      Requester:
        item.requesterName || "-",
      Superior:
        item.superiorName || "-",
      PartyName:
        item.partyName || "-",
      Nature:
        item.nature ||
        item.natureOfBG ||
        "-",
      BGAmount:
        item.bgAmount || "-",
      ExpiryDate:
        item.expiryDate ||
        item.bgExpiryDate ||
        "-",
      ClaimPeriod:
        item.claimPeriod || "-",
      Remarks:
        item.remarks || "-",
      Status:
        item.status || "-",

    }));

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    XLSX.writeFile(
      workbook,
      "bg-reports.xlsx"
    );

  };

  return (
    <MainLayout>

      <div className="bg-white rounded-3xl shadow-xl p-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-4xl font-bold text-[#5B2EFF]">
              Reports
            </h1>

            <p className="text-gray-500 mt-2">
              Approved and rejected BG requests
            </p>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={downloadExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md transition"
            >
              Export Excel
            </button>

            <button
              onClick={downloadPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md transition"
            >
              Export PDF
            </button>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="text-center py-20 text-gray-500">
            Loading reports...
          </div>

        ) : (

          <>
            {/* TABLE */}
            <div className="overflow-x-auto rounded-3xl border border-gray-100">

              <table className="min-w-[2200px] w-full">

                <thead>

                  <tr className="bg-gradient-to-r from-[#5B2EFF] to-[#7B4DFF] text-white text-sm">

                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Department</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Request Date</th>
                    <th className="p-4 text-left">Work Order</th>
                    <th className="p-4 text-left">Type Of Work</th>
                    <th className="p-4 text-left">Job Value</th>
                    <th className="p-4 text-left">Requester</th>
                    <th className="p-4 text-left">Superior</th>
                    <th className="p-4 text-left">Party Name</th>
                    <th className="p-4 text-left">Nature</th>
                    <th className="p-4 text-left">BG Amount</th>
                    <th className="p-4 text-left">Expiry Date</th>
                    <th className="p-4 text-left">Claim Period</th>
                    <th className="p-4 text-left">Remarks</th>
                    <th className="p-4 text-left">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {reportData.map((item, index) => (

                    <tr
                      key={item._id}
                      className="border-b border-gray-100 hover:bg-purple-50/40 transition text-sm"
                    >

                      <td className="p-4 font-semibold">
                        #{index + 1}
                      </td>

                      <td className="p-4">
                        {item.department || "-"}
                      </td>

                      <td className="p-4">
                        {item.location || "-"}
                      </td>

                      <td className="p-4">
                        {item.requestDate ||
                          item.dateOfRequest ||
                          "-"}
                      </td>

                      <td className="p-4">
                        {item.workOrder ||
                          item.workOrderNo ||
                          "-"}
                      </td>

                      <td className="p-4">
                        {item.typeOfWork || "-"}
                      </td>

                      <td className="p-4">
                        ₹ {item.jobValue || "-"}
                      </td>

                      <td className="p-4">
                        {item.requesterName || "-"}
                      </td>

                      <td className="p-4">
                        {item.superiorName || "-"}
                      </td>

                      <td className="p-4">
                        {item.partyName || "-"}
                      </td>

                      <td className="p-4">
                        {item.nature ||
                          item.natureOfBG ||
                          "-"}
                      </td>

                      <td className="p-4 font-semibold text-[#5B2EFF]">
                        ₹ {item.bgAmount || "-"}
                      </td>

                      <td className="p-4">
                        {item.expiryDate ||
                          item.bgExpiryDate ||
                          "-"}
                      </td>

                      <td className="p-4">
                        {item.claimPeriod || "-"}
                      </td>

                      <td className="p-4">
                        {item.remarks || "-"}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-4 py-2 rounded-full text-xs font-semibold ${
                            item.status === "Approved"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* EMPTY */}
            {reportData.length === 0 && (

              <div className="text-center py-20 text-gray-500">
                No Approved / Rejected Reports Found
              </div>

            )}

          </>

        )}

      </div>

    </MainLayout>
  );
}

export default Reports;