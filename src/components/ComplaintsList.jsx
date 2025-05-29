import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

const clusterApi = axios.create({
  baseURL: 'http://localhost:5004',
  timeout: 30000
});

function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [clusters, setClusters] = useState([]);
  const [clusteringLoading, setClusteringLoading] = useState(false);
  const [clusteringError, setClusteringError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      if (response.data.success) {
        setComplaints(response.data.data);
      } else {
        setError('Failed to fetch complaints: Invalid response');
      }
    } catch (err) {
      setError(`Failed to fetch complaints: ${err.message}`);
      console.error('Fetch complaints error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        setComplaints(prevComplaints =>
          prevComplaints.map(complaint =>
            complaint._id === complaintId
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
      } else {
        setError('Failed to update complaint status');
      }
    } catch (err) {
      setError(`Failed to update complaint status: ${err.message}`);
      console.error('Status update error:', err);
    }
  };

  const handleClearStorage = async () => {
    try {
      await clusterApi.post('/clear');
      setClusters([]);
      setClusteringError('');
    } catch (err) {
      setClusteringError(`Failed to clear storage: ${err.message}`);
      console.error('Clear storage error:', err);
    }
  };

  const handleClusterComplaints = async () => {
    setClusteringLoading(true);
    setClusteringError('');
    setClusters([]);

    try {
      if (complaints.length === 0) {
        setClusteringError('No complaints available to cluster');
        return;
      }

      // Clear backend storage
      await clusterApi.post('/clear');

      // Send valid complaint titles
      const validTitles = complaints.filter(c => c.title && typeof c.title === 'string' && c.title.trim());
      if (validTitles.length === 0) {
        setClusteringError('No valid complaint titles to cluster');
        return;
      }

      console.log('Sending titles:', validTitles.map(c => c.title));
      for (const complaint of validTitles) {
        await clusterApi.post('/comment', { text: complaint.title });
      }

      // Fetch clustering results
      const response = await clusterApi.get('/summaries');
      if (!response.data.groups || !Array.isArray(response.data.groups)) {
        throw new Error('Invalid clustering response');
      }
      setClusters(response.data.groups);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown clustering error';
      setClusteringError(`Failed to cluster complaints: ${errorMsg}`);
      console.error('Clustering error:', err);
    } finally {
      setClusteringLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    filter === 'all' ? true : complaint.status === filter
  );

  const extractPotholeInfo = (description) => {
    if (!description) return null;
    const potholeMatch = description.match(/Pothole Detected \(Confidence: (\d+\.\d+)%\)/);
    if (potholeMatch) {
      return { detected: true, confidence: parseFloat(potholeMatch[1]) };
    }
    const noPotholeMatch = description.includes('No Pothole Detected');
    if (noPotholeMatch) {
      return { detected: false, confidence: null };
    }
    return null;
  };

  if (loading) return <div className="text-center py-4">Loading complaints...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complaints Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleClearStorage}
            className="px-4 py-2 rounded-md text-white font-medium bg-gray-500 hover:bg-gray-600"
          >
            Clear Storage
          </button>
          <button
            onClick={handleClusterComplaints}
            disabled={clusteringLoading}
            className={`px-4 py-2 rounded-md text-white font-medium
              ${clusteringLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {clusteringLoading ? 'Clustering...' : 'Cluster Complaints'}
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {clusteringError && (
        <div className="text-red-500 text-center py-4">
          {clusteringError}
          <button
            onClick={handleClusterComplaints}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {clusters.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Clustered Complaints</h3>
          {clusters.map((group, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
              <h4 className="text-lg font-medium text-gray-700">Summary: {group.summary}</h4>
              <ul className="list-disc pl-6 mt-2">
                {group.comments.map((comment, commentIndex) => (
                  <li key={commentIndex} className="text-sm text-gray-600">{comment}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pothole
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => {
              const potholeInfo = complaint.category === 'roads' ? extractPotholeInfo(complaint.description) : null;
              return (
                <tr key={complaint._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{complaint.title || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {complaint.description ? complaint.description.substring(0, 50) + '...' : 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {complaint.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.department || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                      ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                      ${complaint.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}`}>
                      {complaint.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {potholeInfo === null && complaint.category === 'roads' && 'N/A'}
                    {potholeInfo && potholeInfo.detected && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Detected ({potholeInfo.confidence.toFixed(2)}%)
                      </span>
                    )}
                    {potholeInfo && !potholeInfo.detected && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Not Detected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={complaint.status || 'pending'}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComplaintsList;