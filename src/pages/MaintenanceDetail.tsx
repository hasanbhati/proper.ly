import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import useStore from '../store';

const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const maintenanceRequests = useStore(state => state.maintenanceRequests);
  const properties = useStore(state => state.properties);
  const units = useStore(state => state.units);
  const tenants = useStore(state => state.tenants);
  const request = maintenanceRequests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-4">The maintenance request you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/maintenance')}
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Back to Maintenance
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle className="text-yellow-500" />;
      case 'In Progress':
        return <Clock className="text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="text-green-500" />;
      default:
        return null;
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  const getUnitNumber = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.unitNumber : 'N/A';
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'N/A';
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/maintenance')}
        className="flex items-center text-teal-600 hover:text-teal-800 mb-6"
      >
        <ArrowLeft className="mr-2" /> Back to Maintenance
      </button>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-4">
          {getStatusIcon(request.status)}
          <h2 className="text-xl font-semibold text-gray-800">{request.title}</h2>
        </div>
        <div className="mb-4 text-gray-600">{request.description}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            <span>Property: {getPropertyName(request.propertyId)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={16} />
            <span>Tenant: {getTenantName(request.tenantId || '')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Unit: {getUnitNumber(request.unitId || '')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} />
            <span>Date Created: {request.dateCreated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetail; 