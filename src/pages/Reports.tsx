import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useReportStore } from '@/store/reportStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { Report, CATEGORIES } from '@/lib/types';
import { Search, ArrowLeft, ArrowUpDown, Loader2 } from 'lucide-react';
import { format } from 'date-fns-jalali';

const columnHelper = createColumnHelper<Report>();

export default function Reports() {
  const navigate = useNavigate();
  const { reports, isLoading, fetchReports } = useReportStore();
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return reports;
    return reports.filter(r => r.status === statusFilter);
  }, [reports, statusFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('trackingCode', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="font-bold"
          >
            کد رهگیری
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => (
          <code className="font-mono text-sm">{info.getValue()}</code>
        ),
      }),
      columnHelper.accessor('title', {
        header: 'عنوان',
        cell: (info) => (
          <div className="max-w-xs truncate font-medium">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'دسته‌بندی',
        cell: (info) => (
          <span className="text-sm">{CATEGORIES[info.getValue()]}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'وضعیت',
        cell: (info) => <ReportStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('createdAt', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="font-bold"
          >
            تاریخ ثبت
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => (
          <span className="text-sm">
            {format(new Date(info.getValue()), 'dd MMM yyyy')}
          </span>
        ),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'آخرین بروزرسانی',
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {format(new Date(info.getValue()), 'dd MMM yyyy')}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/reports/${info.row.original.id}`)}
          >
            مشاهده
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        ),
      }),
    ],
    [navigate]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">گزارش‌های من</h2>
          <p className="text-muted-foreground">مشاهده و مدیریت تمام گزارش‌های ثبت شده</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>فیلتر و جستجو</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در عنوان، کد رهگیری..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="pending">در انتظار بررسی</SelectItem>
                  <SelectItem value="approved">تأیید شده</SelectItem>
                  <SelectItem value="referred">ارجاع به نهاد</SelectItem>
                  <SelectItem value="answered">پاسخ داده شده</SelectItem>
                  <SelectItem value="closed">بسته شده</SelectItem>
                  <SelectItem value="rejected">رد شده</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-right text-sm font-bold"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-t hover:bg-muted/30 cursor-pointer"
                          onClick={() => navigate(`/dashboard/reports/${row.original.id}`)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-3">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {table.getRowModel().rows.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">گزارشی یافت نشد</p>
                  </div>
                )}

                {/* صفحه‌بندی */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    صفحه {table.getState().pagination.pageIndex + 1} از{' '}
                    {table.getPageCount()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      قبلی
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      بعدی
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
