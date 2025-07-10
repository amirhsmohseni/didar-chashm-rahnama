
import { useState } from 'react';
import { Calculator, DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanType, setLoanType] = useState('');
  const [installmentCount, setInstallmentCount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [results, setResults] = useState(null);

  const loanTypes = {
    'cataract': { name: 'جراحی کاتاراکت', rate: 18 },
    'lasik': { name: 'جراحی لیزیک', rate: 20 },
    'specialized': { name: 'درمان‌های تخصصی', rate: 16 }
  };

  const calculateLoan = () => {
    if (!loanAmount || !loanType || !installmentCount) {
      alert('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    const principal = parseFloat(loanAmount) * 1000000; // تبدیل به تومان
    const rate = loanTypes[loanType].rate / 100; // نرخ سالانه
    const months = parseInt(installmentCount);
    
    // محاسبه قسط ماهانه با فرمول سود مرکب
    const monthlyRate = rate / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    
    // بررسی توانایی پرداخت
    const income = parseFloat(monthlyIncome) * 1000000;
    const paymentRatio = income > 0 ? (monthlyPayment / income) * 100 : 0;
    
    setResults({
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      paymentRatio: Math.round(paymentRatio * 10) / 10,
      loanTypeName: loanTypes[loanType].name
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  const resetCalculator = () => {
    setLoanAmount('');
    setLoanType('');
    setInstallmentCount('');
    setMonthlyIncome('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">محاسبه‌گر اقساط وام</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مبلغ قسط ماهانه و کل هزینه وام خود را محاسبه کنید
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                محاسبه‌گر وام
              </CardTitle>
              <CardDescription>
                اطلاعات وام مورد نظر خود را وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label htmlFor="loanAmount">مبلغ وام (میلیون تومان)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="مثال: 20"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>

              {/* Loan Type */}
              <div className="space-y-2">
                <Label>نوع وام</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع وام را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(loanTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.name} (نرخ سود: {type.rate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Installment Count */}
              <div className="space-y-2">
                <Label htmlFor="installmentCount">تعداد اقساط (ماه)</Label>
                <Select value={installmentCount} onValueChange={setInstallmentCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="تعداد اقساط را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 ماه</SelectItem>
                    <SelectItem value="12">12 ماه</SelectItem>
                    <SelectItem value="18">18 ماه</SelectItem>
                    <SelectItem value="24">24 ماه</SelectItem>
                    <SelectItem value="36">36 ماه</SelectItem>
                    <SelectItem value="48">48 ماه</SelectItem>
                    <SelectItem value="60">60 ماه</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monthly Income (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">درآمد ماهانه (میلیون تومان) - اختیاری</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="مثال: 8"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                />
                <p className="text-xs text-gray-500">برای بررسی توانایی پرداخت</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button onClick={calculateLoan} className="flex-1">
                  محاسبه اقساط
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  پاک کردن
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      نتایج محاسبه
                    </CardTitle>
                    <CardDescription>
                      نوع وام: {results.loanTypeName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">قسط ماهانه</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatNumber(results.monthlyPayment)} تومان
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">کل مبلغ پرداختی</span>
                        </div>
                        <p className="text-xl font-bold text-green-900">
                          {formatNumber(results.totalPayment)} تومان
                        </p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                          <span className="font-semibold text-orange-800">کل سود پرداختی</span>
                        </div>
                        <p className="text-xl font-bold text-orange-900">
                          {formatNumber(results.totalInterest)} تومان
                        </p>
                      </div>

                      {results.paymentRatio > 0 && (
                        <div className={`p-4 rounded-lg ${
                          results.paymentRatio <= 30 ? 'bg-green-50' : 
                          results.paymentRatio <= 50 ? 'bg-yellow-50' : 'bg-red-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className={`h-5 w-5 ${
                              results.paymentRatio <= 30 ? 'text-green-600' : 
                              results.paymentRatio <= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                            <span className={`font-semibold ${
                              results.paymentRatio <= 30 ? 'text-green-800' : 
                              results.paymentRatio <= 50 ? 'text-yellow-800' : 'text-red-800'
                            }`}>
                              نسبت قسط به درآمد
                            </span>
                          </div>
                          <p className={`text-xl font-bold ${
                            results.paymentRatio <= 30 ? 'text-green-900' : 
                            results.paymentRatio <= 50 ? 'text-yellow-900' : 'text-red-900'
                          }`}>
                            {results.paymentRatio}%
                          </p>
                          <p className={`text-sm mt-1 ${
                            results.paymentRatio <= 30 ? 'text-green-700' : 
                            results.paymentRatio <= 50 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {results.paymentRatio <= 30 ? 'وضعیت مناسب' : 
                             results.paymentRatio <= 50 ? 'نیاز به بررسی بیشتر' : 'ممکن است مشکل‌ساز باشد'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Schedule Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>نمونه جدول اقساط</CardTitle>  
                    <CardDescription>چند قسط اول</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3].map((month) => (
                        <div key={month} className="flex justify-between items-center py-2 border-b">
                          <span>قسط {month}</span>
                          <span className="font-semibold">{formatNumber(results.monthlyPayment)} تومان</span>
                        </div>
                      ))}
                      <div className="text-center py-2 text-gray-500">...</div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    آماده محاسبه هستیم
                  </h3>
                  <p className="text-gray-500">
                    اطلاعات وام را پر کرده و دکمه محاسبه را فشار دهید
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Important Notes */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">نکات مهم:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• این محاسبه تقریبی بوده و مبلغ نهایی ممکن است متفاوت باشد</li>
                      <li>• نرخ سود بر اساس شرایط روز و نوع وام متغیر است</li>
                      <li>• برای اطلاعات دقیق با کارشناسان ما تماس بگیرید</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center">
              <Link to="/consultation">
                <Button size="lg" className="w-full">
                  درخواست مشاوره تخصصی
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoanCalculator;
