
import { useState, useEffect } from 'react';
import { MessageSquare, Eye, Phone, Mail, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string | null;
  medical_condition: string;
  doctor_id: string | null;
  status: string;
  notes: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  created_at: string;
  doctors?: {
    name: string;
    specialty: string;
  };
}

const ConsultationRequestsManager = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          doctors:doctor_id (
            name,
            specialty
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت درخواست‌ها",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "بروزرسانی موفق",
        description: "وضعیت درخواست بروزرسانی شد",
      });
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
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
      approved: { label: 'تایید شده', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'رد شده', variant: 'destructive' as const, icon: XCircle },
      completed: { label: 'تکمیل شده', variant: 'outline' as const, icon: CheckCircle },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
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
                <TableHead>تماس</TableHead>
                <TableHead>پزشک</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ ثبت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{request.name}</div>
                      {request.age && (
                        <div className="text-sm text-muted-foreground">
                          {request.age} ساله {request.gender && `- ${request.gender}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {request.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {request.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.doctors ? (
                      <div>
                        <div className="font-medium">{request.doctors.name}</div>
                        <div className="text-sm text-muted-foreground">{request.doctors.specialty}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">انتخاب نشده</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateRequestStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">در انتظار</SelectItem>
                          <SelectItem value="approved">تایید شده</SelectItem>
                          <SelectItem value="rejected">رد شده</SelectItem>
                          <SelectItem value="completed">تکمیل شده</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Request Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>جزئیات درخواست مشاوره</DialogTitle>
              <DialogDescription>
                اطلاعات کامل درخواست مشاوره
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    اطلاعات شخصی
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">نام:</span>
                      <p className="mt-1">{selectedRequest.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">شماره تماس:</span>
                      <p className="mt-1">{selectedRequest.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">ایمیل:</span>
                      <p className="mt-1">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">سن و جنسیت:</span>
                      <p className="mt-1">
                        {selectedRequest.age ? `${selectedRequest.age} ساله` : 'نامشخص'}
                        {selectedRequest.gender && ` - ${selectedRequest.gender}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">شرح مشکل پزشکی</h3>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm">{selectedRequest.medical_condition}</p>
                  </div>
                </div>

                {/* Doctor Information */}
                {selectedRequest.doctors && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">پزشک انتخابی</h3>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="font-medium">{selectedRequest.doctors.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedRequest.doctors.specialty}</p>
                    </div>
                  </div>
                )}

                {/* Appointment Preferences */}
                {(selectedRequest.preferred_date || selectedRequest.preferred_time) && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      ترجیحات زمان ملاقات
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedRequest.preferred_date && (
                        <div>
                          <span className="font-medium">تاریخ مورد نظر:</span>
                          <p className="mt-1">{selectedRequest.preferred_date}</p>
                        </div>
                      )}
                      {selectedRequest.preferred_time && (
                        <div>
                          <span className="font-medium">ساعت مورد نظر:</span>
                          <p className="mt-1">{selectedRequest.preferred_time}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedRequest.notes && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">توضیحات اضافی</h3>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm">{selectedRequest.notes}</p>
                    </div>
                  </div>
                )}

                {/* Status and Date */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">وضعیت و تاریخ</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">وضعیت فعلی:</span>
                      <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ثبت شده در {formatDate(selectedRequest.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ConsultationRequestsManager;
