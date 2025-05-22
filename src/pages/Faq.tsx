
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqCategories = [
    {
      id: 'general',
      title: 'سوالات عمومی',
      questions: [
        {
          question: 'دیدار چشم رهنما چه خدماتی ارائه می‌دهد؟',
          answer: 'دیدار چشم رهنما یک سرویس مشاوره و معرفی پزشک برای افرادی است که به دنبال جراحی چشم هستند. ما به صورت رایگان با شما مشاوره می‌کنیم، بهترین پزشک متناسب با نیاز شما را معرفی می‌کنیم و پس از جراحی نیز روند بهبودی شما را پیگیری می‌کنیم.'
        },
        {
          question: 'آیا باید هزینه‌ای برای مشاوره پرداخت کنم؟',
          answer: 'خیر، تمام خدمات مشاوره‌ای ما کاملاً رایگان است. ما تنها در صورتی که شما جراحی را انجام دهید، از پزشک کمیسیون دریافت می‌کنیم و هیچ هزینه‌ای از بیماران دریافت نمی‌شود.'
        },
        {
          question: 'چگونه می‌توانم درخواست مشاوره بدهم؟',
          answer: 'شما می‌توانید از طریق فرم درخواست مشاوره در وبسایت، تماس تلفنی یا واتساپ با ما در ارتباط باشید. تیم مشاوره ما در اسرع وقت با شما تماس خواهد گرفت.'
        },
        {
          question: 'آیا می‌توانم مستقیماً با پزشک صحبت کنم؟',
          answer: 'خیر، ارتباط شما ابتدا با تیم مشاوران ما خواهد بود. آنها اطلاعات لازم را از شما دریافت کرده و سپس بهترین پزشک را معرفی می‌کنند. پس از آن، شما می‌توانید به مطب پزشک مراجعه کنید.'
        },
        {
          question: 'چه تضمینی برای کیفیت خدمات پزشکان وجود دارد؟',
          answer: 'ما با دقت پزشکان را انتخاب می‌کنیم و تنها با متخصصانی که دارای سابقه درخشان و نتایج موفق هستند همکاری می‌کنیم. همچنین بعد از جراحی، روند بهبودی شما را پیگیری می‌کنیم و در صورت بروز هرگونه مشکل، به سرعت رسیدگی می‌کنیم.'
        }
      ]
    },
    {
      id: 'procedures',
      title: 'انواع جراحی‌های چشم',
      questions: [
        {
          question: 'تفاوت جراحی لازیک و PRK چیست؟',
          answer: 'لازیک و PRK هر دو روش‌های جراحی اصلاح دید هستند، اما در تکنیک و دوره نقاهت تفاوت دارند. در لازیک، فلپی در قرنیه ایجاد می‌شود و سپس با لیزر، بافت زیر آن تراشیده می‌شود. بهبودی در این روش سریع‌تر است. در PRK، لایه خارجی قرنیه برداشته می‌شود و دوره نقاهت طولانی‌تر است، اما برای افرادی که قرنیه نازک دارند، می‌تواند گزینه بهتری باشد.'
        },
        {
          question: 'جراحی آب مروارید چیست و چه زمانی نیاز است؟',
          answer: 'آب مروارید (کاتاراکت) حالتی است که در آن عدسی چشم کدر می‌شود و باعث تاری دید می‌شود. در جراحی آب مروارید، عدسی کدر خارج شده و با یک لنز مصنوعی جایگزین می‌شود. این جراحی معمولاً زمانی توصیه می‌شود که آب مروارید بر زندگی روزمره فرد تأثیر منفی بگذارد.'
        },
        {
          question: 'کراتوپیگمنتیشن چیست و آیا خطرناک است؟',
          answer: 'کراتوپیگمنتیشن روشی برای تغییر رنگ چشم است که در آن رنگدانه‌هایی به قرنیه تزریق می‌شود. این روش باید توسط جراحان بسیار مجرب و در شرایط استاندارد انجام شود، زیرا در صورت انجام نادرست می‌تواند عوارضی مانند عفونت، افزایش فشار چشم یا حتی از دست دادن بینایی را به دنبال داشته باشد. توصیه می‌کنیم قبل از تصمیم‌گیری، حتماً با متخصصان ما مشاوره کنید.'
        },
        {
          question: 'برای کراتوکونوس چه درمان‌هایی وجود دارد؟',
          answer: 'کراتوکونوس حالتی است که در آن قرنیه شکل مخروطی پیدا می‌کند و باعث اختلال در بینایی می‌شود. درمان‌های مختلفی از جمله استفاده از عینک و لنز تماس سخت، کراس‌لینکینگ (تقویت قرنیه با اشعه UV)، حلقه‌های داخل قرنیه‌ای و در موارد پیشرفته، پیوند قرنیه می‌تواند انجام شود. بهترین درمان بسته به شدت بیماری و شرایط بیمار متفاوت است.'
        },
        {
          question: 'آیا تمام افراد با عیوب انکساری می‌توانند جراحی لازیک انجام دهند؟',
          answer: 'خیر، لازیک برای همه مناسب نیست. عواملی مانند ضخامت قرنیه، میزان عیب انکساری، خشکی چشم، بیماری‌های زمینه‌ای چشم و سن می‌تواند در تصمیم‌گیری برای انجام لازیک تأثیرگذار باشد. برخی افراد ممکن است برای روش‌های دیگر مانند PRK، SMILE یا لنزهای داخل چشمی مناسب‌تر باشند.'
        }
      ]
    },
    {
      id: 'costs',
      title: 'هزینه‌ها و بیمه',
      questions: [
        {
          question: 'هزینه جراحی لازیک چقدر است؟',
          answer: 'هزینه جراحی لازیک در ایران بسته به نوع تکنولوژی مورد استفاده، تجربه و شهرت جراح، موقعیت کلینیک و نوع لیزر متفاوت است. به طور میانگین، هزینه جراحی لازیک برای هر دو چشم بین 20 تا 40 میلیون تومان متغیر است. البته این قیمت می‌تواند با توجه به شرایط اقتصادی و تورم تغییر کند.'
        },
        {
          question: 'آیا بیمه هزینه جراحی‌های چشم را پوشش می‌دهد؟',
          answer: 'بیمه‌های پایه معمولاً برخی از جراحی‌های ضروری چشم مانند آب مروارید را پوشش می‌دهند، اما جراحی‌های زیبایی یا انتخابی مانند لازیک معمولاً تحت پوشش بیمه نیستند. برخی بیمه‌های تکمیلی ممکن است بخشی از هزینه‌های لازیک را در شرایط خاص پوشش دهند. توصیه می‌کنیم قبل از جراحی، وضعیت پوشش بیمه‌ای خود را بررسی کنید.'
        },
        {
          question: 'آیا روش‌های اقساطی برای پرداخت هزینه جراحی وجود دارد؟',
          answer: 'بله، برخی از کلینیک‌ها و بیمارستان‌ها امکان پرداخت اقساطی هزینه جراحی را فراهم می‌کنند. همچنین برخی بانک‌ها وام‌های پزشکی با شرایط مناسب ارائه می‌دهند. مشاوران ما می‌توانند در این زمینه اطلاعات بیشتری در اختیار شما قرار دهند.'
        }
      ]
    },
    {
      id: 'recovery',
      title: 'دوران نقاهت و مراقبت‌ها',
      questions: [
        {
          question: 'دوران نقاهت پس از جراحی لازیک چقدر طول می‌کشد؟',
          answer: 'بهبودی پس از لازیک نسبتاً سریع است. بیشتر بیماران یک تا دو روز پس از جراحی می‌توانند به فعالیت‌های روزمره بازگردند. بینایی معمولاً طی 24 ساعت بهبود می‌یابد، اما ممکن است تا چند هفته نوسان داشته باشد. بهبودی کامل و پایداری نتایج نهایی ممکن است 3 تا 6 ماه طول بکشد.'
        },
        {
          question: 'چه مراقبت‌هایی پس از جراحی چشم لازم است؟',
          answer: 'پس از جراحی چشم، مراقبت‌هایی مانند استفاده از قطره‌های چشمی تجویز شده، پرهیز از مالش چشم‌ها، استفاده از عینک آفتابی، اجتناب از شنا و سونا، و محدود کردن فعالیت‌های سنگین برای مدت مشخصی ضروری است. همچنین رعایت زمان‌بندی معاینات پیگیری بسیار مهم است.'
        },
        {
          question: 'آیا پس از جراحی لازیک، دوباره به استفاده از عینک نیاز خواهم داشت؟',
          answer: 'هدف جراحی لازیک، کاهش یا حذف نیاز به عینک یا لنز تماس است و اکثر بیماران به این هدف می‌رسند. با این حال، برخی افراد ممکن است برای فعالیت‌های خاص مانند رانندگی در شب یا مطالعه همچنان به عینک نیاز داشته باشند. همچنین، با افزایش سن و بروز پیرچشمی (پرزبیوپی)، ممکن است نیاز به عینک مطالعه پیدا کنید.'
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => searchQuery === '' || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  // Count total questions after filtering
  const totalQuestionsFiltered = filteredFAQs.reduce(
    (total, category) => total + category.questions.length, 
    0
  );

  return (
    <>
      <Header />

      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">سوالات متداول</h1>
          <p className="text-muted-foreground">
            پاسخ به سوالات رایج در مورد جراحی‌های چشم و خدمات دیدار چشم رهنما
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="جستجو در سوالات متداول..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Quick links */}
            {!searchQuery && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {faqCategories.map((category) => (
                  <a 
                    key={category.id} 
                    href={`#${category.id}`} 
                    className="bg-white border rounded-md p-3 text-center hover:bg-secondary transition-colors"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            )}

            {/* FAQ Sections */}
            {filteredFAQs.length > 0 ? (
              <>
                {searchQuery && (
                  <div className="mb-6 text-sm text-muted-foreground">
                    <p>{totalQuestionsFiltered} نتیجه یافت شد</p>
                  </div>
                )}

                {filteredFAQs.map((category) => (
                  <div key={category.id} id={category.id} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                    <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
                      {category.questions.map((item, index) => (
                        <AccordionItem key={index} value={`${category.id}-item-${index}`}>
                          <AccordionTrigger className="px-4 hover:bg-secondary/50 font-medium">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-1">
                            <div className="text-muted-foreground">
                              {item.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">هیچ نتیجه‌ای برای جستجوی شما یافت نشد</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  پاک کردن جستجو
                </Button>
              </div>
            )}

            {/* Still have questions */}
            <div className="mt-12 bg-eyecare-50 rounded-lg p-6 border border-eyecare-100 text-center">
              <h3 className="text-xl font-semibold mb-3">هنوز سوالی دارید؟</h3>
              <p className="text-muted-foreground mb-4">
                تیم مشاوره ما آماده پاسخگویی به تمامی سوالات شما است
              </p>
              <Button asChild>
                <Link to="/consultation">درخواست مشاوره رایگان</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Faq;
