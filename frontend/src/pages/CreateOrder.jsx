import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config';

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    garments: [{ garmentType: 'shirt', quantity: 1 }]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const garmentTypes = [
    { value: 'shirt', label: 'Shirt', price: 10 },
    { value: 'pants', label: 'Pants', price: 15 },
    { value: 'saree', label: 'Saree', price: 20 }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGarmentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      garments: prev.garments.map((g, i) => 
        i === index ? { ...g, [field]: field === 'quantity' ? (parseInt(value) || 1) : value } : g
      )
    }));
  };

  const addGarment = () => {
    setFormData({
      ...formData,
      garments: [...formData.garments, { garmentType: 'shirt', quantity: 1 }]
    });
  };

  const removeGarment = (index) => {
    if (formData.garments.length > 1) {
      const newGarments = formData.garments.filter((_, i) => i !== index);
      setFormData({ ...formData, garments: newGarments });
    }
  };

  const calculateTotal = () => {
    return formData.garments.reduce((total, g) => {
      const garment = garmentTypes.find(t => t.value === g.garmentType);
      return total + (garment?.price || 0) * (g.quantity || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/order/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Order created successfully!');
        setFormData({ customerName: '', phone: '', garments: [{ garmentType: 'shirt', quantity: 1 }] });
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        setError(data.message || 'Failed to create order');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">New Laundry Order</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link to="/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Order</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Garments</label>
                  <button
                    type="button"
                    onClick={addGarment}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Garment
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.garments.map((garment, index) => (
                    <div key={index} className="flex gap-3 items-end p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                        <select
                          value={garment.garmentType}
                          onChange={(e) => handleGarmentChange(index, 'garmentType', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                          {garmentTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label} (₹{t.price})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-xs text-gray-500 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={garment.quantity}
                          onChange={(e) => handleGarmentChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs text-gray-500 mb-1">Price</label>
                        <span className="text-gray-900 font-medium">₹{(garmentTypes.find(t => t.value === garment.garmentType)?.price || 0) * garment.quantity}</span>
                      </div>
                      {formData.garments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGarment(index)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">₹{calculateTotal()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating Order...' : 'Create Order'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateOrder;