
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search } from 'lucide-react';

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  // Updated doctor data with images
  const allDoctors = [
    {
      id: 1,
      name: "دکتر محمود جباوند",
      specialty: "جراح و متخصص چشم",
      subspecialty: "لازیک و جراحی انکساری",
      city: "تهران",
      experience: 15,
      bio: "دکتر محمود جباوند، متخصص چشم پزشکی با تجربه طولانی در زمینه جراحی‌های انکساری و لازیک. ایشان دانش آموخته دانشگاه علوم پزشکی تهران و دارای فلوشیپ جراحی قرنیه هستند.",
      imgUrl: "/lovable-uploads/3e392293-969b-428e-a78f-04e3afa8e257.png",
      expertise: ["جراحی لازیک", "عمل آب مروارید", "فمتولیزیک"]
    },
    {
      id: 2,
      name: "دکتر سعیدی فر",
      specialty: "فوق تخصص قرنیه",
      subspecialty: "پیوند قرنیه و کراتوکونوس",
      city: "شیراز",
      experience: 12,
      bio: "دکتر سعیدی فر، فوق تخصص قرنیه و بیماری‌های سطح چشم با تجربه وسیع. ایشان در زمینه پیوند قرنیه و درمان کراتوکونوس یکی از پزشکان برجسته کشور هستند.",
      imgUrl: "/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png",
      expertise: ["پیوند قرنیه", "کراتوکونوس", "خشکی چشم"]
    },
    {
      id: 3,
      name: "دکتر یدالله اسلامی",
      specialty: "جراح و متخصص شبکیه",
      subspecialty: "جراحی شبکیه و ویترکتومی",
      city: "مشهد",
      experience: 18,
      bio: "دکتر یدالله اسلامی، متخصص جراحی شبکیه با سابقه درخشان در درمان بیماری‌های مرتبط با شبکیه و ویتره. ایشان دارای مدرک فوق تخصصی از آلمان هستند.",
      imgUrl: "/lovable-uploads/2650818e-8b8d-4207-8ee3-d71dd5a870a8.png",
      expertise: ["جراحی شبکیه", "دیابت چشمی", "ویترکتومی"]
    },
    {
      id: 4,
      name: "دکتر فرشید پورکار",
      specialty: "متخصص انکسار و لیزیک",
      subspecialty: "جراحی عیوب انکساری",
      city: "اصفهان",
      experience: 10,
      bio: "دکتر فرشید پورکار، متخصص چشم با تمرکز بر جراحی‌های انکساری. ایشان در زمینه لازیک و PRK تجربه زیادی دارند و دانش‌آموخته دانشگاه علوم پزشکی اصفهان هستند.",
      imgUrl: "/lovable-uploads/7002eea8-8935-4eb4-9a7f-e9d74d54a226.png",
      expertise: ["جراحی لازیک", "جراحی PRK", "اصلاح آستیگماتیسم"]
    },
    {
      id: 5,
      name: "دکتر ایزدی فر",
      specialty: "متخصص چشم پزشکی",
      subspecialty: "گلوکوم",
      city: "تبریز",
      experience: 14,
      bio: "دکتر ایزدی فر، متخصص در تشخیص و درمان گلوکوم. ایشان در زمینه درمان‌های نوین گلوکوم تحقیقات گسترده‌ای انجام داده‌اند.",
      imgUrl: "/placeholder.svg",
      expertise: ["گلوکوم", "جراحی ترابکولکتومی", "لیزر SLT"]
    },
    {
      id: 6,
      name: "دکتر علیرضا یزدانی آبیانه",
      specialty: "متخصص چشم پزشکی",
      subspecialty: "استرابیسم و چشم کودکان",
      city: "تهران",
      experience: 8,
      bio: "دکتر علیرضا یزدانی آبیانه، متخصص در زمینه استرابیسم (انحراف چشم) و چشم پزشکی کودکان. ایشان دارای مدرک فلوشیپ هستند و با کودکان ارتباط بسیار خوبی برقرار می‌کنند.",
      imgUrl: "/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png",
      expertise: ["استرابیسم", "چشم کودکان", "آمبلیوپی"]
    },
    {
      id: 7,
      name: "دکتر اعظمتی",
      specialty: "جراح و متخصص چشم",
      subspecialty: "کراتوپیگمنتیشن",
      city: "شیراز",
      experience: 11,
      bio: "دکتر اعظمتی، متخصص در کراتوپیگمنتیشن و تغییر رنگ چشم. ایشان یکی از جراحان مجرب در این زمینه در ایران هستند.",
      imgUrl: "/placeholder.svg",
      expertise: ["کراتوپیگمنتیشن", "تغییر رنگ چشم", "لنزهای داخل چشمی"]
    },
    {
      id: 8,
      name: "دکتر مهسا کمالی",
      specialty: "متخصص چشم پزشکی",
      subspecialty: "اکولوپلاستی",
      city: "مشهد",
      experience: 13,
      bio: "دکتر مهسا کمالی، متخصص در جراحی‌های زیبایی اطراف چشم (اکولوپلاستی) با تجربه زیاد. ایشان در زمینه بلفاروپلاستی و رفع افتادگی پلک تخصص ویژه دارند.",
      imgUrl: "/placeholder.svg",
      expertise: ["بلفاروپلاستی", "رفع افتادگی پلک", "جراحی زیبایی اطراف چشم"]
    },
    {
      id: 9,
      name: "دکتر امیر جلالی",
      specialty: "جراح و متخصص چشم",
      subspecialty: "جراحی قرنیه",
      city: "تهران",
      experience: 9,
      bio: "دکتر امیر جلالی، متخصص در جراحی قرنیه و تصحیح عیوب انکساری پیچیده. ایشان از پزشکان با تجربه در زمینه خود هستند.",
      imgUrl: "/placeholder.svg",
      expertise: ["جراحی قرنیه", "پیوند قرنیه", "درمان قوز قرنیه"]
    },
    {
      id: 10,
      name: "دکتر زهرا نوری",
      specialty: "متخصص چشم",
      subspecialty: "شبکیه و ماکولا",
      city: "اصفهان",
      experience: 7,
      bio: "دکتر زهرا نوری، متخصص در تشخیص و درمان بیماری‌های شبکیه و ماکولا. ایشان در درمان دژنراسیون ماکولا و رتینوپاتی دیابتی تخصص دارند.",
      imgUrl: "/placeholder.svg",
      expertise: ["بیماری‌های شبکیه", "دژنراسیون ماکولا", "رتینوپاتی دیابتی"]
    }
  ];

  // Filter doctors based on search query and filters
  const filteredDoctors = allDoctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.subspecialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = cityFilter === '' || cityFilter === 'all-cities' || doctor.city === cityFilter;
    const matchesSpecialty = specialtyFilter === '' || specialtyFilter === 'all-specialties' || 
      doctor.specialty.includes(specialtyFilter) || 
      doctor.subspecialty.includes(specialtyFilter);
    
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  // Get unique cities for filter
  const cities = Array.from(new Set(allDoctors.map(doctor => doctor.city)));
  
  // Get unique specialties for filter
  const specialties = Array.from(new Set(allDoctors.flatMap(doctor => [
    doctor.specialty, 
    doctor.subspecialty
  ])));

  return (
    <>
      <Header />

      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">پزشکان متخصص</h1>
          <p className="text-muted-foreground">
            پزشکان متخصص و با تجربه‌ای که با دقت انتخاب شده‌اند
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border">
            <h2 className="text-lg font-semibold mb-4">جستجو و فیلتر</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="جستجو بر اساس نام یا تخصص..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="شهر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-cities">همه شهرها</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="تخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-specialties">همه تخصص‌ها</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 lg:w-1/4">
                      <div className="aspect-square relative">
                        <img 
                          src={doctor.imgUrl} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-5 md:w-2/3 lg:w-3/4">
                      <h3 className="font-semibold text-xl mb-1">{doctor.name}</h3>
                      <p className="text-primary mb-1">{doctor.specialty}</p>
                      <p className="text-sm text-muted-foreground mb-3">{doctor.subspecialty} • {doctor.city}</p>
                      <p className="text-sm mb-4">{doctor.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.expertise.map((skill, index) => (
                          <span key={index} className="text-xs bg-secondary rounded-full px-3 py-1">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex-1">تجربه: {doctor.experience} سال</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">نتیجه‌ای یافت نشد</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setCityFilter('');
                    setSpecialtyFilter('');
                  }}
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Doctors;
