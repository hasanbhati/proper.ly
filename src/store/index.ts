import { create } from 'zustand';
import { 
  Property, 
  Unit, 
  Tenant, 
  MaintenanceRequest, 
  Contract, 
  Announcement,
  DashboardStats 
} from '../types';

interface HistoricalFinancialData {
  month: string;
  year: number;
  rentCollected: number;
  expenses: number;
  propertyId: string;
}

interface Store {
  // Data
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  maintenanceRequests: MaintenanceRequest[];
  contracts: Contract[];
  announcements: Announcement[];
  dashboardStats: DashboardStats;
  historicalFinancials: HistoricalFinancialData[];
  companyName: string;
  
  // UI State
  notifications: { id: string; message: string; type: 'info' | 'success' | 'error' }[];
  emails: { id: string; subject: string; from: string; unread: boolean }[];
  
  // Modal States
  isPropertyModalOpen: boolean;
  isTenantModalOpen: boolean;
  isMaintenanceModalOpen: boolean;
  isAnnouncementModalOpen: boolean;
  isContractModalOpen: boolean;
  selectedItemId: string | null;
  
  // Search States
  tenantSearchQuery: string;
  propertySearchQuery: string;
  maintenanceSearchQuery: string;
  contractSearchQuery: string;
  
  // Dashboard Widgets
  dashboardWidgets: string[];
  
  // Dashboard Edit Mode
  dashboardEditMode: boolean;
  
  // Actions
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  setCompanyName: (name: string) => void;
  
  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  
  setMaintenanceRequests: (requests: MaintenanceRequest[]) => void;
  addMaintenanceRequest: (request: MaintenanceRequest) => void;
  updateMaintenanceRequest: (id: string, request: Partial<MaintenanceRequest>) => void;
  deleteMaintenanceRequest: (id: string) => void;
  
