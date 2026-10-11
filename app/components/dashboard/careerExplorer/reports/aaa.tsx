'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GraduationCap, TrendingUp, Globe, Award,ShieldCheck, Coins, 
CheckCircle2, Clock, Sparkles, BookOpen, Building2, Briefcase, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { careerExplorerApi, CareerReportItem } from '@/app/utils/career-explorer/careerExplorerMain';

export default function ReportDownloadPage() {
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

      const response = await careerExplorerApi.getReportById(reportId);

      if (isMounted) {
        if (response && response.data) {
          setReport(response.data);

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
      className={`min-h-screen transition-colors p-6 duration-300 print:p-0 print:bg-white print:text-slate-900 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`} >

      <div className="max-w-8xl mx-auto space-y-6">

        <div ref={printRef} className="space-y-6 print:space-y-0 print:block">
          {/* PAGE 1: Identity & Role Blueprint */}
          <div className="print:break-after-always print:page-break-after-always">
          <SectionContainer
            pageNum={1}
            totalPages={10}
            title="Identity & Role Blueprint"
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className={`p-4 -mt-3 rounded-xl border 
                  ${isDark ? 'border-slate-700' : 'border-slate-300'} `}>
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
          </div>

          {/* PAGE 2: Education & Academic Eligibility */}
          <div className="print:break-after-always print:page-break-after-always">
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
          </div>

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
      className={`a4-page-section p-6 rounded-2xl border transition-all space-y-6 ${
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
 
