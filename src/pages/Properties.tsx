import React from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { useState } from 'react';

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const properties = useStore(state => state.properties);
  const addProperty = useStore(state => state.addProperty);
  const deleteProperty = useStore(state => state.deleteProperty);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    type: 'Building',
    image: '',
    units: ''
  });

  const handleOpenModal = () => {
    setForm({ name: '', address: '', type: 'Building', image: '', units: '' });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProperty({
      id: `prop${Date.now()}`,
      name: form.name,
      address: form.address,
      type: form.type as any,
      image: form.image,
      units: Number(form.units)
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${editMode ? 'bg-gray-200 text-gray-800' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
        >
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 relative group">
            <div
              className="h-48 bg-gray-200 relative cursor-pointer"
              onClick={() => !editMode && navigate(`/properties/${property.id}`)}
            >
              {property.image ? (
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Building2 size={48} className="text-gray-400" />
                </div>
              )}
              {editMode && (
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10 opacity-80 group-hover:opacity-100"
                  onClick={e => { e.stopPropagation(); deleteProperty(property.id); }}
                  aria-label="Delete Property"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{property.address}</p>
              <div className="flex items-center justify-between text-sm mt-4">
                <div>
                  <span className="font-medium text-gray-900">{property.type}</span>
                </div>
                {property.units && (
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {property.units} Units
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {editMode && (
          <div
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 h-[280px] flex flex-col items-center justify-center hover:border-teal-400 transition-colors cursor-pointer"
            onClick={handleOpenModal}
          >
            <div className="p-3 rounded-full bg-teal-50 mb-3">
              <Plus size={24} className="text-teal-600" />
            </div>
            <p className="text-gray-500 font-medium">Add New Property</p>
          </div>
        )}
      </div>
      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Property</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                  <option value="Building">Building</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Office">Office</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" name="image" value={form.image} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Units</label>
                <input type="number" name="units" value={form.units} onChange={handleChange} min="1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">Add Property</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;