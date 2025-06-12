
import { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Check, X, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientReview {
  id: string;
  patient_name: string;
  patient_email: string | null;
  rating: number;
  review_text: string;
  doctor_id: string | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  doctors?: {
    name: string;
  };
}

const PatientReviewsManager = () => {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_reviews')
        .select(`
          *,
          doctors(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت نظرات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('patient_reviews')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: !currentStatus ? 'approve_review' : 'disapprove_review',
        resource_type_name: 'patient_reviews',
        resource_id_value: id
      });

      toast({
        title: !currentStatus ? "نظر تأیید شد" : "تأیید نظر لغو شد",
        description: `نظر با موفقیت ${!currentStatus ? 'تأیید' : 'رد'} شد`,
      });

      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی نظر",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('patient_reviews')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: !currentStatus ? 'feature_review' : 'unfeature_review',
        resource_type_name: 'patient_reviews',
        resource_id_value: id
      });

      toast({
        title: !currentStatus ? "نظر ویژه شد" : "نظر از ویژه خارج شد",
        description: "وضعیت نظر با موفقیت تغییر کرد",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی نظر",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('patient_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: 'delete_review',
        resource_type_name: 'patient_reviews',
        resource_id_value: id
      });

      toast({
        title: "نظر حذف شد",
        description: "نظر با موفقیت حذف شد",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف نظر",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          مدیریت نظرات بیماران
        </CardTitle>
      </CardHeader>

      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ نظری ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام بیمار</TableHead>
                <TableHead>پزشک</TableHead>
                <TableHead>امتیاز</TableHead>
                <TableHead>نظر</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{review.patient_name}</div>
                      {review.patient_email && (
                        <div className="text-sm text-muted-foreground">{review.patient_email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.doctors?.name || 'عمومی'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="mr-2 text-sm">({review.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={review.review_text}>
                      {review.review_text}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {review.is_approved ? (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <Check className="h-3 w-3" />
                          تأیید شده
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <X className="h-3 w-3" />
                          در انتظار تأیید
                        </Badge>
                      )}
                      {review.is_featured && (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <Star className="h-3 w-3" />
                          ویژه
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(review.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApproval(review.id, review.is_approved)}
                        title={review.is_approved ? 'لغو تأیید' : 'تأیید'}
                      >
                        {review.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(review.id, review.is_featured)}
                        title={review.is_featured ? 'حذف از ویژه' : 'افزودن به ویژه'}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteReview(review.id)}
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default PatientReviewsManager;
