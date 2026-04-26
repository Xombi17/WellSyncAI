import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_exception.dart';
import '../application/timeline_providers.dart';
import '../data/models/explain_event_response.dart';
import '../data/models/timeline_event.dart';
import '../data/timeline_repository.dart';

class TimelineScreen extends ConsumerStatefulWidget {
  const TimelineScreen({
    required this.dependentId,
    super.key,
  });

  static const String routePath = '/dependents/:dependentId/timeline';

  final String dependentId;

  @override
  ConsumerState<TimelineScreen> createState() => _TimelineScreenState();
}

class _TimelineScreenState extends ConsumerState<TimelineScreen> {
  final Set<String> _busyEventIds = <String>{};
  final Map<String, TimelineEvent> _optimisticEvents = <String, TimelineEvent>{};

  Future<void> _markGiven(TimelineEvent event) async {
    setState(() => _busyEventIds.add(event.id));
    try {
      final outcome = await ref.read(timelineRepositoryProvider).markEventGiven(
            dependentId: widget.dependentId,
            eventId: event.id,
          );
      if (outcome.queuedOffline) {
        setState(() {
          _optimisticEvents[event.id] = _optimisticMarkGiven(event);
        });
      } else {
        setState(() {
          _optimisticEvents.remove(event.id);
        });
        ref.invalidate(timelineProvider(widget.dependentId));
      }
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            outcome.queuedOffline
                ? 'Saved offline. It will sync when the connection returns.'
                : 'Marked as given. Waiting for verification.',
          ),
        ),
      );
    } catch (error) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_errorMessage(error))),
      );
    } finally {
      if (mounted) {
        setState(() => _busyEventIds.remove(event.id));
      }
    }
  }

  Future<void> _verifyEvent(TimelineEvent event) async {
    final request = await showDialog<_VerifyRequest>(
      context: context,
      builder: (context) => const _VerifyDialog(),
    );
    if (request == null) {
      return;
    }

    setState(() => _busyEventIds.add(event.id));
    try {
      final outcome = await ref.read(timelineRepositoryProvider).verifyEvent(
            dependentId: widget.dependentId,
            eventId: event.id,
            verifiedBy: request.verifiedBy,
            verificationNotes: request.verificationNotes,
          );
      if (outcome.queuedOffline) {
        setState(() {
          _optimisticEvents[event.id] = _optimisticVerifyPending(event);
        });
      } else {
        setState(() {
          _optimisticEvents.remove(event.id);
        });
        ref.invalidate(timelineProvider(widget.dependentId));
      }
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            outcome.queuedOffline
                ? 'Verification saved offline. It will sync when online.'
                : 'Vaccination verified.',
          ),
        ),
      );
    } catch (error) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_errorMessage(error))),
      );
    } finally {
      if (mounted) {
        setState(() => _busyEventIds.remove(event.id));
      }
    }
  }

  Future<void> _showExplanation(TimelineEvent event) async {
    final future = ref.read(timelineRepositoryProvider).explainEvent(
          eventId: event.id,
        );

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => _ExplainEventSheet(
        eventName: event.name,
        future: future,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final timelineValue = ref.watch(timelineProvider(widget.dependentId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Timeline'),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(timelineProvider(widget.dependentId).future),
        child: timelineValue.when(
          data: (timeline) => ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        timeline.dependentName,
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        timeline.nextDue == null
                            ? 'No urgent due event right now.'
                            : 'Next due: ${timeline.nextDue!.name} on ${_formatDate(timeline.nextDue!.dueDate)}',
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              if (timeline.events.isEmpty)
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(20),
                    child: Text('No timeline events are available for this dependent.'),
                  ),
                )
              else
                ...List.generate(
                  timeline.events.length,
                  (index) {
                    final event = _effectiveEvent(timeline.events[index]);
                    final isLast = index == timeline.events.length - 1;
                    final isBusy = _busyEventIds.contains(event.id);
                    return _TimelineStepCard(
                      event: event,
                      isLast: isLast,
                      isBusy: isBusy,
                      onExplain: () => _showExplanation(event),
                      onMarkGiven: _canMarkGiven(event) && !isBusy
                          ? () => _markGiven(event)
                          : null,
                      onVerify: _canVerify(event) && !isBusy
                          ? () => _verifyEvent(event)
                          : null,
                    );
                  },
                ),
            ],
          ),
          error: (error, _) => ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const SizedBox(height: 120),
              const Icon(Icons.error_outline_rounded, size: 56),
              const SizedBox(height: 16),
              Text(
                _errorMessage(error),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          loading: () => const Center(child: CircularProgressIndicator()),
        ),
      ),
    );
  }

  TimelineEvent _effectiveEvent(TimelineEvent event) {
    return _optimisticEvents[event.id] ?? event;
  }

  TimelineEvent _optimisticMarkGiven(TimelineEvent event) {
    final now = DateTime.now();
    return TimelineEvent(
      id: event.id,
      dependentId: event.dependentId,
      householdId: event.householdId,
      name: event.name,
      scheduleKey: event.scheduleKey,
      category: event.category,
      doseNumber: event.doseNumber,
      dueDate: event.dueDate,
      windowStart: event.windowStart,
      windowEnd: event.windowEnd,
      status: event.status,
      completedAt: event.completedAt,
      completedBy: event.completedBy,
      location: event.location,
      notes: event.notes,
      verificationStatus: VerificationStatus.pending,
      verifiedBy: event.verifiedBy,
      verificationDocumentUrl: event.verificationDocumentUrl,
      verificationNotes: event.verificationNotes,
      markedGivenAt: now,
      scheduleVersion: event.scheduleVersion,
      createdAt: event.createdAt,
      updatedAt: now,
    );
  }

  TimelineEvent _optimisticVerifyPending(TimelineEvent event) {
    return TimelineEvent(
      id: event.id,
      dependentId: event.dependentId,
      householdId: event.householdId,
      name: event.name,
      scheduleKey: event.scheduleKey,
      category: event.category,
      doseNumber: event.doseNumber,
      dueDate: event.dueDate,
      windowStart: event.windowStart,
      windowEnd: event.windowEnd,
      status: event.status,
      completedAt: event.completedAt,
      completedBy: event.completedBy,
      location: event.location,
      notes: event.notes,
      verificationStatus: VerificationStatus.pending,
      verifiedBy: event.verifiedBy,
      verificationDocumentUrl: event.verificationDocumentUrl,
      verificationNotes: event.verificationNotes,
      markedGivenAt: event.markedGivenAt,
      scheduleVersion: event.scheduleVersion,
      createdAt: event.createdAt,
      updatedAt: DateTime.now(),
    );
  }
}

bool _canMarkGiven(TimelineEvent event) {
  return event.category == EventCategory.vaccination &&
      event.markedGivenAt == null &&
      event.status != EventStatus.completed &&
      event.verificationStatus != VerificationStatus.verified;
}

bool _canVerify(TimelineEvent event) {
  return event.category == EventCategory.vaccination &&
      event.verificationStatus == VerificationStatus.pending;
}

String _statusLabel(TimelineEvent event) {
  if (event.verificationStatus == VerificationStatus.verified) {
    return 'Verified';
  }
  if (event.verificationStatus == VerificationStatus.pending) {
    return 'Pending verification';
  }

  return switch (event.status) {
    EventStatus.upcoming => 'Upcoming',
    EventStatus.due => 'Due',
    EventStatus.overdue => 'Overdue',
    EventStatus.completed => 'Completed',
  };
}

Color _statusColor(BuildContext context, TimelineEvent event) {
  final scheme = Theme.of(context).colorScheme;
  if (event.verificationStatus == VerificationStatus.verified ||
      event.status == EventStatus.completed) {
    return scheme.primary;
  }
  return switch (event.status) {
    EventStatus.upcoming => scheme.secondary,
    EventStatus.due => scheme.tertiary,
    EventStatus.overdue => scheme.error,
    EventStatus.completed => scheme.primary,
  };
}

String _categoryLabel(EventCategory category) {
  return switch (category) {
    EventCategory.vaccination => 'Vaccination',
    EventCategory.checkup => 'Checkup',
    EventCategory.vitamin => 'Vitamin',
    EventCategory.reminder => 'Reminder',
    EventCategory.prenatalCheckup => 'Prenatal checkup',
    EventCategory.medicineDose => 'Medicine dose',
    EventCategory.growthCheck => 'Growth check',
    EventCategory.supplement => 'Supplement',
  };
}

