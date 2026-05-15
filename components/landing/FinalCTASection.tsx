import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmailForm } from '@/components/ui/EmailForm';
import { Container } from '@/components/ui/Container';
import { C, F, S } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useWaitlistStats } from '@/hooks/useWaitlistStats';

interface Props {
  onSubmitEmail: (email: string, mode: 'client') => void;
}

export function FinalCTASection({ onSubmitEmail }: Props) {
  const { isMobile } = useResponsive();
  const { displayCount } = useWaitlistStats();

  return (
    <LinearGradient
      colors={[C.indigo700, C.indigo950]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.section}
    >
      <Container>
        <View style={styles.content}>
          <Text style={[styles.h2, isMobile && styles.h2Mobile]}>
            Soyez parmi les premiers{'\n'}à rejoindre MendPlace.
          </Text>
          <Text style={styles.lead}>
            Accès prioritaire au lancement. Première intervention sans frais de service pour les clients, 1 mois de frais réduits pour les artisans.
          </Text>
          <View style={styles.formWrapper}>
            <EmailForm onSubmit={(email) => onSubmitEmail(email, 'client')} dark />
          </View>
          {displayCount !== null && (
            <Text style={styles.counter}>
              Déjà <Text style={styles.counterBold}>{displayCount}</Text> personne{(Number(displayCount.replace(/\s/g, '')) > 1) ? 's' : ''} inscrite{(Number(displayCount.replace(/\s/g, '')) > 1) ? 's' : ''} · Lancement Q3 2026 à Paris
            </Text>
          )}
        </View>
      </Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 80,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
  },
  h2: {
    fontFamily: F.display,
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 46,
    color: C.white,
    textAlign: 'center',
    marginBottom: 14,
  },
  h2Mobile: {
    fontSize: 28,
    lineHeight: 34,
  },
  lead: {
    fontFamily: F.body,
    fontSize: 17,
    color: C.indigo200,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 440,
    marginBottom: 20,
  },
  counter: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  counterBold: {
    color: C.terra500,
    fontWeight: '700',
  },
});
