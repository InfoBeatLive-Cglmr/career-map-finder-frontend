import React from 'react';
import { AlertFormData } from './types';
import { ShieldAlert } from 'lucide-react';

interface Props {
  formData: AlertFormData;
  updateForm: (fields: Partial<AlertFormData>) => void;
  isDark: boolean;
}

export const AccountabilityRulesStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Notification Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="e.g. name@example.com"
            value={formData.contactEmail}
            onChange={(e) => updateForm({ contactEmail: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Preferred Daily Dispatch Time
          </label>
          <input
            type="time"
            value={formData.preferredAlertTime}
            onChange={(e) => updateForm({ preferredAlertTime: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Safety Policy / 3-Day Inactivity Rule Card */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
        isDark ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <h4 className="font-bold">Inactivity & Auto-Pause Protocol</h4>
          <p>
            To prevent inbox spam and maintain commitment, if you do not reply or submit feedback for <strong>3 consecutive dispatches</strong>, the AI system will automatically pause alerts until you log in and reactivate your goal.
          </p>
        </div>
      </div>

      {/* Additional Instructions */}
      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Special Context / Description
        </label>
        <textarea
          rows={3}
          placeholder="Mention specific description about the primary objective."
          value={formData.additionalContextNotes || ''}
          onChange={(e) => updateForm({ additionalContextNotes: e.target.value })}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
          }`}
        />
      </div>
    </div>
  );
};