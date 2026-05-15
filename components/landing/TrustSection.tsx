import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { C, F, R, S } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

const CARDS = [
  {
    icon: 'search' as const,
    iconColor: C.indigo700,
    iconBg: C.indigo50,
    title: 'Pros vérifiés',
    desc: 'Identité, assurance décennale, qualifications, avis clients. Aucun pro non-vérifié sur la plateforme.',
  },
  {
    icon: 'lock' as const,
    iconColor: C.sageDk,
    iconBg: C.sageBg,
    title: 'Paiement escrow',
    desc: 'L\'argent reste bloqué jusqu\'à la fin de l\'intervention. Tu ne paies que ce qui a été fait.',
  },
  {
    icon: 'star' as const,
    iconColor: '#7A5A1A',
    iconBg: '#FAF1DD',
    title: 'Avis vérifiés',
    desc: 'Un avis = une intervention réelle. Pas de faux avis, pas d\'avis achetés, pas de copinage.',
  },
  {
    icon: 'smartphone' as const,
    iconColor: C.terra700,
    iconBg: C.terra50,
    title: 'iOS, Android, Web',
    desc: 'Suivi en temps réel, messagerie, factures dispos partout. Et quand tu en as besoin.',
  },
];

const GAP = 16;

export function TrustSection() {
  const { isMobile, containerWidth, colWidth } = useResponsive();
  const cardW = isMobile ? containerWidth : colWidth(2, GAP);

  return (
    <View style={styles.section} accessibilityRole="none" accessibilityLabel="Pourquoi nous faire confiance">
      <Container>
        <SectionHead
          tag="Pourquoi nous"
          title={`Sérieux. Sécurisé.\nSans faux semblants.`}
        />
        <View style={styles.grid}>
          {CARDS.map((card) => (
            <View key={card.title} style={[styles.card, { width: cardW }]}>
              <View style={[styles.iconBox, { backgroundColor: card.iconBg }]}>
                <Feather name={card.icon} size={22} color={card.iconColor} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{card.title}</Text>
                <Text style={styles.desc}>{card.desc}</Text>
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
    backgroundColor: C.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    flexDirection: 'row',
    gap: S.lg,
    alignItems: 'flex-start',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sand200,
    borderRadius: 18,
    padding: 24,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: F.display,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: C.sand950,
    marginBottom: 6,
    lineHeight: 23,
    flexWrap: 'wrap',
  },
  desc: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.sand600,
    lineHeight: 21,
    flexWrap: 'wrap',
  },
});
