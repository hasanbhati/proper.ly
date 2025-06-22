import React, { useState } from 'react';
import { Wrench, Filter, Search, AlertCircle, CheckCircle2, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import BaseModal from '../components/modals/BaseModal';

const Maintenance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'inProgress' | 'completed'>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newForm, setNewForm] = useState<any>({
    propertyId: '',
    unitId: '',
    tenantId: '',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
  });
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const updateMaintenanceRequest = useStore(state => state.updateMaintenanceRequest);
  const addMaintenanceRequest = useStore(state => state.addMaintenanceRequest);
  const properties = useStore(state => state.properties);
  const units = useStore(state => state.units);
  const tenants = useStore(state => state.tenants);
  const maintenanceRequests = useStore(state => state.maintenanceRequests);
  const deleteMaintenanceRequest = useStore(state => state.deleteMaintenanceRequest);

  const filteredRequests = maintenanceRequests.filter(request => {
    // Tab filter
    let matchesTab = true;
    if (activeTab !== 'all') {
      if (activeTab === 'pending') matchesTab = request.status === 'Pending';
      else if (activeTab === 'inProgress') matchesTab = request.status === 'In Progress';
      else if (activeTab === 'completed') matchesTab = request.status === 'Completed';
    }
    // Property filter
    const matchesProperty = propertyFilter ? request.propertyId === propertyFilter : true;
    // Status filter
    const matchesStatus = statusFilter === 'all' ? true : request.status === statusFilter;
    // Priority filter
    const matchesPriority = priorityFilter === 'all' ? true : request.priority === priorityFilter;
    // Search filter
    const matchesSearch = search
      ? request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.description.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesTab && matchesProperty && matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-amber-600 bg-amber-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleView = (request: any) => {
    navigate(`/maintenance/${request.id}`);
  };

  const handleEdit = (request: any) => {
    setSelectedRequest(request);
    setFormData(request);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedRequest(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      updateMaintenanceRequest(selectedRequest.id, {
        ...formData,
        dateUpdated: new Date().toISOString().split('T')[0]
      });
      handleCloseModal();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      deleteMaintenanceRequest(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
        <button
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          onClick={() => setIsNewModalOpen(true)}
        >
          <Wrench size={16} />
          <span>New Request</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'all' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'} flex items-center`}
            onClick={() => setActiveTab('all')}
          >
            All Requests
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'pending' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'} flex items-center`}
            onClick={() => setActiveTab('pending')}
          >
            <AlertCircle size={16} className="mr-2" />
            Pending
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'inProgress' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'} flex items-center`}
            onClick={() => setActiveTab('inProgress')}
          >
            <Clock size={16} className="mr-2" />
            In Progress
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'completed' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'} flex items-center`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle2 size={16} className="mr-2" />
            Completed
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search maintenance requests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{request.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.propertyId === 'prop1' ? 'Al noor Tower' :
                       request.propertyId === 'prop2' ? 'Salmiya Heights' :
                       request.propertyId === 'prop3' ? 'Marina View' : 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Unit: {request.unitId?.replace('unit', '') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.dateCreated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center items-center gap-2">
                    <button 
                      onClick={() => handleView(request)}
                      className="text-teal-600 hover:text-teal-900"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(request)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(request.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Maintenance Request</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property</label>
                  <select
                    name="propertyId"
                    value={formData.propertyId || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="prop1">Al noor Tower</option>
                    <option value="prop2">Salmiya Heights</option>
                    <option value="prop3">Marina View</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unitId"
                    value={formData.unitId || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
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

      {/* New Request Modal */}
      <BaseModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="New Maintenance Request">
        <form
          onSubmit={e => {
            e.preventDefault();
            addMaintenanceRequest({
              id: `maint${Date.now()}`,
              ...newForm,
              dateCreated: new Date().toISOString().split('T')[0],
              dateUpdated: new Date().toISOString().split('T')[0],
            });
            setIsNewModalOpen(false);
            setNewForm({ propertyId: '', unitId: '', tenantId: '', title: '', description: '', priority: 'Medium', status: 'Pending' });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Property</label>
            <select
              value={newForm.propertyId}
              onChange={e => setNewForm((f: any) => ({ ...f, propertyId: e.target.value, unitId: '', tenantId: '' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
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
              value={newForm.unitId}
              onChange={e => setNewForm((f: any) => ({ ...f, unitId: e.target.value, tenantId: '' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
              disabled={!newForm.propertyId}
            >
              <option value="">Select Unit</option>
              {units.filter(u => u.propertyId === newForm.propertyId).map(u => (
                <option key={u.id} value={u.id}>{u.unitNumber}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant (optional)</label>
            <select
              value={newForm.tenantId}
              onChange={e => setNewForm((f: any) => ({ ...f, tenantId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              disabled={!newForm.unitId}
            >
              <option value="">Select Tenant</option>
              {tenants.filter(t => t.unitId === newForm.unitId).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newForm.title}
              onChange={e => setNewForm((f: any) => ({ ...f, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newForm.description}
              onChange={e => setNewForm((f: any) => ({ ...f, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={newForm.priority}
              onChange={e => setNewForm((f: any) => ({ ...f, priority: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={newForm.status}
              onChange={e => setNewForm((f: any) => ({ ...f, status: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">Add Request</button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
};

export default Maintenance;