  setContracts: (contracts: Contract[]) => void;
  addContract: (contract: Contract) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  
  setAnnouncements: (announcements: Announcement[]) => void;
  addAnnouncement: (announcement: Announcement) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  
  addUnit: (unit: Unit) => void;
  updateUnit: (id: string, unit: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  
  // Modal Actions
  togglePropertyModal: (id?: string) => void;
  toggleTenantModal: (id?: string) => void;
  toggleMaintenanceModal: (id?: string) => void;
  toggleAnnouncementModal: (id?: string) => void;
  toggleContractModal: (id?: string) => void;
  
  // Search Actions
  setTenantSearchQuery: (query: string) => void;
  setPropertySearchQuery: (query: string) => void;
  setMaintenanceSearchQuery: (query: string) => void;
  setContractSearchQuery: (query: string) => void;
  
  // Dashboard Widget Actions
  addDashboardWidget: (key: string) => void;
  removeDashboardWidget: (key: string) => void;
  
  // Dashboard Edit Mode Actions
  setDashboardEditMode: (edit: boolean) => void;
  toggleDashboardEditMode: () => void;
}

const useStore = create<Store>((set) => ({
  // Initial Data - Empty arrays
  properties: [],
  units: [],
  tenants: [],
  maintenanceRequests: [],
  contracts: [],
  announcements: [],
  dashboardStats: {
    totalProperties: 0,
    totalTenants: 0,
    rentCollected: {
      amount: 0,
      currency: 'KWD',
      percentChange: 0
    },
    rentDue: {
      amount: 0,
      currency: 'KWD',
      overdueCount: 0
    },
    maintenanceRequests: {
      total: 0,
      highPriority: 0
    }
  },
  companyName: 'Proper.Ly',
  historicalFinancials: [],
  
  // Initial UI State
  notifications: [],
  emails: [],
  
  // Initial Modal States
  isPropertyModalOpen: false,
  isTenantModalOpen: false,
  isMaintenanceModalOpen: false,
  isAnnouncementModalOpen: false,
  isContractModalOpen: false,
  selectedItemId: null,
  
  // Initial Search States
  tenantSearchQuery: '',
  propertySearchQuery: '',
  maintenanceSearchQuery: '',
  contractSearchQuery: '',
  
  // Dashboard Widgets
  dashboardWidgets: ['properties', 'tenants', 'collected', 'due', 'maintenance', 'maintenanceTable', 'contractExpiryTable'],
  
  // Dashboard Edit Mode
  dashboardEditMode: false,
  
  // Actions
  setProperties: (properties) => set({ properties }),
  addProperty: (property) => set((state) => ({ 
    properties: [...state.properties, property] 
  })),
  updateProperty: (id, property) => set((state) => ({
    properties: state.properties.map(p => p.id === id ? { ...p, ...property } : p)
  })),
  deleteProperty: (id) => set((state) => {
    const unitsToDelete = state.units.filter(u => u.propertyId === id);
    const unitIds = unitsToDelete.map(u => u.id);
    const tenantsToDelete = state.tenants.filter(t => unitIds.includes(t.unitId));
    const tenantIds = tenantsToDelete.map(t => t.id);
    
    return {
      properties: state.properties.filter(p => p.id !== id),
      units: state.units.filter(u => u.propertyId !== id),
      tenants: state.tenants.filter(t => !unitIds.includes(t.unitId)),
      contracts: state.contracts.filter(c => !tenantIds.includes(c.tenantId))
    };
  }),
  
  setCompanyName: (name) => set({ companyName: name }),
  
  setTenants: (tenants) => set({ tenants }),
  addTenant: (tenant) => set((state) => ({ 
    tenants: [...state.tenants, tenant] 
  })),
  updateTenant: (id, tenant) => set((state) => ({
    tenants: state.tenants.map(t => t.id === id ? { ...t, ...tenant } : t)
  })),
  deleteTenant: (id) => set((state) => ({
    tenants: state.tenants.filter(t => t.id !== id),
    contracts: state.contracts.filter(c => c.tenantId !== id)
  })),
  
  setMaintenanceRequests: (requests) => set({ maintenanceRequests: requests }),
  addMaintenanceRequest: (request) => set((state) => ({ 
    maintenanceRequests: [...state.maintenanceRequests, request] 
  })),
  updateMaintenanceRequest: (id, request) => set((state) => ({
    maintenanceRequests: state.maintenanceRequests.map(r => r.id === id ? { ...r, ...request } : r)
  })),
  deleteMaintenanceRequest: (id) => set((state) => ({
    maintenanceRequests: state.maintenanceRequests.filter(r => r.id !== id)
  })),
  
  setContracts: (contracts) => set({ contracts }),
  addContract: (contract) => set((state) => {
    const property = state.properties.find(p => p.id === contract.propertyId);
    const unit = state.units.find(u => u.id === contract.unitId);
    const tenant = state.tenants.find(t => t.id === contract.tenantId);
    
    if (!property || !unit || !tenant) {
      throw new Error('Invalid contract data: property, unit, or tenant not found');
    }
    
    const updatedUnits = state.units.map(u => 
      u.id === contract.unitId && contract.status === 'Active' 
        ? { ...u, status: 'Occupied' as const }
        : u
    );
    
    return { 
      contracts: [...state.contracts, contract],
      units: updatedUnits
    };
  }),
  updateContract: (id, contract) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, ...contract } : c)
  })),
  deleteContract: (id) => set((state) => ({
    contracts: state.contracts.filter(c => c.id !== id)
  })),
  
  setAnnouncements: (announcements) => set({ announcements }),
  addAnnouncement: (announcement) => set((state) => ({ 
    announcements: [...state.announcements, announcement] 
  })),
  updateAnnouncement: (id, announcement) => set((state) => ({
    announcements: state.announcements.map(a => a.id === id ? { ...a, ...announcement } : a)
  })),
  deleteAnnouncement: (id) => set((state) => ({
    announcements: state.announcements.filter(a => a.id !== id)
  })),
  
  addUnit: (unit) => set((state) => ({ 
    units: [...state.units, unit] 
  })),
  updateUnit: (id, unit) => set((state) => ({
    units: state.units.map(u => u.id === id ? { ...u, ...unit } : u)
  })),
  deleteUnit: (id) => set((state) => ({
    units: state.units.filter(u => u.id !== id),
    tenants: state.tenants.filter(t => t.unitId !== id),
    contracts: state.contracts.filter(c => c.unitId !== id)
  })),
  
  // Modal Actions
  togglePropertyModal: (id) => set((state) => ({ 
    isPropertyModalOpen: !state.isPropertyModalOpen,
    selectedItemId: id || null
  })),
  toggleTenantModal: (id) => set((state) => ({ 
    isTenantModalOpen: !state.isTenantModalOpen,
    selectedItemId: id || null
  })),
  toggleMaintenanceModal: (id) => set((state) => ({ 
    isMaintenanceModalOpen: !state.isMaintenanceModalOpen,
    selectedItemId: id || null
  })),
  toggleAnnouncementModal: (id) => set((state) => ({ 
    isAnnouncementModalOpen: !state.isAnnouncementModalOpen,
    selectedItemId: id || null
  })),
  toggleContractModal: (id) => set((state) => ({ 
    isContractModalOpen: !state.isContractModalOpen,
    selectedItemId: id || null
  })),
  
  // Search Actions
  setTenantSearchQuery: (query) => set({ tenantSearchQuery: query }),
  setPropertySearchQuery: (query) => set({ propertySearchQuery: query }),
  setMaintenanceSearchQuery: (query) => set({ maintenanceSearchQuery: query }),
  setContractSearchQuery: (query) => set({ contractSearchQuery: query }),
  
  // Dashboard Widget Actions
  addDashboardWidget: (key) => set((state) => ({
    dashboardWidgets: [...state.dashboardWidgets, key]
  })),
  removeDashboardWidget: (key) => set((state) => ({
    dashboardWidgets: state.dashboardWidgets.filter(w => w !== key)
  })),
  
  // Dashboard Edit Mode Actions
  setDashboardEditMode: (edit) => set({ dashboardEditMode: edit }),
  toggleDashboardEditMode: () => set((state) => ({ 
    dashboardEditMode: !state.dashboardEditMode 
  }))
}));

export default useStore;