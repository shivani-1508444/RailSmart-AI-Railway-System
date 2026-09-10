export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

export const getClassBadgeColor = (classCode) => {
  switch (classCode) {
    case '1A': return '#8B5CF6';
    case '2A': return '#3B82F6';
    case '3A': return '#06B6D4';
    case 'CC': return '#10B981';
    case 'EC': return '#F59E0B';
    case 'SL': return '#64748B';
    default: return '#3B82F6';
  }
};