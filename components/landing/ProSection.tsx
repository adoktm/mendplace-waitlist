import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { C, F, R, S } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

const CARDS = [
  {
    icon: 'shield' as const,
    stat: '0€',
    title: 'Zéro impayé. Jamais.',
    desc: 'Le client paie avant que tu commences. L\'argent est sécurisé sur un compte dédié et libéré dès validation. Tu interviens, tu es payé. Sans exception, sans relance.',
  },
  {
    icon: 'calendar' as const,
    stat: 'Inclus',
    title: 'Tes outils pro, sans abonnement.',
    desc: 'Devis rapides, planning, facturation automatique, optimisation des tournées et vitrine pro : tout est inclus dès le départ. De nouveaux outils arrivent régulièrement selon les retours des artisans.',
  },
  {
    icon: 'dollar-sign' as const,
    stat: 'Les + bas',
    title: 'Les commissions les plus basses du marché.',
    desc: 'Nos commissions diminuent avec ton activité : plus tu réalises de missions, moins tu paies. Notre modèle repose sur le volume et le long terme, pas sur des marges élevées par mission.',
  },
];

interface Props {
  onOpenModal: (mode: 'pro') => void;
}

const GAP = 16;

export function ProSection({ onOpenModal }: Props) {
  const { isMobile, isDesktop, containerWidth, colWidth } = useResponsive();
  const cardW = isMobile
    ? containerWidth
    : isDesktop
    ? colWidth(3, GAP)
    : colWidth(2, GAP);

  return (
    <View style={styles.section} accessibilityRole="none" accessibilityLabel="Pour les artisans">
      <Container>
        <SectionHead
          tag="Pour les artisans"
          title={`Tu poses les outils.\nOn s'occupe du reste.`}
          lead="Devis, calendrier, factures, paiements. Le commercial, on s'en charge. Toi, tu fais ce que tu sais faire : intervenir."
          dark
        />
        <View style={styles.grid}>
          {CARDS.map((card) => (
            <View key={card.stat} style={[styles.card, { width: cardW }]}>
              <View style={styles.iconBox}>
                <Feather name={card.icon} size={22} color={C.terra500} />
              </View>
              <Text style={styles.stat}>{card.stat}</Text>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.desc}>{card.desc}</Text>
            </View>
          ))}
        </View>
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => onOpenModal('pro')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Rejoindre MendPlace en tant qu'artisan"
          >
            <Text style={styles.ctaBtnText}>Je veux rejoindre MendPlace →</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>
            Accès prioritaire au lancement · 1 mois de frais réduits · Aucun engagement
          </Text>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 72,
    backgroundColor: C.sand950,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 24,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: 'rgba(224,120,86,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stat: {
    fontFamily: F.display,
    fontSize: 34,
    fontWeight: '700',
    color: C.terra500,
    letterSpacing: -1,
    lineHeight: 38,
    marginBottom: 6,
  },
  title: {
    fontFamily: F.display,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: C.sand100,
    marginBottom: 8,
    lineHeight: 23,
    flexWrap: 'wrap',
  },
  desc: {
    fontFamily: F.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 21,
    flexWrap: 'wrap',
  },
  cta: {
    alignItems: 'center',
    gap: S.sm,
  },
  ctaBtn: {
    backgroundColor: C.terra500,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 11,
  },
  ctaBtnText: {
    fontFamily: F.body,
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
  },
  ctaNote: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
});
