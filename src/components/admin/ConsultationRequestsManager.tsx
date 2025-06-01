import { useState, useEffect } from 'react';
import { Eye, Phone, Mail, MessageSquare } from 'lucide-react';
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

const ConsultationRequestsManager = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests' as any)
        .select('*')
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
        .from('consultation_requests' as any)
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
                <TableHead>شهر</TableHead>
                <TableHead>تماس</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.full_name}</TableCell>
                  <TableCell>{request.city || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.preferred_contact === 'phone' && <Phone className="h-4 w-4" />}
                      {request.preferred_contact === 'email' && <Mail className="h-4 w-4" />}
                      {request.preferred_contact === 'whatsapp' && <MessageSquare className="h-4 w-4" />}
                      {request.phone}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                                  <label className="text-sm font-medium">نام و نام خانوادگی:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.full_name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">شهر:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.city || '-'}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">شماره تماس:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">ایمیل:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.email || '-'}</p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">روش ارتباطی ترجیحی:</label>
                                <p className="text-sm text-muted-foreground">
                                  {selectedRequest.preferred_contact === 'phone' && 'تماس تلفنی'}
                                  {selectedRequest.preferred_contact === 'email' && 'ایمیل'}
                                  {selectedRequest.preferred_contact === 'whatsapp' && 'واتساپ'}
                                </p>
                              </div>

                              {selectedRequest.surgery_type && (
                                <div>
                                  <label className="text-sm font-medium">نوع جراحی مورد نظر:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.surgery_type}</p>
                                </div>
                              )}

                              {selectedRequest.eye_problem && (
                                <div>
                                  <label className="text-sm font-medium">مشکل چشمی:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.eye_problem}</p>
                                </div>
                              )}

                              {selectedRequest.medical_history && (
                                <div>
                                  <label className="text-sm font-medium">سوابق پزشکی:</label>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.medical_history}</p>
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
                    </div>
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
