import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import useStore from '../../store';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string;
  viewMode?: boolean;
}

const TenantModal: React.FC<TenantModalProps> = ({ isOpen, onClose, tenantId, viewMode }) => {
  const { tenants, properties, units, addTenant, updateTenant } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    unitId: '',
    leaseStart: '',
    leaseEnd: ''
  });

  useEffect(() => {
    if (tenantId) {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
        setFormData({
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
          propertyId: tenant.propertyId,
          unitId: tenant.unitId,
          leaseStart: tenant.leaseStart,
          leaseEnd: tenant.leaseEnd
        });
      }
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyId: '',
        unitId: '',
        leaseStart: '',
        leaseEnd: ''
      });
    }
  }, [tenantId, tenants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantId) {
      updateTenant(tenantId, formData);
    } else {
      addTenant({
        id: `tenant${tenants.length + 1}`,
        ...formData
      });
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'Tenant Details' : (tenantId ? 'Edit Tenant' : 'Add New Tenant')}
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
            disabled={viewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
            disabled={viewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
            disabled={viewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Property</label>
          <select
            value={formData.propertyId}
            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
            disabled={viewMode}
          >
            <option value="">Select Property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          {formData.propertyId ? (
            <select
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              required
              disabled={viewMode}
            >
              <option value="">Select Unit</option>
              {units.filter(u => u.propertyId === formData.propertyId).map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitNumber}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              required
              disabled
              placeholder="Select a property first"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lease Start Date</label>
          <input
            type="date"
            value={formData.leaseStart}
            onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
            disabled={viewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lease End Date</label>
          <input
            type="date"
            value={formData.leaseEnd}
            onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
            disabled={viewMode}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {viewMode ? 'Close' : 'Cancel'}
          </button>
          {!viewMode && (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {tenantId ? 'Update' : 'Add'} Tenant
            </button>
          )}
        </div>
      </form>
    </BaseModal>
  );
};

export default TenantModal;