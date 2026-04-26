import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/reminder_providers.dart';
import '../data/models/reminder.dart';

class RemindersScreen extends ConsumerWidget {
  const RemindersScreen({super.key});

  static const String routePath = '/reminders';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final remindersValue = ref.watch(reminderListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reminders'),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(reminderListProvider.future),
        child: remindersValue.when(
          data: (reminders) => reminders.isEmpty
              ? const _EmptyReminderState()
              : ListView.separated(
                  padding: const EdgeInsets.all(20),
                  itemCount: reminders.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final reminder = reminders[index];
                    final status = _reminderStatusLabel(reminder.status);
                    return Card(
                      child: ListTile(
                        leading: const Icon(Icons.notifications_active_outlined),
                        title: Text(reminder.eventName),
                        subtitle: Text(
                          'Due ${_formatDate(reminder.dueDate)} • $status',
                        ),
                      ),
                    );
                  },
                ),
          error: (error, _) => _ErrorState(message: error.toString()),
          loading: () => const Center(child: CircularProgressIndicator()),
        ),
      ),
    );
  }
}

String _reminderStatusLabel(ReminderStatus status) {
  return switch (status) {
    ReminderStatus.pending => 'Pending',
    ReminderStatus.snoozed => 'Snoozed',
    ReminderStatus.acknowledged => 'Acknowledged',
    ReminderStatus.completed => 'Completed',
  };
}

String _formatDate(DateTime value) {
  final month = value.month.toString().padLeft(2, '0');
  final day = value.day.toString().padLeft(2, '0');
  return '$day/$month/${value.year}';
}

class _EmptyReminderState extends StatelessWidget {
  const _EmptyReminderState();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: const [
        SizedBox(height: 120),
        Icon(Icons.notifications_off_outlined, size: 56),
        SizedBox(height: 16),
        Text(
          'No reminders are due right now.',
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        const SizedBox(height: 120),
        const Icon(Icons.error_outline_rounded, size: 56),
        const SizedBox(height: 16),
        Text(
          message,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
