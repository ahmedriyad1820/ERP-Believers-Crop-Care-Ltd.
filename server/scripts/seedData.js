import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import { MONGODB_URI } from '../config/config.js'
import Product from '../models/Product.js'
import Team from '../models/Team.js'
import Testimonial from '../models/Testimonial.js'
import Blog from '../models/Blog.js'
import Notice from '../models/Notice.js'
import Career from '../models/Career.js'

dotenv.config()

// Products data (English and Bengali)
const productsData = [
  {
    name: 'Herbicide Pro',
    nameBn: 'হার্বিসাইড প্রো',
    genericName: 'Glyphosate 41% SL',
    genericNameBn: 'গ্লাইফোসেট ৪১% এসএল',
    description: 'Advanced weed control solution for maximum crop protection and yield improvement.',
    descriptionBn: 'সর্বোচ্চ ফসল সুরক্ষা এবং ফলন উন্নতির জন্য উন্নত আগাছা নিয়ন্ত্রণ সমাধান।',
    category: 'Herbicide',
    categoryBn: 'হার্বিসাইড',
    usage: 'Effective for controlling broadleaf weeds and grasses in various crops including rice, wheat, and vegetables.',
    usageBn: 'বিভিন্ন ফসল যেমন ধান, গম এবং শাকসবজিতে চওড়া পাতার আগাছা এবং ঘাস নিয়ন্ত্রণের জন্য কার্যকর।'
  },
  {
    name: 'Fungicide Shield',
    nameBn: 'ফাঙ্গিসাইড শিল্ড',
    genericName: 'Mancozeb 75% WP',
    genericNameBn: 'ম্যানকোজেব ৭৫% ডব্লিউপি',
    description: 'Comprehensive fungal disease protection to keep your crops healthy and productive.',
    descriptionBn: 'আপনার ফসলকে সুস্থ এবং উৎপাদনশীল রাখার জন্য ব্যাপক ছত্রাক রোগ সুরক্ষা।',
    category: 'Fungicide',
    categoryBn: 'ফাঙ্গিসাইড',
    usage: 'Prevents and controls fungal diseases like blight, leaf spot, and rust in tomatoes, potatoes, and other vegetables.',
    usageBn: 'টমেটো, আলু এবং অন্যান্য শাকসবজিতে ব্লাইট, পাতার দাগ এবং মরিচা জাতীয় ছত্রাক রোগ প্রতিরোধ ও নিয়ন্ত্রণ করে।'
  },
  {
    name: 'Insecticide Guard',
    nameBn: 'ইনসেক্টিসাইড গার্ড',
    genericName: 'Chlorpyrifos 20% EC',
    genericNameBn: 'ক্লোরপাইরিফস ২০% ইসি',
    description: 'Effective pest control solution to protect your crops from harmful insects.',
    descriptionBn: 'ক্ষতিকারক পোকামাকড় থেকে আপনার ফসল রক্ষা করার জন্য কার্যকর কীটপতঙ্গ নিয়ন্ত্রণ সমাধান।',
    category: 'Insecticide',
    categoryBn: 'ইনসেক্টিসাইড',
    usage: 'Controls various pests including aphids, thrips, and caterpillars in rice, cotton, and vegetable crops.',
    usageBn: 'ধান, তুলা এবং শাকসবজি ফসলে এফিড, থ্রিপস এবং শুঁয়োপোকা সহ বিভিন্ন পোকামাকড় নিয়ন্ত্রণ করে।'
  },
  {
    name: 'Growth Enhancer',
    nameBn: 'গ্রোথ এনহ্যান্সার',
    genericName: 'Gibberellic Acid 0.186%',
    genericNameBn: 'জিবেরেলিক অ্যাসিড ০.১৮৬%',
    description: 'Natural growth stimulant to boost crop development and improve overall yield.',
    descriptionBn: 'ফসলের বিকাশ বৃদ্ধি এবং সামগ্রিক ফলন উন্নত করার জন্য প্রাকৃতিক বৃদ্ধি উদ্দীপক।',
    category: 'Growth Promoter',
    categoryBn: 'গ্রোথ প্রমোটার',
    usage: 'Enhances plant growth, increases fruit size, and improves flowering in fruits, vegetables, and ornamental plants.',
    usageBn: 'ফল, শাকসবজি এবং সাজসজ্জার উদ্ভিদে উদ্ভিদের বৃদ্ধি বৃদ্ধি করে, ফলনের আকার বাড়ায় এবং ফুল ফোটায় উন্নতি করে।'
  },
  {
    name: 'Fertilizer Plus',
    nameBn: 'ফার্টিলাইজার প্লাস',
    genericName: 'NPK 19:19:19',
    genericNameBn: 'এনপিকে ১৯:১৯:১৯',
    description: 'Nutrient-rich fertilizer blend for optimal plant nutrition and soil health.',
    descriptionBn: 'সর্বোত্তম উদ্ভিদ পুষ্টি এবং মাটি স্বাস্থ্যের জন্য পুষ্টি-সমৃদ্ধ সার মিশ্রণ।',
    category: 'Fertilizer',
    categoryBn: 'সার',
    usage: 'Provides balanced nutrition for all stages of crop growth, suitable for rice, wheat, vegetables, and fruit trees.',
    usageBn: 'ফসলের বৃদ্ধির সব পর্যায়ে সুষম পুষ্টি প্রদান করে, ধান, গম, শাকসবজি এবং ফল গাছের জন্য উপযুক্ত।'
  },
  {
    name: 'Organic Protect',
    nameBn: 'অর্গানিক প্রোটেক্ট',
    genericName: 'Neem Oil 0.03% EC',
    genericNameBn: 'নিম তেল ০.০৩% ইসি',
    description: 'Eco-friendly organic solution for sustainable and safe crop protection.',
    descriptionBn: 'টেকসই এবং নিরাপদ ফসল সুরক্ষার জন্য পরিবেশ-বান্ধব জৈব সমাধান।',
    category: 'Organic',
    categoryBn: 'জৈব',
    usage: 'Natural pest and disease control for organic farming, safe for vegetables, fruits, and ornamental plants.',
    usageBn: 'জৈব চাষের জন্য প্রাকৃতিক পোকামাকড় ও রোগ নিয়ন্ত্রণ, শাকসবজি, ফল এবং সাজসজ্জার উদ্ভিদের জন্য নিরাপদ।'
  },
  {
    name: 'Weed Master',
    nameBn: 'উইড মাস্টার',
    genericName: '2,4-D Amine 58% SL',
    genericNameBn: '২,৪-ডি অ্যামাইন ৫৮% এসএল',
    description: 'Powerful selective herbicide for effective broadleaf weed management in field crops.',
    descriptionBn: 'ক্ষেতের ফসলে কার্যকর চওড়া পাতার আগাছা ব্যবস্থাপনার জন্য শক্তিশালী নির্বাচনী হার্বিসাইড।',
    category: 'Herbicide',
    categoryBn: 'হার্বিসাইড',
    usage: 'Ideal for controlling broadleaf weeds in rice, wheat, maize, and sugarcane fields without harming the main crop.',
    usageBn: 'ধান, গম, ভুট্টা এবং আখ ক্ষেতে মূল ফসলের ক্ষতি না করে চওড়া পাতার আগাছা নিয়ন্ত্রণের জন্য আদর্শ।'
  },
  {
    name: 'Disease Fighter',
    nameBn: 'ডিজিজ ফাইটার',
    genericName: 'Carbendazim 50% WP',
    genericNameBn: 'কারবেন্ডাজিম ৫০% ডব্লিউপি',
    description: 'Systemic fungicide providing long-lasting protection against various plant diseases.',
    descriptionBn: 'বিভিন্ন উদ্ভিদ রোগের বিরুদ্ধে দীর্ঘস্থায়ী সুরক্ষা প্রদানকারী সিস্টেমিক ফাঙ্গিসাইড।',
    category: 'Fungicide',
    categoryBn: 'ফাঙ্গিসাইড',
    usage: 'Controls powdery mildew, leaf spot, and other fungal diseases in vegetables, fruits, and field crops.',
    usageBn: 'শাকসবজি, ফল এবং ক্ষেতের ফসলে পাউডারি মিলডিউ, পাতার দাগ এবং অন্যান্য ছত্রাক রোগ নিয়ন্ত্রণ করে।'
  },
  {
    name: 'Pest Eliminator',
    nameBn: 'পেস্ট এলিমিনেটর',
    genericName: 'Imidacloprid 17.8% SL',
    genericNameBn: 'ইমিডাক্লোপ্রিড ১৭.৮% এসএল',
    description: 'Advanced systemic insecticide for comprehensive pest control and plant protection.',
    descriptionBn: 'ব্যাপক পোকামাকড় নিয়ন্ত্রণ এবং উদ্ভিদ সুরক্ষার জন্য উন্নত সিস্টেমিক ইনসেক্টিসাইড।',
    category: 'Insecticide',
    categoryBn: 'ইনসেক্টিসাইড',
    usage: 'Effective against sucking pests like aphids, whiteflies, and thrips in vegetables, cotton, and rice.',
    usageBn: 'শাকসবজি, তুলা এবং ধানে এফিড, হোয়াইটফ্লাই এবং থ্রিপসের মতো চোষা পোকামাকড়ের বিরুদ্ধে কার্যকর।'
  },
  {
    name: 'Root Booster',
    nameBn: 'রুট বুস্টার',
    genericName: 'Auxin 0.1% SL',
    genericNameBn: 'অক্সিন ০.১% এসএল',
    description: 'Specialized growth promoter for enhanced root development and plant establishment.',
    descriptionBn: 'উন্নত মূল বিকাশ এবং উদ্ভিদ প্রতিষ্ঠার জন্য বিশেষায়িত বৃদ্ধি উদ্দীপক।',
    category: 'Growth Promoter',
    categoryBn: 'গ্রোথ প্রমোটার',
    usage: 'Promotes strong root systems, improves nutrient uptake, and enhances overall plant vigor in all crops.',
    usageBn: 'সব ফসলে শক্তিশালী মূল ব্যবস্থা প্রচার করে, পুষ্টি গ্রহণ উন্নত করে এবং সামগ্রিক উদ্ভিদ শক্তি বৃদ্ধি করে।'
  },
  {
    name: 'Micro Nutrient Mix',
    nameBn: 'মাইক্রো নিউট্রিয়েন্ট মিক্স',
    genericName: 'Zn + B + Fe 12%',
    genericNameBn: 'জিঙ্ক + বোরন + আয়রন ১২%',
    description: 'Essential micronutrient blend for addressing nutrient deficiencies and improving crop quality.',
    descriptionBn: 'পুষ্টির ঘাটতি মোকাবেলা এবং ফসলের গুণমান উন্নত করার জন্য অপরিহার্য মাইক্রোনিউট্রিয়েন্ট মিশ্রণ।',
    category: 'Fertilizer',
    categoryBn: 'সার',
    usage: 'Corrects zinc, boron, and iron deficiencies in rice, wheat, vegetables, and fruit crops for better yields.',
    usageBn: 'ধান, গম, শাকসবজি এবং ফল ফসলে জিঙ্ক, বোরন এবং আয়রনের ঘাটতি সংশোধন করে ভাল ফলনের জন্য।'
  }
]

