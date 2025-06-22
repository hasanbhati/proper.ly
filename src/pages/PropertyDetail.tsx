import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Plus, Edit2, X } from 'lucide-react';
import useStore from '../store';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const properties = useStore(state => state.properties || []);
  const units = useStore(state => state.units || []);
  const tenants = useStore(state => state.tenants || []);
  const updateProperty = useStore(state => state.updateProperty);
  const addUnit = useStore(state => state.addUnit);
  const updateUnit = useStore(state => state.updateUnit);
  const addTenant = useStore(state => state.addTenant);
  const updateTenant = useStore(state => state.updateTenant);
  const deleteUnit = useStore(state => state.deleteUnit);
  const deleteTenant = useStore(state => state.deleteTenant);

  const property = properties.find((p: any) => p.id === id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(property || {});
  const [isUnitTenantModalOpen, setIsUnitTenantModalOpen] = useState(false);
  const [unitTenantForm, setUnitTenantForm] = useState<any>({});
  const [editingUnitTenant, setEditingUnitTenant] = useState<any>(null);

  if (!property) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Property Not Found</h2>
          <button
            onClick={() => navigate('/properties')}
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const handleEditProperty = () => {
    setEditForm(property);
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProperty(property.id, editForm);
    setIsEditModalOpen(false);
  };

  const handleEditUnitTenant = (unit: any) => {
    const tenant = tenants.find((t: any) => t.unitId === unit.id) || {};
    setUnitTenantForm({ ...unit, tenant, status: unit.status || 'Occupied' });
    setEditingUnitTenant(unit);
    setIsUnitTenantModalOpen(true);
  };

  const handleAddUnitTenant = () => {
    setUnitTenantForm({ propertyId: property.id, status: 'Occupied', tenant: {} });
    setEditingUnitTenant(null);
    setIsUnitTenantModalOpen(true);
  };

  const handleUnitTenantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setUnitTenantForm((prev: any) => ({
        ...prev,
        status: value,
        tenant: value === 'Occupied' ? (prev.tenant || {}) : {},
      }));
    } else if (name.startsWith('tenant.')) {
      setUnitTenantForm((prev: any) => ({ ...prev, tenant: { ...prev.tenant, [name.replace('tenant.', '')]: value } }));
    } else {
      setUnitTenantForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleUnitTenantFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let unitId = editingUnitTenant ? editingUnitTenant.id : `unit${Date.now()}`;
    const unitData = { ...unitTenantForm, id: unitId };
    if (editingUnitTenant) {
      updateUnit(unitId, unitData);
    } else {
      addUnit(unitData);
    }
    // Handle tenant
    if (unitTenantForm.status === 'Occupied' && unitTenantForm.tenant && unitTenantForm.tenant.name) {
      const tenantId = unitTenantForm.tenant.id || `tenant${Date.now()}`;
      const tenantData = {
        ...unitTenantForm.tenant,
        id: tenantId,
        propertyId: property.id,
        unitId: unitId
      };
      if (unitTenantForm.tenant.id) {
        updateTenant(tenantId, tenantData);
      } else {
        addTenant(tenantData);
      }
    } else if (editingUnitTenant) {
      // If unit is now vacant, remove tenant for this unit
      const oldTenant = tenants.find((t: any) => t.unitId === unitId);
      if (oldTenant) deleteTenant(oldTenant.id);
    }
    setIsUnitTenantModalOpen(false);
  };

  const handleDeleteUnitTenant = (unit: any) => {
    const tenant = tenants.find((t: any) => t.unitId === unit.id);
    deleteUnit(unit.id);
    if (tenant) deleteTenant(tenant.id);
  };

  // Get units for this property
  const propertyUnits = units.filter((u: any) => u.propertyId === property.id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/properties')}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Property Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex gap-6 items-center">
          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            {property.image ? (
              <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 size={48} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {property.name}
              <button onClick={handleEditProperty} className="text-gray-400 hover:text-gray-600">
                <Edit2 size={18} />
              </button>
            </h2>
            <p className="text-gray-500 mb-2">{property.address}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Type: {property.type}</span>
              <span>Units: {propertyUnits.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Units & Tenants</h3>
        <button onClick={handleAddUnitTenant} className="flex items-center gap-2 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">
          <Plus size={16} /> Add Unit & Tenant
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenant Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenant Contact</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {propertyUnits.map((unit: any) => {
              const tenant = tenants.find((t: any) => t.unitId === unit.id);
              return (
                <tr key={unit.id}>
                  <td className="px-4 py-2">{unit.unitNumber}</td>
                  <td className="px-4 py-2">{tenant ? tenant.name : '-'}</td>
                  <td className="px-4 py-2">{tenant ? tenant.phone : '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleEditUnitTenant(unit)} className="text-teal-600 hover:text-teal-800 text-sm font-medium mr-2">Edit</button>
                    <button onClick={() => handleDeleteUnitTenant(unit)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Property Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={22} />
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Property</h3>
            <form onSubmit={handleEditFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name || ''}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address || ''}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  name="type"
                  value={editForm.type || ''}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editForm.image || ''}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Unit & Tenant Modal */}
      {isUnitTenantModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button onClick={() => setIsUnitTenantModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={22} />
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingUnitTenant ? 'Edit Unit & Tenant' : 'Add Unit & Tenant'}</h3>
            <form onSubmit={handleUnitTenantFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Number</label>
                <input
                  type="text"
                  name="unitNumber"
                  value={unitTenantForm.unitNumber || ''}
                  onChange={handleUnitTenantFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Floor</label>
                  <input
                    type="number"
                    name="floor"
                    value={unitTenantForm.floor || ''}
                    onChange={handleUnitTenantFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={unitTenantForm.bedrooms || ''}
                    onChange={handleUnitTenantFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={unitTenantForm.bathrooms || ''}
                    onChange={handleUnitTenantFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Square Feet</label>
                  <input
                    type="number"
                    name="squareFeet"
                    value={unitTenantForm.squareFeet || ''}
                    onChange={handleUnitTenantFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={unitTenantForm.status || ''}
                    onChange={handleUnitTenantFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="Occupied">Occupied</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
                  <input
                    type="number"
                    name="rentAmount"
                    value={unitTenantForm.rentAmount || ''}
                    onChange={handleUnitTenantFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              {unitTenantForm.status === 'Occupied' && (
                <>
                  <div className="border-b border-gray-200 my-2"></div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Tenant Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="tenant.name"
                      value={unitTenantForm.tenant?.name || ''}
                      onChange={handleUnitTenantFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="tenant.email"
                      value={unitTenantForm.tenant?.email || ''}
                      onChange={handleUnitTenantFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="tenant.phone"
                      value={unitTenantForm.tenant?.phone || ''}
                      onChange={handleUnitTenantFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lease Start</label>
                      <input
                        type="date"
                        name="tenant.leaseStart"
                        value={unitTenantForm.tenant?.leaseStart || ''}
                        onChange={handleUnitTenantFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lease End</label>
                      <input
                        type="date"
                        name="tenant.leaseEnd"
                        value={unitTenantForm.tenant?.leaseEnd || ''}
                        onChange={handleUnitTenantFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  {editingUnitTenant ? 'Save Changes' : 'Add Unit & Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail; 