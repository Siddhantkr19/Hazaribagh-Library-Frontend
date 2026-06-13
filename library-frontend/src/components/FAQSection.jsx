import React, { useState } from 'react';
import { ChevronDown, Compass, CreditCard, Clock, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 'discover',
    icon: <Compass className="w-5 h-5" />,
    label: "Getting Started",
    questions: [
      { q: "What is LibHub?", a: "LibHub is Hazaribagh’s first digital marketplace for students. It allows you to discover, compare, and instantly book seats at top physical study centers across areas like  Korrah and Korra." },
      { q: "How do I find the best library for me?", a: "Use our smart search feature on the homepage! Filter by location or sort by your monthly budget to find your perfect focus zone." }
    ]
  },
  {
    id: 'payments',
    icon: <CreditCard className="w-5 h-5" />,
    label: "Booking & Pricing",
    questions: [
      { q: "How do I book a seat?", a: "1. Create a free account. 2. Browse libraries and click 'Book Seat'. 3. Complete the secure payment. Your seat is instantly confirmed!" },
      { q: "Are there any discounts for first-time users?", a: "Yes! We offer a special 'New Student Exclusive.' Look out for dynamic pricing drops (like paying ₹350 instead of ₹400) or our 3-Days Free Trial." },
      { q: "Can I pay offline at the library?", a: "Absolutely. You can visit the library directly and pay in cash. The Library Admin will use their LibHub system to secure your seat digitally." }
    ]
  },
  {
    id: 'manage',
    icon: <Clock className="w-5 h-5" />,
    label: "Seat Management",
    questions: [
      { q: "Where can I see my active booking?", a: "Everything is in your personal Student Dashboard. View your active library, days remaining on your subscription, and download payment receipts." },
      { q: "How will I know when my seat expires?", a: "No need to memorize dates! LibHub automatically sends you an email reminder 3 days before your subscription ends." }
    ]
  },
  {
    id: 'support',
    icon: <HelpCircle className="w-5 h-5" />,
    label: "Help & Support",
    questions: [
      { q: "My payment failed, but money was deducted?", a: "Don't panic! Sometimes bank servers delay. Go to your Dashboard and open the 'Help & Queries' tab to raise a ticket. Our admin team will fix it immediately." },
      { q: "How do I contact customer care?", a: "Send a direct message to the administration team from your Student Dashboard using the Help Tickets feature. We're always here to help!" }
    ]
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group border border-gray-200 dark:border-white/10 rounded-2xl mb-3 bg-white dark:bg-gray-900/80 backdrop-blur-md hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
      <button
        className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {question}
        </span>
        
        <div className={`p-1.5 rounded-full transition-colors duration-300 ${isOpen ? 'bg-orange-100 dark:bg-orange-500/20' : 'bg-blue-50 dark:bg-blue-500/10'}`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'text-orange-500 transform rotate-180' : 'text-blue-500 dark:text-blue-400'}`} />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState(faqs[0].id);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Frequently <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Asked</span> Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to know about discovering, booking, and managing your perfect study space in Hazaribagh.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {faqs.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border ${
                activeTab === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg shadow-orange-500/25 transform scale-105'
                  : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/10'
              }`}
            >
              <div className={activeTab === category.id ? "text-white" : "text-blue-500 dark:text-blue-400 group-hover:text-blue-600"}>
                {category.icon}
              </div>
              {category.label}
            </button>
          ))}
        </div>

        <div className="min-h-min">
          {faqs.map((category) => (
            <div 
              key={category.id} 
              className={`transition-all duration-500 ${activeTab === category.id ? 'block animate-fade-in-up' : 'hidden'}`}
            >
              {category.questions.map((faq, index) => (
                <FAQItem key={index} question={faq.q} answer={faq.a} />
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;



