import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { C, F, R, S } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

const STEPS = [
  {
    num: '01',
    icon: 'message-square' as const,
    iconColor: C.indigo700,
    iconBg: C.indigo50,
    title: 'Tu décris ton besoin.',
    desc: 'Type d\'intervention, photos, disponibilités. Quelques mots suffisent. Aucun formulaire complexe.',
    time: '⏱ 2 min',
    timeBg: C.indigo50,
    timeColor: C.indigo700,
  },
  {
    num: '02',
    icon: 'file-text' as const,
    iconColor: C.terra700,
    iconBg: C.terra50,
    title: 'Un professionnel répond.',
    desc: 'Un artisan vérifié t\'envoie un devis détaillé. Tu valides en un clic, le paiement est sécurisé.',
    time: '⏱ ~30 min',
    timeBg: C.terra50,
    timeColor: C.terra700,
  },
  {
    num: '03',
    icon: 'check' as const,
    iconColor: C.sageDk,
    iconBg: C.sageBg,
    title: 'Intervention. Validation. Facture.',
    desc: 'Le professionnel intervient. Tu confirmes la mission dans l\'app. Le paiement est libéré, la facture est envoyée.',
    time: '✓ Tout en règle',
    timeBg: C.sageBg,
    timeColor: C.sageDk,
  },
];

const GAP = 16;

export function HowItWorksSection() {
  const { isMobile, isDesktop, containerWidth, colWidth } = useResponsive();
  // mobile: 1 col, tablet: 2 col, desktop: 3 col
  const cardW = isMobile
    ? containerWidth
    : isDesktop
    ? colWidth(3, GAP)
    : colWidth(2, GAP);

  return (
    <View style={styles.section} accessibilityRole="none" accessibilityLabel="Comment ça marche">
      <Container>
        <SectionHead
          tag="En 3 étapes"
          title="Simple. Précis. Sans détour."
          lead="De la demande au paiement, tout passe par l'app. Pas d'appels, pas de négo, pas de surprise."
        />
        <View style={styles.grid}>
          {STEPS.map((step) => (
            <View key={step.num} style={[styles.card, { width: cardW }]}>
              <Text style={styles.bgNum}>{step.num}</Text>
              <View style={[styles.iconBox, { backgroundColor: step.iconBg }]}>
                <Feather name={step.icon} size={22} color={step.iconColor} />
              </View>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.desc}>{step.desc}</Text>
              <View style={[styles.timeBadge, { backgroundColor: step.timeBg }]}>
                <Text style={[styles.timeText, { color: step.timeColor }]}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 72,
    backgroundColor: C.sand50,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sand200,
    borderRadius: 18,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bgNum: {
    position: 'absolute',
    top: -18,
    right: 14,
    fontFamily: F.display,
    fontSize: 88,
    fontWeight: '700',
    letterSpacing: -4,
    color: C.sand100,
    lineHeight: 88,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: F.display,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: C.sand950,
    marginBottom: 8,
    lineHeight: 23,
    flexWrap: 'wrap',
  },
  desc: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.sand600,
    lineHeight: 21,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  timeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: R.full,
  },
  timeText: {
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: '600',
  },
});
