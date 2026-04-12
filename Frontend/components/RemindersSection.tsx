'use client';
import { useQuery } from '@tanstack/react-query';
import { Bell, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../lib/api-client';

interface Reminder {
  id: string;
  health_event_id: string;
  dependent_id: string;
  household_id: string;
  event_name: string;
  due_date: string;
  status: 'pending' | 'snoozed' | 'acknowledged' | 'completed';
}

interface RemindersResponse {
  reminders: Reminder[];
}

export function RemindersSection({ householdId }: { householdId?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reminders', householdId],
    queryFn: async (): Promise<RemindersResponse> => {
      const params = householdId ? `?household_id=${householdId}` : '';
      const response = await apiClient.get(`/reminders${params}`);
      return { reminders: Array.isArray(response.data) ? response.data : [] };
    },
    staleTime: 5 * 60 * 1000,
  });

  const reminders = data?.reminders || [];
  const pendingReminders = reminders.filter((r) => r.status === 'pending').slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 animate-pulse h-32" />
    );
  }

  if (pendingReminders.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Bell size={24} className="text-blue-500" strokeWidth={2.5} />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Upcoming Reminders
        </h3>
      </div>

      <div className="space-y-3">
        {pendingReminders.map((reminder, index) => {
          const dueDate = new Date(reminder.due_date);
          const today = new Date();
          const isOverdue = dueDate < today;
          const daysUntilDue = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl flex items-center gap-4 ${
                isOverdue
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isOverdue
                    ? 'bg-red-200 dark:bg-red-800'
                    : 'bg-blue-200 dark:bg-blue-800'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle
                    size={20}
                    className="text-red-600 dark:text-red-400"
                    strokeWidth={2.5}
                  />
                ) : (
                  <Calendar
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                    strokeWidth={2.5}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-white truncate">
                  {reminder.event_name}
                </p>
                <p
                  className={`text-sm ${
                    isOverdue
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysUntilDue)} days`
                    : daysUntilDue === 0
                      ? 'Due today'
                      : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
                </p>
              </div>

              <CheckCircle
                size={20}
                className="text-slate-400 dark:text-slate-600 shrink-0"
                strokeWidth={2}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
