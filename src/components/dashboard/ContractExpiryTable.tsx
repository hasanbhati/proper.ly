import { Contract, Tenant } from '../../types';

interface ContractExpiryTableProps {
  contracts: Contract[];
  tenants: Tenant[];
}

const ContractExpiryTable: React.FC<ContractExpiryTableProps> = ({ contracts, tenants }) => {
  // Filter contracts that are about to expire (within 30 days)
  const expiringContracts = contracts.filter(contract => {
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
  });

  const getTenantById = (id: string) => tenants.find(tenant => tenant.id === id);

  const handleViewAll = () => {
    window.location.href = '/contracts';
  };

  const handleSendReminder = (contract: Contract) => {
    const tenant = getTenantById(contract.tenantId);
    if (tenant) {
      alert(`Sending reminder to ${tenant.name} about contract expiring on ${contract.endDate}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Contract Expiry Alerts</h2>
        <button 
          onClick={handleViewAll}
          className="text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expiringContracts.length > 0 ? (
              expiringContracts.map((contract) => {
                const tenant = getTenantById(contract.tenantId);
                return (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm">
                          {tenant?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{tenant?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {contract.propertyId}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {contract.endDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleSendReminder(contract)}
                        className="bg-teal-600 text-white text-xs py-1 px-3 rounded-md hover:bg-teal-700 transition-colors"
                      >
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                  No contracts expiring soon
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractExpiryTable;