import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/voice/gemini_live_service.dart';

class VoiceFAB extends ConsumerStatefulWidget {
  const VoiceFAB({super.key});

  @override
  ConsumerState<VoiceFAB> createState() => _VoiceFABState();
}

class _VoiceFABState extends ConsumerState<VoiceFAB> with SingleTickerProviderStateMixin {
  bool _isListening = false;
  String _status = 'Disconnected';
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _toggleListening() async {
    final service = ref.read(geminiLiveServiceProvider);
    
    if (_isListening) {
      _animationController.stop();
      await service.stopListening();
      setState(() => _isListening = false);
    } else {
      await service.connect();
      await service.startListening();
      _animationController.repeat(reverse: true);
      setState(() => _isListening = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Listen to status changes
    ref.listen(geminiLiveServiceProvider, (previous, next) {
      // Status updates could be handled via a provider or stream
    });

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (_isListening)
          ScaleTransition(
            scale: Tween(begin: 1.0, end: 1.2).animate(
              CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
            ),
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Listening...',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        FloatingActionButton.large(
          onPressed: _toggleListening,
          backgroundColor: _isListening 
              ? Theme.of(context).colorScheme.error 
              : Theme.of(context).colorScheme.primary,
          child: Icon(
            _isListening ? Icons.mic_off : Icons.mic,
            size: 36,
            color: Colors.white,
          ),
        ),
      ],
    );
  }
}
