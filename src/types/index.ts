// Property Types
export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Building' | 'House' | 'Apartment' | 'Office';
  units?: number;
  image?: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  rentAmount: number;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
}

// Maintenance Types
export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dateCreated: string;
  dateUpdated: string;
}

// Contract Types
export interface Contract {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  status: 'Active' | 'Pending' | 'Expired';
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  datePosted: string;
  properties: string[]; // Property IDs that the announcement applies to
}

// Dashboard Stats
export interface DashboardStats {
  totalProperties: number;
  totalTenants: number;
  rentCollected: {
    amount: number;
    currency: string;
    percentChange: number;
  };
  rentDue: {
    amount: number;
    currency: string;
    overdueCount: number;
  };
  maintenanceRequests: {
    total: number;
    highPriority: number;
  };
}

interface HistoricalFinancialData {
  month: string;
  year: number;
  rentCollected: number;
  expenses: number;
  propertyId?: string; // Optional property ID for filtering
}

interface Store {
  // ... existing code ...
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
}