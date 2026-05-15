import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { EmailForm } from '@/components/ui/EmailForm';
import { Container } from '@/components/ui/Container';
import { C, F, R, S } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useWaitlistStats } from '@/hooks/useWaitlistStats';

interface Props {
  onSubmitEmail: (email: string, mode: 'client') => void;
}

const TRUST = ['Gratuit', 'Sans engagement', 'Accès prioritaire'];

export function HeroSection({ onSubmitEmail }: Props) {
  const { isMobile, width } = useResponsive();
  const tinyFont = width < 380;
  const { displayCount, avatars } = useWaitlistStats();

  return (
    <View
      style={styles.hero}
      accessibilityRole="none"
      nativeID="main-content"
    >
      {/* Decorative blobs — hidden from screen readers */}
      <View style={styles.blobTop} accessibilityElementsHidden />
      <View style={styles.blobBottom} accessibilityElementsHidden />

      <Container>
        <View style={styles.content}>

          {/* Eyebrow */}
          <View style={styles.eyebrow} accessibilityElementsHidden>
            <View style={styles.dot} />
            <Text style={styles.eyebrowText} numberOfLines={1}>
              Bientôt à Paris · Inscription en avant-première
            </Text>
          </View>

          {/* Headline */}
          <Text
            style={[styles.h1, isMobile && styles.h1Mobile, tinyFont && styles.h1Tiny]}
            accessibilityRole="header"
          >
            Le bon artisan,{'\n'}
            <Text style={styles.h1Accent}>au bon moment.</Text>
          </Text>

          {/* Lead */}
          <Text style={styles.lead}>
            <Text style={styles.leadBold}>Plomberie, électricité, serrurerie.</Text>
            {' '}Devis reçu en moins d'une heure, paiement sécurisé, facture automatique.{' '}
            <Text style={styles.leadBold}>Une plateforme pensée pour la confiance.</Text>
          </Text>

          {/* Email form */}
          <View style={styles.formWrapper}>
            <EmailForm onSubmit={(email) => onSubmitEmail(email, 'client')} />
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow} accessibilityLabel="Gratuit, sans engagement, accès prioritaire">
            {TRUST.map((item) => (
              <View key={item} style={styles.trustItem} accessibilityElementsHidden>
                <View style={styles.checkCircle}>
                  <Feather name="check" size={9} color={C.sage} />
                </View>
                <Text style={styles.trustText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Counter */}
          {displayCount !== null && (
            <View style={styles.counter} accessibilityElementsHidden>
              {avatars.length > 0 && (
                <View style={styles.avatars}>
                  {avatars.map((a, i) => (
                    <View
                      key={i}
                      style={[
                        styles.avatar,
                        { backgroundColor: a.bg, marginLeft: i === 0 ? 0 : -8 },
                      ]}
                    >
                      <Text style={styles.avatarText}>{a.initials}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={styles.counterText}>
                <Text style={styles.counterBold}>{displayCount}</Text> personne{(Number(displayCount.replace(/\s/g, '')) > 1) ? 's' : ''} inscrite{(Number(displayCount.replace(/\s/g, '')) > 1) ? 's' : ''}
              </Text>
            </View>
          )}

        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 80,
    paddingBottom: 72,
    backgroundColor: C.sand50,
    overflow: 'hidden',
  },
  /* Blobs stay within hero bounds — no negative right/left */
  blobTop: {
    position: 'absolute',
    top: -60,
    right: 0,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: C.indigo100,
    opacity: 0.5,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -70,
    left: 0,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: C.terra50,
    opacity: 0.55,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sand200,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: R.full,
    marginBottom: 28,
    maxWidth: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.terra500,
    flexShrink: 0,
  },
  eyebrowText: {
    fontFamily: F.body,
    fontSize: 12,
    fontWeight: '500',
    color: C.sand800,
    flexShrink: 1,
  },
  h1: {
    fontFamily: F.display,
    fontSize: 58,
    fontWeight: '700',
    letterSpacing: -1.5,
    lineHeight: 64,
    color: C.sand950,
    textAlign: 'center',
    marginBottom: 24,
  },
  h1Mobile: {
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1,
  },
  h1Tiny: {
    fontSize: 32,
    lineHeight: 38,
  },
  h1Accent: {
    color: C.terra500,
  },
  lead: {
    fontFamily: F.body,
    fontSize: 17,
    lineHeight: 28,
    color: C.sand600,
    textAlign: 'center',
    marginBottom: 32,
  },
  leadBold: {
    color: C.sand950,
    fontWeight: '600',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 480,
    marginBottom: 20,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: S.md,
    marginBottom: 28,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.sageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.sand600,
  },
  /* Counter — flex row, centered */
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatars: {
    flexDirection: 'row',
    flexShrink: 0,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: C.sand50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: F.body,
    fontSize: 9,
    fontWeight: '700',
    color: C.white,
  },
  counterText: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.sand600,
    textAlign: 'center',
  },
  counterBold: {
    fontWeight: '700',
    color: C.sand950,
  },
});
