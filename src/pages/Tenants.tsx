import { User, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import useStore from '../store';
import TenantModal from '../components/modals/TenantModal';
import { useState } from 'react';

const Tenants: React.FC = () => {
  const { 
    tenants, 
    properties, 
    tenantSearchQuery, 
    setTenantSearchQuery,
    isTenantModalOpen,
    toggleTenantModal,
    selectedItemId,
    deleteTenant
  } = useStore();

  const [viewMode, setViewMode] = useState(false);
  const [propertyFilter, setPropertyFilter] = useState('');
  const [leaseStatusFilter, setLeaseStatusFilter] = useState('all');

  const today = new Date();

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenantSearchQuery
      ? tenant.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(tenantSearchQuery.toLowerCase())
      : true;
    const matchesProperty = propertyFilter ? tenant.propertyId === propertyFilter : true;
    let matchesLease = true;
    if (leaseStatusFilter !== 'all') {
      const start = tenant.leaseStart ? new Date(tenant.leaseStart) : null;
      const end = tenant.leaseEnd ? new Date(tenant.leaseEnd) : null;
      if (start && end) {
        if (leaseStatusFilter === 'active') {
          matchesLease = start <= today && today <= end;
        } else if (leaseStatusFilter === 'expired') {
          matchesLease = today > end;
        } else if (leaseStatusFilter === 'upcoming') {
          matchesLease = today < start;
        }
      } else {
        matchesLease = false;
      }
    }
    return matchesSearch && matchesProperty && matchesLease;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      deleteTenant(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
        
        <button 
          onClick={() => toggleTenantModal()}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          <Plus size={16} />
          <span>Add Tenant</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search tenants..." 
              value={tenantSearchQuery}
              onChange={(e) => setTenantSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <select
            value={propertyFilter}
            onChange={e => setPropertyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={leaseStatusFilter}
            onChange={e => setLeaseStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="upcoming">Upcoming</option>
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
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Period
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No tenants found.</td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const property = properties.find(p => p.id === tenant.propertyId);
                  return (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
                            <User size={18} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tenant.name || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tenant.email || '-'}</div>
                        <div className="text-sm text-gray-500">{tenant.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property?.name || '-'}</div>
                        <div className="text-sm text-gray-500">Unit: {tenant.unitId ? tenant.unitId.replace('unit', '') : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(tenant.leaseStart && tenant.leaseEnd) ? `${tenant.leaseStart} to ${tenant.leaseEnd}` : '-' }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center gap-2">
                        <button 
                          onClick={() => { setViewMode(true); toggleTenantModal(tenant.id); }}
                          className="text-teal-600 hover:text-teal-900"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => { setViewMode(false); toggleTenantModal(tenant.id); }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tenant.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TenantModal 
        isOpen={isTenantModalOpen}
        onClose={() => toggleTenantModal()}
        tenantId={selectedItemId || undefined}
        viewMode={viewMode}
      />
    </div>
  );
};

export default Tenants;