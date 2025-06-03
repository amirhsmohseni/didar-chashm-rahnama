
import { useState, useEffect } from 'react';
import { Eye, Phone, Mail, MessageSquare, Calendar, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string | null;
  medical_condition: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  doctor_id: string | null;
  doctors?: {
    name: string;
  };
}

const ConsultationRequestsManager = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          doctors (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت درخواست‌ها",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت درخواست با موفقیت تغییر کرد",
      });
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'در انتظار', variant: 'secondary' as const },
      contacted: { label: 'تماس گرفته شده', variant: 'default' as const },
      completed: { label: 'تکمیل شده', variant: 'secondary' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPreferredDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>درخواست‌های مشاوره</CardTitle>
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ درخواستی ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>مشکل پزشکی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ ثبت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.medical_condition}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>جزئیات درخواست مشاوره</DialogTitle>
                          <DialogDescription>
                            درخواست ثبت شده در {selectedRequest && formatDate(selectedRequest.created_at)}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">نام:</label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">سن:</label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.age || '-'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">شماره تماس:</label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">ایمیل:</label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.email}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">جنسیت:</label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.gender || '-'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">تاریخ مراجعه ترجیحی:</label>
                                <p className="text-sm text-muted-foreground">{formatPreferredDate(selectedRequest.preferred_date)}</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">زمان ترجیحی: </label>
                              <p className="text-sm text-muted-foreground">{selectedRequest.preferred_time || '-'}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">پزشک منتخب:</label>
                              <p className="text-sm text-muted-foreground">{selectedRequest.doctors?.name || 'انتخاب نشده'}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">مشکل پزشکی:</label>
                              <p className="text-sm text-muted-foreground">{selectedRequest.medical_condition}</p>
                            </div>

                            {selectedRequest.notes && (
                              <div>
                                <label className="text-sm font-medium">یادداشت‌ها:</label>
                                <p className="text-sm text-muted-foreground">{selectedRequest.notes}</p>
                              </div>
                            )}

                            <div>
                              <label className="text-sm font-medium">تغییر وضعیت:</label>
                              <Select
                                value={selectedRequest.status}
                                onValueChange={(value) => updateStatus(selectedRequest.id, value)}
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">در انتظار</SelectItem>
                                  <SelectItem value="contacted">تماس گرفته شده</SelectItem>
                                  <SelectItem value="completed">تکمیل شده</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationRequestsManager;
