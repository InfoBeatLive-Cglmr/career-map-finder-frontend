'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GraduationCap, TrendingUp, Globe, Award,ShieldCheck, Coins, 
CheckCircle2, Clock, Sparkles, BookOpen, Building2, Briefcase, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { careerExplorerApi, CareerReportItem } from '@/app/utils/career-explorer/careerExplorerMain';

export default function CareerReportDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams();
  const router = useRouter();
  const reportId = params['report-id'] as string;

  const [report, setReport] = useState<CareerReportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const printRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;

  setLoading(true);
  setError(null);

  const fetchReport = async () => {
    if (!reportId) {
      if (isMounted) setLoading(false);
      return;
    }

    const storageKey = `career_report_report_id_${reportId}`;

    try {
      // ✅ Check cache first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);

        if (cached) {
          if (isMounted) {
            setReport(JSON.parse(cached));
            setLoading(false);
          }
          return;
        }
      }

      // ❌ Fetch API
      const response = await careerExplorerApi.getReportById(reportId);

      if (isMounted) {
        if (response && response.data) {
          setReport(response.data);

          // ✅ Save
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(response.data));
          }
        } else {
          setReport(null);
        }

        setLoading(false);
      }
    } catch (error: any) {
      console.error('Failed to fetch career report:', error);

      if (isMounted) {
        setError?.(
          error?.message ||
            'Failed to fetch career report. Please try again later.'
        );
        setReport(null);
        setLoading(false);
      }
    }
  };

  fetchReport();

  return () => {
    isMounted = false;
  };
}, [reportId]);

//   useEffect(() => {
//   let isMounted = true;
//   setLoading(true);
//   setError(null); 

//   const fetchReport = async () => {
//     if (!reportId) {
//       if (isMounted) {
//         setLoading(false);
//       }
//       return;
//     }

//     try {
//       // Call production API service to get report by ID
//       const response = await careerExplorerApi.getReportById(reportId);

//       if (isMounted) {
//         if (response && response.data) {
//           setReport(response.data);
//         } else {
//           setReport(null);
//         }
//         setLoading(false);
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch career report:', error);
//       if (isMounted) {
//         setError?.(
//           error?.message || 'Failed to fetch career report. Please try again later.'
//         );
//         setReport(null);
//         setLoading(false);
//       }
//     }
//   };

//   fetchReport();

