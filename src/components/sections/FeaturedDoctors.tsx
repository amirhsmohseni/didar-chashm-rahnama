
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const FeaturedDoctors = () => {
  // Sample doctor data with updated images
  const doctors = [
    {
      id: 1,
      name: "دکتر محمود جباوند",
      specialty: "جراح و متخصص چشم",
      city: "تهران",
      imgUrl: "/lovable-uploads/3e392293-969b-428e-a78f-04e3afa8e257.png",
      expertise: ["جراحی لازیک", "عمل آب مروارید"]
    },
    {
      id: 2,
      name: "دکتر سعیدی فر",
      specialty: "فوق تخصص قرنیه",
      city: "شیراز",
      imgUrl: "/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png",
      expertise: ["پیوند قرنیه", "کراتوکونوس"]
    },
    {
      id: 3,
      name: "دکتر یدالله اسلامی",
      specialty: "جراح و متخصص شبکیه",
      city: "مشهد",
      imgUrl: "/lovable-uploads/2650818e-8b8d-4207-8ee3-d71dd5a870a8.png",
      expertise: ["جراحی شبکیه", "دیابت چشمی"]
    },
    {
      id: 4,
      name: "دکتر فرشید پورکار",
      specialty: "متخصص انکسار و لیزیک",
      city: "اصفهان",
      imgUrl: "/lovable-uploads/7002eea8-8935-4eb4-9a7f-e9d74d54a226.png",
      expertise: ["جراحی لازیک", "جراحی PRK"]
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">پزشکان برتر</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            پزشکان متخصص و با تجربه که با دقت انتخاب شده‌اند تا بهترین خدمات چشم‌پزشکی را به شما ارائه دهند
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={doctor.imgUrl} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-primary mb-1">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground mb-2">{doctor.city}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {doctor.expertise.map((item, index) => (
                    <span key={index} className="text-xs bg-secondary rounded-full px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/doctors">
              مشاهده همه پزشکان
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
