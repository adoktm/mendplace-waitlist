import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { C, F, R, S } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

const PROMISES = [
  {
    num: '01',
    title: 'Une réponse en moins d\'une heure',
    desc: 'Dès la publication de votre demande, un professionnel vérifié et disponible vous transmet un devis. Vous restez maître du temps, sans attente, sans relance.',
  },
  {
    num: '02',
    title: 'Un devis clair, en amont',
    desc: 'Tarifs détaillés, prestations précisées, conditions transparentes. Le montant est connu et accepté avant toute intervention.',
  },
  {
    num: '03',
    title: 'Un créneau précis, pas une plage',
    desc: 'Rendez-vous à l\'heure choisie. Confirmation par notification, suivi de l\'arrivée en temps réel. Votre temps n\'attend pas.',
  },
  {
    num: '04',
    title: 'Un paiement protégé',
    desc: 'Le règlement est conservé sur un compte séquestre, libéré après votre validation. Facture automatique, garantie 30 jours sur l\'intervention.',
  },
];

const GAP = 16;

export function PromisesSection() {
  const { isMobile, containerWidth, colWidth } = useResponsive();
  const cardW = isMobile ? containerWidth : colWidth(2, GAP);

  return (
    <View style={styles.section} accessibilityRole="none" accessibilityLabel="Nos engagements">
      <Container>
        <SectionHead
          tag="Nos engagements"
          title={`Quatre promesses simples.\nTenues, à chaque intervention.`}
          lead="Faire entrer un professionnel chez soi demande de la confiance. MendPlace transforme cette confiance en garanties concrètes."
        />
        <View style={styles.grid}>
          {PROMISES.map((p) => (
            <View key={p.num} style={[styles.card, { width: cardW }]}>
              <View style={styles.numBox}>
                <Text style={styles.num}>{p.num}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{p.title}</Text>
                <Text style={styles.desc}>{p.desc}</Text>
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
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sand200,
    borderRadius: 18,
    padding: 24,
  },
  numBox: {
    backgroundColor: C.indigo50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  num: {
    fontFamily: F.display,
    fontSize: 28,
    fontWeight: '700',
    color: C.indigo700,
    letterSpacing: -1,
    lineHeight: 32,
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
    marginBottom: 8,
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
