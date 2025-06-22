import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import useStore from '../../store';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId?: string;
  viewMode?: boolean;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, contractId, viewMode }) => {
  const { contracts, properties, units, tenants, addContract, updateContract } = useStore();
  const [formData, setFormData] = useState({
    propertyId: '',
    unitId: '',
    tenantId: '',
    startDate: '',
    endDate: '',
    rentAmount: 0,
    status: 'Active' as 'Active' | 'Pending' | 'Expired',
  });

  useEffect(() => {
    if (contractId) {
      const contract = contracts.find(c => c.id === contractId);
      if (contract) {
        setFormData({
          propertyId: contract.propertyId,
          unitId: contract.unitId,
          tenantId: contract.tenantId,
          startDate: contract.startDate,
          endDate: contract.endDate,
          rentAmount: contract.rentAmount,
          status: contract.status,
        });
      }
    } else {
      setFormData({
        propertyId: '',
        unitId: '',
        tenantId: '',
        startDate: '',
        endDate: '',
        rentAmount: 0,
        status: 'Active',
      });
    }
  }, [contractId, contracts]);

  const handlePropertyChange = (propertyId: string) => {
    setFormData(prev => ({
      ...prev,
      propertyId,
      unitId: '',
      tenantId: '',
    }));
  };

  const handleUnitChange = (unitId: string) => {
    const tenantForUnit = tenants.find(t => t.unitId === unitId);
    setFormData(prev => ({
      ...prev,
      unitId,
      tenantId: tenantForUnit ? tenantForUnit.id : '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setFormData(prev => ({ ...prev, status: value as 'Active' | 'Pending' | 'Expired' }));
    } else if (name === 'rentAmount') {
      setFormData(prev => ({ ...prev, rentAmount: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contractData = {
      ...formData,
      tenantId: formData.tenantId || tenants.find(t => t.unitId === formData.unitId)?.id || '',
    };
    if (contractId) {
      updateContract(contractId, contractData);
    } else {
      addContract({
        id: `contract${Date.now()}`,
        ...contractData,
      });
    }
    onClose();
  };

  const availableUnits = units.filter(unit => unit.propertyId === formData.propertyId);
  const availableTenants = tenants.filter(tenant => tenant.unitId === formData.unitId);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={contractId ? 'Edit Contract' : 'Create New Contract'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property</label>
          <select
            value={formData.propertyId}
            onChange={e => handlePropertyChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode}
          >
            <option value="">Select Property</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            value={formData.unitId}
            onChange={e => handleUnitChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode || !formData.propertyId}
          >
            <option value="">Select Unit</option>
            {availableUnits.map(u => (
              <option key={u.id} value={u.id}>{u.unitNumber}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tenant</label>
          <select
            value={formData.tenantId}
            onChange={e => setFormData({ ...formData, tenantId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode || !formData.unitId || availableTenants.length === 0}
          >
            <option value="">Select Tenant</option>
            {availableTenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            name="startDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            name="endDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
          <input
            type="number"
            value={formData.rentAmount}
            onChange={handleChange}
            name="rentAmount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
            disabled={viewMode}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            disabled={viewMode}
          >
            {contractId ? 'Save Changes' : 'Create Contract'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ContractModal; 