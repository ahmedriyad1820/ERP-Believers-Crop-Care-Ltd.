import { useState, useMemo, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import logoImage from './assets/logo.png'
import SiteHeader from './components/SiteHeader.jsx'
import AboutSection from './components/AboutSection.jsx'
import AboutPage from './pages/About.jsx'
import ProductPage from './pages/Product.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import NoticePage from './pages/Notice.jsx'
import CareerPage from './pages/Career.jsx'
import JobDetailsPage from './pages/JobDetails.jsx'
import BlogPage from './pages/Blog.jsx'
import BlogDetailsPage from './pages/BlogDetails.jsx'
import ContactPage from './pages/Contact.jsx'
import AdminPage from './pages/Admin.jsx'
import TeamSection from './components/TeamSection.jsx'

// Translations
const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      product: 'Product',
      notices: 'Notices',
      career: 'Career',
      blog: 'Blog',
      contact: 'Contact Us'
    },
    hero: {
      title: 'No fear in harvesting, this is our promise',
      description: 'From organic practices to modern agri-tech solutions, Believers Crop Care Ltd. empowers farmers and communities to thrive.',
      viewProducts: 'View Products'
    },
    about: {
      heroTitle: 'About Us',
      heroSubtitle: 'Discover how Believers Crop Care supports farmers with scalable programs, modern agronomy, and dependable distribution.',
      tagline: 'About Us',
      description: 'Believers Crop Care Ltd. is a growing name in the agricultural industry, dedicated to helping farmers protect their crops and increase productivity. From day one, our goal has been simple — to provide high-quality, effective, and affordable crop protection products that farmers can truly rely on.',
      details: 'We believe that successful farming starts with the right support. That\'s why we work closely with farmers, dealers, and distributors to understand their needs and offer timely solutions that make a real difference in the field. Our products are developed with care, focusing on performance, safety, and environmental responsibility.\n\nWhat began as a small team with a big dream has now grown into a trusted company with a strong presence in the market. Our expanding network of partners and distributors allows us to reach more farmers every day, helping them grow healthier crops and achieve better yields.\n\nAt Believers Crop Care Ltd., we\'re more than just a crop protection company — we\'re partners in progress. With continuous research, innovation, and a commitment to quality, we aim to create a brighter, greener future for farming communities across the country.',
      visionButton: 'Vision',
      missionButton: 'Mission',
      vision: {
        title: 'OUR VISION',
        content: 'Our vision is to be a trusted name in sustainable crop protection by empowering farmers with safe, effective, and innovative agricultural solutions. We strive to enhance productivity while preserving environmental balance — ensuring growth that benefits both farmers and the planet.\n\nWe aim to build a future where every farmer has access to quality crop care products, modern agricultural knowledge, and long-term support for prosperous farming communities.'
      },
      mission: {
        title: 'OUR MISSION',
        content: 'Our mission at Believers Crop Care Ltd. is to empower farmers with innovative, reliable, and sustainable crop protection solutions that enhance productivity and safeguard the environment. We strive to deliver products that help farmers achieve better yields through safe and responsible practices while building long-term relationships based on trust, quality, and service excellence.\n\nWe are committed to continuous research, product development, and farmer education — ensuring that every field we serve grows stronger, healthier, and more productive for generations to come.'
      }
    },
    review: {
      rating: '4.9',
      customersReview: '1200+ Customers Review',
      ratings: '5.2K Ratings',
      reviews: '18 reviews'
    },
    whyChooseUs: {
      tagline: 'Why Choose Us',
      title: 'Why Choose Believers Crop Care Ltd.',
      features: [
        {
          title: 'Quality Products',
          description: 'We provide high-quality, effective crop protection products that farmers can trust and rely on for better yields.'
        },
        {
          title: 'Affordable Solutions',
          description: 'Our products are designed to be affordable without compromising on quality, making them accessible to all farmers.'
        },
        {
          title: 'Expert Support',
          description: 'We work closely with farmers, dealers, and distributors to provide timely solutions and expert guidance.'
        },
        {
          title: 'Environmental Responsibility',
          description: 'Our products focus on performance, safety, and environmental responsibility for sustainable farming.'
        },
        {
          title: 'Growing Network',
          description: 'Our expanding network of partners and distributors ensures we reach more farmers every day.'
        },
        {
          title: 'Continuous Innovation',
          description: 'With continuous research and innovation, we stay ahead in providing the best solutions for farming communities.'
        }
      ]
    },
    team: {
      tagline: 'Our Team',
      title: 'People Behind Believers Crop Care',
      description: 'A multidisciplinary leadership team of agronomists, innovators, and service specialists who ensure farmers receive dependable support.',
      groups: [
        { key: 'chairman', title: 'Chairman' },
        { key: 'board', title: 'Board of Directors' },
        { key: 'management', title: 'Management Team' }
      ],
      followCta: 'Follow',
      stats: {
        network: 'Partners',
        projects: 'Field Visits'
      },
      members: [
        {
          name: 'Abdul Latif',
          role: 'Chairman',
          expertise: 'Provides strategic vision and governance for sustainable agribusiness growth nationwide.',
          photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
          group: 'chairman',
          stats: {
            network: '312',
            projects: '48'
          }
        },
        {
          name: 'Md. Alif Ahmed',
          role: 'Managing Director',
          expertise: '17+ years in agri-distribution and sustainable supply chain operations.',
          photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
          group: 'board',
          stats: {
            network: '420',
            projects: '63'
          }
        },
        {
          name: 'Md. Arafat Ahmed',
          role: 'Director',
          expertise: 'Builds nationwide dealer partnerships and farmer service programs.',
          photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
          group: 'board',
          stats: {
            network: '285',
            projects: '37'
          }
        },
        {
          name: 'Dr. Nusrat Rahman',
          role: 'Head of Sales',
          expertise: 'Leads regional sales teams and on-ground activation to keep farmers supported year-round.',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '198',
            projects: '54'
          }
        },
        {
          name: 'Tanvir Ahmed',
          role: 'Head of Operations',
          expertise: 'Ensures smooth warehousing, last-mile delivery, and dealer fulfillment across all districts.',
          photo: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '176',
            projects: '41'
          }
        },
        {
          name: 'Fariha Islam',
          role: 'Head of Supply Chain',
          expertise: 'Coordinates procurement, quality control, and forecasting for our expanding product lineup.',
          photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '204',
            projects: '47'
          }
        },
        {
          name: 'Rezaul Karim',
          role: 'Head of Agronomy Support',
          expertise: 'Guides demo plots, agronomy content, and farmer advisory programs nationwide.',
          photo: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '198',
            projects: '58'
          }
        }
      ]
    },
    testimonials: {
      tagline: 'Grower Testimonials',
      title: 'Trusted By Farmers Nationwide',
      cards: [
        {
          quote: 'Believers Crop Care delivers on time and their agronomists always pick up the phone. Our coastal chilli farms stay protected throughout the season.',
          name: 'Md. Rafiq Hasan',
          role: 'Chilli Farmer, Khulna',
          photo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80'
        },
        {
          quote: 'We run 18 demo plots and the field feedback loop is excellent. Dealers trust the brand because farmers call us back with great harvest stories.',
          name: 'Shakila Sultana',
          role: 'Lead Dealer, Rajshahi',
          photo: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80'
        },
        {
          quote: 'Their supply chain is reliable even during monsoon. Herbicide Pro helped us reclaim 40 acres of land from weeds within two weeks.',
          name: 'Abdul Matin',
          role: 'Rice Collective, Sylhet',
          photo: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    blog: {
      tagline: 'Our Latest News',
      title: 'Insights & success stories from the field',
      cta: 'More Blogs',
      readMore: 'Read More',
      featured: [
        {
          category: 'Agricultural',
          title: 'Expert Tips for Maximizing Crop Yields',
          author: 'Ellan John',
          date: 'April 29, 2024',
          excerpt: 'Practical strategies on irrigation, nutrition, and pest care to help your crops thrive all season.',
          image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'
        },
        {
          category: 'Farming',
          title: 'Practices and Benefits of Sustainable Farming',
          author: 'Max Wills',
          date: 'April 29, 2024',
          excerpt: 'Learn how regenerative techniques improve soil health while lowering input costs.',
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
        }
      ],
      list: [
        {
          category: 'Sustainable',
          title: 'Companion Planting for Natural Pest Control',
          author: 'Max Wills',
          date: 'April 29, 2024',
          image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
        },
        {
          category: 'Livestock',
          title: 'Essential Guidelines for Livestock Health',
          author: 'Sam Andre',
          date: 'April 29, 2024',
          image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80'
        },
        {
          category: 'Crop Care',
          title: 'How To Build A Resilient Crop Calendar',
          author: 'Ellan John',
          date: 'April 29, 2024',
          image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    contact: {
      tagline: 'Contact Us',
      title: 'Let\'s discuss crop protection needs',
      description: 'Reach our service desk for dealer orders, field support, or agronomy queries. Our team responds within one business day.',
      phoneLabel: 'Call us',
      phone: '+880 711223344',
      emailLabel: 'Email us',
      email: 'info@bccl.com',
      addressLabel: 'Visit us',
      address: 'Chockveli, Ranirhat, Bogura',
      cta: 'Send Message',
      form: {
        nameLabel: 'Name',
        namePlaceholder: 'Your full name',
        phoneLabel: 'Phone',
        phonePlaceholder: '+880 1XXX-XXXXXX',
        emailLabel: 'Email',
        emailPlaceholder: 'you@example.com',
        districtLabel: 'District',
        districtPlaceholder: 'Your district',
        messageLabel: 'How can we help?',
        messagePlaceholder: 'Describe your requirement'
      }
    },
    products: {
      tagline: 'Our Products',
      title: 'Quality Crop Protection Solutions',
      description: 'Discover our range of effective and reliable crop protection products designed to help farmers achieve better yields.',
      learnMore: 'Learn More',
      seeAll: 'See All Products',
      items: [
        {
          name: 'Herbicide Pro',
          genericName: 'Glyphosate 41% SL',
          description: 'Advanced weed control solution for maximum crop protection and yield improvement.',
          category: 'Herbicide',
          usage: 'Effective for controlling broadleaf weeds and grasses in various crops including rice, wheat, and vegetables.'
        },
        {
          name: 'Fungicide Shield',
          genericName: 'Mancozeb 75% WP',
          description: 'Comprehensive fungal disease protection to keep your crops healthy and productive.',
          category: 'Fungicide',
          usage: 'Prevents and controls fungal diseases like blight, leaf spot, and rust in tomatoes, potatoes, and other vegetables.'
        },
        {
          name: 'Insecticide Guard',
          genericName: 'Chlorpyrifos 20% EC',
          description: 'Effective pest control solution to protect your crops from harmful insects.',
          category: 'Insecticide',
          usage: 'Controls various pests including aphids, thrips, and caterpillars in rice, cotton, and vegetable crops.'
        },
        {
          name: 'Growth Enhancer',
          genericName: 'Gibberellic Acid 0.186%',
          description: 'Natural growth stimulant to boost crop development and improve overall yield.',
          category: 'Growth Promoter',
          usage: 'Enhances plant growth, increases fruit size, and improves flowering in fruits, vegetables, and ornamental plants.'
        },
        {
          name: 'Fertilizer Plus',
          genericName: 'NPK 19:19:19',
          description: 'Nutrient-rich fertilizer blend for optimal plant nutrition and soil health.',
          category: 'Fertilizer',
          usage: 'Provides balanced nutrition for all stages of crop growth, suitable for rice, wheat, vegetables, and fruit trees.'
        },
        {
          name: 'Organic Protect',
          genericName: 'Neem Oil 0.03% EC',
          description: 'Eco-friendly organic solution for sustainable and safe crop protection.',
          category: 'Organic',
          usage: 'Natural pest and disease control for organic farming, safe for vegetables, fruits, and ornamental plants.'
        },
        {
          name: 'Weed Master',
          genericName: '2,4-D Amine 58% SL',
          description: 'Powerful selective herbicide for effective broadleaf weed management in field crops.',
          category: 'Herbicide',
          usage: 'Ideal for controlling broadleaf weeds in rice, wheat, maize, and sugarcane fields without harming the main crop.'
        },
        {
          name: 'Disease Fighter',
          genericName: 'Carbendazim 50% WP',
          description: 'Systemic fungicide providing long-lasting protection against various plant diseases.',
          category: 'Fungicide',
          usage: 'Controls powdery mildew, leaf spot, and other fungal diseases in vegetables, fruits, and field crops.'
        },
        {
          name: 'Pest Eliminator',
          genericName: 'Imidacloprid 17.8% SL',
          description: 'Advanced systemic insecticide for comprehensive pest control and plant protection.',
          category: 'Insecticide',
          usage: 'Effective against sucking pests like aphids, whiteflies, and thrips in vegetables, cotton, and rice.'
        },
        {
          name: 'Root Booster',
          genericName: 'Auxin 0.1% SL',
          description: 'Specialized growth promoter for enhanced root development and plant establishment.',
          category: 'Growth Promoter',
          usage: 'Promotes strong root systems, improves nutrient uptake, and enhances overall plant vigor in all crops.'
        },
        {
          name: 'Micro Nutrient Mix',
          genericName: 'Zn + B + Fe 12%',
          description: 'Essential micronutrient blend for addressing nutrient deficiencies and improving crop quality.',
          category: 'Fertilizer',
          usage: 'Corrects zinc, boron, and iron deficiencies in rice, wheat, vegetables, and fruit crops for better yields.'
        }
      ],
      addToCart: 'ADD TO CART',
      details: 'Details'
    },
    areasCovered: {
      tagline: 'Areas We Covered',
      title: 'Our Service Coverage Across Bangladesh',
      description: 'We are proud to serve farmers across various regions of Bangladesh, bringing quality crop protection solutions to agricultural communities nationwide.',
      pill: 'Coverage Snapshot',
      mapAlt: 'Bangladesh map showing Believers Crop Care service coverage',
      briefTitle: 'Committed Across Every Division',
      briefIntro: 'Our agronomy network keeps farmers connected with timely delivery, on-field guidance, and dependable after-sales care.',
      briefPoints: [
        '32+ distribution hubs serving all 64 districts',
        'Dedicated field officers and demo plots in every division',
        '24/7 farmer helpline for urgent agronomy assistance'
      ]
    },
    footer: {
      copyright: '© 2024 Believers Crop Care Ltd. All rights reserved. Developed by Alisha IT Solutions.',
      tagline: 'No fear in harvesting, this is our promise'
    }
  },
  bn: {
    nav: {
      home: 'হোম',
      about: 'সম্পর্কে',
      product: 'পণ্য',
      notices: 'নোটিশ',
      career: 'ক্যারিয়ার',
      blog: 'ব্লগ',
      contact: 'যোগাযোগ'
    },
    hero: {
      title: 'ফসল ফলনে নেইকো ভীতি, এই আমাদের প্রতিশ্রুতি',
      description: 'জৈব অনুশীলন থেকে আধুনিক কৃষি-প্রযুক্তি সমাধান পর্যন্ত, বিলিভার্স ক্রপ কেয়ার লিমিটেড কৃষক এবং সম্প্রদায়কে উন্নতির জন্য ক্ষমতায়ন করে।',
      viewProducts: 'পণ্য দেখুন'
    },
    about: {
      heroTitle: 'প্রকল্প বিবরণ',
      heroSubtitle: 'কীভাবে বিলিভার্স ক্রপ কেয়ার আধুনিক এগ্রোনমি, নির্ভরযোগ্য সরবরাহ এবং মাঠ সহযোগিতার মাধ্যমে কৃষকদের পাশে থাকে তা জানুন।',
      tagline: 'আমাদের সম্পর্কে',
      description: 'বিলিভার্স ক্রপ কেয়ার লিমিটেড কৃষি শিল্পে একটি ক্রমবর্ধমান নাম, যা কৃষকদের তাদের ফসল রক্ষা করতে এবং উৎপাদনশীলতা বাড়াতে সাহায্য করার জন্য নিবেদিত। প্রথম দিন থেকেই, আমাদের লক্ষ্য সহজ ছিল — উচ্চমানের, কার্যকর এবং সাশ্রয়ী ফসল সুরক্ষা পণ্য সরবরাহ করা যা কৃষকরা সত্যিই নির্ভর করতে পারে।',
      details: 'আমরা বিশ্বাস করি যে সফল কৃষি শুরু হয় সঠিক সহায়তা দিয়ে। তাই আমরা কৃষক, ডিলার এবং ডিস্ট্রিবিউটরদের সাথে ঘনিষ্ঠভাবে কাজ করি তাদের চাহিদা বুঝতে এবং সময়মতো সমাধান প্রদান করতে যা মাঠে সত্যিকারের পার্থক্য তৈরি করে। আমাদের পণ্যগুলি যত্ন সহকারে বিকশিত হয়েছে, কর্মক্ষমতা, নিরাপত্তা এবং পরিবেশগত দায়িত্বের উপর ফোকাস করে।\n\nযা একটি ছোট দল দিয়ে শুরু হয়েছিল একটি বড় স্বপ্ন নিয়ে এখন বাজারে একটি শক্তিশালী উপস্থিতি সহ একটি বিশ্বস্ত কোম্পানিতে পরিণত হয়েছে। আমাদের অংশীদার এবং ডিস্ট্রিবিউটরদের প্রসারিত নেটওয়ার্ক আমাদের প্রতিদিন আরও বেশি কৃষকের কাছে পৌঁছাতে দেয়, তাদের স্বাস্থ্যকর ফসল বৃদ্ধি করতে এবং ভাল ফলন অর্জন করতে সাহায্য করে।\n\nবিলিভার্স ক্রপ কেয়ার লিমিটেডে, আমরা শুধু একটি ফসল সুরক্ষা কোম্পানি নই — আমরা অগ্রগতির অংশীদার। ধারাবাহিক গবেষণা, উদ্ভাবন এবং গুণমানের প্রতি প্রতিশ্রুতির সাথে, আমরা দেশজুড়ে কৃষি সম্প্রদায়ের জন্য একটি উজ্জ্বল, সবুজ ভবিষ্যত তৈরি করার লক্ষ্য রাখি।',
      visionButton: 'ভিশন',
      missionButton: 'মিশন',
      vision: {
        title: 'আমাদের ভিশন',
        content: 'আমাদের ভিশন হল নিরাপদ, কার্যকর এবং উদ্ভাবনী কৃষি সমাধানের মাধ্যমে কৃষকদের ক্ষমতায়ন করে টেকসই ফসল সুরক্ষায় একটি বিশ্বস্ত নাম হওয়া। আমরা উৎপাদনশীলতা বাড়ানোর সাথে সাথে পরিবেশগত ভারসাম্য বজায় রাখার চেষ্টা করি — এমন বৃদ্ধি নিশ্চিত করা যা কৃষক এবং গ্রহ উভয়েরই উপকার করে।\n\nআমরা এমন একটি ভবিষ্যত গড়ে তুলতে চাই যেখানে প্রতিটি কৃষকের কাছে মানসম্পন্ন ফসল যত্ন পণ্য, আধুনিক কৃষি জ্ঞান এবং সমৃদ্ধ কৃষি সম্প্রদায়ের জন্য দীর্ঘমেয়াদী সহায়তা রয়েছে।'
      },
      mission: {
        title: 'আমাদের মিশন',
        content: 'বিলিভার্স ক্রপ কেয়ার লিমিটেডে আমাদের মিশন হল উদ্ভাবনী, নির্ভরযোগ্য এবং টেকসই ফসল সুরক্ষা সমাধানের মাধ্যমে কৃষকদের ক্ষমতায়ন করা যা উৎপাদনশীলতা বাড়ায় এবং পরিবেশ রক্ষা করে। আমরা এমন পণ্য সরবরাহ করার চেষ্টা করি যা নিরাপদ এবং দায়িত্বশীল অনুশীলনের মাধ্যমে কৃষকদের ভাল ফলন অর্জনে সাহায্য করে, পাশাপাশি বিশ্বাস, গুণমান এবং পরিষেবা উৎকর্ষের উপর ভিত্তি করে দীর্ঘমেয়াদী সম্পর্ক গড়ে তোলে।\n\nআমরা ধারাবাহিক গবেষণা, পণ্য উন্নয়ন এবং কৃষক শিক্ষার প্রতি প্রতিশ্রুতিবদ্ধ — নিশ্চিত করা যে আমরা যে প্রতিটি ক্ষেত্রের সেবা করি তা আগামী প্রজন্মের জন্য শক্তিশালী, স্বাস্থ্যকর এবং আরও উৎপাদনশীল হয়ে ওঠে।'
      }
    },
    review: {
      rating: '৪.৯',
      customersReview: '১২০০+ গ্রাহক পর্যালোচনা',
      ratings: '৫.২K রেটিং',
      reviews: '১৮ পর্যালোচনা'
    },
    whyChooseUs: {
      tagline: 'কেন আমাদের বেছে নেবেন',
      title: 'কেন বেছে নেবেন বিলিভার্স ক্রপ কেয়ার লিমিটেড',
      features: [
        {
          title: 'মানসম্পন্ন পণ্য',
          description: 'আমরা উচ্চমানের, কার্যকর ফসল সুরক্ষা পণ্য সরবরাহ করি যা কৃষকরা বিশ্বাস করতে পারে এবং ভাল ফলনের জন্য নির্ভর করতে পারে।'
        },
        {
          title: 'সাশ্রয়ী সমাধান',
          description: 'আমাদের পণ্যগুলি মানের সাথে আপোস না করে সাশ্রয়ী হওয়ার জন্য ডিজাইন করা হয়েছে, যা সমস্ত কৃষকের কাছে সহজলভ্য করে তোলে।'
        },
        {
          title: 'বিশেষজ্ঞ সহায়তা',
          description: 'আমরা কৃষক, ডিলার এবং ডিস্ট্রিবিউটরদের সাথে ঘনিষ্ঠভাবে কাজ করি যাতে সময়মতো সমাধান এবং বিশেষজ্ঞ নির্দেশনা প্রদান করতে পারি।'
        },
        {
          title: 'পরিবেশগত দায়িত্ব',
          description: 'আমাদের পণ্যগুলি টেকসই কৃষির জন্য কর্মক্ষমতা, নিরাপত্তা এবং পরিবেশগত দায়িত্বের উপর ফোকাস করে।'
        },
        {
          title: 'বর্ধনশীল নেটওয়ার্ক',
          description: 'আমাদের অংশীদার এবং ডিস্ট্রিবিউটরদের প্রসারিত নেটওয়ার্ক নিশ্চিত করে যে আমরা প্রতিদিন আরও বেশি কৃষকের কাছে পৌঁছাতে পারি।'
        },
        {
          title: 'ধারাবাহিক উদ্ভাবন',
          description: 'ধারাবাহিক গবেষণা এবং উদ্ভাবনের মাধ্যমে, আমরা কৃষি সম্প্রদায়ের জন্য সেরা সমাধান প্রদানে এগিয়ে থাকি।'
        }
      ]
    },
    team: {
      tagline: 'আমাদের দল',
      title: 'বিলিভার্স ক্রপ কেয়ারের পেছনের মানুষ',
      description: 'এগ্রোনমি, উদ্ভাবন এবং সেবা বিশেষজ্ঞদের সমন্বয়ে গঠিত একটি নেতৃত্বদানকারী দল যারা নিশ্চিত করে যে কৃষকরা সবসময় বিশ্বস্ত সহায়তা পান।',
      groups: [
        { key: 'chairman', title: 'চেয়ারম্যান' },
        { key: 'board', title: 'পরিচালনা পর্ষদ' },
        { key: 'management', title: 'ব্যবস্থাপনা দল' }
      ],
      followCta: 'ফলো করুন',
      stats: {
        network: 'অংশীদার',
        projects: 'মাঠ সফর'
      },
      members: [
        {
          name: 'আব্দুল লতিফ',
          role: 'চেয়ারম্যান',
          expertise: 'সারা দেশে টেকসই কৃষি ব্যবসার প্রবৃদ্ধির জন্য কৌশলগত ভিশন ও তত্ত্বাবধান দেন।',
          photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
          group: 'chairman',
          stats: {
            network: '৩১২',
            projects: '৪৮'
          }
        },
        {
          name: 'মো. আলিফ আহমেদ',
          role: 'ম্যানেজিং ডিরেক্টর',
          expertise: '১৭+ বছরের কৃষি বিতরণ এবং টেকসই সাপ্লাই চেইন পরিচালনার অভিজ্ঞতা।',
          photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
          group: 'board',
          stats: {
            network: '৪২০',
            projects: '৬৩'
          }
        },
        {
          name: 'মো. আরাফাত আহমেদ',
          role: 'ডিরেক্টর',
          expertise: 'সারা দেশে ডিলার অংশীদারিত্ব ও কৃষক সেবা প্রোগ্রাম গড়ে তোলেন।',
          photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
          group: 'board',
          stats: {
            network: '২৮৫',
            projects: '৩৭'
          }
        },
        {
          name: 'ডা. নুসরাত রহমান',
          role: 'হেড অব সেলস',
          expertise: 'বিভাগীয় সেলস টিম ও মাঠ পর্যায়ের কার্যক্রম তদারকি করে কৃষকদের সার্বক্ষণিক সহায়তা নিশ্চিত করেন।',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '১৯৮',
            projects: '৫৪'
          }
        },
        {
          name: 'তানভীর আহমেদ',
          role: 'হেড অব অপারেশনস',
          expertise: 'গুদাম, লজিস্টিকস ও ডিলার ডেলিভারির ধারাবাহিকতা নিশ্চিত করেন।',
          photo: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '১৭৬',
            projects: '৪১'
          }
        },
        {
          name: 'ফারিহা ইসলাম',
          role: 'হেড অব সাপ্লাই চেইন',
          expertise: 'ক্রয়, কোয়ালিটি কন্ট্রোল ও চাহিদা পূর্বাভাস সমন্বয় করেন।',
          photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '২০৪',
            projects: '৪৭'
          }
        },
        {
          name: 'রেজাউল করিম',
          role: 'হেড অব আগ্রোনমি সাপোর্ট',
          expertise: 'ডেমো প্লট, কৃষক প্রশিক্ষণ ও পরামর্শ সেবা সমন্বয় করেন।',
          photo: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80',
          group: 'management',
          stats: {
            network: '১৯৮',
            projects: '৫৮'
          }
        }
      ]
    },
    testimonials: {
      tagline: 'কৃষকের অভিজ্ঞতা',
      title: 'দেশজুড়ে কৃষকের আস্থার নাম',
      cards: [
        {
          quote: 'বিলিভার্স ক্রপ কেয়ার সময়মতো পণ্য দেয় এবং তাদের এগ্রোনমিস্টরা সবসময় ফোন ধরে। উপকূলীয় মরিচ ক্ষেত সারা মৌসুমে সুরক্ষিত থাকে।',
          name: 'মো. রফিক হাসান',
          role: 'মরিচ চাষি, খুলনা',
          photo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80'
        },
        {
          quote: 'আমরা ১৮টি ডেমো প্লট চালাই এবং মাঠের প্রতিক্রিয়া খুব দ্রুত পাই। ডিলাররা ব্র্যান্ডে আস্থা রাখে কারণ কৃষকরা ভাল ফলনের গল্প শেয়ার করে।',
          name: 'শাকিলা সুলতানা',
          role: 'লিড ডিলার, রাজশাহী',
          photo: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80'
        },
        {
          quote: 'বর্ষাতেও তাদের সরবরাহ চেইন নির্ভরযোগ্য। হার্বিসাইড প্রো দুই সপ্তাহে ৪০ একর জমি আগাছা মুক্ত করেছে।',
          name: 'আবদুল মতিন',
          role: 'ধান সমবায়, সিলেট',
          photo: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    blog: {
      tagline: 'সর্বশেষ ব্লগ',
      title: 'মাঠের অভিজ্ঞতা ও কৃষি সাফল্যের গল্প',
      cta: 'আরও ব্লগ',
      readMore: 'আরও পড়ুন',
      featured: [
        {
          category: 'কৃষি',
          title: 'সর্বোচ্চ ফলনের জন্য বিশেষজ্ঞ পরামর্শ',
          author: 'এলান জন',
          date: '২৯ এপ্রিল, ২০২৪',
          excerpt: 'সেচ, পুষ্টি ও পোকা দমনের কার্যকর কৌশলে পুরো মৌসুমে ফসল সুস্থ রাখুন।',
          image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'
        },
        {
          category: 'ফার্মিং',
          title: 'টেকসই কৃষির চর্চা ও উপকারিতা',
          author: 'ম্যাক্স উইলস',
          date: '২৯ এপ্রিল, ২০২৪',
          excerpt: 'রিজেনারেটিভ পদ্ধতি কীভাবে মাটির স্বাস্থ্য বাড়ায় ও খরচ কমায় জেনে নিন।',
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
        }
      ],
      list: [
        {
          category: 'টেকসই',
          title: 'পোকা দমনে সহকারী গাছ ব্যবহারের উপায়',
          author: 'ম্যাক্স উইলস',
          date: '২৯ এপ্রিল, ২০২৪',
          image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
        },
        {
          category: 'পশুপালন',
          title: 'পশু স্বাস্থ্যের অপরিহার্য নির্দেশিকা',
          author: 'স্যাম আন্দ্রে',
          date: '২৯ এপ্রিল, ২০২৪',
          image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80'
        },
        {
          category: 'ফসল পরিচর্যা',
          title: 'সহজে স্থিতিশীল ফসল ক্যালেন্ডার তৈরির টিপস',
          author: 'এলান জন',
          date: '২৯ এপ্রিল, ২০২৪',
          image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    contact: {
      tagline: 'যোগাযোগ করুন',
      title: 'ফসল সুরক্ষা নিয়ে আমাদের সাথে কথা বলুন',
      description: 'ডিলার অর্ডার, মাঠ সহায়তা বা এগ্রোনমি প্রশ্নে আমাদের সাপোর্ট ডেস্কে যোগাযোগ করুন। এক কর্মদিবসের মধ্যে সাড়া পাবেন।',
      phoneLabel: 'কল করুন',
      phone: '+৮৮০ ৭১১২২৩৩৪৪',
      emailLabel: 'ইমেইল করুন',
      email: 'info@bccl.com',
      addressLabel: 'অফিস ঠিকানা',
      address: 'চকভেলি, রানীরহাট, বগুড়া',
      cta: 'বার্তা পাঠান',
      form: {
        nameLabel: 'নাম',
        namePlaceholder: 'আপনার পূর্ণ নাম',
        phoneLabel: 'ফোন',
        phonePlaceholder: '+৮৮০ ১XXX-XXXXXX',
        emailLabel: 'ইমেইল',
        emailPlaceholder: 'আপনার@ইমেইল.কম',
        districtLabel: 'জেলা',
        districtPlaceholder: 'আপনার জেলা',
        messageLabel: 'আমরা কীভাবে সাহায্য করতে পারি?',
        messagePlaceholder: 'আপনার প্রয়োজনীয়তা বর্ণনা করুন'
      }
    },
    products: {
      tagline: 'আমাদের পণ্য',
      title: 'মানসম্পন্ন ফসল সুরক্ষা সমাধান',
      description: 'কৃষকদের ভাল ফলন অর্জনে সাহায্য করার জন্য ডিজাইন করা কার্যকর এবং নির্ভরযোগ্য ফসল সুরক্ষা পণ্যের আমাদের পরিসর আবিষ্কার করুন।',
      learnMore: 'আরও জানুন',
      seeAll: 'সব পণ্য দেখুন',
      items: [
        {
          name: 'হার্বিসাইড প্রো',
          genericName: 'গ্লাইফোসেট ৪১% এসএল',
          description: 'সর্বোচ্চ ফসল সুরক্ষা এবং ফলন উন্নতির জন্য উন্নত আগাছা নিয়ন্ত্রণ সমাধান।',
          category: 'হার্বিসাইড',
          usage: 'বিভিন্ন ফসল যেমন ধান, গম এবং শাকসবজিতে চওড়া পাতার আগাছা এবং ঘাস নিয়ন্ত্রণের জন্য কার্যকর।'
        },
        {
          name: 'ফাঙ্গিসাইড শিল্ড',
          genericName: 'ম্যানকোজেব ৭৫% ডব্লিউপি',
          description: 'আপনার ফসলকে সুস্থ এবং উৎপাদনশীল রাখার জন্য ব্যাপক ছত্রাক রোগ সুরক্ষা।',
          category: 'ফাঙ্গিসাইড',
          usage: 'টমেটো, আলু এবং অন্যান্য শাকসবজিতে ব্লাইট, পাতার দাগ এবং মরিচা জাতীয় ছত্রাক রোগ প্রতিরোধ ও নিয়ন্ত্রণ করে।'
        },
        {
          name: 'ইনসেক্টিসাইড গার্ড',
          genericName: 'ক্লোরপাইরিফস ২০% ইসি',
          description: 'ক্ষতিকারক পোকামাকড় থেকে আপনার ফসল রক্ষা করার জন্য কার্যকর কীটপতঙ্গ নিয়ন্ত্রণ সমাধান।',
          category: 'ইনসেক্টিসাইড',
          usage: 'ধান, তুলা এবং শাকসবজি ফসলে এফিড, থ্রিপস এবং শুঁয়োপোকা সহ বিভিন্ন পোকামাকড় নিয়ন্ত্রণ করে।'
        },
        {
          name: 'গ্রোথ এনহ্যান্সার',
          genericName: 'জিবেরেলিক অ্যাসিড ০.১৮৬%',
          description: 'ফসলের বিকাশ বৃদ্ধি এবং সামগ্রিক ফলন উন্নত করার জন্য প্রাকৃতিক বৃদ্ধি উদ্দীপক।',
          category: 'গ্রোথ প্রমোটার',
          usage: 'ফল, শাকসবজি এবং সাজসজ্জার উদ্ভিদে উদ্ভিদের বৃদ্ধি বৃদ্ধি করে, ফলনের আকার বাড়ায় এবং ফুল ফোটায় উন্নতি করে।'
        },
        {
          name: 'ফার্টিলাইজার প্লাস',
          genericName: 'এনপিকে ১৯:১৯:১৯',
          description: 'সর্বোত্তম উদ্ভিদ পুষ্টি এবং মাটি স্বাস্থ্যের জন্য পুষ্টি-সমৃদ্ধ সার মিশ্রণ।',
          category: 'সার',
          usage: 'ফসলের বৃদ্ধির সব পর্যায়ে সুষম পুষ্টি প্রদান করে, ধান, গম, শাকসবজি এবং ফল গাছের জন্য উপযুক্ত।'
        },
        {
          name: 'অর্গানিক প্রোটেক্ট',
          genericName: 'নিম তেল ০.০৩% ইসি',
          description: 'টেকসই এবং নিরাপদ ফসল সুরক্ষার জন্য পরিবেশ-বান্ধব জৈব সমাধান।',
          category: 'জৈব',
          usage: 'জৈব চাষের জন্য প্রাকৃতিক পোকামাকড় ও রোগ নিয়ন্ত্রণ, শাকসবজি, ফল এবং সাজসজ্জার উদ্ভিদের জন্য নিরাপদ।'
        },
        {
          name: 'উইড মাস্টার',
          genericName: '২,৪-ডি অ্যামাইন ৫৮% এসএল',
          description: 'ক্ষেতের ফসলে কার্যকর চওড়া পাতার আগাছা ব্যবস্থাপনার জন্য শক্তিশালী নির্বাচনী হার্বিসাইড।',
          category: 'হার্বিসাইড',
          usage: 'ধান, গম, ভুট্টা এবং আখ ক্ষেতে মূল ফসলের ক্ষতি না করে চওড়া পাতার আগাছা নিয়ন্ত্রণের জন্য আদর্শ।'
        },
        {
          name: 'ডিজিজ ফাইটার',
          genericName: 'কারবেন্ডাজিম ৫০% ডব্লিউপি',
          description: 'বিভিন্ন উদ্ভিদ রোগের বিরুদ্ধে দীর্ঘস্থায়ী সুরক্ষা প্রদানকারী সিস্টেমিক ফাঙ্গিসাইড।',
          category: 'ফাঙ্গিসাইড',
          usage: 'শাকসবজি, ফল এবং ক্ষেতের ফসলে পাউডারি মিলডিউ, পাতার দাগ এবং অন্যান্য ছত্রাক রোগ নিয়ন্ত্রণ করে।'
        },
        {
          name: 'পেস্ট এলিমিনেটর',
          genericName: 'ইমিডাক্লোপ্রিড ১৭.৮% এসএল',
          description: 'ব্যাপক পোকামাকড় নিয়ন্ত্রণ এবং উদ্ভিদ সুরক্ষার জন্য উন্নত সিস্টেমিক ইনসেক্টিসাইড।',
          category: 'ইনসেক্টিসাইড',
          usage: 'শাকসবজি, তুলা এবং ধানে এফিড, হোয়াইটফ্লাই এবং থ্রিপসের মতো চোষা পোকামাকড়ের বিরুদ্ধে কার্যকর।'
        },
        {
          name: 'রুট বুস্টার',
          genericName: 'অক্সিন ০.১% এসএল',
          description: 'উন্নত মূল বিকাশ এবং উদ্ভিদ প্রতিষ্ঠার জন্য বিশেষায়িত বৃদ্ধি উদ্দীপক।',
          category: 'গ্রোথ প্রমোটার',
          usage: 'সব ফসলে শক্তিশালী মূল ব্যবস্থা প্রচার করে, পুষ্টি গ্রহণ উন্নত করে এবং সামগ্রিক উদ্ভিদ শক্তি বৃদ্ধি করে।'
        },
        {
          name: 'মাইক্রো নিউট্রিয়েন্ট মিক্স',
          genericName: 'জিঙ্ক + বোরন + আয়রন ১২%',
          description: 'পুষ্টির ঘাটতি মোকাবেলা এবং ফসলের গুণমান উন্নত করার জন্য অপরিহার্য মাইক্রোনিউট্রিয়েন্ট মিশ্রণ।',
          category: 'সার',
          usage: 'ধান, গম, শাকসবজি এবং ফল ফসলে জিঙ্ক, বোরন এবং আয়রনের ঘাটতি সংশোধন করে ভাল ফলনের জন্য।'
        }
      ],
      addToCart: 'কার্টে যোগ করুন',
      details: 'বিস্তারিত'
    },
    areasCovered: {
      tagline: 'আমাদের সেবার এলাকা',
      title: 'বাংলাদেশ জুড়ে আমাদের সেবা কভারেজ',
      description: 'আমরা বাংলাদেশের বিভিন্ন অঞ্চলে কৃষকদের সেবা করতে গর্বিত, সারা দেশে কৃষি সম্প্রদায়ের কাছে মানসম্পন্ন ফসল সুরক্ষা সমাধান নিয়ে আসছি।',
      pill: 'কভারেজের সারসংক্ষেপ',
      mapAlt: 'বাংলাদেশের মানচিত্রে বিলিভার্স ক্রপ কেয়ারের সেবার কভারেজ দেখানো হয়েছে',
      briefTitle: 'প্রতিটি বিভাগে আমাদের উপস্থিতি',
      briefIntro: 'আমাদের এগ্রোনমি নেটওয়ার্ক প্রতিটি বিভাগে কৃষকদের দ্রুত ডেলিভারি, মাঠ পর্যায়ের দিকনির্দেশনা এবং বিক্রয়োত্তর সহায়তা নিশ্চিত করে।',
      briefPoints: [
        '৬৪ জেলায় ৩২+ ডিস্ট্রিবিউশন হাব',
        'প্রতিটি বিভাগে ফিল্ড অফিসার ও ডেমো প্লট',
        '২৪/৭ কৃষক হেল্পলাইন জরুরি নির্দেশনার জন্য'
      ]
    },
    footer: {
      copyright: '© ২০২৪ বিলিভার্স ক্রপ কেয়ার লিমিটেড। সর্বস্বত্ব সংরক্ষিত। আলিশা আইটি সলিউশন দ্বারা উন্নয়নকৃত।',
      tagline: 'ফসল ফলনে নেইকো ভীতি, এই আমাদের প্রতিশ্রুতি '
    }
  }
}

function HomePage({ language, toggleLanguage, t, heroImage = '/hero-image.jpg' }) {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantities, setQuantities] = useState({}) // Store quantities for each product
  const [isMobile, setIsMobile] = useState(false) // Track if in mobile/responsive mode
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0) // Testimonial slider index
  const [contentUpdate, setContentUpdate] = useState(0) // For reactive hero media updates
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0) // For hero image slider
  const productsSliderRef = useRef(null)

  // Get hero media from localStorage (reactive)
  const heroMedia = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    const pageImages = pageImagesStr ? JSON.parse(pageImagesStr) : {}
    const mediaType = pageImages.homeHeroMediaType || 'photos'
    return {
      images: pageImages.homeHeroImages || [heroImage],
      video: pageImages.homeHeroVideo || '',
      mediaType: mediaType
    }
  }, [contentUpdate, heroImage])

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

  // Reset hero image index when images change
  useEffect(() => {
    setCurrentHeroImageIndex(0)
  }, [heroMedia.images.length, heroMedia.mediaType])

  // Preload hero images for smoother transitions
  useEffect(() => {
    if (heroMedia.mediaType === 'video') return

    heroMedia.images.forEach((imageUrl) => {
      const img = new Image()
      img.src = imageUrl
    })
  }, [heroMedia.images, heroMedia.mediaType])

  // Auto-advance hero images every 10 seconds (only if photos mode and multiple images)
  useEffect(() => {
    if (heroMedia.mediaType === 'video' || heroMedia.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) =>
        prev === heroMedia.images.length - 1 ? 0 : prev + 1
      )
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [heroMedia.mediaType, heroMedia.images.length])
  // Only show first 5 products + see all button
  const displayedProducts = t.products.items.slice(0, 5)

  // Calculate max slides based on mode
  const maxSlides = isMobile
    ? displayedProducts.length  // One product per slide in mobile (5 products + 1 see all = 6 slides, index 0-5)
    : Math.max(0, displayedProducts.length - 3)  // One product per slide in desktop, but show 3 at once

  const handleNextSlide = () => {
    if (currentSlide === maxSlides) {
      // At the end, navigate to product page
      navigate('/product')
      return
    }
    setCurrentSlide((prev) => (prev < maxSlides ? prev + 1 : 0))
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : maxSlides))
  }

  const isAtEnd = currentSlide === maxSlides

  // Touch swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextSlide()
    }
    if (isRightSwipe) {
      handlePrevSlide()
    }
  }

  // No need to group products - each product is its own slide in desktop

  const handleQuantityChange = (productIndex, change) => {
    setQuantities(prev => {
      const current = prev[productIndex] || 1
      const newQuantity = Math.max(1, current + change)
      return { ...prev, [productIndex]: newQuantity }
    })
  }

  const getQuantity = (productIndex) => {
    return quantities[productIndex] || 1
  }

  const getInitials = (name = '') => {
    const parts = name.split(' ').filter(Boolean)
    if (!parts.length) return ''
    return parts.map(part => part[0]).join('').slice(0, 2)
  }

  // Detect mobile/responsive mode
  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile
      const nowMobile = window.innerWidth <= 768
      setIsMobile(nowMobile)
      // Reset slide when switching between mobile and desktop
      if (wasMobile !== nowMobile) {
        setCurrentSlide(0)
        setCurrentTestimonialIndex(0)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  // Reset slide when language changes
  useEffect(() => {
    setCurrentSlide(0)
    setCurrentTestimonialIndex(0)
  }, [language])

  // Auto-advance testimonials in responsive mode (every 5 seconds)
  useEffect(() => {
    if (!isMobile || !t.testimonials?.cards?.length) return

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) =>
        prev === t.testimonials.cards.length - 1 ? 0 : prev + 1
      )
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [isMobile, t.testimonials?.cards?.length])

  useEffect(() => {
    const sections = document.querySelectorAll('.fade-section')
    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            entry.target.classList.remove('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />

      {/* Hero Section */}
      <main className="hero-section fade-section">
        <div className="hero-background">
          {heroMedia.mediaType === 'video' && heroMedia.video ? (
            <video
              src={heroMedia.video}
              autoPlay
              loop
              muted
              playsInline
              className="hero-background-video"
            />
          ) : (
            heroMedia.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Hero slide ${index + 1}`}
                className="hero-background-image"
                style={{
                  opacity: index === currentHeroImageIndex ? 1 : 0,
                  zIndex: index === currentHeroImageIndex ? 1 : 0
                }}
              />
            ))
          )}
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">{t.hero.title}</h1>
            <p className="hero-description">
              {t.hero.description}
            </p>
            <div className="hero-actions-wrapper">
              <button
                className="learn-more-btn"
                onClick={() => {
                  const productsSection = document.getElementById('products-section')
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                {t.hero.viewProducts}
              </button>
            </div>
          </div>

          <div className="hero-right">
            {/* Customer Review Section */}
            <div className="review-box">
              <div className="review-rating">
                <span className="rating-number">{t.review.rating}</span>
                <div className="rating-stars">
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star half">★</span>
                </div>
              </div>
              <p className="review-count">{t.review.customersReview}</p>
              <div className="review-profiles">
                <div className="profile-pic">
                  <img
                    src={t.testimonials.cards[0]?.photo || '/hero-image.jpg'}
                    alt="Reviewer"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/hero-image.jpg' }}
                  />
                </div>
                <div className="profile-pic">
                  <img
                    src={t.testimonials.cards[1]?.photo || '/hero-image.jpg'}
                    alt="Reviewer"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/hero-image.jpg' }}
                  />
                </div>
                <div className="profile-pic">
                  <img
                    src={t.testimonials.cards[2]?.photo || '/hero-image.jpg'}
                    alt="Reviewer"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/hero-image.jpg' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AboutSection t={t} />

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section fade-section">
        <div className="why-choose-us-decorative-leaf">
          <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Monstera Leaf */}
            <path d="M50 50C80 30 120 40 160 70C200 100 220 140 230 180C235 200 235 220 230 240C225 260 215 280 200 300C185 320 165 340 140 360C120 375 100 385 80 390C60 395 40 398 20 400L15 380C30 375 45 370 60 365C75 360 90 355 105 350C120 345 135 340 150 335C165 330 180 325 190 315C200 305 205 290 200 275C195 260 180 250 165 245C150 240 135 240 120 245C105 250 90 260 80 275C70 290 65 310 70 330C75 350 90 365 110 375C130 385 155 390 180 390C205 390 230 380 250 365C270 350 285 330 295 305C300 290 300 275 295 260C290 245 280 230 265 220C250 210 230 205 210 205C190 205 170 210 155 220C140 230 130 245 130 260C130 275 140 285 155 290C170 295 190 295 210 290C230 285 245 275 255 260C265 245 270 225 265 205C260 185 245 170 225 160C205 150 180 145 155 150C130 155 110 170 100 190C90 210 95 235 110 255C125 275 150 285 180 285C210 285 235 270 250 250C265 230 270 205 260 180C250 155 230 135 205 125C180 115 150 120 130 140C110 160 105 190 120 215C135 240 160 255 190 255C220 255 245 240 255 220C265 200 260 175 245 160C230 145 210 140 190 145C170 150 155 165 150 185C145 205 155 225 175 235C195 245 220 245 240 235C260 225 270 205 265 185C260 165 245 150 225 145C205 140 185 145 170 155C155 165 145 180 145 195C145 210 155 220 170 225C185 230 205 230 220 225C235 220 245 210 250 195C255 180 250 165 240 155C230 145 215 140 200 140C185 140 170 145 160 155C150 165 145 180 150 195C155 210 170 220 190 220C210 220 225 210 230 195C235 180 230 165 220 160C210 155 195 155 185 165C175 175 175 190 185 200C195 210 210 210 225 205C240 200 250 190 250 175C250 160 240 150 225 150C210 150 200 160 200 175C200 190 210 200 225 200C240 200 250 190 250 175L50 50Z" fill="#22c55e" opacity="0.12" />
            {/* Leaf Fenestrations (holes) */}
            <ellipse cx="180" cy="200" rx="25" ry="35" fill="#f9fafb" />
            <ellipse cx="220" cy="250" rx="20" ry="30" fill="#f9fafb" />
            <ellipse cx="200" cy="300" rx="18" ry="25" fill="#f9fafb" />
            <ellipse cx="160" cy="280" rx="15" ry="20" fill="#f9fafb" />
            <ellipse cx="140" cy="240" rx="12" ry="18" fill="#f9fafb" />
            {/* Leaf outline */}
            <path d="M50 50C80 30 120 40 160 70C200 100 220 140 230 180C235 200 235 220 230 240C225 260 215 280 200 300C185 320 165 340 140 360C120 375 100 385 80 390C60 395 40 398 20 400" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none" />
            <path d="M20 400L15 380C30 375 45 370 60 365C75 360 90 355 105 350C120 345 135 340 150 335C165 330 180 325 190 315C200 305 205 290 200 275" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none" />
          </svg>
        </div>
        <div className="why-choose-us-container">
          <div className="why-choose-us-header">
            <p className="why-choose-us-tagline">{t.whyChooseUs.tagline}</p>
            <h2 className="why-choose-us-title">{t.whyChooseUs.title}</h2>
          </div>
          <div className="why-choose-us-grid">
            {t.whyChooseUs.features.map((feature, index) => (
              <div key={index} className="why-choose-us-card">
                <div className="why-choose-us-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {index === 0 && (
                      <path d="M6 14l3 3 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    {index === 1 && (
                      <>
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                        <path d="M4 18c0-2.8 3.1-5 7-5s7 2.2 7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <path d="M4 14c3-4 6-4 9 0s6 4 9 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="2" />
                      </>
                    )}
                    {index === 4 && (
                      <>
                        <path d="M6 19V7l6-3 6 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 10l6 3 6-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    )}
                    {index === 5 && (
                      <>
                        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    )}
                    {index > 5 && (
                      <path d="M12 3l1.9 3.86 4.26.62-3.08 3 0.73 4.25L12 13.77 8.19 15.73l0.73-4.25-3.08-3 4.26-.62L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </div>
                <h3 className="why-choose-us-card-title">{feature.title}</h3>
                <p className="why-choose-us-card-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="products-section fade-section">
        <div className="products-container">
          <div className="products-header">
            <p className="products-tagline">{t.products.tagline}</p>
            <h2 className="products-title">{t.products.title}</h2>
            <p className="products-description">{t.products.description}</p>
          </div>
          <div className="products-slider-wrapper">
            <button className="slider-btn slider-btn-prev" onClick={handlePrevSlide} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="products-slider-container">
              <div
                ref={productsSliderRef}
                className="products-slider"
                style={{ transform: isMobile ? `translateX(-${currentSlide * 100}%)` : `translateX(-${currentSlide * (100 / 3)}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {isMobile ? (
                  // Mobile: Show one product per slide (first 5 products + see all button)
                  <>
                    {displayedProducts.map((product, productIndex) => {
                      const quantity = getQuantity(productIndex)
                      return (
                        <div key={productIndex} className="product-slide-group">
                          <div className="product-slide">
                            <div className="product-card">
                              <div className="product-image-wrapper">
                                <div className="product-image">
                                  <img
                                    src="/product-bottle.png"
                                    alt={product.name}
                                    onError={(e) => {
                                      console.error('Product image failed to load:', e.target.src);
                                      e.target.src = '/hero-image.jpg'; // Fallback
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="product-content">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-generic-name">{product.genericName}</p>
                                <p className="product-category-text">{product.category}</p>
                                <p className="product-usage">{product.usage}</p>
                                {isMobile && (
                                  <p className="product-swipe-note">
                                    {language === 'en' ? '← Swipe to see more products →' : '← আরও পণ্য দেখতে সোয়াইপ করুন →'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {/* See All Products Button as 6th item */}
                    <div className="product-slide-group">
                      <div className="product-slide">
                        <div className="product-card product-see-all-card">
                          <div className="product-see-all-content">
                            <button
                              className="products-see-all-btn"
                              onClick={() => navigate('/product')}
                            >
                              {t.products.seeAll}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Desktop: Show each product as its own slide, but display 3 at once
                  <>
                    {displayedProducts.map((product, productIndex) => {
                      const quantity = getQuantity(productIndex)
                      return (
                        <div key={productIndex} className="product-slide-group">
                          <div className="product-slide">
                            <div className="product-card">
                              <div className="product-image-wrapper">
                                <div className="product-image">
                                  <img
                                    src="/product-bottle.png"
                                    alt={product.name}
                                    onError={(e) => {
                                      console.error('Product image failed to load:', e.target.src);
                                      e.target.src = '/hero-image.jpg'; // Fallback
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="product-content">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-generic-name">{product.genericName}</p>
                                <p className="product-category-text">{product.category}</p>
                                <p className="product-usage">{product.usage}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </div>
            <button
              className={`slider-btn slider-btn-next ${isAtEnd ? 'slider-btn-see-all' : ''}`}
              onClick={handleNextSlide}
              aria-label={isAtEnd ? 'See All Products' : 'Next'}
            >
              {isAtEnd ? (
                <span className="slider-btn-see-all-text">{t.products.seeAll}</span>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Areas Covered Section */}
      <section className="areas-covered-section fade-section">
        <div className="areas-covered-container">
          <div className="areas-covered-header">
            <p className="areas-covered-tagline">{t.areasCovered.tagline}</p>
            <h2 className="areas-covered-title">{t.areasCovered.title}</h2>
          </div>
          <div className="areas-covered-content">
            <div className="areas-covered-map-column">
              <div className="bangladesh-map-wrapper">
                <div className="bangladesh-map-3d">
                  <img
                    src="/bangladesh.svg"
                    alt={t.areasCovered.mapAlt}
                    className="bangladesh-map-svg"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-dot"></div>
                  <span>{language === 'en' ? 'Service Areas' : 'সেবার এলাকা'}</span>
                </div>
              </div>
              <p className="areas-covered-map-note">{t.areasCovered.mapAlt}</p>
            </div>
            <div className="areas-covered-brief">
              <span className="areas-covered-pill">{t.areasCovered.pill}</span>
              <h3>{t.areasCovered.briefTitle}</h3>
              <p>{t.areasCovered.briefIntro}</p>
              <div className="areas-covered-highlight-grid">
                {t.areasCovered.briefPoints.map((point, index) => (
                  <div key={index} className="areas-covered-highlight">
                    <span className="highlight-icon" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="2" />
                        <path d="M6 10.2l2.2 2.2L14 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection t={t} language={language} showManagement={false} />

      {/* Testimonials Section */}
      <section className="testimonial-section fade-section">
        <div className="testimonial-container">
          <div className="testimonial-header">
            <p className="testimonial-tagline">{t.testimonials.tagline}</p>
            <h2 className="testimonial-title">{t.testimonials.title}</h2>
          </div>
          <div className={`testimonial-grid ${isMobile ? 'testimonial-slider' : ''}`}>
            {t.testimonials.cards.map((card, index) => (
              <div
                key={index}
                className={`testimonial-card ${isMobile && index !== currentTestimonialIndex ? 'testimonial-card-hidden' : ''}`}
                style={{ backgroundImage: `url(${card.photo})` }}
              >
                <div className="testimonial-card-overlay"></div>
                <div className="testimonial-card-content">
                  <div className="testimonial-quote-icon" aria-hidden="true">"</div>
                  <p className="testimonial-quote">"{card.quote}"</p>
                  <div className="testimonial-footer">
                    <div className="testimonial-avatar">
                      <img
                        src={card.photo}
                        alt={card.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = '/hero-image.jpg' }}
                      />
                    </div>
                    <div>
                      <p className="testimonial-name">{card.name}</p>
                      <p className="testimonial-role">{card.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section fade-section" id="contact">
        <div className="contact-container">
          <div className="contact-content">
            <span className="contact-tagline">{t.contact.tagline}</span>
            <h2 className="contact-title">{t.contact.title}</h2>
            <p className="contact-description">{t.contact.description}</p>
            <div className="contact-info-grid">
              <div className="contact-info-card">
                <div className="contact-info-icon" aria-hidden="true">📞</div>
                <div>
                  <p className="contact-info-label">{t.contact.phoneLabel}</p>
                  <a href={`tel:${t.contact.phone}`} className="contact-info-value">{t.contact.phone}</a>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon" aria-hidden="true">✉️</div>
                <div>
                  <p className="contact-info-label">{t.contact.emailLabel}</p>
                  <a href={`mailto:${t.contact.email}`} className="contact-info-value">{t.contact.email}</a>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon" aria-hidden="true">📍</div>
                <div>
                  <p className="contact-info-label">{t.contact.addressLabel}</p>
                  <p className="contact-info-value">{t.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <label>
                <span>{t.contact.form.nameLabel}</span>
                <input type="text" placeholder={t.contact.form.namePlaceholder} required />
              </label>
              <label>
                <span>{t.contact.form.phoneLabel}</span>
                <input type="tel" placeholder={t.contact.form.phonePlaceholder} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                <span>{t.contact.form.emailLabel}</span>
                <input type="email" placeholder={t.contact.form.emailPlaceholder} required />
              </label>
              <label>
                <span>{t.contact.form.districtLabel}</span>
                <input type="text" placeholder={t.contact.form.districtPlaceholder} />
              </label>
            </div>
            <label>
              <span>{t.contact.form.messageLabel}</span>
              <textarea rows="4" placeholder={t.contact.form.messagePlaceholder} required></textarea>
            </label>
            <button type="submit" className="contact-submit-btn">{t.contact.cta}</button>
          </form>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section fade-section">
        <div className="blog-container">
          <div className="blog-header">
            <div>
              <p className="blog-tagline">{t.blog.tagline}</p>
              <h2 className="blog-title">{t.blog.title}</h2>
            </div>
            <button
              className="blog-cta"
              type="button"
              onClick={() => navigate('/blog')}
            >
              {t.blog.cta}
            </button>
          </div>
          <div className="blog-content">
            <div className="blog-featured-grid">
              {(isMobile ? t.blog.featured.slice(0, 1) : t.blog.featured).map((post, index) => (
                <article key={`featured-${index}`} className="blog-featured-card">
                  <div className="blog-featured-image">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/hero-image.jpg' }}
                    />
                    <span className="blog-category-pill">{post.category}</span>
                  </div>
                  <div className="blog-featured-body">
                    <div className="blog-meta-row">
                      <span className="blog-meta-item">
                        <span aria-hidden="true">👤</span> {post.author}
                      </span>
                      <span className="blog-meta-item">
                        <span aria-hidden="true">📅</span> {post.date}
                      </span>
                    </div>
                    <h3 className="blog-featured-title">{post.title}</h3>
                    <button className="blog-read-more" type="button">
                      {t.blog.readMore}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="blog-list">
              {(isMobile ? t.blog.list.slice(0, 1) : t.blog.list).map((post, index) => (
                <article key={`list-${index}`} className="blog-list-card">
                  <div className="blog-list-thumb">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/hero-image.jpg' }}
                    />
                  </div>
                  <div className="blog-list-body">
                    <span className="blog-list-category">{post.category}</span>
                    <h3 className="blog-list-title">{post.title}</h3>
                    <div className="blog-meta-row">
                      <span className="blog-meta-item">
                        <span aria-hidden="true">👤</span> {post.author}
                      </span>
                      <span className="blog-meta-item">
                        <span aria-hidden="true">📅</span> {post.date}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

function App() {
  const [language, setLanguage] = useState('en')
  const [contentUpdate, setContentUpdate] = useState(0)

  // Get edited content from localStorage
  const editedContent = useMemo(() => {
    try {
      const saved = localStorage.getItem('editedContent')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }, [contentUpdate])

  // Get hero image from localStorage
  const heroImage = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    const pageImages = pageImagesStr ? JSON.parse(pageImagesStr) : {}
    return pageImages.homeHero || localStorage.getItem('heroImage') || '/hero-image.jpg'
  }, [contentUpdate])

  useEffect(() => {
    const handleStorageChange = () => {
      setContentUpdate(prev => prev + 1)
    }
    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event from admin page
    window.addEventListener('contentUpdated', handleStorageChange)

    // Global scroll-based input change prevention
    const handleWheel = (e) => {
      if (document.activeElement &&
        document.activeElement.type === 'number' &&
        e.target === document.activeElement) {
        e.preventDefault()
      }
    }
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contentUpdated', handleStorageChange)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Merge translations with edited content
  const t = useMemo(() => {
    const baseTranslations = translations[language]
    if (!editedContent || Object.keys(editedContent).length === 0) {
      return baseTranslations
    }

    // Deep merge edited content with base translations
    const merged = JSON.parse(JSON.stringify(baseTranslations))

    if (editedContent.hero) {
      if (editedContent.hero.title) merged.hero.title = editedContent.hero.title
      if (editedContent.hero.description) merged.hero.description = editedContent.hero.description
      if (editedContent.hero.viewProducts) merged.hero.viewProducts = editedContent.hero.viewProducts
    }

    if (editedContent.about) {
      if (editedContent.about.heroTitle) merged.about.heroTitle = editedContent.about.heroTitle
      if (editedContent.about.heroSubtitle) merged.about.heroSubtitle = editedContent.about.heroSubtitle
      if (editedContent.about.tagline) merged.about.tagline = editedContent.about.tagline
      if (editedContent.about.description) merged.about.description = editedContent.about.description
      if (editedContent.about.title) merged.about.title = editedContent.about.title
      if (editedContent.about.visionButton) merged.about.visionButton = editedContent.about.visionButton
      if (editedContent.about.missionButton) merged.about.missionButton = editedContent.about.missionButton

      // Handle about details paragraphs
      if (editedContent.about.details && Array.isArray(editedContent.about.details)) {
        const originalDetails = merged.about.details.split('\n\n')
        editedContent.about.details.forEach((para, idx) => {
          if (para && originalDetails[idx] !== undefined) {
            originalDetails[idx] = para
          }
        })
        merged.about.details = originalDetails.join('\n\n')
      }

      if (editedContent.about.vision) {
        if (editedContent.about.vision.title) merged.about.vision.title = editedContent.about.vision.title
        if (editedContent.about.vision.content) {
          merged.about.vision.content = editedContent.about.vision.content
        } else if (editedContent.about.vision.paragraphs && Array.isArray(editedContent.about.vision.paragraphs)) {
          // Reconstruct content from paragraphs
          merged.about.vision.content = editedContent.about.vision.paragraphs.join('\n\n')
        }
      }
      if (editedContent.about.mission) {
        if (editedContent.about.mission.title) merged.about.mission.title = editedContent.about.mission.title
        if (editedContent.about.mission.content) {
          merged.about.mission.content = editedContent.about.mission.content
        } else if (editedContent.about.mission.paragraphs && Array.isArray(editedContent.about.mission.paragraphs)) {
          // Reconstruct content from paragraphs
          merged.about.mission.content = editedContent.about.mission.paragraphs.join('\n\n')
        }
      }
    }

    if (editedContent.review) {
      if (editedContent.review.rating) merged.review.rating = editedContent.review.rating
      if (editedContent.review.customersReview) merged.review.customersReview = editedContent.review.customersReview
    }

    if (editedContent.products) {
      // Products page header content
      if (editedContent.products.pageHeading) {
        // This will be used in Product page
        merged.products.pageHeading = editedContent.products.pageHeading
      }
      if (editedContent.products.pageSubtitle) {
        merged.products.pageSubtitle = editedContent.products.pageSubtitle
      }
      if (editedContent.products.tagline) merged.products.tagline = editedContent.products.tagline
      if (editedContent.products.title) merged.products.title = editedContent.products.title
      if (editedContent.products.description) merged.products.description = editedContent.products.description

      // Product items (array format)
      if (Array.isArray(editedContent.products)) {
        editedContent.products.forEach((product, index) => {
          if (merged.products.items[index]) {
            if (product.name) merged.products.items[index].name = product.name
            if (product.description) merged.products.items[index].description = product.description
          }
        })
      }

      // Product items (object.items format)
      if (editedContent.products.items && Array.isArray(editedContent.products.items)) {
        editedContent.products.items.forEach((product, index) => {
          if (merged.products.items[index]) {
            if (product.name) merged.products.items[index].name = product.name
            if (product.genericName) merged.products.items[index].genericName = product.genericName
            if (product.category) merged.products.items[index].category = product.category
            if (product.description) merged.products.items[index].description = product.description
            if (product.usage) merged.products.items[index].usage = product.usage
          }
        })
      }
    }

    if (editedContent.whyChooseUs) {
      if (editedContent.whyChooseUs.title) merged.whyChooseUs.title = editedContent.whyChooseUs.title
      if (editedContent.whyChooseUs.features && Array.isArray(editedContent.whyChooseUs.features)) {
        editedContent.whyChooseUs.features.forEach((feature, index) => {
          if (merged.whyChooseUs.features[index]) {
            if (feature.title) merged.whyChooseUs.features[index].title = feature.title
            if (feature.description) merged.whyChooseUs.features[index].description = feature.description
          }
        })
      }
    }

    if (editedContent.testimonials) {
      if (editedContent.testimonials.tagline) merged.testimonials.tagline = editedContent.testimonials.tagline
      if (editedContent.testimonials.title) merged.testimonials.title = editedContent.testimonials.title
      if (editedContent.testimonials.cards) {
        editedContent.testimonials.cards.forEach((card, index) => {
          if (merged.testimonials.cards[index]) {
            if (card.quote) merged.testimonials.cards[index].quote = card.quote
            if (card.name) merged.testimonials.cards[index].name = card.name
            if (card.role) merged.testimonials.cards[index].role = card.role
          }
        })
      }
    }

    if (editedContent.blog) {
      if (editedContent.blog.tagline) merged.blog.tagline = editedContent.blog.tagline
      if (editedContent.blog.title) merged.blog.title = editedContent.blog.title
      if (editedContent.blog.cta) merged.blog.cta = editedContent.blog.cta
      if (editedContent.blog.list && Array.isArray(editedContent.blog.list)) {
        editedContent.blog.list.forEach((blog, index) => {
          if (merged.blog.list[index] && blog.title) {
            merged.blog.list[index].title = blog.title
          }
        })
      }
    }

    if (editedContent.contact) {
      if (editedContent.contact.title) merged.contact.title = editedContent.contact.title
      if (editedContent.contact.description) merged.contact.description = editedContent.contact.description
      if (editedContent.contact.phone) merged.contact.phone = editedContent.contact.phone
      if (editedContent.contact.email) merged.contact.email = editedContent.contact.email
      if (editedContent.contact.address) merged.contact.address = editedContent.contact.address
    }

    if (editedContent.areasCovered) {
      if (editedContent.areasCovered.tagline) merged.areasCovered.tagline = editedContent.areasCovered.tagline
      if (editedContent.areasCovered.title) merged.areasCovered.title = editedContent.areasCovered.title
      if (editedContent.areasCovered.pill) merged.areasCovered.pill = editedContent.areasCovered.pill
      if (editedContent.areasCovered.briefTitle) merged.areasCovered.briefTitle = editedContent.areasCovered.briefTitle
      if (editedContent.areasCovered.briefIntro) merged.areasCovered.briefIntro = editedContent.areasCovered.briefIntro
      if (editedContent.areasCovered.mapAlt) merged.areasCovered.mapAlt = editedContent.areasCovered.mapAlt
      if (editedContent.areasCovered.briefPoints && Array.isArray(editedContent.areasCovered.briefPoints)) {
        editedContent.areasCovered.briefPoints.forEach((point, index) => {
          if (point && merged.areasCovered.briefPoints[index] !== undefined) {
            merged.areasCovered.briefPoints[index] = point
          }
        })
      }
    }

    if (editedContent.team) {
      if (editedContent.team.tagline) merged.team.tagline = editedContent.team.tagline
      if (editedContent.team.title) merged.team.title = editedContent.team.title
      if (editedContent.team.description) merged.team.description = editedContent.team.description
    }

    // Note: aboutStats is handled dynamically in About.jsx since it's not in base translations

    if (editedContent.footer) {
      if (editedContent.footer.copyright) merged.footer.copyright = editedContent.footer.copyright
    }

    return merged
  }, [language, editedContent])

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'bn' : 'en'))
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage language={language} toggleLanguage={toggleLanguage} t={t} heroImage={heroImage} />} />
        <Route path="/about" element={<AboutPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/product" element={<ProductPage language={language} toggleLanguage={toggleLanguage} t={t} editedContent={editedContent} />} />
        <Route path="/product/:productIndex" element={<ProductDetails language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/notices" element={<NoticePage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/career" element={<CareerPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/career/:jobId" element={<JobDetailsPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/blog" element={<BlogPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/blog/:postId" element={<BlogDetailsPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/contact" element={<ContactPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
        <Route path="/admin" element={<AdminPage language={language} toggleLanguage={toggleLanguage} t={t} />} />
      </Routes>
    </Router>
  )
}

export default App
