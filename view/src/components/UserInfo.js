import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/users/session`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setError(data.message || 'Not logged in');
      }
    } catch (err) {
      setError('Error fetching user');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShippingAddress = async () => {
    try {
      const res = await fetch(`${API}/users/shipping-address`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setShippingAddress(data.shippingAddress || {
          name: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        });
      } else {
        setError(data.message || 'Unable to fetch address');
      }
    } catch (err) {
      setError('Error fetching shipping address');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchShippingAddress();
  }, []);

  const handleUpdate = async () => {
    try {
      setError('');
      setSuccess('');
      const res = await fetch(`${API}/users/shipping-address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(shippingAddress),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Shipping address updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update address');
      }
    } catch (err) {
      setError('Failed to update shipping address');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      const res = await fetch(`${API}/users/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Password updated successfully!');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Failed to update password');
    }
  };

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white rounded-xl shadow-md overflow-hidden">
      <div className=" bg-[#0F2C59] p-6 text-white">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-blue-100">Welcome back, {user?.name || 'User'}</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
            <p>{success}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="p-2 bg-gray-50 rounded">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>

              {showPasswordForm && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current Password"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New Password"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm Password"
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={handlePasswordUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit Address
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['name', 'address', 'city', 'state', 'postalCode', 'country'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {field === 'postalCode' ? 'Postal Code' : field}
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={shippingAddress[field] || ''}
                          onChange={handleChange}
                          placeholder={`Enter ${field === 'postalCode' ? 'Postal Code' : field}`}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdate}
                      className="bg-[#0F2C59] hover:bg-[#0F2C59] text-white px-4 py-2 rounded"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  {Object.entries(shippingAddress).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key === 'postalCode' ? 'Postal Code' : key}:
                      </span>
                      <p className="mt-1">{value || 'Not provided'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
