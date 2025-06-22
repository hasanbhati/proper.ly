import { BarChart2, Download } from 'lucide-react';
import useStore from '../store';
import { useMemo, useState } from 'react';

const Reports: React.FC = () => {
  const properties = useStore(state => state.properties);
  const units = useStore(state => state.units);
  const contracts = useStore(state => state.contracts);
  const historicalFinancials = useStore(state => state.historicalFinancials);

  const [propertyFilter, setPropertyFilter] = useState('');

  const propertyOccupancy = useMemo(() => {
    const filteredProperties = propertyFilter 
      ? properties.filter(property => property.id === propertyFilter)
      : properties;
    return filteredProperties.map(property => {
      const unitsInProperty = units.filter(unit => unit.propertyId === property.id);
      const occupiedUnits = unitsInProperty.filter(unit => unit.status === 'Occupied');
      const occupancyRate = unitsInProperty.length === 0 ? 0 : (occupiedUnits.length / unitsInProperty.length) * 100;
      return { propertyName: property.name, rate: occupancyRate };
    });
  }, [properties, units, propertyFilter]);

  const totalPotentialMonthlyRent = useMemo(() => {
    return contracts.reduce((sum, contract) => {
      if (contract.status === 'Active') {
        return sum + contract.rentAmount;
      }
      return sum;
    }, 0);
  }, [contracts]);

  const maxRentCollected = useMemo(() => {
    const filteredData = propertyFilter 
      ? historicalFinancials.filter(data => data.propertyId === propertyFilter)
      : historicalFinancials;
    return filteredData.reduce((max, data) => Math.max(max, data.rentCollected), 0);
  }, [historicalFinancials, propertyFilter]);

  const handleExport = () => {
    // Prepare data for export
    const occupancyData = propertyOccupancy.map(item => 
      [item.propertyName, `${item.rate.toFixed(1)}% occupied`].join(',')
    );

    const financialSummaryData = historicalFinancials.map(data => 
      [data.month, data.year, data.rentCollected, data.expenses, data.rentCollected - data.expenses].join(',')
    );

    // Create CSV content
    const csvContent = [
      'Reports',
      '',
      'Occupancy Rate By Property',
      'Property,Occupancy Rate',
      ...occupancyData,
      '',
      'Financial Summary',
      'Month,Year,Rent Collected,Expenses,Net Income',
      ...financialSummaryData
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'properly_reports.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        
        <div className="flex space-x-3">
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
          <button 
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Monthly Rent Collection</h2>
            <div className="text-sm text-gray-500">Historical Data</div>
          </div>
          
          <div className="h-64 flex items-end justify-around space-x-2 mt-4 border-b border-l border-gray-200">
            {/* Chart bars */}
            {historicalFinancials.length > 0 && (propertyFilter === '' || historicalFinancials.some(data => data.propertyId === propertyFilter)) ? (
              historicalFinancials
                .filter(data => propertyFilter === '' || data.propertyId === propertyFilter)
                .map((data, index) => (
                <div key={index} className="flex-1 h-full flex flex-col justify-end items-center group">
                  <div 
                    className="w-full bg-teal-500 rounded-t-sm hover:bg-teal-600 transition-colors relative"
                    style={{ height: `${maxRentCollected === 0 ? 0 : (data.rentCollected / maxRentCollected) * 90}%` }} 
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity pointer-events-none">
                      KWD {data.rentCollected.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs mt-1 text-gray-500">
                    {data.month.substring(0, 3)}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full w-full text-gray-500">
                No historical financial data available.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Occupancy Rate</h2>
            <div className="text-sm text-gray-500">By property</div>
          </div>
          
          <div className="space-y-4 mt-4">
            {propertyOccupancy.map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.propertyName}</span>
                    <span className="text-sm text-gray-500">{item.rate.toFixed(1)}% occupied</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.rate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Financial Summary</h2>
            <div className="text-sm text-gray-500">Current year</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Collected
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Income
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Using historical financial data */}
                {historicalFinancials
                  .filter(data => propertyFilter === '' || data.propertyId === propertyFilter)
                  .map((data, index) => {
                    const net = data.rentCollected - data.expenses;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {`${data.month} ${data.year}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          KWD {data.rentCollected.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          KWD {data.expenses.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          KWD {net.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;