import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import useStore from '../../store';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, propertyId }) => {
  const { properties, addProperty, updateProperty } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'Building',
    units: 0,
    image: ''
  });

  useEffect(() => {
    if (propertyId) {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setFormData({
          name: property.name,
          address: property.address,
          type: property.type,
          units: property.units || 0,
          image: property.image || ''
        });
      }
    } else {
      setFormData({
        name: '',
        address: '',
        type: 'Building',
        units: 0,
        image: ''
      });
    }
  }, [propertyId, properties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyId) {
      updateProperty(propertyId, formData);
    } else {
      addProperty({
        id: `prop${properties.length + 1}`,
        ...formData
      });
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={propertyId ? 'Edit Property' : 'Add New Property'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            <option value="Building">Building</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Office">Office</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Units</label>
          <input
            type="number"
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {propertyId ? 'Update' : 'Add'} Property
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default PropertyModal;