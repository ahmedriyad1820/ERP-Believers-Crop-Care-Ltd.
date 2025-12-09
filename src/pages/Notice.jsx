import { useEffect, useState, useMemo } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function NoticePage({ language, toggleLanguage, t }) {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Default to showing all notices (no date filter)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [contentUpdate, setContentUpdate] = useState(0)
  
  const pageImages = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    return pageImagesStr ? JSON.parse(pageImagesStr) : {}
  }, [contentUpdate])

  // Listen for content updates
  useEffect(() => {
    const handleStorageChange = () => {
      setContentUpdate(prev => prev + 1)
    }
    const handleContentUpdate = () => {
      setContentUpdate(prev => prev + 1)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('contentUpdated', handleContentUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contentUpdated', handleContentUpdate)
    }
  }, [])

  // Get edited content from localStorage (reactive to contentUpdate)
  const editedContentStr = localStorage.getItem('editedContent')
  const editedContent = editedContentStr ? JSON.parse(editedContentStr) : {}
  const noticeHero = editedContent.notice?.hero || {}
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentNoticeHero = (() => {
    const str = localStorage.getItem('editedContent')
    const content = str ? JSON.parse(str) : {}
    return content.notice?.hero || {}
  })()
  
  const displayNoticeHero = contentUpdate > 0 ? currentNoticeHero : noticeHero

  const heroContent = {
    title: displayNoticeHero.title || (language === 'bn' ? 'নোটিশ' : 'Notices'),
    subtitle: displayNoticeHero.subtitle || (language === 'bn'
      ? 'সম্প্রতি প্রকাশিত নোটিশ, ঘোষণা এবং গুরুত্বপূর্ণ তথ্য দেখুন।'
      : 'View recently published notices, announcements, and important information.')
      }

  // Sample notices data - in a real app, this would come from an API
  const noticesData = language === 'en'
    ? [
        // November 2025 Notices
        {
          id: 27,
          title: 'Winter Crop Protection Campaign 2025',
          date: '2025-11-28',
          content: 'Launching our comprehensive winter crop protection campaign for the upcoming season. Get expert advice on protecting your winter vegetables and crops from common pests and diseases. Special discounts available on winter crop protection products. Visit your nearest dealer for details.',
          important: true,
          photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 28,
          title: 'Annual Dealer Conference 2025 - Registration Open',
          date: '2025-11-25',
          content: 'Save the date! Our annual dealer conference will be held on December 10, 2025 in Dhaka. All authorized dealers are invited to attend. Registration is now open. Early bird registration discount available until November 30, 2025. Details have been sent via email.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 29,
          title: 'New Product Launch: Advanced Fungicide Shield Pro',
          date: '2025-11-22',
          content: 'We are excited to announce the launch of our new advanced fungicide product, Shield Pro. This enhanced formulation provides superior protection against fungal diseases in rice, wheat, and vegetable crops. Available at all authorized dealers starting December 1, 2025.',
          important: true,
          photo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 30,
          title: 'Farmer Training Workshop - November 2025',
          date: '2025-11-20',
          content: 'Join our free farmer training workshop covering modern agricultural techniques, integrated pest management, and sustainable farming practices. Workshops will be held in major districts throughout November. Registration is free. Contact your local dealer for venue details.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 31,
          title: 'Price Update - Effective December 1, 2025',
          date: '2025-11-18',
          content: 'Please be informed that there will be a price adjustment for selected products effective December 1, 2025. Contact your local dealer for updated pricing information. Orders placed before December 1st will be honored at current prices.',
          important: true,
          photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 32,
          title: 'Quality Assurance Certification Renewal',
          date: '2025-11-15',
          content: 'We are pleased to announce that all our manufacturing facilities have successfully renewed their quality assurance certifications. We remain committed to providing the highest quality crop protection solutions to our farmers.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 33,
          title: 'Holiday Schedule - December 2025',
          date: '2025-11-12',
          content: 'Our offices will be closed from December 16-17, 2025 for Victory Day holidays. All orders placed during this period will be processed starting December 18, 2025. We apologize for any inconvenience.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 34,
          title: 'New Distribution Hub Opening in Rajshahi',
          date: '2025-11-10',
          content: 'We are opening a new distribution hub in Rajshahi to better serve farmers in the northwestern region. The hub will be operational from December 1, 2025. This will ensure faster delivery and better product availability for farmers in the region.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 35,
          title: 'Customer Loyalty Program Launch',
          date: '2025-11-08',
          content: 'We are launching our new customer loyalty program. Earn points with every purchase and redeem them for discounts and special offers. All registered customers are automatically enrolled. Visit your dealer to learn more about the program benefits.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 36,
          title: 'Safety Awareness Campaign - November 2025',
          date: '2025-11-05',
          content: 'Important safety guidelines for proper pesticide and fertilizer application. Always read product labels, wear protective equipment, and follow recommended application rates. Your safety is our priority. Free safety training sessions available at all dealer locations.',
          important: true,
          photo: 'https://images.unsplash.com/photo-1573164713714-95f53d0b0c0e?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 37,
          title: 'Digital Payment System Integration',
          date: '2025-11-03',
          content: 'We have integrated digital payment systems for easier transactions. Dealers and customers can now make payments through mobile banking, bKash, Nagad, and other digital platforms. Contact your dealer for more information on payment options.',
          important: false,
          photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 19,
          title: 'Special Discount Offer - Limited Time Only',
          date: '2025-01-15',
          content: 'Get up to 25% discount on selected crop protection products this month. This special offer is valid until January 31, 2025. Visit your nearest dealer or contact our sales team to avail this opportunity. Terms and conditions apply.',
          important: true
        },
        {
          id: 20,
          title: 'New Mobile App Launch - Farmer Connect',
          date: '2025-01-12',
          content: 'We are thrilled to announce the launch of our new mobile application "Farmer Connect". Get instant access to product information, expert advice, order tracking, and exclusive offers. Download now from Google Play Store and Apple App Store.',
          important: false
        },
        {
          id: 21,
          title: 'Weather Alert - Crop Protection Advisory',
          date: '2025-01-10',
          content: 'Due to recent weather changes, we recommend farmers to take extra precautions with their crops. Apply protective measures for your winter vegetables and ensure proper drainage. Contact our agronomy team for personalized advice.',
          important: true
        },
        {
          id: 22,
          title: 'Online Ordering System Now Available',
          date: '2025-01-08',
          content: 'We have launched our new online ordering system for dealers and distributors. Place orders 24/7, track shipments in real-time, and manage your inventory efficiently. Login credentials have been sent to all registered dealers via email.',
          important: false
        },
        {
          id: 23,
          title: 'Customer Satisfaction Survey 2025',
          date: '2025-01-05',
          content: 'Your feedback is important to us! Participate in our annual customer satisfaction survey and help us improve our services. All participants will receive a special discount voucher. Survey link has been sent to registered customers.',
          important: false
        },
        {
          id: 24,
          title: 'New Regional Office Opening in Sylhet',
          date: '2025-01-03',
          content: 'We are pleased to announce the opening of our new regional office in Sylhet. This will enhance our service delivery to farmers in the northeastern region. The office will be fully operational from January 15, 2025. Visit us for all your crop protection needs.',
          important: false
        },
        {
          id: 1,
          title: 'New Product Launch: Herbicide Pro Plus',
          date: '2024-12-20',
          content: 'We are excited to announce the launch of our new product, Herbicide Pro Plus. This advanced formulation provides superior weed control for rice and wheat crops. Available at all authorized dealers starting January 2025.',
          important: true
        },
        {
          id: 2,
          title: 'Holiday Schedule - December 2024',
          date: '2024-12-15',
          content: 'Our offices will be closed from December 25-26, 2024 for Christmas holidays. All orders placed during this period will be processed starting December 27, 2024. We apologize for any inconvenience.',
          important: false
        },
        {
          id: 3,
          title: 'Field Training Program - January 2025',
          date: '2024-12-10',
          content: 'Join our comprehensive field training program for farmers and dealers. Learn about proper application techniques, safety measures, and best practices for crop protection. Registration opens December 20, 2024.',
          important: false
        },
        {
          id: 4,
          title: 'Price Update - Effective January 1, 2025',
          date: '2024-12-05',
          content: 'Please be informed that there will be a price adjustment for selected products effective January 1, 2025. Contact your local dealer for updated pricing information.',
          important: true
        },
        {
          id: 5,
          title: 'New Dealer Partnership Opportunities',
          date: '2024-11-28',
          content: 'We are expanding our dealer network across Bangladesh. Interested parties can apply for dealership opportunities in their respective districts. Contact our sales team for more information.',
          important: false
        },
        {
          id: 6,
          title: 'Safety Guidelines for Pesticide Application',
          date: '2024-11-25',
          content: 'Important safety guidelines for proper pesticide application. Always read product labels, wear protective equipment, and follow recommended application rates. Your safety is our priority.',
          important: true
        },
        {
          id: 7,
          title: 'Annual Dealer Conference 2024',
          date: '2024-11-20',
          content: 'Save the date! Our annual dealer conference will be held on December 15, 2024 in Dhaka. All authorized dealers are invited to attend. Registration details will be sent via email.',
          important: false
        },
        {
          id: 8,
          title: 'Product Recall Notice - Batch #2024-089',
          date: '2024-11-15',
          content: 'We are recalling a specific batch of Fungicide Shield (Batch #2024-089) due to quality concerns. If you have purchased this batch, please contact our customer service immediately.',
          important: true
        },
        {
          id: 9,
          title: 'Winter Crop Protection Campaign 2024',
          date: '2024-11-10',
          content: 'Launching our special winter crop protection campaign. Get expert advice on protecting your winter vegetables and crops from common pests and diseases. Visit your nearest dealer for special offers.',
          important: false
        },
        {
          id: 10,
          title: 'Quality Assurance Update',
          date: '2024-11-05',
          content: 'We are pleased to announce that all our products have passed the latest quality assurance tests. We remain committed to providing the highest quality crop protection solutions to our farmers.',
          important: false
        },
        {
          id: 11,
          title: 'Farmer Support Helpline Extended Hours',
          date: '2024-10-30',
          content: 'Our farmer support helpline is now available 24/7. Get instant assistance with product queries, application guidance, and technical support. Call us anytime at +880 711223344.',
          important: true
        },
        {
          id: 12,
          title: 'New Distribution Center Opening in Chittagong',
          date: '2024-10-25',
          content: 'We are opening a new distribution center in Chittagong to better serve farmers in the region. The center will be operational from November 1, 2024. This will ensure faster delivery and better product availability.',
          important: false
        },
        {
          id: 13,
          title: 'Agronomy Workshop Series - November 2024',
          date: '2024-10-20',
          content: 'Join our free agronomy workshop series covering topics on soil health, integrated pest management, and sustainable farming practices. Workshops will be held in major districts throughout November.',
          important: false
        },
        {
          id: 14,
          title: 'Payment Terms Update for Dealers',
          date: '2024-10-15',
          content: 'Updated payment terms and credit facilities for authorized dealers. New flexible payment options available. Contact your regional sales manager for details on the updated dealer agreement.',
          important: true
        },
        {
          id: 15,
          title: 'Seasonal Product Availability Notice',
          date: '2024-10-10',
          content: 'Please note that certain seasonal products may have limited availability during off-seasons. We recommend placing advance orders to ensure product availability when needed. Contact your dealer for seasonal product schedules.',
          important: false
        },
        {
          id: 16,
          title: 'Digital Platform Launch - Dealer Portal',
          date: '2024-10-05',
          content: 'We are launching a new digital dealer portal for easier order management, inventory tracking, and sales reporting. All dealers will receive login credentials via email. Training sessions will be conducted in October.',
          important: false
        },
        {
          id: 17,
          title: 'Environmental Compliance Certification',
          date: '2024-09-30',
          content: 'We are proud to announce that all our manufacturing facilities have received environmental compliance certification. This reaffirms our commitment to sustainable and responsible agricultural practices.',
          important: false
        },
        {
          id: 18,
          title: 'Customer Feedback Program',
          date: '2024-09-25',
          content: 'Your feedback matters! We are launching a new customer feedback program. Share your experiences and suggestions to help us improve our products and services. Participants will receive special rewards.',
          important: false
        }
      ]
    : [
        // November 2025 Notices (Bengali)
        {
          id: 27,
          title: 'শীতকালীন ফসল সুরক্ষা ক্যাম্পেইন ২০২৫',
          date: '২০২৫-১১-২৮',
          content: 'আসন্ন মৌসুমের জন্য আমাদের ব্যাপক শীতকালীন ফসল সুরক্ষা ক্যাম্পেইন চালু হচ্ছে। সাধারণ পোকামাকড় ও রোগ থেকে আপনার শীতকালীন শাকসবজি ও ফসল রক্ষার জন্য বিশেষজ্ঞ পরামর্শ পান। শীতকালীন ফসল সুরক্ষা পণ্যে বিশেষ ছাড় উপলব্ধ। বিস্তারিত জানতে আপনার নিকটতম ডিলারের সাথে যোগাযোগ করুন।',
          important: true,
          photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 28,
          title: 'বার্ষিক ডিলার কনফারেন্স ২০২৫ - নিবন্ধন খোলা',
          date: '২০২৫-১১-২৫',
          content: 'তারিখটি মনে রাখুন! আমাদের বার্ষিক ডিলার কনফারেন্স ১০ ডিসেম্বর, ২০২৫ ঢাকায় অনুষ্ঠিত হবে। সমস্ত অনুমোদিত ডিলারদের অংশগ্রহণের জন্য আমন্ত্রণ জানানো হচ্ছে। নিবন্ধন এখন খোলা। ৩০ নভেম্বর, ২০২৫ পর্যন্ত আর্লি বার্ড নিবন্ধন ছাড় উপলব্ধ। বিস্তারিত ইমেইলের মাধ্যমে পাঠানো হয়েছে।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 29,
          title: 'নতুন পণ্য লঞ্চ: অ্যাডভান্সড ফাঙ্গিসাইড শিল্ড প্রো',
          date: '২০২৫-১১-২২',
          content: 'আমরা আমাদের নতুন উন্নত ফাঙ্গিসাইড পণ্য শিল্ড প্রো-এর লঞ্চ ঘোষণা করতে পেরে আনন্দিত। এই উন্নত ফর্মুলেশন ধান, গম এবং শাকসবজি ফসলে ছত্রাক রোগের বিরুদ্ধে উন্নত সুরক্ষা প্রদান করে। ১ ডিসেম্বর, ২০২৫ থেকে সমস্ত অনুমোদিত ডিলারের কাছে পাওয়া যাবে।',
          important: true,
          photo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 30,
          title: 'কৃষক প্রশিক্ষণ ওয়ার্কশপ - নভেম্বর ২০২৫',
          date: '২০২৫-১১-২০',
          content: 'আধুনিক কৃষি কৌশল, সমন্বিত পোকা ব্যবস্থাপনা এবং টেকসই কৃষি অনুশীলনের বিষয়ে আমাদের বিনামূল্যের কৃষক প্রশিক্ষণ ওয়ার্কশপে যোগ দিন। ওয়ার্কশপগুলি নভেম্বর মাসে প্রধান জেলাগুলিতে অনুষ্ঠিত হবে। নিবন্ধন বিনামূল্যে। ভেন্যুর বিস্তারিত জানতে আপনার স্থানীয় ডিলারের সাথে যোগাযোগ করুন।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 31,
          title: 'মূল্য আপডেট - ১ ডিসেম্বর, ২০২৫ থেকে কার্যকর',
          date: '২০২৫-১১-১৮',
          content: 'অনুগ্রহ করে জানানো যাচ্ছে যে ১ ডিসেম্বর, ২০২৫ থেকে নির্বাচিত পণ্যের মূল্য সমন্বয় করা হবে। আপডেটেড মূল্যের তথ্যের জন্য আপনার স্থানীয় ডিলারের সাথে যোগাযোগ করুন। ১ ডিসেম্বরের আগে করা অর্ডার বর্তমান মূল্যে সম্মানিত হবে।',
          important: true,
          photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 32,
          title: 'মান নিশ্চিতকরণ সার্টিফিকেশন নবায়ন',
          date: '২০২৫-১১-১৫',
          content: 'আমরা আনন্দিত যে আমাদের সমস্ত উৎপাদন সুবিধা সফলভাবে তাদের মান নিশ্চিতকরণ সার্টিফিকেশন নবায়ন করেছে। আমরা আমাদের কৃষকদের সর্বোচ্চ মানের ফসল সুরক্ষা সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 33,
          title: 'ছুটির সময়সূচী - ডিসেম্বর ২০২৫',
          date: '২০২৫-১১-১২',
          content: 'বিজয় দিবস ছুটির জন্য আমাদের অফিস ১৬-১৭ ডিসেম্বর, ২০২৫ বন্ধ থাকবে। এই সময়ের মধ্যে করা সমস্ত অর্ডার ১৮ ডিসেম্বর, ২০২৫ থেকে প্রক্রিয়া করা হবে। অসুবিধার জন্য আমরা দুঃখিত।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 34,
          title: 'রাজশাহীতে নতুন বিতরণ হাব উদ্বোধন',
          date: '২০২৫-১১-১০',
          content: 'উত্তর-পশ্চিমাঞ্চলের কৃষকদের আরও ভালো সেবা দেওয়ার জন্য আমরা রাজশাহীতে একটি নতুন বিতরণ হাব খুলছি। হাবটি ১ ডিসেম্বর, ২০২৫ থেকে কার্যকর হবে। এটি অঞ্চলের কৃষকদের জন্য দ্রুত ডেলিভারি এবং ভালো পণ্য প্রাপ্যতা নিশ্চিত করবে।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 35,
          title: 'গ্রাহক লয়্যালটি প্রোগ্রাম লঞ্চ',
          date: '২০২৫-১১-০৮',
          content: 'আমরা আমাদের নতুন গ্রাহক লয়্যালটি প্রোগ্রাম চালু করছি। প্রতিটি ক্রয়ের সাথে পয়েন্ট অর্জন করুন এবং সেগুলি ছাড় এবং বিশেষ অফারের জন্য রিডিম করুন। সমস্ত নিবন্ধিত গ্রাহক স্বয়ংক্রিয়ভাবে নিবন্ধিত। প্রোগ্রামের সুবিধা সম্পর্কে আরও জানতে আপনার ডিলারের সাথে যোগাযোগ করুন।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 36,
          title: 'নিরাপত্তা সচেতনতা ক্যাম্পেইন - নভেম্বর ২০২৫',
          date: '২০২৫-১১-০৫',
          content: 'সঠিক কীটনাশক ও সার প্রয়োগের জন্য গুরুত্বপূর্ণ নিরাপত্তা নির্দেশিকা। সর্বদা পণ্যের লেবেল পড়ুন, সুরক্ষামূলক সরঞ্জাম পরিধান করুন এবং সুপারিশকৃত প্রয়োগের হার অনুসরণ করুন। আপনার নিরাপত্তা আমাদের অগ্রাধিকার। সমস্ত ডিলার অবস্থানে বিনামূল্যের নিরাপত্তা প্রশিক্ষণ সেশন উপলব্ধ।',
          important: true,
          photo: 'https://images.unsplash.com/photo-1573164713714-95f53d0b0c0e?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 37,
          title: 'ডিজিটাল পেমেন্ট সিস্টেম ইন্টিগ্রেশন',
          date: '২০২৫-১১-০৩',
          content: 'আমরা সহজ লেনদেনের জন্য ডিজিটাল পেমেন্ট সিস্টেম ইন্টিগ্রেট করেছি। ডিলার এবং গ্রাহকরা এখন মোবাইল ব্যাংকিং, বিকাশ, নগদ এবং অন্যান্য ডিজিটাল প্ল্যাটফর্মের মাধ্যমে পেমেন্ট করতে পারবেন। পেমেন্ট বিকল্প সম্পর্কে আরও তথ্যের জন্য আপনার ডিলারের সাথে যোগাযোগ করুন।',
          important: false,
          photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 19,
          title: 'বিশেষ ছাড়ের অফার - সীমিত সময়ের জন্য',
          date: '২০২৫-০১-১৫',
          content: 'এই মাসে নির্বাচিত ফসল সুরক্ষা পণ্যে ২৫% পর্যন্ত ছাড় পান। এই বিশেষ অফার ৩১ জানুয়ারি, ২০২৫ পর্যন্ত বৈধ। এই সুযোগ গ্রহণ করতে আপনার নিকটতম ডিলারের সাথে যোগাযোগ করুন বা আমাদের বিক্রয় দলের সাথে যোগাযোগ করুন। শর্তাবলী প্রযোজ্য।',
          important: true
        },
        {
          id: 20,
          title: 'নতুন মোবাইল অ্যাপ লঞ্চ - ফার্মার কানেক্ট',
          date: '২০২৫-০১-১২',
          content: 'আমরা আমাদের নতুন মোবাইল অ্যাপ্লিকেশন "ফার্মার কানেক্ট" চালু করতে পেরে আনন্দিত। পণ্যের তথ্য, বিশেষজ্ঞ পরামর্শ, অর্ডার ট্র্যাকিং এবং এক্সক্লুসিভ অফার সহ তাত্ক্ষণিক অ্যাক্সেস পান। এখনই Google Play Store এবং Apple App Store থেকে ডাউনলোড করুন।',
          important: false
        },
        {
          id: 21,
          title: 'আবহাওয়া সতর্কতা - ফসল সুরক্ষা পরামর্শ',
          date: '২০২৫-০১-১০',
          content: 'সাম্প্রতিক আবহাওয়া পরিবর্তনের কারণে, আমরা কৃষকদের তাদের ফসলের জন্য অতিরিক্ত সতর্কতা অবলম্বনের পরামর্শ দিচ্ছি। আপনার শীতকালীন শাকসবজির জন্য সুরক্ষামূলক ব্যবস্থা প্রয়োগ করুন এবং সঠিক নিষ্কাশন নিশ্চিত করুন। ব্যক্তিগত পরামর্শের জন্য আমাদের এগ্রোনমি দলের সাথে যোগাযোগ করুন।',
          important: true
        },
        {
          id: 22,
          title: 'অনলাইন অর্ডারিং সিস্টেম এখন উপলব্ধ',
          date: '২০২৫-০১-০৮',
          content: 'আমরা ডিলার এবং ডিস্ট্রিবিউটরদের জন্য আমাদের নতুন অনলাইন অর্ডারিং সিস্টেম চালু করেছি। ২৪/৭ অর্ডার করুন, রিয়েল-টাইমে শিপমেন্ট ট্র্যাক করুন এবং আপনার ইনভেন্টরি দক্ষতার সাথে পরিচালনা করুন। লগইন credentials সমস্ত নিবন্ধিত ডিলারদের ইমেইলের মাধ্যমে পাঠানো হয়েছে।',
          important: false
        },
        {
          id: 23,
          title: 'গ্রাহক সন্তুষ্টি জরিপ ২০২৫',
          date: '২০২৫-০১-০৫',
          content: 'আপনার মতামত আমাদের কাছে গুরুত্বপূর্ণ! আমাদের বার্ষিক গ্রাহক সন্তুষ্টি জরিপে অংশগ্রহণ করুন এবং আমাদের সেবা উন্নত করতে সাহায্য করুন। সমস্ত অংশগ্রহণকারী একটি বিশেষ ছাড় ভাউচার পাবেন। জরিপ লিঙ্ক নিবন্ধিত গ্রাহকদের কাছে পাঠানো হয়েছে।',
          important: false
        },
        {
          id: 24,
          title: 'সিলেটে নতুন আঞ্চলিক অফিস উদ্বোধন',
          date: '২০২৫-০১-০৩',
          content: 'আমরা সিলেটে আমাদের নতুন আঞ্চলিক অফিস খোলার ঘোষণা করতে পেরে আনন্দিত। এটি উত্তর-পূর্বাঞ্চলের কৃষকদের কাছে আমাদের সেবা সরবরাহ উন্নত করবে। অফিসটি ১৫ জানুয়ারি, ২০২৫ থেকে সম্পূর্ণ কার্যকর হবে। আপনার সমস্ত ফসল সুরক্ষার প্রয়োজনের জন্য আমাদের সাথে যোগাযোগ করুন।',
          important: false
        },
        {
          id: 1,
          title: 'নতুন পণ্য লঞ্চ: হার্বিসাইড প্রো প্লাস',
          date: '২০২৪-১২-২০',
          content: 'আমরা আমাদের নতুন পণ্য হার্বিসাইড প্রো প্লাসের লঞ্চ ঘোষণা করতে পেরে আনন্দিত। এই উন্নত ফর্মুলেশন ধান ও গম ফসলে উন্নত আগাছা নিয়ন্ত্রণ প্রদান করে। জানুয়ারি ২০২৫ থেকে সমস্ত অনুমোদিত ডিলারের কাছে পাওয়া যাবে।',
          important: true
        },
        {
          id: 2,
          title: 'ছুটির সময়সূচী - ডিসেম্বর ২০২৪',
          date: '২০২৪-১২-১৫',
          content: 'ক্রিসমাস ছুটির জন্য আমাদের অফিস ২৫-২৬ ডিসেম্বর, ২০২৪ বন্ধ থাকবে। এই সময়ের মধ্যে করা সমস্ত অর্ডার ২৭ ডিসেম্বর, ২০২৪ থেকে প্রক্রিয়া করা হবে। অসুবিধার জন্য আমরা দুঃখিত।',
          important: false
        },
        {
          id: 3,
          title: 'মাঠ প্রশিক্ষণ প্রোগ্রাম - জানুয়ারি ২০২৫',
          date: '২০২৪-১২-১০',
          content: 'কৃষক ও ডিলারদের জন্য আমাদের ব্যাপক মাঠ প্রশিক্ষণ প্রোগ্রামে যোগ দিন। সঠিক প্রয়োগ কৌশল, নিরাপত্তা ব্যবস্থা এবং ফসল সুরক্ষার সেরা অনুশীলন সম্পর্কে জানুন। নিবন্ধন ২০ ডিসেম্বর, ২০২৪ থেকে শুরু হবে।',
          important: false
        },
        {
          id: 4,
          title: 'মূল্য আপডেট - ১ জানুয়ারি, ২০২৫ থেকে কার্যকর',
          date: '২০২৪-১২-০৫',
          content: 'অনুগ্রহ করে জানানো যাচ্ছে যে ১ জানুয়ারি, ২০২৫ থেকে নির্বাচিত পণ্যের মূল্য সমন্বয় করা হবে। আপডেটেড মূল্যের তথ্যের জন্য আপনার স্থানীয় ডিলারের সাথে যোগাযোগ করুন।',
          important: true
        },
        {
          id: 5,
          title: 'নতুন ডিলার পার্টনারশিপ সুযোগ',
          date: '২০২৪-১১-২৮',
          content: 'আমরা বাংলাদেশ জুড়ে আমাদের ডিলার নেটওয়ার্ক প্রসারিত করছি। আগ্রহী পক্ষ তাদের নিজ নিজ জেলায় ডিলারশিপ সুযোগের জন্য আবেদন করতে পারেন। আরও তথ্যের জন্য আমাদের বিক্রয় দলের সাথে যোগাযোগ করুন।',
          important: false
        },
        {
          id: 6,
          title: 'কীটনাশক প্রয়োগের জন্য নিরাপত্তা নির্দেশিকা',
          date: '২০২৪-১১-২৫',
          content: 'সঠিক কীটনাশক প্রয়োগের জন্য গুরুত্বপূর্ণ নিরাপত্তা নির্দেশিকা। সর্বদা পণ্যের লেবেল পড়ুন, সুরক্ষামূলক সরঞ্জাম পরিধান করুন এবং সুপারিশকৃত প্রয়োগের হার অনুসরণ করুন। আপনার নিরাপত্তা আমাদের অগ্রাধিকার।',
          important: true
        },
        {
          id: 7,
          title: 'বার্ষিক ডিলার কনফারেন্স ২০২৪',
          date: '২০২৪-১১-২০',
          content: 'তারিখটি মনে রাখুন! আমাদের বার্ষিক ডিলার কনফারেন্স ১৫ ডিসেম্বর, ২০২৪ ঢাকায় অনুষ্ঠিত হবে। সমস্ত অনুমোদিত ডিলারদের অংশগ্রহণের জন্য আমন্ত্রণ জানানো হচ্ছে। নিবন্ধনের বিস্তারিত ইমেইলের মাধ্যমে পাঠানো হবে।',
          important: false
        },
        {
          id: 8,
          title: 'পণ্য প্রত্যাহার নোটিশ - ব্যাচ #২০২৪-০৮৯',
          date: '২০২৪-১১-১৫',
          content: 'মানের উদ্বেগের কারণে আমরা ফাঙ্গিসাইড শিল্ডের একটি নির্দিষ্ট ব্যাচ (ব্যাচ #২০২৪-০৮৯) প্রত্যাহার করছি। যদি আপনি এই ব্যাচটি কিনে থাকেন, অনুগ্রহ করে অবিলম্বে আমাদের গ্রাহক সেবার সাথে যোগাযোগ করুন।',
          important: true
        },
        {
          id: 9,
          title: 'শীতকালীন ফসল সুরক্ষা ক্যাম্পেইন ২০২৪',
          date: '২০২৪-১১-১০',
          content: 'আমাদের বিশেষ শীতকালীন ফসল সুরক্ষা ক্যাম্পেইন চালু হচ্ছে। সাধারণ পোকামাকড় ও রোগ থেকে আপনার শীতকালীন শাকসবজি ও ফসল রক্ষার জন্য বিশেষজ্ঞ পরামর্শ পান। বিশেষ অফারের জন্য আপনার নিকটতম ডিলারের সাথে যোগাযোগ করুন।',
          important: false
        },
        {
          id: 10,
          title: 'মান নিশ্চিতকরণ আপডেট',
          date: '২০২৪-১১-০৫',
          content: 'আমরা আনন্দিত যে আমাদের সমস্ত পণ্য সর্বশেষ মান নিশ্চিতকরণ পরীক্ষায় উত্তীর্ণ হয়েছে। আমরা আমাদের কৃষকদের সর্বোচ্চ মানের ফসল সুরক্ষা সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ।',
          important: false
        },
        {
          id: 11,
          title: 'কৃষক সহায়তা হেল্পলাইন বর্ধিত সময়',
          date: '২০২৪-১০-৩০',
          content: 'আমাদের কৃষক সহায়তা হেল্পলাইন এখন ২৪/৭ উপলব্ধ। পণ্যের প্রশ্ন, প্রয়োগ নির্দেশনা এবং প্রযুক্তিগত সহায়তার জন্য তাৎক্ষণিক সহায়তা পান। যেকোনো সময় +৮৮০ ৭১১২২৩৩৪৪ নম্বরে কল করুন।',
          important: true
        },
        {
          id: 12,
          title: 'চট্টগ্রামে নতুন বিতরণ কেন্দ্র উদ্বোধন',
          date: '২০২৪-১০-২৫',
          content: 'অঞ্চলের কৃষকদের আরও ভালো সেবা দেওয়ার জন্য আমরা চট্টগ্রামে একটি নতুন বিতরণ কেন্দ্র খুলছি। কেন্দ্রটি ১ নভেম্বর, ২০২৪ থেকে কার্যকর হবে। এটি দ্রুত ডেলিভারি এবং ভালো পণ্য প্রাপ্যতা নিশ্চিত করবে।',
          important: false
        },
        {
          id: 13,
          title: 'এগ্রোনমি ওয়ার্কশপ সিরিজ - নভেম্বর ২০২৪',
          date: '২০২৪-১০-২০',
          content: 'মাটি স্বাস্থ্য, সমন্বিত পোকা ব্যবস্থাপনা এবং টেকসই কৃষি অনুশীলনের বিষয়ে আমাদের বিনামূল্যের এগ্রোনমি ওয়ার্কশপ সিরিজে যোগ দিন। ওয়ার্কশপগুলি নভেম্বর মাসে প্রধান জেলাগুলিতে অনুষ্ঠিত হবে।',
          important: false
        },
        {
          id: 14,
          title: 'ডিলারদের জন্য পেমেন্ট শর্ত আপডেট',
          date: '২০২৪-১০-১৫',
          content: 'অনুমোদিত ডিলারদের জন্য আপডেটেড পেমেন্ট শর্ত এবং ক্রেডিট সুবিধা। নতুন নমনীয় পেমেন্ট বিকল্প উপলব্ধ। আপডেটেড ডিলার চুক্তির বিস্তারিত জানতে আপনার আঞ্চলিক বিক্রয় ম্যানেজারের সাথে যোগাযোগ করুন।',
          important: true
        },
        {
          id: 15,
          title: 'মৌসুমী পণ্য প্রাপ্যতা নোটিশ',
          date: '২০২৪-১০-১০',
          content: 'অনুগ্রহ করে মনে রাখবেন যে নির্দিষ্ট মৌসুমী পণ্য অফ-সিজনে সীমিত প্রাপ্যতা থাকতে পারে। প্রয়োজন হলে পণ্য প্রাপ্যতা নিশ্চিত করতে অগ্রিম অর্ডার দেওয়ার পরামর্শ দেওয়া হচ্ছে। মৌসুমী পণ্যের সময়সূচীর জন্য আপনার ডিলারের সাথে যোগাযোগ করুন।',
          important: false
        },
        {
          id: 16,
          title: 'ডিজিটাল প্ল্যাটফর্ম লঞ্চ - ডিলার পোর্টাল',
          date: '২০২৪-১০-০৫',
          content: 'আমরা সহজ অর্ডার ব্যবস্থাপনা, ইনভেন্টরি ট্র্যাকিং এবং বিক্রয় রিপোর্টিংয়ের জন্য একটি নতুন ডিজিটাল ডিলার পোর্টাল চালু করছি। সমস্ত ডিলার ইমেইলের মাধ্যমে লগইন ক credentials পাবেন। প্রশিক্ষণ সেশন অক্টোবরে অনুষ্ঠিত হবে।',
          important: false
        },
        {
          id: 17,
          title: 'পরিবেশগত সম্মতি সার্টিফিকেশন',
          date: '২০২৪-০৯-৩০',
          content: 'আমরা গর্বিত যে আমাদের সমস্ত উৎপাদন সুবিধা পরিবেশগত সম্মতি সার্টিফিকেশন পেয়েছে। এটি টেকসই এবং দায়িত্বশীল কৃষি অনুশীলনের প্রতি আমাদের প্রতিশ্রুতি পুনরায় নিশ্চিত করে।',
          important: false
        },
        {
          id: 18,
          title: 'গ্রাহক প্রতিক্রিয়া প্রোগ্রাম',
          date: '২০২৪-০৯-২৫',
          content: 'আপনার মতামত গুরুত্বপূর্ণ! আমরা একটি নতুন গ্রাহক প্রতিক্রিয়া প্রোগ্রাম চালু করছি। আমাদের পণ্য ও সেবা উন্নত করতে আপনার অভিজ্ঞতা এবং পরামর্শ শেয়ার করুন। অংশগ্রহণকারীরা বিশেষ পুরস্কার পাবেন।',
          important: false
        }
      ]

  // Convert date string to standard format for filtering
  const normalizeDate = (dateString) => {
    // Handle Bengali date format
    if (dateString.includes('২০২৪') || dateString.includes('২০২৫') || /[০-৯]/.test(dateString)) {
      // Convert Bengali numerals to English
      const bengaliToEnglish = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
      }
      let normalized = dateString
      Object.keys(bengaliToEnglish).forEach(bn => {
        normalized = normalized.replace(new RegExp(bn, 'g'), bengaliToEnglish[bn])
      })
      // Extract date parts (format: YYYY-MM-DD)
      const parts = normalized.match(/(\d{4})-(\d{2})-(\d{2})/)
      if (parts) {
        return `${parts[1]}-${parts[2]}-${parts[3]}`
      }
    }
    // If already in English format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    return dateString
  }

  // Filter notices based on selected date
  const filteredNotices = selectedDate
    ? noticesData.filter(notice => {
        const noticeDate = normalizeDate(notice.date)
        return noticeDate === selectedDate
      })
    : noticesData

  // Group notices by date (most recent first)
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    const dateA = normalizeDate(a.date)
    const dateB = normalizeDate(b.date)
    return new Date(dateB) - new Date(dateA)
  })

  useEffect(() => {
    // Add fade effect only once on page load
    const sections = document.querySelectorAll('.fade-section')
    if (!sections.length) {
      return
    }

    // Use a timeout to ensure DOM is ready, then add visible class
    const timer = setTimeout(() => {
      sections.forEach((section, index) => {
        // Stagger the fade-in effect slightly for each section
        setTimeout(() => {
          section.classList.add('visible')
        }, index * 100) // 100ms delay between each section
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString) => {
    const normalized = normalizeDate(dateString)
    const date = new Date(normalized)
    
    if (language === 'bn') {
      // For Bengali, check if original date string has Bengali numerals
      if (/[০-৯]/.test(dateString)) {
        // Return original Bengali format
        return dateString
      }
      // Otherwise format in Bengali style (but with English numerals for now)
      return date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    // For English
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Get available dates for calendar (unique dates from notices)
  const availableDates = [...new Set(noticesData.map(notice => normalizeDate(notice.date)))].sort((a, b) => new Date(b) - new Date(a))
  
  // Create a Set for quick lookup of dates with notices
  const datesWithNotices = new Set(availableDates)

  // Calendar functions
  const monthNames = language === 'bn' 
    ? ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = language === 'bn'
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDateForCalendar = (year, month, day) => {
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${monthStr}-${dayStr}`
  }

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    // Navigate to the selected date's month
    const dateObj = new Date(date)
    setCurrentMonth(dateObj.getMonth())
    setCurrentYear(dateObj.getFullYear())
    // Close modal on mobile after selecting date
    setIsFilterModalOpen(false)
  }

  // Update calendar month when selectedDate changes externally
  useEffect(() => {
    if (selectedDate) {
      const dateObj = new Date(selectedDate)
      setCurrentMonth(dateObj.getMonth())
      setCurrentYear(dateObj.getFullYear())
    }
  }, [selectedDate])

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []
    const today = new Date()
    const todayStr = formatDateForCalendar(today.getFullYear(), today.getMonth(), today.getDate())

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day calendar-day-empty"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateForCalendar(currentYear, currentMonth, day)
      const hasNotice = datesWithNotices.has(dateStr)
      const isSelected = selectedDate === dateStr
      const isToday = todayStr === dateStr

      days.push(
        <button
          key={day}
          className={`calendar-day ${hasNotice ? 'calendar-day-has-notice' : ''} ${isSelected ? 'calendar-day-selected' : ''} ${isToday ? 'calendar-day-today' : ''}`}
          onClick={() => handleDateClick(dateStr)}
          title={hasNotice ? (language === 'bn' ? 'এই তারিখে নোটিশ আছে' : 'Has notices on this date') : (language === 'bn' ? 'এই তারিখে নোটিশ নেই' : 'No notices on this date')}
        >
          <span className="calendar-day-number">{day}</span>
          {hasNotice && <span className="calendar-day-indicator"></span>}
        </button>
      )
    }

    return days
  }

  return (
    <div className="app notice-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="notice-page-main">
        <section className="notice-hero-banner fade-section">
          <div 
            className="notice-hero-banner-content" 
            style={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, rgba(9, 17, 31, 0.40), rgba(19, 56, 98, 0.40)), url(${pageImages.noticeHero || '/hero-image.jpg'}) center 40% / cover no-repeat`
            }}
          >
            <h1 className="notice-hero-heading">{heroContent.title}</h1>
            <p className="notice-hero-subtitle">{heroContent.subtitle}</p>
          </div>
        </section>

        <section className="notices-section fade-section">
          <div className="notices-container">
            <div className="notices-layout">
              {/* Notices List */}
              <div className="notices-list-wrapper">
                <div className="notices-list-header">
                  <p className="notice-filter-hint">
                    {selectedDate 
                      ? (language === 'bn' 
                          ? `শো করছে: ${formatDate(selectedDate)}` 
                          : `Showing: ${formatDate(selectedDate)}`)
                      : (language === 'bn' 
                          ? 'সব নোটিশ দেখাচ্ছে' 
                          : 'Showing All Notices')}
                  </p>
                  {/* Mobile Filter Button */}
                  <button
                    className="notice-filter-mobile-btn"
                    onClick={() => setIsFilterModalOpen(true)}
                    aria-label={language === 'bn' ? 'ফিল্টার' : 'Filter'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{language === 'bn' ? 'ফিল্টার' : 'Filter'}</span>
                  </button>
                </div>
                <div className="notices-list">
              {sortedNotices.length > 0 ? (
                sortedNotices.map(notice => (
                  <article 
                    key={notice.id} 
                    className={`notice-card ${notice.important ? 'notice-card-important' : ''}`}
                    onClick={() => setSelectedNotice(notice)}
                  >
                    {notice.important && (
                      <div className="notice-important-badge">
                        {language === 'bn' ? 'গুরুত্বপূর্ণ' : 'Important'}
                      </div>
                    )}
                    <div className="notice-card-header">
                      <div className="notice-card-meta">
                        <span className="notice-date">{formatDate(notice.date)}</span>
                      </div>
                      <h3 className="notice-card-title">{notice.title}</h3>
                    </div>
                  </article>
                ))
              ) : (
                <div className="notice-empty-state">
                  <p>{language === 'bn' ? 'কোন নোটিশ পাওয়া যায়নি' : 'No notices found'}</p>
                </div>
              )}
                </div>
              </div>

              {/* Calendar Filter - Right Side */}
              <div className="notice-calendar-sidebar">
                <div className="notice-calendar-container">
                  <div className="notice-calendar-header">
                    <h3 className="notice-calendar-title">
                      {language === 'bn' ? 'তারিখ দিয়ে ফিল্টার করুন' : 'Filter by Date'}
                    </h3>
                    <div className="notice-calendar-nav">
                      <button
                        className="calendar-nav-btn"
                        onClick={handlePreviousMonth}
                        aria-label={language === 'bn' ? 'পূর্ববর্তী মাস' : 'Previous month'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <span className="calendar-month-year">
                        {monthNames[currentMonth]} {currentYear}
                      </span>
                      <button
                        className="calendar-nav-btn"
                        onClick={handleNextMonth}
                        aria-label={language === 'bn' ? 'পরবর্তী মাস' : 'Next month'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="notice-calendar-grid">
                    <div className="calendar-weekdays">
                      {dayNames.map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {renderCalendar()}
                    </div>
                  </div>
                  <div className="notice-calendar-footer">
                    <div className="notice-calendar-buttons">
                      <button
                        className="notice-calendar-btn notice-calendar-btn-today"
                        onClick={() => {
                          const today = getTodayDate()
                          setSelectedDate(today)
                          const todayDate = new Date()
                          setCurrentMonth(todayDate.getMonth())
                          setCurrentYear(todayDate.getFullYear())
                        }}
                      >
                        {language === 'bn' ? 'আজকের তারিখ' : 'Show Today'}
                      </button>
                      <button
                        className="notice-calendar-btn notice-calendar-btn-all"
                        onClick={() => {
                          setSelectedDate('')
                          const today = new Date()
                          setCurrentMonth(today.getMonth())
                          setCurrentYear(today.getFullYear())
                        }}
                      >
                        {language === 'bn' ? 'সব দেখান' : 'Show All'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="notice-filter-modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
          <div className="notice-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notice-filter-modal-header">
              <h3>{language === 'bn' ? 'তারিখ দিয়ে ফিল্টার করুন' : 'Filter by Date'}</h3>
              <button
                className="notice-filter-modal-close"
                onClick={() => setIsFilterModalOpen(false)}
                aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="notice-filter-modal-content">
              <div className="notice-calendar-container">
                <div className="notice-calendar-header">
                  <div className="notice-calendar-nav">
                    <button
                      className="calendar-nav-btn"
                      onClick={handlePreviousMonth}
                      aria-label={language === 'bn' ? 'পূর্ববর্তী মাস' : 'Previous month'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <span className="calendar-month-year">
                      {monthNames[currentMonth]} {currentYear}
                    </span>
                    <button
                      className="calendar-nav-btn"
                      onClick={handleNextMonth}
                      aria-label={language === 'bn' ? 'পরবর্তী মাস' : 'Next month'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="notice-calendar-grid">
                  <div className="calendar-weekdays">
                    {dayNames.map(day => (
                      <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                  </div>
                  <div className="calendar-days">
                    {renderCalendar()}
                  </div>
                </div>
                <div className="notice-calendar-footer">
                  <div className="notice-calendar-buttons">
                    <button
                      className="notice-calendar-btn notice-calendar-btn-today"
                      onClick={() => {
                        const today = getTodayDate()
                        setSelectedDate(today)
                        const todayDate = new Date()
                        setCurrentMonth(todayDate.getMonth())
                        setCurrentYear(todayDate.getFullYear())
                        setIsFilterModalOpen(false)
                      }}
                    >
                      {language === 'bn' ? 'আজকের তারিখ' : 'Show Today'}
                    </button>
                    <button
                      className="notice-calendar-btn notice-calendar-btn-all"
                      onClick={() => {
                        setSelectedDate('')
                        const today = new Date()
                        setCurrentMonth(today.getMonth())
                        setCurrentYear(today.getFullYear())
                        setIsFilterModalOpen(false)
                      }}
                    >
                      {language === 'bn' ? 'সব দেখান' : 'Show All'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="notice-detail-modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="notice-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notice-detail-header">
              <h2 className="notice-detail-title">{selectedNotice.title}</h2>
              <button
                className="notice-detail-close"
                onClick={() => setSelectedNotice(null)}
                aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="notice-detail-content">
              {selectedNotice.photo && (
                <div className="notice-detail-photo-wrapper">
                  <img
                    src={selectedNotice.photo}
                    alt={selectedNotice.title}
                    className="notice-detail-photo"
                    onClick={() => setLightboxImage(selectedNotice.photo)}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/hero-image.jpg'
                    }}
                  />
                </div>
              )}
              <div className="notice-detail-body">
                <div className="notice-detail-meta">
                  <span className="notice-detail-date">{formatDate(selectedNotice.date)}</span>
                  {selectedNotice.important && (
                    <span className="notice-detail-important-badge">
                      {language === 'bn' ? 'গুরুত্বপূর্ণ' : 'Important'}
                    </span>
                  )}
                </div>
                <div className="notice-detail-text">
                  <p>{selectedNotice.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {lightboxImage && (
        <div className="notice-lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="notice-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="notice-lightbox-close"
              onClick={() => setLightboxImage(null)}
              aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <img
              src={lightboxImage}
              alt="Notice"
              className="notice-lightbox-image"
              onClick={() => setLightboxImage(null)}
            />
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img 
              src={logoImage} 
              alt="Believers Crop Care Ltd." 
              className="footer-logo-image"
            />
          </div>
          <div className="footer-info">
            <p className="footer-text">{t.footer.copyright}</p>
            <p className="footer-text">{t.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default NoticePage

