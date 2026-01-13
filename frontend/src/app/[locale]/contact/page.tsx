'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // FAQ toggle state
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // FAQ data - kept your exact content
  const faqItems = [
    {
      question: 'How do I register as a patient?',
      answer: 'Click the "Register" button, fill in your details, and you\'ll receive your QR code immediately. It\'s completely free for patients.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all data is end-to-end encrypted. You control who sees your records, and we comply with Rwanda\'s data protection regulations.'
    },
    {
      question: 'How do healthcare providers join?',
      answer: 'Healthcare facilities can register online. After verification, you\'ll get access to the provider portal and can start receiving patients.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We support MTN Mobile Money and Airtel Money for seamless payment of consultation fees.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Clean rectangle with straight bottom edge */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/others/contact-1.jpg"
            alt="Contact HealthVault Rwanda"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Gradient Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-dark/50 z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100">
              Have questions? We're here to help. Reach out to our team and we'll respond as soon as possible.
            </p>
            
            {/* Contact Badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              
             
            </div>
          </div>
        </div>
        
        {/* REMOVED: Decorative Wave - Now it's a straight rectangle */}
      </section>

      {/* Contact Info Cards - FROM YOUR ORIGINAL CODE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location */}
            <Card className="text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary bg-opacity-10 rounded-2xl">
                  <MapPin size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Office Location</h3>
              <p className="text-gray-600">
                KG 11 Ave, Kigali<br />
                Kigali, Rwanda
              </p>
            </Card>

            {/* Phone */}
            <Card className="text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-accent bg-opacity-10 rounded-2xl">
                  <Phone size={32} className="text-accent" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className="text-gray-600">
                +250 788 123 456<br />
                +250 788 789 012
              </p>
            </Card>

            {/* Email */}
            <Card className="text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-success bg-opacity-10 rounded-2xl">
                  <Mail size={32} className="text-success" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-gray-600">
                info@healthvault.rw<br />
                support@healthvault.rw
              </p>
            </Card>

            {/* Hours */}
            <Card className="text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-warning bg-opacity-10 rounded-2xl">
                  <Clock size={32} className="text-warning" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Working Hours</h3>
              <p className="text-gray-600">
                Mon - Fri: 8AM - 6PM<br />
                Sat: 9AM - 2PM
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Image - FROM YOUR ORIGINAL CODE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Send us a message</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
                  We'd Love to Hear from You
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg">
                  <p className="text-success font-medium flex items-center gap-2">
                    <MessageCircle size={20} />
                    Message sent successfully! We'll respond soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  disabled={loading}
                  className="group"
                >
                  {loading ? 'Sending...' : (
                    <>
                      Send Message
                      <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Image & Additional Info - FROM YOUR ORIGINAL CODE */}
            <div className="space-y-6">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/others/contact.jpg"
                  alt="Contact our team"
                  fill
                  className="object-cover"
                />
              </div>

              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-2xl font-bold mb-4">Quick Support</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">For Patients:</h4>
                    <p className="text-gray-600">
                      Need help accessing your records? Contact support at support@healthvault.rw
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">For Healthcare Providers:</h4>
                    <p className="text-gray-600">
                      Interested in partnering? Email partnerships@healthvault.rw
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Technical Support:</h4>
                    <p className="text-gray-600">
                      Report technical issues at tech@healthvault.rw
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder - FROM YOUR ORIGINAL CODE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-gray-600">Visit our office in Kigali</p>
          </div>

          <div className="bg-gray-300 rounded-2xl overflow-hidden shadow-xl" style={{ height: '400px' }}>
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-lg font-semibold">Interactive Map</p>
                <p className="text-sm">KG 11 Ave, Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview - WITH TOGGLE BUTTONS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card 
                key={index}
                className={`transition-all duration-300 ${
                  openFAQ === index ? 'border-primary/30 shadow-md' : ''
                }`}
              >
                <button
                  className="w-full text-left flex items-center justify-between p-6"
                  onClick={() => toggleFAQ(index)}
                >
                  <h4 className="font-bold text-lg mb-0">
                    {item.question}
                  </h4>
                  <div className={`transition-transform duration-300 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}>
                    {openFAQ === index ? (
                      <ChevronUp size={24} className="text-primary" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-400" />
                    )}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}