// Team members data
const teamData = [
  {
    name: 'Abdul Latif',
    nameBn: 'আব্দুল লতিফ',
    role: 'Chairman',
    roleBn: 'চেয়ারম্যান',
    expertise: 'Provides strategic vision and governance for sustainable agribusiness growth nationwide.',
    expertiseBn: 'সারা দেশে টেকসই কৃষি ব্যবসার প্রবৃদ্ধির জন্য কৌশলগত ভিশন ও তত্ত্বাবধান দেন।',
    photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
    group: 'chairman',
    stats: { network: '312', projects: '48' }
  },
  {
    name: 'Md. Alif Ahmed',
    nameBn: 'মো. আলিফ আহমেদ',
    role: 'Managing Director',
    roleBn: 'ম্যানেজিং ডিরেক্টর',
    expertise: '17+ years in agri-distribution and sustainable supply chain operations.',
    expertiseBn: '১৭+ বছরের কৃষি বিতরণ এবং টেকসই সাপ্লাই চেইন পরিচালনার অভিজ্ঞতা।',
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
    group: 'board',
    stats: { network: '420', projects: '63' }
  },
  {
    name: 'Md. Arafat Ahmed',
    nameBn: 'মো. আরাফাত আহমেদ',
    role: 'Director',
    roleBn: 'ডিরেক্টর',
    expertise: 'Builds nationwide dealer partnerships and farmer service programs.',
    expertiseBn: 'সারা দেশে ডিলার অংশীদারিত্ব ও কৃষক সেবা প্রোগ্রাম গড়ে তোলেন।',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    group: 'board',
    stats: { network: '285', projects: '37' }
  },
  {
    name: 'Dr. Nusrat Rahman',
    nameBn: 'ডা. নুসরাত রহমান',
    role: 'Head of Sales',
    roleBn: 'হেড অব সেলস',
    expertise: 'Leads regional sales teams and on-ground activation to keep farmers supported year-round.',
    expertiseBn: 'বিভাগীয় সেলস টিম ও মাঠ পর্যায়ের কার্যক্রম তদারকি করে কৃষকদের সার্বক্ষণিক সহায়তা নিশ্চিত করেন।',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    group: 'management',
    stats: { network: '198', projects: '54' }
  },
  {
    name: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    role: 'Head of Operations',
    roleBn: 'হেড অব অপারেশনস',
    expertise: 'Ensures smooth warehousing, last-mile delivery, and dealer fulfillment across all districts.',
    expertiseBn: 'গুদাম, লজিস্টিকস ও ডিলার ডেলিভারির ধারাবাহিকতা নিশ্চিত করেন।',
    photo: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80',
    group: 'management',
    stats: { network: '176', projects: '41' }
  },
  {
    name: 'Fariha Islam',
    nameBn: 'ফারিহা ইসলাম',
    role: 'Head of Supply Chain',
    roleBn: 'হেড অব সাপ্লাই চেইন',
    expertise: 'Coordinates procurement, quality control, and forecasting for our expanding product lineup.',
    expertiseBn: 'ক্রয়, কোয়ালিটি কন্ট্রোল ও চাহিদা পূর্বাভাস সমন্বয় করেন।',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    group: 'management',
    stats: { network: '204', projects: '47' }
  },
  {
    name: 'Rezaul Karim',
    nameBn: 'রেজাউল করিম',
    role: 'Head of Agronomy Support',
    roleBn: 'হেড অব আগ্রোনমি সাপোর্ট',
    expertise: 'Guides demo plots, agronomy content, and farmer advisory programs nationwide.',
    expertiseBn: 'ডেমো প্লট, কৃষক প্রশিক্ষণ ও পরামর্শ সেবা সমন্বয় করেন।',
    photo: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80',
    group: 'management',
    stats: { network: '198', projects: '58' }
  }
]

