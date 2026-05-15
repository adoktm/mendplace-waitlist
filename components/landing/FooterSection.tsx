import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Container } from '@/components/ui/Container';
import { LegalModal, LegalModalType } from '@/components/ui/LegalModal';
import { C, F } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

const LINKS: { label: string; modal: LegalModalType }[] = [
  { label: 'Mentions légales', modal: 'legal' },
  { label: 'Confidentialité', modal: 'privacy' },
  { label: 'Contact', modal: 'contact' },
];


export function FooterSection() {
  const { isMobile, width } = useResponsive();
  const isLarge = width >= 768;
  const [activeModal, setActiveModal] = useState<LegalModalType | null>(null);

  return (
    <View style={styles.footer} accessibilityRole="none" accessibilityLabel="Pied de page">
      <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
      <Container>
        <View style={[styles.inner, isMobile && styles.innerMobile]}>
          <View style={styles.left}>
            <Image
              source={
                isLarge
                  ? require('@/assets/images/Logo_MendPlace_Long.png')
                  : require('@/assets/images/Logo_MendPlace_Petit.png')
              }
              style={[
                isLarge ? styles.logoLarge : styles.logoSmall,
                Platform.OS === 'web'
                  ? ({ filter: 'brightness(0) invert(1)', opacity: 0.85 } as any)
                  : { tintColor: 'white', opacity: 0.85 },
              ]}
              resizeMode="contain"
              accessible
              accessibilityLabel="Logo MendPlace"
              accessibilityRole="image"
              alt="Logo MendPlace"
              {...({ title: 'MendPlace — Plombier, Électricien, Serrurier à Paris' } as any)}
            />
            <Text style={styles.copy}>© 2026 MendPlace · Paris</Text>
          </View>
          <View style={styles.links} accessibilityRole="none">
            {LINKS.map((link) => (
              <TouchableOpacity
                key={link.label}
                onPress={() => setActiveModal(link.modal)}
                accessibilityRole="button"
                accessibilityLabel={link.label}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.rgpd}>
          En vous inscrivant, vous acceptez de recevoir des communications de MendPlace. Vous pouvez vous désabonner à tout moment.
        </Text>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: C.black,
    paddingTop: 40,
    paddingBottom: 28,
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoLarge: {
    height: 22,
    width: 120,
    flexShrink: 0,
  },
  logoSmall: {
    height: 28,
    width: 30,
    flexShrink: 0,
  },
  copy: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  links: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: 'wrap',
  },
  linkText: {
    fontFamily: F.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  rgpd: {
    fontFamily: F.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    maxWidth: 720,
    lineHeight: 18,
  },
});
