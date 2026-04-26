import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../application/dependent_providers.dart';
import '../data/models/dependent.dart';

class DependentsScreen extends ConsumerWidget {
  const DependentsScreen({super.key});

  static const String routePath = '/dependents';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dependentsValue = ref.watch(dependentListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dependents'),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(dependentListProvider.future),
        child: dependentsValue.when(
          data: (dependents) => dependents.isEmpty
              ? const _EmptyDependentsState()
              : ListView.separated(
                  padding: const EdgeInsets.all(20),
                  itemCount: dependents.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final dependent = dependents[index];
                    return Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          child: Text(_initialFor(dependent.name)),
                        ),
                        title: Text(dependent.name),
                        subtitle: Text(
                          '${_dependentLabel(dependent.type)} • DOB ${_formatDate(dependent.dateOfBirth)}',
                        ),
                        trailing: const Icon(Icons.chevron_right_rounded),
                        onTap: () => context.push(
                          '${DependentsScreen.routePath}/${dependent.id}/timeline',
                        ),
                      ),
                    );
                  },
                ),
          error: (error, _) => _LoadErrorState(message: error.toString()),
          loading: () => const Center(child: CircularProgressIndicator()),
        ),
      ),
    );
  }
}

String _dependentLabel(DependentType type) {
  return switch (type) {
    DependentType.child => 'Child',
    DependentType.adult => 'Adult',
    DependentType.elder => 'Elder',
    DependentType.pregnant => 'Pregnant',
  };
}

String _formatDate(DateTime value) {
  final month = value.month.toString().padLeft(2, '0');
  final day = value.day.toString().padLeft(2, '0');
  return '$day/$month/${value.year}';
}

String _initialFor(String value) {
  if (value.isEmpty) {
    return '?';
  }
  return String.fromCharCode(value.runes.first).toUpperCase();
}

class _EmptyDependentsState extends StatelessWidget {
  const _EmptyDependentsState();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: const [
        SizedBox(height: 120),
        Icon(Icons.child_care_outlined, size: 56),
        SizedBox(height: 16),
        Text(
          'No dependents added yet.',
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class _LoadErrorState extends StatelessWidget {
  const _LoadErrorState({required this.message});

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
