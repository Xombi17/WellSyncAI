'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { HealthEvent } from '../lib/api';

interface MarkGivenRequest {
  // Empty body for now
}

interface VerifyVaccinationRequest {
  verified_by: string;
  verification_notes?: string;
  verification_document_url?: string;
}

export function useVerification() {
  const queryClient = useQueryClient();

  const markGivenMutation = useMutation({
    mutationFn: async ({
      dependentId,
      eventId,
    }: {
      dependentId: string;
      eventId: string;
    }): Promise<HealthEvent> => {
      const response = await apiClient.post(
        `/timeline/${dependentId}/events/${eventId}/mark-given`,
        {}
      );
      return response.data;
    },
    onSuccess: (_, { dependentId }) => {
      queryClient.invalidateQueries({ queryKey: ['timeline', dependentId] });
    },
  });

  const verifyVaccinationMutation = useMutation({
    mutationFn: async ({
      dependentId,
      eventId,
      data,
    }: {
      dependentId: string;
      eventId: string;
      data: VerifyVaccinationRequest;
    }): Promise<HealthEvent> => {
      const response = await apiClient.post(
        `/timeline/${dependentId}/events/${eventId}/verify`,
        data
      );
      return response.data;
    },
    onSuccess: (_, { dependentId }) => {
      queryClient.invalidateQueries({ queryKey: ['timeline', dependentId] });
    },
  });

  return {
    markGiven: markGivenMutation.mutate,
    markGivenAsync: markGivenMutation.mutateAsync,
    isMarkingGiven: markGivenMutation.isPending,
    verifyVaccination: verifyVaccinationMutation.mutate,
    verifyVaccinationAsync: verifyVaccinationMutation.mutateAsync,
    isVerifying: verifyVaccinationMutation.isPending,
  };
}
