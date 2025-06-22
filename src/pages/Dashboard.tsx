import StatsWidget from '../components/dashboard/StatsWidget';
import MaintenanceRequestsTable from '../components/dashboard/MaintenanceRequestsTable';
import ContractExpiryTable from '../components/dashboard/ContractExpiryTable';
import useStore from '../store';
import useAuthStore from '../store/auth';
import { X, LayoutPanelTop } from 'lucide-react';
import React, { useMemo } from 'react';

const Dashboard: React.FC = () => {
  const dashboardWidgets = useStore((s) => s.dashboardWidgets);
  const removeDashboardWidget = useStore((s) => s.removeDashboardWidget);
  const dashboardEditMode = useStore((s) => s.dashboardEditMode);
  const toggleDashboardEditMode = useStore((s) => s.toggleDashboardEditMode);
  
  // Get data from store
  const properties = useStore(state => state.properties);
  const units = useStore(state => state.units);
  const tenants = useStore(state => state.tenants);
  const maintenanceRequests = useStore(state => state.maintenanceRequests);
  const contracts = useStore(state => state.contracts);
  const historicalFinancials = useStore(state => state.historicalFinancials);

  const user = useAuthStore(state => state.user);

  // Calculate stats
  const stats = useMemo(() => {
    const activeContracts = contracts.filter(c => c.status === 'Active');
    const totalRent = activeContracts.reduce((sum, c) => sum + c.rentAmount, 0);
    const highPriorityRequests = maintenanceRequests.filter(r => r.priority === 'High');
    // Calculate rent collection percentage change
    let percentChange = 0;
    if (historicalFinancials.length >= 2) {
      const latestMonth = historicalFinancials[historicalFinancials.length - 1];
      const previousMonth = historicalFinancials[historicalFinancials.length - 2];
      if (previousMonth.rentCollected > 0) {
        percentChange = ((latestMonth.rentCollected - previousMonth.rentCollected) / previousMonth.rentCollected) * 100;
      } else if (latestMonth.rentCollected > 0) {
        percentChange = 100;
      }
    }
    return {
      totalProperties: properties.length,
      totalTenants: tenants.length,
      rentCollected: {
        amount: totalRent,
        currency: 'KWD',
        percentChange: parseFloat(percentChange.toFixed(1))
      },
      rentDue: {
        amount: 0, // Set to 0 until actual due logic is implemented
        currency: 'KWD',
        overdueCount: 0 // Set to 0 until actual overdue logic is implemented
      },
      maintenanceRequests: {
        total: maintenanceRequests.length,
        highPriority: highPriorityRequests.length
      }
    };
  }, [properties, units, tenants, maintenanceRequests, contracts, historicalFinancials]);

  const ALL_WIDGETS = [
    {
      key: 'properties',
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: 'properties',
      type: 'stat',
    },
    {
      key: 'tenants',
      title: 'Total Tenants',
      value: stats.totalTenants,
      icon: 'tenants',
      type: 'stat',
    },
    {
      key: 'collected',
      title: 'Rent Collected',
      value: `${stats.rentCollected.currency} ${stats.rentCollected.amount.toLocaleString()}`,
      icon: 'collected',
      type: 'stat',
    },
    {
      key: 'due',
      title: 'Rent Due/Overdue',
      value: `${stats.rentDue.currency} ${stats.rentDue.amount.toLocaleString()}`,
      icon: 'due',
      type: 'stat',
    },
    {
      key: 'maintenance',
      title: 'Maintenance Requests',
      value: stats.maintenanceRequests.total,
      icon: 'maintenance',
      type: 'stat',
    },
    {
      key: 'maintenanceTable',
      title: 'Maintenance Requests Table',
      type: 'table',
    },
    {
      key: 'contractExpiryTable',
      title: 'Contract Expiry Table',
      type: 'table',
    },
  ];

  const activeWidgets = ALL_WIDGETS.filter(w => dashboardWidgets.includes(w.key));
  const statWidgets = activeWidgets.filter(w => w.type === 'stat');
  const showMaintenanceTable = dashboardWidgets.includes('maintenanceTable');
  const showContractExpiryTable = dashboardWidgets.includes('contractExpiryTable');

  // Get recent maintenance requests for the table
  const recentMaintenanceRequests = useMemo(() => {
    return maintenanceRequests
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      .slice(0, 5);
  }, [maintenanceRequests]);

  // Get upcoming contract expiries for the table
  const upcomingContractExpiries = useMemo(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return contracts
      .filter(contract => {
        const endDate = new Date(contract.endDate);
        return endDate <= thirtyDaysFromNow && endDate >= new Date();
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 5);
  }, [contracts]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, {user?.email || 'User'}</p>
      </div>
      <div className="flex justify-end mb-4">
        <button
          className={`p-2 rounded-full transition-colors duration-200 ${dashboardEditMode ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100'}`}
          onClick={toggleDashboardEditMode}
          title={dashboardEditMode ? 'Done' : 'Edit Widgets'}
        >
          <LayoutPanelTop size={22} className={dashboardEditMode ? 'text-teal-600' : 'text-gray-600'} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statWidgets.map((widget) => (
          <div key={widget.key} className="relative group">
            <StatsWidget
              title={widget.title}
              value={widget.value ?? ''}
              icon={widget.icon as any}
            />
            {dashboardEditMode && (
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10 opacity-80 group-hover:opacity-100"
                onClick={() => removeDashboardWidget(widget.key)}
                aria-label={`Remove ${widget.title}`}
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showMaintenanceTable && (
          <div className="relative group">
            <MaintenanceRequestsTable requests={recentMaintenanceRequests} />
            {dashboardEditMode && (
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10 opacity-80 group-hover:opacity-100"
                onClick={() => removeDashboardWidget('maintenanceTable')}
                aria-label="Remove Maintenance Requests Table"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        )}
        {showContractExpiryTable && (
          <div className="relative group">
            <ContractExpiryTable contracts={upcomingContractExpiries} tenants={tenants} />
            {dashboardEditMode && (
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10 opacity-80 group-hover:opacity-100"
                onClick={() => removeDashboardWidget('contractExpiryTable')}
                aria-label="Remove Contract Expiry Table"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;