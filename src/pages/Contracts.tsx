import React, { useState, useMemo } from 'react';
import { FileText, Plus, Search, Filter, Calendar, DollarSign, Trash2, Eye, Edit } from 'lucide-react';
import useStore from '../store';
import ContractModal from '../components/modals/ContractModal';

const Contracts: React.FC = () => {
  const { contracts, properties, tenants, deleteContract, isContractModalOpen, toggleContractModal, selectedItemId } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'Active' | 'Pending' | 'Expired'>('');
  const [isViewMode, setIsViewMode] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      deleteContract(id);
    }
  };

  const handleNewContractClick = () => {
    setIsViewMode(false); // Ensure modal is not in view mode for new contract
    toggleContractModal();
  };

  const handleViewClick = (id: string) => {
    setIsViewMode(true);
    toggleContractModal(id);
  };

  const handleEditClick = (id: string) => {
    setIsViewMode(false);
    toggleContractModal(id);
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown';
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };
  
  // Helper to get unit number from ID
   const getUnitNumber = (unitId: string) => {
    // Assuming unitId is in format propertyId-unitNumber
    const parts = unitId.split('-');
    return parts.length > 1 ? parts[1] : unitId.replace('unit', '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesTab = activeTab === 'all' || contract.status.toLowerCase() === activeTab;
      
      const matchesSearch = searchTerm === '' || 
        contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTenantName(contract.tenantId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPropertyName(contract.propertyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUnitNumber(contract.unitId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.startDate.includes(searchTerm) ||
        contract.endDate.includes(searchTerm) ||
        contract.rentAmount.toString().includes(searchTerm);

      const matchesProperty = propertyFilter === '' || contract.propertyId === propertyFilter;
      const matchesTenant = tenantFilter === '' || contract.tenantId === tenantFilter;
      const matchesStatus = statusFilter === '' || contract.status === statusFilter;

      return matchesTab && matchesSearch && matchesProperty && matchesTenant && matchesStatus;
    });
  }, [contracts, activeTab, searchTerm, propertyFilter, tenantFilter, statusFilter, tenants, properties]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contracts</h1>
        
        <button 
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          onClick={handleNewContractClick}
        >
          <Plus size={16} />
          <span>New Contract</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {/* Tab Buttons */}
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'all' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All Contracts
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'active' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'pending' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'expired' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('expired')}
          >
            Expired
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          
          {/* Property Filter */}
          <select
            value={propertyFilter}
            onChange={e => setPropertyFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Tenant Filter */}
           <select
            value={tenantFilter}
            onChange={e => setTenantFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-teal-500 focus:focus:border-teal-500 sm:text-sm"
          >
            <option value="">All Tenants</option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Status Filter */}
           <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as '' | 'Active' | 'Pending' | 'Expired')}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-teal-500 focus:focus:border-teal-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getTenantName(contract.tenantId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getPropertyName(contract.propertyId)}</div>
                    <div className="text-sm text-gray-500">Unit: {getUnitNumber(contract.unitId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>{contract.startDate} to {contract.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <DollarSign size={14} className="mr-1" />
                      <span>KWD {contract.rentAmount}/month</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center items-center gap-2">
                    <button className="text-teal-600 hover:text-teal-900" onClick={() => handleViewClick(contract.id)} title="View">
                      <Eye size={18} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900" onClick={() => handleEditClick(contract.id)} title="Edit">
                       <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(contract.id)} title="Delete">
                       <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Modal */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => toggleContractModal()}
        contractId={selectedItemId || undefined}
        viewMode={isViewMode}
      />
    </div>
  );
};

export default Contracts;