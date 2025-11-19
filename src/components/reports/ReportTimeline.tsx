import { ReportStatusHistory, STATUS_LABELS } from '@/lib/types';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns-jalali';

interface ReportTimelineProps {
  history: ReportStatusHistory[];
}

export const ReportTimeline = ({ history }: ReportTimelineProps) => {
  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            {index < history.length - 1 && (
              <div className="w-0.5 h-full bg-border min-h-8 mt-2" />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="font-medium mb-1">{STATUS_LABELS[item.status]}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(item.date), 'dd MMMM yyyy - HH:mm')}
            </div>
            {item.note && (
              <div className="text-sm mt-2 p-3 bg-muted rounded-lg">
                {item.note}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
