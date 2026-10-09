import { useTheme } from '@/app/context/ThemeContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bell } from 'lucide-react';

const notifications = () => {
      const { theme } = useTheme();
      const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div>
    
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); }}
            className={`p-2 rounded-xl border transition-colors relative ${
              theme === 'dark'
                ? 'text-slate-300 hover:bg-slate-900 border-slate-700'
                : 'text-slate-600 hover:bg-slate-50 border-slate-300'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span
              className={`w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ${
                theme === 'dark' ? 'ring-slate-950' : 'ring-white'
              }`}
            />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`hiddn absolute -right-10 sm:right-0 mt-2 w-80 border rounded-2xl shadow-2xl p-4 z-50 ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-300'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-3 border-b ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-300'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Notifications
                  </h4>
                  <span
                    className={`text-[10px] font-semibold cursor-pointer ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                  >
                    Mark all read
                  </span>
                </div>
                <div className="py-3 space-y-3">
                  <div
                    className={`text-xs p-2.5 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-700'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      JEE Advanced Cutoffs Released
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Updated cutoff metrics available for IIT Bombay CSE.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      10 minutes ago
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

    </div>
  )
}

export default notifications