String _formatDate(DateTime value) {
  final month = value.month.toString().padLeft(2, '0');
  final day = value.day.toString().padLeft(2, '0');
  return '$day/$month/${value.year}';
}

String _errorMessage(Object error) {
  return switch (error) {
    ApiException exception => exception.message,
    _ => 'Something went wrong. Please try again.',
  };
}

class _TimelineStepCard extends StatelessWidget {
  const _TimelineStepCard({
    required this.event,
    required this.isLast,
    required this.isBusy,
    required this.onExplain,
    this.onMarkGiven,
    this.onVerify,
  });

  final TimelineEvent event;
  final bool isLast;
  final bool isBusy;
  final VoidCallback onExplain;
  final VoidCallback? onMarkGiven;
  final VoidCallback? onVerify;

  @override
  Widget build(BuildContext context) {
    final accent = _statusColor(context, event);

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 36,
            child: Column(
              children: [
                Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: accent,
                    shape: BoxShape.circle,
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      margin: const EdgeInsets.symmetric(vertical: 6),
                      color: accent.withValues(alpha: 0.25),
                    ),
                  ),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  event.name,
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  '${_categoryLabel(event.category)} • Due ${_formatDate(event.dueDate)}',
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Chip(
                            label: Text(_statusLabel(event)),
                            backgroundColor: accent.withValues(alpha: 0.15),
                            side: BorderSide.none,
                          ),
                        ],
                      ),
                      if (event.markedGivenAt != null) ...[
                        const SizedBox(height: 12),
                        Text(
                          'Marked given on ${_formatDate(event.markedGivenAt!)}',
                        ),
                      ],
                      if (event.verifiedBy != null) ...[
                        const SizedBox(height: 6),
                        Text('Verified by ${event.verifiedBy}'),
                      ],
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          OutlinedButton.icon(
                            onPressed: isBusy ? null : onExplain,
                            icon: const Icon(Icons.auto_awesome_outlined),
                            label: const Text('Explain this'),
                          ),
                          if (onMarkGiven != null)
                            FilledButton.tonalIcon(
                              onPressed: onMarkGiven,
                              icon: isBusy
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Icon(Icons.check_circle_outline_rounded),
                              label: const Text('Mark given'),
                            ),
                          if (onVerify != null)
                            FilledButton.icon(
                              onPressed: onVerify,
                              icon: isBusy
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Icon(Icons.verified_outlined),
                              label: const Text('Verify'),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ExplainEventSheet extends StatelessWidget {
  const _ExplainEventSheet({
    required this.eventName,
    required this.future,
  });

  final String eventName;
  final Future<ExplainEventResponse> future;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: FutureBuilder<ExplainEventResponse>(
          future: future,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const SizedBox(
                height: 220,
                child: Center(child: CircularProgressIndicator()),
              );
            }

            if (snapshot.hasError) {
              return SizedBox(
                height: 220,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      eventName,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    Text(_errorMessage(snapshot.error!)),
                  ],
                ),
              );
            }

            final explanation = snapshot.data!;
            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    explanation.eventName,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    explanation.explanation,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _VerifyRequest {
  const _VerifyRequest({
    required this.verifiedBy,
    this.verificationNotes,
  });

  final String verifiedBy;
  final String? verificationNotes;
}

class _VerifyDialog extends StatefulWidget {
  const _VerifyDialog();

  @override
  State<_VerifyDialog> createState() => _VerifyDialogState();
}

class _VerifyDialogState extends State<_VerifyDialog> {
  final _formKey = GlobalKey<FormState>();
  final _verifiedByController = TextEditingController();
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _verifiedByController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Verify vaccination'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _verifiedByController,
              decoration: const InputDecoration(
                labelText: 'Verified by',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Enter verifier name.';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _notesController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Verification notes',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () {
            if (!_formKey.currentState!.validate()) {
              return;
            }
            Navigator.of(context).pop(
              _VerifyRequest(
                verifiedBy: _verifiedByController.text.trim(),
                verificationNotes: _notesController.text.trim().isEmpty
                    ? null
                    : _notesController.text.trim(),
              ),
            );
          },
          child: const Text('Verify'),
        ),
      ],
    );
  }
}
