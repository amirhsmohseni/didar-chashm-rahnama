
import { useState } from 'react';
import { CheckCircle, AlertCircle, Calculator, FileText, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const LoanConditions = () => {
  const conditions = [
    {
      title: "سن متقاضی",
      description: "بین 18 تا 65 سال",
      icon: Users,
      type: "required"
    },
    {
      title: "حداقل درآمد",
      description: "حداقل 5 میلیون تومان درآمد ثابت ماهانه",
      icon: FileText,
      type: "required"
    },
    {
      title: "سابقه کاری",
      description: "حداقل 6 ماه سابقه کار ثابت",
      icon: Clock,
      type: "required"
    },
    {
      title: "ضامن",
      description: "یک نفر ضامن با شرایط مشابه",
      icon: Users,
      type: "optional"
    }
  ];

  const loanTypes = [
    {
      name: "وام جراحی کاتاراکت",
      amount: "10 تا 50 میلیون تومان",
      installments: "12 تا 36 ماه",
      interest: "18% سالانه",
      features: ["بدون نیاز به ضامن", "تصویب سریع", "شروع اقساط پس از جراحی"]
    },
    {
      name: "وام جراحی لیزیک",
      amount: "5 تا 30 میلیون تومان", 
      installments: "6 تا 24 ماه",
      interest: "20% سالانه",
      features: ["پرداخت انعطاف‌پذیر", "مشاوره تخصصی", "گارانتی عمل"]
    },
    {
      name: "وام درمان‌های تخصصی",
      amount: "15 تا 100 میلیون تومان",
      installments: "24 تا 60 ماه",
      interest: "16% سالانه", 
      features: ["سقف بالا", "اقساط بلندمدت", "شرایط ویژه"]
    }
  ];

  const requiredDocuments = [
    "کپی شناسنامه و کارت ملی",
    "گواهی کار و حقوق",
    "فیش‌های حقوقی 3 ماه اخیر",
    "تصویر چک ضمانت",
    "نظریه پزشک معالج",
    "برآورد هزینه درمان"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرایط دریافت وام</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            با شرایط آسان و انعطاف‌پذیر، درمان چشم خود را بدون نگرانی مالی انجام دهید
          </p>
        </div>

        {/* Loan Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">انواع وام‌های ارائه شده</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanTypes.map((loan, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{loan.name}</CardTitle>
                  <CardDescription>
                    <div className="space-y-2 text-sm">
                      <div><strong>مبلغ:</strong> {loan.amount}</div>
                      <div><strong>اقساط:</strong> {loan.installments}</div>
                      <div><strong>نرخ سود:</strong> {loan.interest}</div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">ویژگی‌ها:</h4>
                    <ul className="space-y-1">
                      {loan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conditions Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">شرایط عمومی دریافت وام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conditions.map((condition, index) => {
              const IconComponent = condition.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${condition.type === 'required' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        <IconComponent className={`h-6 w-6 ${condition.type === 'required' ? 'text-red-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{condition.title}</h3>
                          <Badge variant={condition.type === 'required' ? 'destructive' : 'secondary'}>
                            {condition.type === 'required' ? 'الزامی' : 'اختیاری'}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{condition.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">مدارک مورد نیاز</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">مراحل دریافت وام</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "درخواست", desc: "ثبت درخواست آنلاین یا حضوری" },
                { step: 2, title: "بررسی", desc: "بررسی مدارک و شرایط" },
                { step: 3, title: "تصویب", desc: "تصویب وام و تعیین مبلغ" },
                { step: 4, title: "پرداخت", desc: "واریز وام و شروع درمان" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">آماده دریافت وام هستید؟</h2>
          <p className="text-gray-600 mb-6">برای مشاوره رایگان و محاسبه دقیق اقساط با ما تماس بگیرید</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/loan-calculator">
              <Button size="lg" className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                محاسبه اقساط
              </Button>
            </Link>
            <Link to="/consultation">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                درخواست مشاوره
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">اطلاعات تماس</h3>
            <p className="text-blue-700 mb-2">برای دریافت مشاوره تخصصی:</p>
            <p className="text-blue-800 font-semibold">تلفن: 021-12345678</p>
            <p className="text-blue-800 font-semibold">موبایل: 0912-3456789</p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default LoanConditions;
