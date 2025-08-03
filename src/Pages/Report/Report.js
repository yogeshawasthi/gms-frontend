import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Report = ({ gymId, months = 1 }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // Change the URL if your backend runs on a different port/domain
        const res = await axios.get(`/gym/${gymId}/report?months=${months}`);
        setReport(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };
    if (gymId) fetchReport();
  }, [gymId, months]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!report) return null;

  return (
    <div>
      <h2>Gym Report: {report.gymName}</h2>
      <p>Period: {report.period}</p>
      <p>Total Members: {report.totalMembers}</p>
      <p>Total Income: ₹{report.totalIncome}</p>
      <h3>Active Members</h3>
      <ul>
        {report.activeMembers.map(m => (
          <li key={m.memberId}>{m.userName} ({m.email}) - {m.plan} - ₹{m.planPrice}</li>
        ))}
      </ul>
      {/* Add similar sections for inactiveMembers and expiredMembers if needed */}
    </div>
  );
};

export default Report;