// Testimonials data
const testimonialsData = [
  {
    quote: 'Believers Crop Care delivers on time and their agronomists always pick up the phone. Our coastal chilli farms stay protected throughout the season.',
    quoteBn: 'বিলিভার্স ক্রপ কেয়ার সময়মতো পণ্য দেয় এবং তাদের এগ্রোনমিস্টরা সবসময় ফোন ধরে। উপকূলীয় মরিচ ক্ষেত সারা মৌসুমে সুরক্ষিত থাকে।',
    name: 'Md. Rafiq Hasan',
    nameBn: 'মো. রফিক হাসান',
    role: 'Chilli Farmer, Khulna',
    roleBn: 'মরিচ চাষি, খুলনা',
    photo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
    order: 0
  },
  {
    quote: 'We run 18 demo plots and the field feedback loop is excellent. Dealers trust the brand because farmers call us back with great harvest stories.',
    quoteBn: 'আমরা ১৮টি ডেমো প্লট চালাই এবং মাঠের প্রতিক্রিয়া খুব দ্রুত পাই। ডিলাররা ব্র্যান্ডে আস্থা রাখে কারণ কৃষকরা ভাল ফলনের গল্প শেয়ার করে।',
    name: 'Shakila Sultana',
    nameBn: 'শাকিলা সুলতানা',
    role: 'Lead Dealer, Rajshahi',
    roleBn: 'লিড ডিলার, রাজশাহী',
    photo: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    order: 1
  },
  {
    quote: 'Their supply chain is reliable even during monsoon. Herbicide Pro helped us reclaim 40 acres of land from weeds within two weeks.',
    quoteBn: 'বর্ষাতেও তাদের সরবরাহ চেইন নির্ভরযোগ্য। হার্বিসাইড প্রো দুই সপ্তাহে ৪০ একর জমি আগাছা মুক্ত করেছে।',
    name: 'Abdul Matin',
    nameBn: 'আবদুল মতিন',
    role: 'Rice Collective, Sylhet',
    roleBn: 'ধান সমবায়, সিলেট',
    photo: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    order: 2
  }
]

