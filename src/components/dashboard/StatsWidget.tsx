import { Building2, Users, DollarSign, AlertCircle, Wrench } from 'lucide-react';

type IconType = 'properties' | 'tenants' | 'collected' | 'due' | 'maintenance';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: IconType;
  trend?: {
    value: number | string;
    isPositive?: boolean;
  };
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ 
  title, 
  value, 
  subtext, 
  icon,
  trend
}) => {
  const getIcon = () => {
    const iconMap: Record<IconType, JSX.Element> = {
      properties: <Building2 size={20} className="text-blue-600" />,
      tenants: <Users size={20} className="text-green-600" />,
      collected: <DollarSign size={20} className="text-emerald-600" />,
      due: <AlertCircle size={20} className="text-orange-600" />,
      maintenance: <Wrench size={20} className="text-red-600" />
    };
    return iconMap[icon];
  };

  const getNavigationPath = () => {
    const pathMap: Record<IconType, string> = {
      properties: '/properties',
      tenants: '/tenants',
      collected: '/reports',
      due: '/reports',
      maintenance: '/maintenance'
    };
    return pathMap[icon];
  };

  const handleClick = () => {
    window.location.href = getNavigationPath();
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {value}
            </p>
            {trend && typeof value === 'number' && value > 0 && (
              <p className={`ml-2 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </p>
            )}
          </div>
          {subtext && typeof value === 'number' && value > 0 && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-2 bg-opacity-10 rounded-lg bg-blue-50">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;