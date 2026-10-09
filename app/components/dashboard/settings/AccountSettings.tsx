'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { DashboardLayoutWrapper } from '../DashboardLayoutWrapper';
import { AlertCircle, CheckCircle2, Loader2, Save, Trash2} from 'lucide-react';
import { userManagementApi, UpdateUserInput, UserItem } from '../../../utils/account/userManagement'; 
import Cookies from 'js-cookie';
import { syncUpdateResponsesAndInvalidateCache } from './InvalidateCache';


export default function AccountSettingsPage() {

   const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Loading & Action States
  const [fetching, setFetching] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

   const userId =  Cookies.get('userId');

  // Alert Banner States
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Modal State for Delete Confirmation
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
 
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    bio: '',
  });

  const [academic, setAcademic] = useState({
    academicLevel: '',
    streamSpecialization: '',
    fieldOfInterest: '',
    institutionName: '',
    graduationYear: '',
    targetPercentage: '',
  });

  
  const [payment, setPayment] = useState({
    planType:'Free Tier',
    billingCycle:'N/A',
    nextBillingDate:'N/A',
    lastPaymentDate:'N/A',
  });

  useEffect(() => {
  if (!userId) {
    setFetching(false);
    return;
  }

  const storageKey = `user_profile_${userId}`;

  const loadUserData = async () => {
    try {
      setFetching(true);

      // ✅ 1. Check localStorage first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);

        if (cached) {
          const u: UserItem = JSON.parse(cached);

          setProfile({
            fullName: u.fullName || '',
            email: u.email || '',
            phoneNumber: u.phoneNumber || '',
            location: u.location || '',
            bio: u.bio || '',
          });

          setAcademic({
            academicLevel: u.academicLevel || '',
            streamSpecialization: u.streamSpecialization || '',
            fieldOfInterest: u.fieldOfInterest || '',
            institutionName: u.institutionName || '',
            graduationYear: u.graduationYear ? String(u.graduationYear) : '',
            targetPercentage: u.targetPercentage ? String(u.targetPercentage) : '',
          });

          setPayment({
            planType: u.planType || 'Free Tier',
            billingCycle: u.billingCycle || 'N/A',
            nextBillingDate: u.nextBillingDate
              ? new Date(u.nextBillingDate).toLocaleDateString()
              : 'N/A',
            lastPaymentDate: u.lastPaymentDate
              ? new Date(u.lastPaymentDate).toLocaleDateString()
              : 'N/A',
          });

          setFetching(false);
          return; // 🚨 stop API call
        }
      }

      // ❌ 2. API call (unchanged)
      const res = await userManagementApi.getUserInfo(userId);

      if (res.success && res.currentUser) {
        const u: UserItem = res.currentUser;

        setProfile({
          fullName: u.fullName || '',
          email: u.email || '',
          phoneNumber: u.phoneNumber || '',
          location: u.location || '',
          bio: u.bio || '',
        });

        setAcademic({
          academicLevel: u.academicLevel || '',
          streamSpecialization: u.streamSpecialization || '',
          fieldOfInterest: u.fieldOfInterest || '',
          institutionName: u.institutionName || '',
          graduationYear: u.graduationYear ? String(u.graduationYear) : '',
          targetPercentage: u.targetPercentage ? String(u.targetPercentage) : '',
        });

        setPayment({
          planType: u.planType || 'Free Tier',
          billingCycle: u.billingCycle || 'N/A',
          nextBillingDate: u.nextBillingDate
            ? new Date(u.nextBillingDate).toLocaleDateString()
            : 'N/A',
          lastPaymentDate: u.lastPaymentDate
            ? new Date(u.lastPaymentDate).toLocaleDateString()
            : 'N/A',
        });

        // ✅ Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(u));
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to load user profile.',
      });
    } finally {
      setFetching(false);
    }
  };

  loadUserData();
}, [userId]);

  // Fetch User Info on Mount
  // useEffect(() => {
  //   if (!userId) {
  //     setFetching(false);
  //     return;
  //   }

  //   const loadUserData = async () => {
  //     try {
  //       setFetching(true);
  //       const res = await userManagementApi.getUserInfo(userId);
  //       if (res.success && res.currentUser) {
  //         const u: UserItem = res.currentUser;

  //         setProfile({
  //           fullName: u.fullName || '',
  //           email: u.email || '',
  //           phoneNumber: u.phoneNumber || '',
  //           location: u.location || '',
  //           bio: u.bio || '',
  //         });

  //         setAcademic({
  //           academicLevel: u.academicLevel || '',
  //           streamSpecialization: u.streamSpecialization || '',
  //           fieldOfInterest: u.fieldOfInterest || '',
  //           institutionName: u.institutionName || '',
  //           graduationYear: u.graduationYear ? String(u.graduationYear) : '',
  //           targetPercentage: u.targetPercentage ? String(u.targetPercentage) : '',
  //         });

  //         setPayment({
  //           planType: u.planType || 'Free Tier',
  //           billingCycle: u.billingCycle || 'N/A',
  //           nextBillingDate: u.nextBillingDate
  //             ? new Date(u.nextBillingDate).toLocaleDateString()
  //             : 'N/A',
  //           lastPaymentDate: u.lastPaymentDate
  //             ? new Date(u.lastPaymentDate).toLocaleDateString()
  //             : 'N/A',
  //         });
  //       }
  //     } catch (err: any) {
  //       setStatusMessage({
  //         type: 'error',
  //         text: err.message || 'Failed to load user profile.',
  //       });
  //     } finally {
  //       setFetching(false);
  //     }
  //   };

  //   loadUserData();
  // }, [userId]);

  // Handle Form Submission (Save Profile & Academic Info)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setStatusMessage({ type: 'error', text: 'User ID is missing.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const payload: UpdateUserInput = {
      fullName: profile.fullName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      location: profile.location,
      bio: profile.bio,
      academicLevel: academic.academicLevel,
      streamSpecialization: academic.streamSpecialization,
      fieldOfInterest: academic.fieldOfInterest,
      institutionName: academic.institutionName,
      graduationYear: academic.graduationYear
        ? Number(academic.graduationYear)
        : undefined,
      targetPercentage: academic.targetPercentage
        ? Number(academic.targetPercentage)
        : undefined,
    };

    try {
      const res = await userManagementApi.updateUser(userId, payload);
      if (res.success) {
        syncUpdateResponsesAndInvalidateCache();
        setStatusMessage({
          type: 'success',
          text: res.message || 'Account settings updated successfully!',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update account settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteConfirmed = async () => {
    if (!userId) return;

    setDeleting(true);
    setStatusMessage(null);

    try {
      const res = await userManagementApi.deleteAccount(userId);
      if (res.success) {
        setShowDeleteModal(false);
        window.location.href = '/auth/signup'; // Redirect to signup page after deletion
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to delete account.',
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayoutWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Loading account details...
          </p>
        </div>
      </DashboardLayoutWrapper>
    );
  }

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6 max-w-6xl mx-auto ">

         <div className="grid grid-cols-1 lg:grid-cols-12 ">

          
        {/* Global Feedback Banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? isDark
                  ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDark
                ? 'bg-red-950/50 border-red-800 text-red-300'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

          <main className="lg:col-span-12">
            <form onSubmit={handleSave}>
             
                <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-slate-950 border-slate-700' 
                  : 'bg-white border-slate-300'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Personal Information
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Update your account identity and contact details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        placeholder='full name'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder='email address'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                        placeholder='phone number'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder='Your location'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Student Bio / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder='write your bio here'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
           
                <div className={`p-6 mt-6 rounded-2xl border space-y-6 ${isDark ? 'bg-slate-950 border-slate-700' 
                  : 'bg-white border-slate-300'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Academic Background
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Helps the AI predictor customize college cutoff recommendations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                         Current Academic Level
                      </label>
                      <input
                        type="text"
                        value={academic.academicLevel}
                        onChange={(e) => setAcademic({ ...academic, academicLevel: e.target.value })}
                        placeholder='current academic level'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Stream / Specialization
                      </label>
                      <input
                        type="text"
                        value={academic.streamSpecialization}
                        onChange={(e) => setAcademic({ ...academic, streamSpecialization: e.target.value })}
                        placeholder='stream specialization'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Primary Field of Interest
                      </label>
                      <input
                        type="text"
                        value={academic.fieldOfInterest}
                        onChange={(e) => setAcademic({ ...academic, fieldOfInterest: e.target.value })}
                        placeholder='primary field of interest'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        School / Institution Name
                      </label>
                      <input
                        type="text"
                        value={academic.institutionName}
                        onChange={(e) => setAcademic({ ...academic, institutionName: e.target.value })}
                        placeholder='school / institution name'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Target Graduation Year
                      </label>
                      <input
                        type="text"
                        value={academic.graduationYear}
                        onChange={(e) => setAcademic({ ...academic, graduationYear: e.target.value })}
                        placeholder='target graduation year'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Target Percentage / CGPA
                      </label>
                      <input
                        type="text"
                        value={academic.targetPercentage}
                        onChange={(e) => setAcademic({ ...academic, targetPercentage: e.target.value })}
                        placeholder='target percentage / cgpa'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className={`p-6 mt-6 rounded-2xl border space-y-6 ${isDark ? 'bg-slate-950 border-slate-700' 
                  : 'bg-white border-slate-300'}`}>

                     <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Payment Details
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Payment and subscription plan detials.
                    </p>
                  </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                         Current Plan Type
                      </label>
                      <input
                        type="text"
                        value={payment.planType}
                        disabled
                        onChange={(e) => setPayment({ ...payment, planType: e.target.value })}
                        placeholder='current plan type'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Current Billing Cycle
                      </label>
                      <input
                        type="text"
                        value={payment.billingCycle}
                        disabled
                        onChange={(e) => setPayment({ ...payment, billingCycle: e.target.value })}
                        placeholder='current billing cycle'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Last Payment Date
                      </label>
                      <input
                        type="text"
                        value={payment.lastPaymentDate}
                        disabled
                        onChange={(e) => setPayment({ ...payment, lastPaymentDate: e.target.value })}
                        placeholder='last payment date'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Next Billing Date
                      </label>
                      <input
                        type="text"
                        value={payment.nextBillingDate}
                        disabled
                        onChange={(e) => setPayment({ ...payment, nextBillingDate: e.target.value })}
                        placeholder='Next Billing Date'
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                        }`}
                      />
                    </div>

                  </div>
                </div>

           
                <div className={`p-6 mt-6 rounded-2xl border space-y-6 ${isDark ? 'bg-slate-950 border-slate-700' 
                  : 'bg-white border-slate-300'}`}>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Account Controls
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Request permanent account erasure.
                    </p>
                  </div>

                  <div className="space-y-4">
            
                    <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Delete Account & Data</p>
                        <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70">
                          Permanently remove your profile, history, and saved exams.
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => setShowDeleteModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs
                         font-semibold flex items-center gap-1.5 transition-colors">
                        
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Account</span>
                        
                      </button>

                    </div>

                  </div>
                </div>
            
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs 
                  font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </main>
        </div>

          {/* Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold">Confirm Account Deletion</h3>
              </div>
              <p
                className={`text-xs sm:text-sm mt-3 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Are you sure you want to delete your account? This action will soft-delete your profile and revoke access to all subscribed features.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Yes, Delete Account</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayoutWrapper>
  );
}