// Blog posts data
const blogsData = [
  {
    category: 'Agricultural',
    categoryBn: 'কৃষি',
    title: 'Expert Tips for Maximizing Crop Yields',
    titleBn: 'সর্বোচ্চ ফলনের জন্য বিশেষজ্ঞ পরামর্শ',
    author: 'Ellan John',
    authorBn: 'এলান জন',
    date: 'April 29, 2024',
    excerpt: 'Practical strategies on irrigation, nutrition, and pest care to help your crops thrive all season.',
    excerptBn: 'সেচ, পুষ্টি ও পোকা দমনের কার্যকর কৌশলে পুরো মৌসুমে ফসল সুস্থ রাখুন।',
    image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    category: 'Farming',
    categoryBn: 'ফার্মিং',
    title: 'Practices and Benefits of Sustainable Farming',
    titleBn: 'টেকসই কৃষির চর্চা ও উপকারিতা',
    author: 'Max Wills',
    authorBn: 'ম্যাক্স উইলস',
    date: 'April 29, 2024',
    excerpt: 'Learn how regenerative techniques improve soil health while lowering input costs.',
    excerptBn: 'রিজেনারেটিভ পদ্ধতি কীভাবে মাটির স্বাস্থ্য বাড়ায় ও খরচ কমায় জেনে নিন।',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    category: 'Sustainable',
    categoryBn: 'টেকসই',
    title: 'Companion Planting for Natural Pest Control',
    titleBn: 'পোকা দমনে সহকারী গাছ ব্যবহারের উপায়',
    author: 'Max Wills',
    authorBn: 'ম্যাক্স উইলস',
    date: 'April 29, 2024',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    isFeatured: false
  },
  {
    category: 'Livestock',
    categoryBn: 'পশুপালন',
    title: 'Essential Guidelines for Livestock Health',
    titleBn: 'পশু স্বাস্থ্যের অপরিহার্য নির্দেশিকা',
    author: 'Sam Andre',
    authorBn: 'স্যাম আন্দ্রে',
    date: 'April 29, 2024',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    isFeatured: false
  },
  {
    category: 'Crop Care',
    categoryBn: 'ফসল পরিচর্যা',
    title: 'How To Build A Resilient Crop Calendar',
    titleBn: 'সহজে স্থিতিশীল ফসল ক্যালেন্ডার তৈরির টিপস',
    author: 'Ellan John',
    authorBn: 'এলান জন',
    date: 'April 29, 2024',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
    isFeatured: false
  }
]

