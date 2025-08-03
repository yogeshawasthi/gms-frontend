import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";

const GymReport = () => {
  const { gymId } = useParams();
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/auth/gym/${gymId}/report?months=${months}`
        );
        setReport(res.data);
      } catch (err) {
        setReport(null);
        toast.error("Failed to fetch report.");
      }
      setLoading(false);
    };
    if (gymId) fetchReport();
  }, [gymId, months]);

  // Simple PDF generation (no autotable)
  const handleDownload = () => {
    if (!report) {
      toast.error("No report data to download.");
      return;
    }
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Gym Activity Report", 105, 13, { align: "center" });

    // Summary Section
    y = 28;
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Gym: `, 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${report.gymName || ""}`, 35, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Period: `, 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${report.period || ""}`, 35, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Members  `, 14, y);// space after colon
    doc.setFont("helvetica", "bold");
    doc.text(`${report.totalMembers ?? 0}`, 45, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Income: `, 14, y);
    doc.setTextColor(21, 128, 61); // green-700
    doc.setFont("helvetica", "bold");
    doc.text(`${report.totalIncome ?? 0}`, 45, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    y += 7;

    // Draw a line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, 196, y);
    y += 6;

    // Helper to print member lists as a table
    const printMembers = (title, members, color) => {
      // Section Title
      doc.setFillColor(...color);
      doc.rect(14, y - 2, 182, 8, "F");
      doc.setTextColor(60, 60, 60); // faded heading text
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(title, 16, y + 4);
      doc.setTextColor(0, 0, 0);
      y += 10;

      // Table Header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("No.", 16, y);
      doc.text("Name", 28, y);
      doc.text("Plan", 90, y);
      doc.text("Status", 130, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      if (!members || members.length === 0) {
        doc.text("None", 28, y);
        y += 7;
      } else {
        members.forEach((m, idx) => {
          doc.text(`${idx + 1}`, 16, y);
          doc.text(`${m.userName || ""}`, 28, y);
          doc.text(`${m.plan || ""}`, 90, y);
          doc.text(`${m.status || ""}`, 130, y);
          y += 7;
          // Add new page if needed
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }
      y += 4;
    };

    // Faded color headings for sections
    printMembers("Active Members", report.activeMembers, [219, 234, 254]);   // faded blue
    printMembers("Inactive Members", report.inactiveMembers, [254, 243, 199]); // faded yellow
    printMembers("Expired Members", report.expiredMembers, [254, 226, 226]); // faded red

    doc.save(`gym_report_${months}_months.pdf`);
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ToastContainer />
      <div className="flex-shrink-0 p-8">
        <h2 className="text-2xl font-bold mb-4">Download Gym Activity Report</h2>
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Period:</label>
          <select
            value={months}
            onChange={e => setMonths(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
              <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>
            ))}
          </select>
          <button
            onClick={handleDownload}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading || !report}
          >
            {loading ? "Loading..." : "Download PDF"}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-8">
        {loading && <div>Loading report...</div>}

        {!loading && report && (
          <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full">
            {/* Summary Card as Flex Boxes */}
            <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Gym Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded p-4 flex flex-col items-center justify-center min-h-[90px]">
                  <div className="text-gray-500 font-semibold">Gym</div>
                  <div className="text-lg font-bold">{report.gymName}</div>
                </div>
                <div className="bg-yellow-50 rounded p-4 flex flex-col items-center justify-center min-h-[90px]">
                  <div className="text-gray-500 font-semibold">Period</div>
                  <div className="text-lg font-bold">{report.period}</div>
                </div>
                <div className="bg-green-50 rounded p-4 flex flex-col items-center justify-center min-h-[90px]">
                  <div className="text-gray-500 font-semibold">Total Members </div>
                  <div className="text-lg font-bold">{report.totalMembers}</div>
                </div>
                <div className="bg-purple-50 rounded p-4 flex flex-col items-center justify-center min-h-[90px]">
                  <div className="text-gray-500 font-semibold">Total Income</div>
                  <div className="text-lg text-green-700 font-bold">Rs.{report.totalIncome}</div>
                </div>
              </div>
            </div>

            {/* Member Tables */}
            <div className="space-y-8 flex-1">
              {/* Active Members */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-blue-700">Active Members</h4>
                {report.activeMembers?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-blue-200 rounded shadow">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="py-2 px-3 text-left">Name</th>
                          <th className="py-2 px-3 text-left">Plan</th>
                          <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.activeMembers.map(m => (
                          <tr key={m.memberId} className="border-t border-blue-100 hover:bg-blue-50">
                            <td className="py-2 px-3">{m.userName || ""}</td>
                            <td className="py-2 px-3">{m.plan || ""}</td>
                            <td className="py-2 px-3">{m.status || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No active members.</p>
                )}
              </div>

              {/* Inactive Members */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-yellow-700">Inactive Members</h4>
                {report.inactiveMembers?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-yellow-200 rounded shadow">
                      <thead>
                        <tr className="bg-yellow-100">
                          <th className="py-2 px-3 text-left">Name</th>
                          <th className="py-2 px-3 text-left">Plan</th>
                          <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.inactiveMembers.map(m => (
                          <tr key={m.memberId} className="border-t border-yellow-100 hover:bg-yellow-50">
                            <td className="py-2 px-3">{m.userName || ""}</td>
                            <td className="py-2 px-3">{m.plan || ""}</td>
                            <td className="py-2 px-3">{m.status || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No inactive members.</p>
                )}
              </div>

              {/* Expired Members */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-red-700">Expired Members</h4>
                {report.expiredMembers?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-red-200 rounded shadow">
                      <thead>
                        <tr className="bg-red-100">
                          <th className="py-2 px-3 text-left">Name</th>
                          <th className="py-2 px-3 text-left">Plan</th>
                          <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.expiredMembers.map(m => (
                          <tr key={m.memberId} className="border-t border-red-100 hover:bg-red-50">
                            <td className="py-2 px-3">{m.userName || ""}</td>
                            <td className="py-2 px-3">{m.plan || ""}</td>
                            <td className="py-2 px-3">{m.status || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No expired members.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && !report && (
          <div>No report data available.</div>
        )}
      </div>
    </div>
  );
};

export default GymReport;