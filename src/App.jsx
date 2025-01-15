import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = 'https://leader-board-assignment-backend-sanchitpatil08s-projects.vercel.app/';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/points/claim`, {
        userId: selectedUser
      });
      toast.success(`Claimed ${response.data.pointsClaimed} points!`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to claim points');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      toast.error('Please enter a user name');
      return;
    }

    try {
      await axios.post(`${API_URL}/users`, { name: newUserName });
      toast.success('User added successfully');
      setNewUserName('');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
          </div>

          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter new user name"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add User
              </button>
            </div>
          </form>

          {/* User Selection and Claim Points */}
          <div className="flex gap-2 mb-6">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleClaimPoints}
              disabled={loading || !selectedUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Claiming...' : 'Claim Points'}
            </button>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                        #{user.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