// Career/Job data
const careersData = [
  {
    jobId: 'area-sales-manager',
    title: 'Area Sales Manager',
    titleBn: 'এরিয়া সেলস ম্যানেজার',
    location: 'Multiple districts',
    locationBn: 'বিভিন্ন জেলা',
    type: 'Full-time',
    typeBn: 'ফুল টাইম',
    summary: 'Own dealer relationships, drive sales targets, and support field activations in your assigned territory.',
    summaryBn: 'ডিস্ট্রিবিউটর ও ডিলার নেটওয়ার্ক পরিচালনা, সেলস টার্গেট অর্জন এবং মাঠ পর্যায়ে সম্পর্ক গড়ে তোলার দায়িত্ব।'
  },
  {
    jobId: 'field-agronomy-officer',
    title: 'Field Agronomy Officer',
    titleBn: 'ফিল্ড এগ্রোনমি অফিসার',
    location: 'Field-based',
    locationBn: 'ফিল্ড বেসড',
    type: 'Full-time',
    typeBn: 'ফুল টাইম',
    summary: 'Lead demo plots, farmer meetings, and trainings while bringing back insights to improve our products.',
    summaryBn: 'ডেমো প্লট, কৃষক মিটিং ও ট্রেনিং-এর মাধ্যমে প্রযুক্তিগত সহায়তা প্রদান এবং ফিডব্যাক সংগ্রহ।'
  },
  {
    jobId: 'supply-chain-coordinator',
    title: 'Supply Chain Coordinator',
    titleBn: 'সাপ্লাই চেইন কো-অর্ডিনেটর',
    location: 'Head office',
    locationBn: 'হেড অফিস',
    type: 'Full-time',
    typeBn: 'ফুল টাইম',
    summary: 'Coordinate order processing, stock planning, and logistics to keep products available in every season.',
    summaryBn: 'অর্ডার প্রসেসিং, স্টক প্ল্যানিং এবং লজিস্টিকস টিমের সাথে সমন্বয়ের মাধ্যমে সময়মতো পণ্য সরবরাহ নিশ্চিত করা।'
  }
]