//   return () => {
//     isMounted = false;
//   };
// }, [reportId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 
           border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">
            Loading Comprehensive Report...
          </p>
        </div>
      </div>
    );
  }

    if (!report) {
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className={`p-6 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
            isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
          }`}>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">No Reports Available</h2>
            <p className="text-sm text-slate-400">There are no career reports to display at this time.</p>
            <button
              onClick={() => router.push('/dashboard/career-explorer')}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
              text-sm transition-all shadow-md cursor-pointer"
            >
              Explore New Career Path
            </button>
          </div>
        </div>
      );
    }

  
    if (error) {
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className={`p-6 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
            isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
          }`}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Unable to Load Reports</h2>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
              text-sm transition-all shadow-md cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 print:p-0 print:bg-white print:text-slate-900 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`} >

      <div className="max-w-7xl mx-auto space-y-6">

        <div ref={printRef} className="space-y-6 print:space-y-0 ">
          {/* PAGE 1: Identity & Role Blueprint */}
          <SectionContainer
            pageNum={1}
            totalPages={10}
            title="Identity & Role Blueprint"
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className={`p-4 -mt-3 rounded-xl border ${isDark ? 'border-slate-700' : 'border-slate-300'} `}>
                  <h3 className="text-xl font-bold text-indigo-600 mb-2">
                    {report.careerName || 'N/A'}
                  </h3>
                  <p className="text-xs leading-relaxed opacity-100">
                    {report.careerOverview || 'N/A'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                      What a Professional Does
                    </h4>
                    <p className="text-xs leading-relaxed ">
                      {report.whatProfessionalDoes || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                      Why Choose This Career
                    </h4>
                    <p className="text-xs leading-relaxed ">
                      {report.whyChooseThisCareer || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                      Who Is Suitable For
                    </h4>
                    <p className="text-xs leading-relaxed ">
                      {report.whoIsSuitableFor || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <MetricBox
                  icon={Coins}
                  label="Starting Salary"
                  value={report.startingSalaryRange || 'N/A'}
                  color="emerald"
                  isDark={isDark}
                />
                <MetricBox
                  icon={GraduationCap}
                  label="Min Qualification"
                  value={report.minQualification || 'N/A'}
                  color="indigo"
                  isDark={isDark}
                />
                <MetricBox
                  icon={ShieldCheck}
                  label="Job Security Rating"
                  value={`${report.jobSecurityRating ?? 0}/10`}
                  color="blue"
                  isDark={isDark}
                />
                <MetricBox
                  icon={Clock}
                  label="Typical Hours"
                  value={report.typicalWorkingHours || 'N/A'}
                  color="amber"
                  isDark={isDark}
                />
              </div>
            </div>

            <div className={`mt-6 pt-6 border-t ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-4 `}>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                  Work Environment
                </h4>
                <p className="text-xs leading-relaxed ">
                  {report.workEnvironmentDesc || 'N/A'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                  A Typical Day in the Life
                </h4>
                <p className="text-xs leading-relaxed ">
                  {report.typicalDayLife || 'N/A'}
                </p>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 2: Education & Academic Eligibility */}
          <SectionContainer
            pageNum={2}
            totalPages={10}
            title="Education & Academic Eligibility"
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    Academic Requirements
                  </h3>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
                  <div className="flex justify-start gap-1 text-xs">
                    <span className="font-semibold ">
                      Class 10 Requirements:
                    </span>
                    <span className=" text-right">
                      {report.class10Requirements || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 text-xs">
                    <span className="font-semibold ">
                      Class 11/12 Stream:
                    </span>
                    <span className=" text-right">
                      {report.class11_12Stream || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 text-xs">
                    <span className="font-semibold ">
                      Minimum Qualification:
                    </span>
                    <span className=" text-right">
                      {report.minQualification || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 text-xs">
                    <span className="font-semibold ">
                      Degree Required:
                    </span>
                    <span className=" text-right">
                      {report.degreeRequired || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 text-xs">
                    <span className="font-semibold ">
                      Course Duration:
                    </span>
                    <span className=" text-right">
                      {report.courseDuration || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    Required Subjects
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {(report.subjectsRequired || []).map((sub, i) => (
                      <li
                        key={i}
                        className="text-xs flex items-center gap-1.5 p-2 rounded-lg "
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    Course Options & Eligibility Details
                  </h3>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  {report.ageLimit && (
                    <p className="text-xs">
                      <span className="font-semibold ">
                        Age Limit:
                      </span>{' '}
                      {report.ageLimit}
                    </p>
                  )}
                  {report.nationalityEligibility && (
                    <p className="text-xs">
                      <span className="font-semibold ">
                        Nationality Eligibility:
                      </span>{' '}
                      {report.nationalityEligibility}
                    </p>
                  )}
                  {report.medicalRequirements && (
                    <p className="text-xs">
                      <span className="font-semibold ">
                        Medical Requirements:
                      </span>{' '}
                      {report.medicalRequirements}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    Available Course Options
                  </h4>
                  <div className="space-y-2">
                    {(report.courseOptions || []).map((course, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-3`}
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex 
                        items-center justify-center font-bold text-xs shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 3: Entrance Examinations & Strategy */}
          <SectionContainer
            pageNum={3}
            totalPages={10}
            title="Entrance Examinations & Strategy"
            isDark={isDark}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2`}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    National Exams
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(report.nationalExams || []).map((exam, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold  py-0.5 rounded "
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={` p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    State Exams
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(report.stateExams || []).map((exam, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold  py-0.5 rounded "
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    University Exams
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(report.universityExams || []).map((exam, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold py-0.5 rounded "
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Exam Pattern & Details
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.examPattern || 'N/A'}
                  </p>
                  <p className="text-xs leading-relaxed">
                    <span className="font-semibold ">
                      Eligibility:
                    </span>{' '}
                    {report.examEligibility || 'N/A'}
                  </p>
                  {report.markingScheme && (
                    <p className="text-xs">
                      <span className="font-semibold ">
                        Marking Scheme:
                      </span>{' '}
                      {report.markingScheme}
                    </p>
                  )}
                  {report.examFrequency && (
                    <p className="text-xs">
                      <span className="font-semibold ">
                        Exam Frequency:
                      </span>{' '}
                      {report.examFrequency}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Preparation Strategy & Books
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.prepStrategy || 'N/A'}
                  </p>
                  <p className="text-xs font-semibold ">
                    Prep Timeline: {report.prepTimeline || 'N/A'}
                  </p>
                  <div>
                    <span className="text-xs font-bold  block mb-1">
                      Recommended Books:
                    </span>
                    <ul className="space-y-1">
                      {(report.recommendedBooks || []).map((book, i) => (
                        <li
                          key={i}
                          className="text-xs flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{book}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 4: Admissions & College Guidance */}
          <SectionContainer
            pageNum={4}
            totalPages={10}
            title="Admissions & College Guidance"
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Admission Process
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.admissionProcess || 'N/A'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2`}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Counselling Process
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.counsellingProcess || 'N/A'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2`}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    College Selection Guide
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.collegeSelectionGuide || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Top Government Colleges
                  </h4>
                  <ul className="space-y-1.5">
                    {(report.topGovtColleges || []).map((college, i) => (
                      <li
                        key={i}
                        className={`text-xs p-2 rounded-lg border ${ isDark ? 'border-slate-700' : 'border-slate-300'}
                         flex items-center gap-2 `}
                      >
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{college}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Top Private Colleges
                  </h4>
                  <ul className="space-y-1.5">
                    {(report.topPrivateColleges || []).map((college, i) => (
                      <li
                        key={i}
                        className={`text-xs p-2 border ${ isDark ? 'border-slate-700' : 'border-slate-300'}
                          rounded-lg  flex items-center gap-2 `}
                      >
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{college}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-1 text-xs `}>
                  <p>
                    <span className="font-semibold ">
                      Fee Structure:
                    </span>{' '}
                    {report.feeStructure || 'N/A'}
                  </p>
                  {report.availableScholarships && (
                    <p className="mt-2">
                      <span className="font-semibold ">
                        Scholarships:
                      </span>{' '}
                      {report.availableScholarships.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 5: Step-by-Step Career Journey */}
          <SectionContainer
            pageNum={5}
            totalPages={10}
            title="Step-by-Step Career Journey"
            isDark={isDark}
          >
            <div className="space-y-6">
              <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                <h4 className="text-xs font-bold uppercase text-indigo-600">
                  Step-by-Step Roadmap
                </h4>
                <p className="text-xs leading-relaxed">
                  {report.stepByStepRoadmap || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} `}>
                  <h5 className="text-xs font-bold text-indigo-600 mb-2">
                    Entry Level Roles
                  </h5>
                  <ul className="space-y-1">
                    {(report.entryLevelRoles || []).map((role, i) => (
                      <li key={i} className="text-xs ">
                        • {role}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} `}>
                  <h5 className="text-xs font-bold text-indigo-600 mb-2">
                    Mid Level Roles
                  </h5>
                  <ul className="space-y-1">
                    {(report.midLevelRoles || []).map((role, i) => (
                      <li key={i} className="text-xs ">
                        • {role}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} `}>
                  <h5 className="text-xs font-bold text-indigo-600 mb-2">
                    Senior Level Roles
                  </h5>
                  <ul className="space-y-1">
                    {(report.seniorLevelRoles || []).map((role, i) => (
                      <li key={i} className="text-xs ">
                        • {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Specializations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(report.specializations || []).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md  
                        text-indigo-600 border border-indigo-500/100"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Alternative Career Paths
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(report.alternativeCareerPaths || []).map((alt, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md  
                        border border-slate-500/100"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 6: Employment Sectors & Hiring Markets */}
          <SectionContainer
            pageNum={6}
            totalPages={10}
            title="Employment Sectors & Hiring Markets"
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Government Opportunities
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.govtJobOpportunities || 'N/A'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Private Sector Opportunities
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.privateJobOpportunities || 'N/A'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Self Employment & Freelance
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.selfEmploymentOptions || 'N/A'}
                  </p>
                  {report.freelanceOpportunities && (
                    <p className="text-xs leading-relaxed  mt-2">
                      {report.freelanceOpportunities}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Top Hiring Industries
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(report.hiringIndustries || []).map((ind, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md 
                        text-indigo-500 border border-indigo-500/100"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Top Global Employers
                  </h4>
                  <div className="space-y-1.5">
                    {(report.topGlobalEmployers || []).map((emp, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-500/5 text-xs font-semibold flex items-center gap-2"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{emp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Home vs Abroad Overview
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.homeVsAbroadOverview || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 7: Financial Trajectory & Compensation */}
          <SectionContainer
            pageNum={7}
            totalPages={10}
            title="Financial Trajectory & Compensation"
            isDark={isDark}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <MetricBox
                  icon={Coins}
                  label="Starting Salary"
                  value={report.startingSalaryRange || 'N/A'}
                  color="emerald"
                  isDark={isDark}
                />
                <MetricBox
                  icon={Coins}
                  label="Average Salary"
                  value={report.averageSalary || 'N/A'}
                  color="indigo"
                  isDark={isDark}
                />
                <MetricBox
                  icon={Coins}
                  label="Experienced Salary"
                  value={report.experiencedSalary || 'N/A'}
                  color="blue"
                  isDark={isDark}
                />
                <MetricBox
                  icon={Coins}
                  label="Highest Potential"
                  value={report.highestPotentialEarnings || 'N/A'}
                  color="amber"
                  isDark={isDark}
                />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                  Salary by Experience Level
                </h3>
                <div className="grid grid-cols-1  md:grid-cols-2 gap-3">
                  {(report.salaryByExperience || []).map((point, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'}
                       text-start space-y-1 `}
                    >
                      <p className="text-[10px] font-bold  uppercase">
                        {point.stage}
                      </p>
                      <p className="text-sm font-bold text-indigo-600">
                        {point.range}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                  Salary by Specialization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {(report.salaryBySpecialization || []).map((spec, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} 
                        flex justify-between items-center text-xs `}
                    >
                      <span className="font-semibold">
                        {spec.specialization}
                      </span>
                      <span className="font-bold text-indigo-600">
                        {spec.avgSalary}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 8: Global Mobility & Practice Abroad */}
          <SectionContainer
            pageNum={8}
            totalPages={10}
            title="Global Mobility & Practice Abroad"
            isDark={isDark}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                    Top Target Countries
                  </h3>
                  <div className="space-y-2">
                    {(report.topCountriesAbroad || []).map((country, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} 
                        flex items-center justify-between text-xs `}
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold">{country}</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded  text-indigo-600">
                          High Demand
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                    Required Exams & Licensing Abroad
                  </h3>
                  <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 text-xs `}>
                    <div>
                      <span className="font-semibold  block mb-1">
                        Exams Abroad:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(report.requiredExamsAbroad || []).map((exam, i) => (
                          <span
                            key={i}
                            className="py-0.5 rounded "
                          >
                            {exam}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold  block">
                        Licensing:
                      </span>
                      <p className="">
                        {report.licensingAbroad || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                  Salary Abroad Comparison
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {(report.salaryAbroadComparison || []).map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-1 text-xs `}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{item.country}</span>
                        <span className="text-indigo-600">{item.avgSalary}</span>
                      </div>
                      <p className="text-[10px]">
                        Visa Ease:{' '}
                        <span className="font-semibold text-indigo-600">
                          {item.visaEase}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 9: Career Reality & Work-Life Balance */}
          <SectionContainer
            pageNum={9}
            totalPages={10}
            title="Career Reality & Work-Life Balance"
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Key Ratings & Environment
                </h3>
                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
                  <div className="flex justify-start gap-1 items-center text-xs">
                    <span className="font-semibold">
                      Work-Life Balance Score:
                    </span>
                    <span className="px-2.5 py-1 rounded-full  text-indigo-600 font-bold">
                      {report.workLifeBalanceRating ?? 0}/10
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 items-center text-xs">
                    <span className="font-semibold">Job Security Score:</span>
                    <span className="px-2.5 py-1 rounded-full text-indigo-600 font-bold">
                      {report.jobSecurityRating ?? 0}/10
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 items-center text-xs">
                    <span className="font-semibold">Typical Hours:</span>
                    <span className="font-bold">{report.typicalWorkingHours}</span>
                  </div>
                  <div className="flex justify-start gap-1 items-center text-xs">
                    <span className="font-semibold">Stress Level:</span>
                    <span className="font-bold text-ambe-400">
                      {report.stressLevel}
                    </span>
                  </div>
                  <div className="flex justify-start gap-1 items-center text-xs">
                    <span className="font-semibold">Competition Level:</span>
                    <span className="font-bold">{report.competitionLevel}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                    Key Advantages
                  </h4>
                  <ul className="space-y-1.5">
                    {(report.advantages || []).map((adv, i) => (
                      <li
                        key={i}
                        className={`text-xs border ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2 p-2 rounded-lg `}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
                    Key Disadvantages & Challenges
                  </h4>
                  <ul className="space-y-1.5">
                    {(report.disadvantages || []).map((dis, i) => (
                      <li
                        key={i}
                        className={`text-xs border ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2 p-2 rounded-lg `}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* PAGE 10: Future Readiness & AI Resilience */}
          <SectionContainer
            pageNum={10}
            totalPages={10}
            title="Future Readiness & AI Resilience"
            isDark={isDark}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    Future Demand Outlook
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {report.futureDemandOutlook || 'N/A'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
                  <h4 className="text-xs font-bold uppercase text-indigo-600">
                    AI Automation & Replacement Risk
                  </h4>
                  <div className="flex justify-start gap-1 items-center text-xs">
                    <span className="font-semibold">Replacement Risk:</span>
                    <span className="">
                      {report.aiReplacementRiskLevel}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed ">
                    {report.aiAutomationImpact || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Emerging Opportunities
                  </h4>
                  <ul className="space-y-1.5">
                    {(report.emergingOpportunities || []).map((opp, i) => (
                      <li
                        key={i}
                        className={`text-xs p-2.5 rounded-lg border 
                          ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2`}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Emerging Specializations
                  </h4>
                  <ul className="space-y-1.5">
                    {(report.emergingSpecializations || []).map((spec, i) => (
                      <li
                        key={i}
                        className={`text-xs p-2.5 rounded-lg border 
                          ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2 `}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`pt-6 border-t ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex justify-between 
              items-center text-[10px] `}>
                <span>Career Map Finder Intelligence Report</span>
                <span>Verified Data Engine</span>
              </div>
            </div>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
}

function SectionContainer({
  pageNum,
  totalPages,
  title,
  children,
  isDark,
}: {
  pageNum: number;
  totalPages: number;
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      data-a4-page={pageNum}
      className={`a4-page-section p-6 rounded-2xl border shadow-xl transition-all space-y-6 ${
        isDark
          ? 'bg-slate-900/90 border-slate-700 text-slate-100'
          : 'bg-white border-slate-300 text-slate-900'
      }`}
    >
      <div className={`flex items-center justify-between border-b pb-4 
        ${ isDark ? 'border-slate-700' : 'border-slate-300'}`}>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            Page {pageNum} of {totalPages}
          </span>
          <h2 className="text-[13px] font-bold tracking-tight">{title}</h2>
        </div>
        <div className="text-[13px] font-semibold px-2.5 py-1 rounded-md">
          CareerMapFinder 
        </div>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}

function MetricBox({
  icon: Icon,
  label,
  value,
  color,
  isDark,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'emerald' | 'indigo' | 'blue' | 'amber';
  isDark: boolean;
}) {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    blue: 'bg-blue-500/10 text-blue-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  const styleClass = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`p-3 rounded-xl border flex items-center gap-3 ${
        isDark
          ? 'bg-slate-950/50 border-slate-700'
          : 'bg-slate-50 border-slate-300'
      }`}
    >
      <div className={`p-2 rounded-lg shrink-0 ${styleClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold ">
          {label}
        </p>
        <p className="text-xs font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { GraduationCap, TrendingUp, Globe, Award,ShieldCheck, Coins, 
// CheckCircle2, Clock, Sparkles, BookOpen, Building2, Briefcase, AlertTriangle } from 'lucide-react';
// import { useTheme } from '@/app/context/ThemeContext';
// import { ComprehensiveCareerReport } from '@/app/utils/career-explorer/careerExplorer';
// import { sampleProductionCareerReport } from '@/app/utils/career-explorer/sampleCareerReport';

// export default function CareerReportDetailPage() {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
//   const params = useParams();
//   const router = useRouter();
//   const reportId = params['report-id'] as string;

//   const [report, setReport] = useState<ComprehensiveCareerReport | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const printRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     let isMounted = true;
//     setLoading(true);

//     const fetchReport = async () => {
//       try {
//         const reportsList = Array.isArray(sampleProductionCareerReport)
//           ? sampleProductionCareerReport
//           : [];
//         const foundReport =
//           reportsList.find((item) => item.id === reportId) || reportsList[0];

//         if (isMounted) {
//           setReport(foundReport || null);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error('Failed to fetch career report:', error);
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchReport();

//     return () => {
//       isMounted = false;
//     };
//   }, [reportId]);

//   if (loading) {
//     return (
//       <div
//         className={`min-h-screen flex items-center justify-center ${
//           isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//         }`}
//       >
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-indigo-500 
//            border-t-transparent rounded-full animate-spin" />
//           <p className="text-xs font-semibold text-slate-400">
//             Loading Comprehensive Report...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!report) {
//     return (
//       <div
//         className={`min-h-screen flex items-center justify-center ${
//           isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//         }`}
//       >
//         <div className="text-center space-y-4">
//           <h2 className="text-xl font-bold">Report Not Found</h2>
//           <button
//             onClick={() => router.push('/dashboard/career-explorer')}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-xl
//              text-xs font-semibold hover:bg-indigo-700 transition">
//             Back to Catalog
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen transition-colors duration-300 print:p-0 print:bg-white print:text-slate-900 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`} >

//       <div className="max-w-7xl mx-auto space-y-6">

//         <div ref={printRef} className="space-y-6 print:space-y-0 ">
//           {/* PAGE 1: Identity & Role Blueprint */}
//           <SectionContainer
//             pageNum={1}
//             totalPages={10}
//             title="Identity & Role Blueprint"
//             isDark={isDark}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div className="md:col-span-2 space-y-4">
//                 <div className={`p-4 -mt-3 rounded-xl border ${isDark ? 'border-slate-700' : 'border-slate-300'} `}>
//                   <h3 className="text-xl font-bold text-indigo-600 mb-2">
//                     {report.careerName || 'N/A'}
//                   </h3>
//                   <p className="text-xs leading-relaxed opacity-100">
//                     {report.careerOverview || 'N/A'}
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <div>
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
//                       What a Professional Does
//                     </h4>
//                     <p className="text-xs leading-relaxed ">
//                       {report.whatProfessionalDoes || 'N/A'}
//                     </p>
//                   </div>

//                   <div>
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
//                       Why Choose This Career
//                     </h4>
//                     <p className="text-xs leading-relaxed ">
//                       {report.whyChooseThisCareer || 'N/A'}
//                     </p>
//                   </div>

//                   <div>
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
//                       Who Is Suitable For
//                     </h4>
//                     <p className="text-xs leading-relaxed ">
//                       {report.whoIsSuitableFor || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <MetricBox
//                   icon={Coins}
//                   label="Starting Salary"
//                   value={report.startingSalaryRange || 'N/A'}
//                   color="emerald"
//                   isDark={isDark}
//                 />
//                 <MetricBox
//                   icon={GraduationCap}
//                   label="Min Qualification"
//                   value={report.minQualification || 'N/A'}
//                   color="indigo"
//                   isDark={isDark}
//                 />
//                 <MetricBox
//                   icon={ShieldCheck}
//                   label="Job Security Rating"
//                   value={`${report.jobSecurityRating ?? 0}/10`}
//                   color="blue"
//                   isDark={isDark}
//                 />
//                 <MetricBox
//                   icon={Clock}
//                   label="Typical Hours"
//                   value={report.typicalWorkingHours || 'N/A'}
//                   color="amber"
//                   isDark={isDark}
//                 />
//               </div>
//             </div>

//             <div className={`mt-6 pt-6 border-t ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-4 `}>
//               <div>
//                 <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                   Work Environment
//                 </h4>
//                 <p className="text-xs leading-relaxed ">
//                   {report.workEnvironmentDesc || 'N/A'}
//                 </p>
//               </div>

//               <div>
//                 <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                   A Typical Day in the Life
//                 </h4>
//                 <p className="text-xs leading-relaxed ">
//                   {report.typicalDayLife || 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 2: Education & Academic Eligibility */}
//           <SectionContainer
//             pageNum={2}
//             totalPages={10}
//             title="Education & Academic Eligibility"
//             isDark={isDark}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <GraduationCap className="w-5 h-5 text-indigo-500" />
//                   <h3 className="text-sm font-bold uppercase tracking-wide">
//                     Academic Requirements
//                   </h3>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
//                   <div className="flex justify-start gap-1 text-xs">
//                     <span className="font-semibold ">
//                       Class 10 Requirements:
//                     </span>
//                     <span className=" text-right">
//                       {report.class10Requirements || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 text-xs">
//                     <span className="font-semibold ">
//                       Class 11/12 Stream:
//                     </span>
//                     <span className=" text-right">
//                       {report.class11_12Stream || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 text-xs">
//                     <span className="font-semibold ">
//                       Minimum Qualification:
//                     </span>
//                     <span className=" text-right">
//                       {report.minQualification || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 text-xs">
//                     <span className="font-semibold ">
//                       Degree Required:
//                     </span>
//                     <span className=" text-right">
//                       {report.degreeRequired || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 text-xs">
//                     <span className="font-semibold ">
//                       Course Duration:
//                     </span>
//                     <span className=" text-right">
//                       {report.courseDuration || 'N/A'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-600">
//                     Required Subjects
//                   </h4>
//                   <ul className="grid grid-cols-2 gap-2">
//                     {(report.subjectsRequired || []).map((sub, i) => (
//                       <li
//                         key={i}
//                         className="text-xs flex items-center gap-1.5 p-2 rounded-lg "
//                       >
//                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
//                         <span>{sub}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <Award className="w-5 h-5 text-indigo-500" />
//                   <h3 className="text-sm font-bold uppercase tracking-wide">
//                     Course Options & Eligibility Details
//                   </h3>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   {report.ageLimit && (
//                     <p className="text-xs">
//                       <span className="font-semibold ">
//                         Age Limit:
//                       </span>{' '}
//                       {report.ageLimit}
//                     </p>
//                   )}
//                   {report.nationalityEligibility && (
//                     <p className="text-xs">
//                       <span className="font-semibold ">
//                         Nationality Eligibility:
//                       </span>{' '}
//                       {report.nationalityEligibility}
//                     </p>
//                   )}
//                   {report.medicalRequirements && (
//                     <p className="text-xs">
//                       <span className="font-semibold ">
//                         Medical Requirements:
//                       </span>{' '}
//                       {report.medicalRequirements}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-600">
//                     Available Course Options
//                   </h4>
//                   <div className="space-y-2">
//                     {(report.courseOptions || []).map((course, i) => (
//                       <div
//                         key={i}
//                         className={`p-2.5 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-3`}
//                       >
//                         <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex 
//                         items-center justify-center font-bold text-xs shrink-0">
//                           {i + 1}
//                         </span>
//                         <span className="text-xs font-semibold">{course}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 3: Entrance Examinations & Strategy */}
//           <SectionContainer
//             pageNum={3}
//             totalPages={10}
//             title="Entrance Examinations & Strategy"
//             isDark={isDark}
//           >
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2`}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     National Exams
//                   </h4>
//                   <div className="flex flex-wrap gap-1">
//                     {(report.nationalExams || []).map((exam, i) => (
//                       <span
//                         key={i}
//                         className="text-[10px] font-semibold  py-0.5 rounded "
//                       >
//                         {exam}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className={` p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     State Exams
//                   </h4>
//                   <div className="flex flex-wrap gap-1">
//                     {(report.stateExams || []).map((exam, i) => (
//                       <span
//                         key={i}
//                         className="text-[10px] font-semibold  py-0.5 rounded "
//                       >
//                         {exam}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     University Exams
//                   </h4>
//                   <div className="flex flex-wrap gap-1">
//                     {(report.universityExams || []).map((exam, i) => (
//                       <span
//                         key={i}
//                         className="text-[10px] font-semibold py-0.5 rounded "
//                       >
//                         {exam}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                 <div className="space-y-3">
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Exam Pattern & Details
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.examPattern || 'N/A'}
//                   </p>
//                   <p className="text-xs leading-relaxed">
//                     <span className="font-semibold ">
//                       Eligibility:
//                     </span>{' '}
//                     {report.examEligibility || 'N/A'}
//                   </p>
//                   {report.markingScheme && (
//                     <p className="text-xs">
//                       <span className="font-semibold ">
//                         Marking Scheme:
//                       </span>{' '}
//                       {report.markingScheme}
//                     </p>
//                   )}
//                   {report.examFrequency && (
//                     <p className="text-xs">
//                       <span className="font-semibold ">
//                         Exam Frequency:
//                       </span>{' '}
//                       {report.examFrequency}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-3">
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Preparation Strategy & Books
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.prepStrategy || 'N/A'}
//                   </p>
//                   <p className="text-xs font-semibold ">
//                     Prep Timeline: {report.prepTimeline || 'N/A'}
//                   </p>
//                   <div>
//                     <span className="text-xs font-bold  block mb-1">
//                       Recommended Books:
//                     </span>
//                     <ul className="space-y-1">
//                       {(report.recommendedBooks || []).map((book, i) => (
//                         <li
//                           key={i}
//                           className="text-xs flex items-center gap-1.5"
//                         >
//                           <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
//                           <span>{book}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 4: Admissions & College Guidance */}
//           <SectionContainer
//             pageNum={4}
//             totalPages={10}
//             title="Admissions & College Guidance"
//             isDark={isDark}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div className="space-y-4">
//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Admission Process
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.admissionProcess || 'N/A'}
//                   </p>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2`}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Counselling Process
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.counsellingProcess || 'N/A'}
//                   </p>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2`}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     College Selection Guide
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.collegeSelectionGuide || 'N/A'}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Top Government Colleges
//                   </h4>
//                   <ul className="space-y-1.5">
//                     {(report.topGovtColleges || []).map((college, i) => (
//                       <li
//                         key={i}
//                         className={`text-xs p-2 rounded-lg border ${ isDark ? 'border-slate-700' : 'border-slate-300'}
//                          flex items-center gap-2 `}
//                       >
//                         <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
//                         <span>{college}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Top Private Colleges
//                   </h4>
//                   <ul className="space-y-1.5">
//                     {(report.topPrivateColleges || []).map((college, i) => (
//                       <li
//                         key={i}
//                         className={`text-xs p-2 border ${ isDark ? 'border-slate-700' : 'border-slate-300'}
//                           rounded-lg  flex items-center gap-2 `}
//                       >
//                         <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
//                         <span>{college}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-1 text-xs `}>
//                   <p>
//                     <span className="font-semibold ">
//                       Fee Structure:
//                     </span>{' '}
//                     {report.feeStructure || 'N/A'}
//                   </p>
//                   {report.availableScholarships && (
//                     <p className="mt-2">
//                       <span className="font-semibold ">
//                         Scholarships:
//                       </span>{' '}
//                       {report.availableScholarships.join(', ')}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 5: Step-by-Step Career Journey */}
//           <SectionContainer
//             pageNum={5}
//             totalPages={10}
//             title="Step-by-Step Career Journey"
//             isDark={isDark}
//           >
//             <div className="space-y-6">
//               <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                 <h4 className="text-xs font-bold uppercase text-indigo-600">
//                   Step-by-Step Roadmap
//                 </h4>
//                 <p className="text-xs leading-relaxed">
//                   {report.stepByStepRoadmap || 'N/A'}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//                 <div className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} `}>
//                   <h5 className="text-xs font-bold text-indigo-600 mb-2">
//                     Entry Level Roles
//                   </h5>
//                   <ul className="space-y-1">
//                     {(report.entryLevelRoles || []).map((role, i) => (
//                       <li key={i} className="text-xs ">
//                         • {role}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} `}>
//                   <h5 className="text-xs font-bold text-indigo-600 mb-2">
//                     Mid Level Roles
//                   </h5>
//                   <ul className="space-y-1">
//                     {(report.midLevelRoles || []).map((role, i) => (
//                       <li key={i} className="text-xs ">
//                         • {role}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} `}>
//                   <h5 className="text-xs font-bold text-indigo-600 mb-2">
//                     Senior Level Roles
//                   </h5>
//                   <ul className="space-y-1">
//                     {(report.seniorLevelRoles || []).map((role, i) => (
//                       <li key={i} className="text-xs ">
//                         • {role}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Specializations
//                   </h4>
//                   <div className="flex flex-wrap gap-1.5">
//                     {(report.specializations || []).map((spec, i) => (
//                       <span
//                         key={i}
//                         className="text-[10px] font-semibold px-2.5 py-1 rounded-md  
//                         text-indigo-600 border border-indigo-500/100"
//                       >
//                         {spec}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Alternative Career Paths
//                   </h4>
//                   <div className="flex flex-wrap gap-1.5">
//                     {(report.alternativeCareerPaths || []).map((alt, i) => (
//                       <span
//                         key={i}
//                         className="text-[10px] font-semibold px-2.5 py-1 rounded-md  
//                         border border-slate-500/100"
//                       >
//                         {alt}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 6: Employment Sectors & Hiring Markets */}
//           <SectionContainer
//             pageNum={6}
//             totalPages={10}
//             title="Employment Sectors & Hiring Markets"
//             isDark={isDark}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div className="space-y-4">
//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Government Opportunities
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.govtJobOpportunities || 'N/A'}
//                   </p>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Private Sector Opportunities
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.privateJobOpportunities || 'N/A'}
//                   </p>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Self Employment & Freelance
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.selfEmploymentOptions || 'N/A'}
//                   </p>
//                   {report.freelanceOpportunities && (
//                     <p className="text-xs leading-relaxed  mt-2">
//                       {report.freelanceOpportunities}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Top Hiring Industries
//                   </h4>
//                   <div className="flex flex-wrap gap-1.5">
//                     {(report.hiringIndustries || []).map((ind, i) => (
//                       <span
//                         key={i}
//                         className="text-[10px] font-semibold px-2.5 py-1 rounded-md 
//                         text-indigo-500 border border-indigo-500/100"
//                       >
//                         {ind}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Top Global Employers
//                   </h4>
//                   <div className="space-y-1.5">
//                     {(report.topGlobalEmployers || []).map((emp, i) => (
//                       <div
//                         key={i}
//                         className="p-2 rounded-lg bg-slate-500/5 text-xs font-semibold flex items-center gap-2"
//                       >
//                         <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
//                         <span>{emp}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-2 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Home vs Abroad Overview
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.homeVsAbroadOverview || 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 7: Financial Trajectory & Compensation */}
//           <SectionContainer
//             pageNum={7}
//             totalPages={10}
//             title="Financial Trajectory & Compensation"
//             isDark={isDark}
//           >
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//                 <MetricBox
//                   icon={Coins}
//                   label="Starting Salary"
//                   value={report.startingSalaryRange || 'N/A'}
//                   color="emerald"
//                   isDark={isDark}
//                 />
//                 <MetricBox
//                   icon={Coins}
//                   label="Average Salary"
//                   value={report.averageSalary || 'N/A'}
//                   color="indigo"
//                   isDark={isDark}
//                 />
//                 <MetricBox
//                   icon={Coins}
//                   label="Experienced Salary"
//                   value={report.experiencedSalary || 'N/A'}
//                   color="blue"
//                   isDark={isDark}
//                 />
//                 <MetricBox
//                   icon={Coins}
//                   label="Highest Potential"
//                   value={report.highestPotentialEarnings || 'N/A'}
//                   color="amber"
//                   isDark={isDark}
//                 />
//               </div>

//               <div>
//                 <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
//                   Salary by Experience Level
//                 </h3>
//                 <div className="grid grid-cols-1  md:grid-cols-2 gap-3">
//                   {(report.salaryByExperience || []).map((point, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'}
//                        text-start space-y-1 `}
//                     >
//                       <p className="text-[10px] font-bold  uppercase">
//                         {point.stage}
//                       </p>
//                       <p className="text-sm font-bold text-indigo-600">
//                         {point.range}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
//                   Salary by Specialization
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
//                   {(report.salaryBySpecialization || []).map((spec, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} 
//                         flex justify-between items-center text-xs `}
//                     >
//                       <span className="font-semibold">
//                         {spec.specialization}
//                       </span>
//                       <span className="font-bold text-indigo-600">
//                         {spec.avgSalary}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 8: Global Mobility & Practice Abroad */}
//           <SectionContainer
//             pageNum={8}
//             totalPages={10}
//             title="Global Mobility & Practice Abroad"
//             isDark={isDark}
//           >
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                 <div>
//                   <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
//                     Top Target Countries
//                   </h3>
//                   <div className="space-y-2">
//                     {(report.topCountriesAbroad || []).map((country, i) => (
//                       <div
//                         key={i}
//                         className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} 
//                         flex items-center justify-between text-xs `}
//                       >
//                         <span className="flex items-center gap-2">
//                           <Globe className="w-4 h-4 text-indigo-600" />
//                           <span className="font-semibold">{country}</span>
//                         </span>
//                         <span className="text-[10px] font-bold px-2 py-0.5 rounded  text-indigo-600">
//                           High Demand
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
//                     Required Exams & Licensing Abroad
//                   </h3>
//                   <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 text-xs `}>
//                     <div>
//                       <span className="font-semibold  block mb-1">
//                         Exams Abroad:
//                       </span>
//                       <div className="flex flex-wrap gap-1">
//                         {(report.requiredExamsAbroad || []).map((exam, i) => (
//                           <span
//                             key={i}
//                             className="py-0.5 rounded "
//                           >
//                             {exam}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-semibold  block">
//                         Licensing:
//                       </span>
//                       <p className="">
//                         {report.licensingAbroad || 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
//                   Salary Abroad Comparison
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
//                   {(report.salaryAbroadComparison || []).map((item, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-1 text-xs `}
//                     >
//                       <div className="flex justify-between font-bold">
//                         <span>{item.country}</span>
//                         <span className="text-indigo-600">{item.avgSalary}</span>
//                       </div>
//                       <p className="text-[10px]">
//                         Visa Ease:{' '}
//                         <span className="font-semibold text-indigo-600">
//                           {item.visaEase}
//                         </span>
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 9: Career Reality & Work-Life Balance */}
//           <SectionContainer
//             pageNum={9}
//             totalPages={10}
//             title="Career Reality & Work-Life Balance"
//             isDark={isDark}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div className="space-y-4">
//                 <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
//                   Key Ratings & Environment
//                 </h3>
//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
//                   <div className="flex justify-start gap-1 items-center text-xs">
//                     <span className="font-semibold">
//                       Work-Life Balance Score:
//                     </span>
//                     <span className="px-2.5 py-1 rounded-full  text-indigo-600 font-bold">
//                       {report.workLifeBalanceRating ?? 0}/10
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 items-center text-xs">
//                     <span className="font-semibold">Job Security Score:</span>
//                     <span className="px-2.5 py-1 rounded-full text-indigo-600 font-bold">
//                       {report.jobSecurityRating ?? 0}/10
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 items-center text-xs">
//                     <span className="font-semibold">Typical Hours:</span>
//                     <span className="font-bold">{report.typicalWorkingHours}</span>
//                   </div>
//                   <div className="flex justify-start gap-1 items-center text-xs">
//                     <span className="font-semibold">Stress Level:</span>
//                     <span className="font-bold text-ambe-400">
//                       {report.stressLevel}
//                     </span>
//                   </div>
//                   <div className="flex justify-start gap-1 items-center text-xs">
//                     <span className="font-semibold">Competition Level:</span>
//                     <span className="font-bold">{report.competitionLevel}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
//                     Key Advantages
//                   </h4>
//                   <ul className="space-y-1.5">
//                     {(report.advantages || []).map((adv, i) => (
//                       <li
//                         key={i}
//                         className={`text-xs border ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2 p-2 rounded-lg `}
//                       >
//                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
//                         <span>{adv}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
//                     Key Disadvantages & Challenges
//                   </h4>
//                   <ul className="space-y-1.5">
//                     {(report.disadvantages || []).map((dis, i) => (
//                       <li
//                         key={i}
//                         className={`text-xs border ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2 p-2 rounded-lg `}
//                       >
//                         <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
//                         <span>{dis}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* PAGE 10: Future Readiness & AI Resilience */}
//           <SectionContainer
//             pageNum={10}
//             totalPages={10}
//             title="Future Readiness & AI Resilience"
//             isDark={isDark}
//           >
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     Future Demand Outlook
//                   </h4>
//                   <p className="text-xs leading-relaxed">
//                     {report.futureDemandOutlook || 'N/A'}
//                   </p>
//                 </div>

//                 <div className={`p-4 rounded-xl border ${ isDark ? 'border-slate-700' : 'border-slate-300'} space-y-3 `}>
//                   <h4 className="text-xs font-bold uppercase text-indigo-600">
//                     AI Automation & Replacement Risk
//                   </h4>
//                   <div className="flex justify-start gap-1 items-center text-xs">
//                     <span className="font-semibold">Replacement Risk:</span>
//                     <span className="">
//                       {report.aiReplacementRiskLevel}
//                     </span>
//                   </div>
//                   <p className="text-xs leading-relaxed ">
//                     {report.aiAutomationImpact || 'N/A'}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Emerging Opportunities
//                   </h4>
//                   <ul className="space-y-1.5">
//                     {(report.emergingOpportunities || []).map((opp, i) => (
//                       <li
//                         key={i}
//                         className={`text-xs p-2.5 rounded-lg border 
//                           ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2`}
//                       >
//                         <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
//                         <span>{opp}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
//                     Emerging Specializations
//                   </h4>
//                   <ul className="space-y-1.5">
//                     {(report.emergingSpecializations || []).map((spec, i) => (
//                       <li
//                         key={i}
//                         className={`text-xs p-2.5 rounded-lg border 
//                           ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex items-center gap-2 `}
//                       >
//                         <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
//                         <span>{spec}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               <div className={`pt-6 border-t ${ isDark ? 'border-slate-700' : 'border-slate-300'} flex justify-between 
//               items-center text-[10px] `}>
//                 <span>Career Map Finder Intelligence Report</span>
//                 <span>Verified Data Engine</span>
//               </div>
//             </div>
//           </SectionContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// function SectionContainer({
//   pageNum,
//   totalPages,
//   title,
//   children,
//   isDark,
// }: {
//   pageNum: number;
//   totalPages: number;
//   title: string;
//   children: React.ReactNode;
//   isDark: boolean;
// }) {
//   return (
//     <div
//       data-a4-page={pageNum}
//       className={`a4-page-section p-6 rounded-2xl border shadow-xl transition-all space-y-6 ${
//         isDark
//           ? 'bg-slate-900/90 border-slate-700 text-slate-100'
//           : 'bg-white border-slate-300 text-slate-900'
//       }`}
//     >
//       <div className={`flex items-center justify-between border-b pb-4 
//         ${ isDark ? 'border-slate-700' : 'border-slate-300'}`}>
//         <div>
//           <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
//             Page {pageNum} of {totalPages}
//           </span>
//           <h2 className="text-[13px] font-bold tracking-tight">{title}</h2>
//         </div>
//         <div className="text-[13px] font-semibold px-2.5 py-1 rounded-md">
//           CareerMapFinder 
//         </div>
//       </div>
//       <div className="pt-2">{children}</div>
//     </div>
//   );
// }

// function MetricBox({
//   icon: Icon,
//   label,
//   value,
//   color,
//   isDark,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string;
//   color: 'emerald' | 'indigo' | 'blue' | 'amber';
//   isDark: boolean;
// }) {
//   const colorMap = {
//     emerald: 'bg-emerald-500/10 text-emerald-500',
//     indigo: 'bg-indigo-500/10 text-indigo-500',
//     blue: 'bg-blue-500/10 text-blue-500',
//     amber: 'bg-amber-500/10 text-amber-500',
//   };

//   const styleClass = colorMap[color] || colorMap.indigo;

//   return (
//     <div
//       className={`p-3 rounded-xl border flex items-center gap-3 ${
//         isDark
//           ? 'bg-slate-950/50 border-slate-700'
//           : 'bg-slate-50 border-slate-300'
//       }`}
//     >
//       <div className={`p-2 rounded-lg shrink-0 ${styleClass}`}>
//         <Icon className="w-4 h-4" />
//       </div>
//       <div>
//         <p className="text-[10px] uppercase font-bold ">
//           {label}
//         </p>
//         <p className="text-xs font-bold leading-tight">{value}</p>
//       </div>
//     </div>
//   );
// }