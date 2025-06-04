
import { useState, useEffect } from 'react';
import { MessageSquare, Eye, Check, X, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string | null;
  medical_condition: string;
  notes: string | null;
  status: string;
  preferred_date: string | null;
  preferred_time: string | null;
  created_at: string;
  updated_at: string;
}

const ConsultationRequestsManager = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingRequest, setViewingRequest] = useState<ConsultationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت درخواست‌های مشاوره",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ 
          status: newStatus,
          notes: adminNotes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت درخواست با موفقیت تغییر کرد",
      });

      fetchRequests();
      setViewingRequest(null);
      setAdminNotes('');
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
      pending: { label: 'در انتظار', variant: 'secondary' as const, icon: Clock },
      approved: { label: 'تایید شده', variant: 'default' as const, icon: Check },
      rejected: { label: 'رد شده', variant: 'destructive' as const, icon: X },
      completed: { label: 'تکمیل شده', variant: 'outline' as const, icon: Check },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
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

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fa-IR', {
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
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          مدیریت درخواست‌های مشاوره
        </CardTitle>
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ درخواست مشاوره‌ای ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>ایمیل</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ درخواست</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{request.name}</div>
                      {request.age && (
                        <div className="text-sm text-muted-foreground">
                          {request.age} ساله
                          {request.gender && ` - ${request.gender === 'male' ? 'آقای' : 'خانم'}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewingRequest(request);
                            setAdminNotes(request.notes || '');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          مشاهده
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>جزئیات درخواست مشاوره</DialogTitle>
                          <DialogDescription>
                            درخواست {request.name} - {formatDate(request.created_at)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {viewingRequest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <strong>نام:</strong> {viewingRequest.name}
                              </div>
                              <div>
                                <strong>ایمیل:</strong> {viewingRequest.email}
                              </div>
                              <div>
                                <strong>شماره تماس:</strong> {viewingRequest.phone}
                              </div>
                              <div>
                                <strong>سن:</strong> {viewingRequest.age || 'نامشخص'}
                              </div>
                              <div>
                                <strong>جنسیت:</strong> 
                                {viewingRequest.gender === 'male' ? ' آقا' : 
                                 viewingRequest.gender === 'female' ? ' خانم' : ' نامشخص'}
                              </div>
                              <div>
                                <strong>وضعیت:</strong> {getStatusBadge(viewingRequest.status)}
                              </div>
                              {viewingRequest.preferred_date && (
                                <div>
                                  <strong>تاریخ مطلوب:</strong> {new Date(viewingRequest.preferred_date).toLocaleDateString('fa-IR')}
                                </div>
                              )}
                              {viewingRequest.preferred_time && (
                                <div>
                                  <strong>زمان مطلوب:</strong> {formatTime(viewingRequest.preferred_time)}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <strong>شرح وضعیت پزشکی:</strong>
                              <p className="mt-1 p-3 bg-secondary rounded-md">
                                {viewingRequest.medical_condition}
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                یادداشت مدیر (اختیاری):
                              </label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="یادداشت خود را اینجا بنویسید..."
                                rows={3}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                تغییر وضعیت:
                              </label>
                              <div className="flex gap-2">
                                <Button
                                  variant="default"
                                  onClick={() => updateStatus(viewingRequest.id, 'approved')}
                                  disabled={viewingRequest.status === 'approved'}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  تایید
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => updateStatus(viewingRequest.id, 'rejected')}
                                  disabled={viewingRequest.status === 'rejected'}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  رد
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => updateStatus(viewingRequest.id, 'completed')}
                                  disabled={viewingRequest.status === 'completed'}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  تکمیل
                                </Button>
                              </div>
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