// Sample notices data (first 10 notices)
const noticesData = [
  {
    title: 'Winter Crop Protection Campaign 2025',
    titleBn: 'শীতকালীন ফসল সুরক্ষা ক্যাম্পেইন ২০২৫',
    content: 'Launching our comprehensive winter crop protection campaign for the upcoming season. Get expert advice on protecting your winter vegetables and crops from common pests and diseases. Special discounts available on winter crop protection products. Visit your nearest dealer for details.',
    contentBn: 'আসন্ন মৌসুমের জন্য আমাদের ব্যাপক শীতকালীন ফসল সুরক্ষা ক্যাম্পেইন চালু হচ্ছে। সাধারণ পোকামাকড় ও রোগ থেকে আপনার শীতকালীন শাকসবজি ও ফসল রক্ষার জন্য বিশেষজ্ঞ পরামর্শ পান। শীতকালীন ফসল সুরক্ষা পণ্যে বিশেষ ছাড় উপলব্ধ। বিস্তারিত জানতে আপনার নিকটতম ডিলারের সাথে যোগাযোগ করুন।',
    date: '2025-11-28',
    photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    important: true
  },
  {
    title: 'Annual Dealer Conference 2025 - Registration Open',
    titleBn: 'বার্ষিক ডিলার কনফারেন্স ২০২৫ - নিবন্ধন খোলা',
    content: 'Save the date! Our annual dealer conference will be held on December 10, 2025 in Dhaka. All authorized dealers are invited to attend. Registration is now open. Early bird registration discount available until November 30, 2025. Details have been sent via email.',
    contentBn: 'তারিখটি মনে রাখুন! আমাদের বার্ষিক ডিলার কনফারেন্স ১০ ডিসেম্বর, ২০২৫ ঢাকায় অনুষ্ঠিত হবে। সমস্ত অনুমোদিত ডিলারদের অংশগ্রহণের জন্য আমন্ত্রণ জানানো হচ্ছে। নিবন্ধন এখন খোলা। ৩০ নভেম্বর, ২০২৫ পর্যন্ত আর্লি বার্ড নিবন্ধন ছাড় উপলব্ধ। বিস্তারিত ইমেইলের মাধ্যমে পাঠানো হয়েছে।',
    date: '2025-11-25',
    photo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    important: false
  },
  {
    title: 'New Product Launch: Advanced Fungicide Shield Pro',
    titleBn: 'নতুন পণ্য লঞ্চ: অ্যাডভান্সড ফাঙ্গিসাইড শিল্ড প্রো',
    content: 'We are excited to announce the launch of our new advanced fungicide product, Shield Pro. This enhanced formulation provides superior protection against fungal diseases in rice, wheat, and vegetable crops. Available at all authorized dealers starting December 1, 2025.',
    contentBn: 'আমরা আমাদের নতুন উন্নত ফাঙ্গিসাইড পণ্য শিল্ড প্রো-এর লঞ্চ ঘোষণা করতে পেরে আনন্দিত। এই উন্নত ফর্মুলেশন ধান, গম এবং শাকসবজি ফসলে ছত্রাক রোগের বিরুদ্ধে উন্নত সুরক্ষা প্রদান করে। ১ ডিসেম্বর, ২০২৫ থেকে সমস্ত অনুমোদিত ডিলারের কাছে পাওয়া যাবে।',
    date: '2025-11-22',
    photo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    important: true
  },
  {
    title: 'Farmer Training Workshop - November 2025',
    titleBn: 'কৃষক প্রশিক্ষণ ওয়ার্কশপ - নভেম্বর ২০২৫',
    content: 'Join our free farmer training workshop covering modern agricultural techniques, integrated pest management, and sustainable farming practices. Workshops will be held in major districts throughout November. Registration is free. Contact your local dealer for venue details.',
    contentBn: 'আধুনিক কৃষি কৌশল, সমন্বিত পোকা ব্যবস্থাপনা এবং টেকসই কৃষি অনুশীলনের বিষয়ে আমাদের বিনামূল্যের কৃষক প্রশিক্ষণ ওয়ার্কশপে যোগ দিন। ওয়ার্কশপগুলি নভেম্বর মাসে প্রধান জেলাগুলিতে অনুষ্ঠিত হবে। নিবন্ধন বিনামূল্যে। ভেন্যুর বিস্তারিত জানতে আপনার স্থানীয় ডিলারের সাথে যোগাযোগ করুন।',
    date: '2025-11-20',
    photo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    important: false
  },
  {
    title: 'Price Update - Effective December 1, 2025',
    titleBn: 'মূল্য আপডেট - ১ ডিসেম্বর, ২০২৫ থেকে কার্যকর',
    content: 'Please be informed that there will be a price adjustment for selected products effective December 1, 2025. Contact your local dealer for updated pricing information. Orders placed before December 1st will be honored at current prices.',
    contentBn: 'অনুগ্রহ করে জানানো যাচ্ছে যে ১ ডিসেম্বর, ২০২৫ থেকে নির্বাচিত পণ্যের মূল্য সমন্বয় করা হবে। আপডেটেড মূল্যের তথ্যের জন্য আপনার স্থানীয় ডিলারের সাথে যোগাযোগ করুন। ১ ডিসেম্বরের আগে করা অর্ডার বর্তমান মূল্যে সম্মানিত হবে।',
    date: '2025-11-18',
    photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    important: true
  }
]

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await Product.deleteMany({})
    await Team.deleteMany({})
    await Testimonial.deleteMany({})
    await Blog.deleteMany({})
    await Notice.deleteMany({})
    await Career.deleteMany({})

    // Insert Products
    console.log('Seeding products...')
    const products = await Product.insertMany(productsData)
    console.log(`✓ Inserted ${products.length} products`)

    // Insert Team Members
    console.log('Seeding team members...')
    const team = await Team.insertMany(teamData)
    console.log(`✓ Inserted ${team.length} team members`)

    // Insert Testimonials
    console.log('Seeding testimonials...')
    const testimonials = await Testimonial.insertMany(testimonialsData)
    console.log(`✓ Inserted ${testimonials.length} testimonials`)

    // Insert Blog Posts
    console.log('Seeding blog posts...')
    const blogs = await Blog.insertMany(blogsData)
    console.log(`✓ Inserted ${blogs.length} blog posts`)

    // Insert Notices
    console.log('Seeding notices...')
    const notices = await Notice.insertMany(noticesData)
    console.log(`✓ Inserted ${notices.length} notices`)

    // Insert Careers
    console.log('Seeding career opportunities...')
    const careers = await Career.insertMany(careersData)
    console.log(`✓ Inserted ${careers.length} career opportunities`)

    console.log('\n✅ Database seeding completed successfully!')
    console.log('\nSummary:')
    console.log(`  - Products: ${products.length}`)
    console.log(`  - Team Members: ${team.length}`)
    console.log(`  - Testimonials: ${testimonials.length}`)
    console.log(`  - Blog Posts: ${blogs.length}`)
    console.log(`  - Notices: ${notices.length}`)
    console.log(`  - Career Opportunities: ${careers.length}`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run seed function
seedDatabase()

