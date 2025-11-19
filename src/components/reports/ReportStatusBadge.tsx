import { ReportStatus, STATUS_LABELS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const STATUS_STYLES: Record<ReportStatus, string> = {
  pending: 'bg-status-pending/10 text-status-pending border-status-pending/20',
  approved: 'bg-status-approved/10 text-status-approved border-status-approved/20',
  referred: 'bg-status-referred/10 text-status-referred border-status-referred/20',
  answered: 'bg-status-answered/10 text-status-answered border-status-answered/20',
  closed: 'bg-status-closed/10 text-status-closed border-status-closed/20',
  rejected: 'bg-status-rejected/10 text-status-rejected border-status-rejected/20',
};

export const ReportStatusBadge = ({ status, className }: ReportStatusBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={cn(STATUS_STYLES[status], 'font-medium', className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
};
