'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Clock, CheckCircle2, Navigation, 
Copy, ExternalLink, Sparkles } from 'lucide-react';
import { ContactFormData, InquiryReason } from './types';
import { createContact, CreateContactPayload, ApiError } from '../../../utils/account/contact'; 

interface ComponentProps {
  isDark: boolean;
}

export const ContactFormSection: React.FC<ComponentProps> = ({ isDark }) => {
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    reason: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Map `message` from formData to `statement` expected by the API
    const payload: CreateContactPayload = {
      name: formData.name,
      email: formData.email,
      reason: formData.reason,
      statement: formData.message,
    };

    try {
      const response = await createContact(payload);

      if (response.success) {
        setIsSubmitted(true);
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          reason: 'General Inquiry',
          message: '',
        });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to submit contact request.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      console.error('Contact form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`border rounded-2xl p-6 sm:p-8 shadow-xl transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-700 text-white'
          : 'bg-white border-slate-300 text-slate-900'
      }`}
    >
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          Send Us a Message <Sparkles className="w-5 h-5 text-indigo-500" />
        </h2>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Fill out the form below and our education support team will get back to you within 24 hours.
        </p>
      </div>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-xl border text-center space-y-3 ${
            isDark
              ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}
        >
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
          <h3 className="font-bold text-base">Thank You! Message Delivered.</h3>
          <p className="text-xs max-w-sm mx-auto">
            We have received your inquiry regarding <strong>{formData.reason}</strong> and sent a confirmation to your email.
          </p>
          {/* <button
            onClick={() => setIsSubmitted(false)}
            className="mt-2 text-xs font-semibold underline hover:opacity-80"
          >
            Send Another Message
          </button> */}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Your Full  Name"
              className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5
                 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. name@example.com"
              className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Reason for Contact */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Reason for Contact <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value as InquiryReason })}
              className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Admissions & University Guidance">Admissions & University Guidance</option>
              <option value="Scholarship Support">Scholarship Support</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Partnership / Institutional Onboarding">Partnership / Institutional Onboarding</option>
            </select>
          </div>

          {/* Statement Area */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Message / Statement <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your inquiry or question in detail..."
              className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 
            text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center 
            justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Sending Message...</span>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export const ContactInfoAndMapSection: React.FC<ComponentProps> = ({ isDark }) => {
  const [copied, setCopied] = useState(false);

  const contactDetails = {
    address: '560111, Bangaluru, Karnataka, India',
    phone: '+91 (040) 6789-2340',
    email: 'support@careermapfinder.com',
    hours: 'Mon - Fri: 8:00 AM - 8:00 PM UTC',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Contact Cards Grid */}
      <div
        className={`border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 ${
          isDark
            ? 'bg-slate-900/90 border-slate-700 text-white'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Contact Details</h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Reach out directly via phone, email, or visit our central headquarters.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
         
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border shrink-0 
                ${isDark ? 'bg-slate-950 border-slate-700 text-purple-400' : 'bg-purple-50 border-purple-300 text-purple-600'}`}>
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className={`block text-[10px] font-bold uppercase tracking-wider 
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Email Support
              </span>
              <p className="font-semibold mt-0.5">{contactDetails.email}</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border shrink-0 
                ${isDark ? 'bg-slate-950 border-slate-700 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-600'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className={`block text-[10px] font-bold uppercase tracking-wider 
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Office Operating Hours
              </span>
              <p className="font-semibold mt-0.5">{contactDetails.hours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Placeholder Card */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 overflow-hidden relative ${
          isDark
            ? 'bg-slate-900/90 border-slate-700 text-white'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" /> Interactive Location Map
          </span>
          <button
            onClick={() => copyToClipboard(contactDetails.address)}
            className={`text-[10px] font-semibold px-2 py-1 rounded border flex items-center gap-1 transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Map Canvas Visual Mockup */}
        <div className={`relative h-56 rounded-xl border overflow-hidden flex flex-col justify-between p-4 ${
          isDark 
            ? 'bg-slate-950 border-slate-700 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]' 
            : 'bg-slate-100 border-slate-300 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]'
        }`}>
          {/* Decorative Map Nodes */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-48 h-48 rounded-full border-2 border-indigo-500/50 animate-ping" />
          </div>

          {/* Pin Card Overlay */}
          <div className="relative z-10 flex items-center gap-2 self-center bg-indigo-600 
           text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold">
            <MapPin className="w-4 h-4 fill-white text-indigo-600" />
            <span>Career Map Finder</span>
          </div>

          {/* Action Bar on Map */}
          <div className={`relative z-10 p-3 rounded-lg border backdrop-blur-md flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-300'
          }`}>
            <div className="text-[11px]">
              <span className="font-bold block">Bangaluru Office</span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Bangaluru, Karnataka, India</span>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] 
              font-bold rounded-lg flex items-center gap-1 transition-all"
            >
              <span>Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};