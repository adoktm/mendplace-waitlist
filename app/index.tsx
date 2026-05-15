import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Head from 'expo-router/head';

import { NavBar } from '@/components/landing/NavBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { PromisesSection } from '@/components/landing/PromisesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ProSection } from '@/components/landing/ProSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { FooterSection } from '@/components/landing/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';
import { C, F, R, S } from '@/constants/theme';
import { useWaitlistStats } from '@/hooks/useWaitlistStats';

const NAV_HEIGHT = 60;

/* ─── Floating CTA bar ─── */
function FloatingBar({
  anim,
  onOpenModal,
}: {
  anim: Animated.Value;
  onOpenModal: (mode: 'client' | 'pro') => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      style={[
        styles.floatingWrapper,
        {
          bottom: insets.bottom + 14,
          transform: [{ translateY: anim }],
          pointerEvents: 'box-none',
        } as any,
      ]}
    >
      <View style={styles.floatingBar}>
        <TouchableOpacity
          style={[styles.floatBtn, styles.floatBtnGhost]}
          onPress={() => onOpenModal('client')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Je suis client — rejoindre la liste d'attente"
        >
          <Feather name="user" size={13} color={C.white} />
          <Text style={styles.floatBtnGhostTxt}>Je suis client</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatBtn, styles.floatBtnAccent]}
          onPress={() => onOpenModal('pro')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Je suis artisan — rejoindre la liste d'attente"
        >
          <Feather name="tool" size={13} color={C.white} />
          <Text style={styles.floatBtnAccentTxt}>Je suis artisan</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

/* ─── Main page ─── */
export default function LandingPage() {
  const insets      = useSafeAreaInsets();
  const [modalMode, setModalMode] = useState<'client' | 'pro' | null>(null);
  const [prefillEmail, setPrefillEmail] = useState('');
  const { optimisticAdd } = useWaitlistStats();

  const navAnim     = useRef(new Animated.Value(0)).current;
  const floatAnim   = useRef(new Animated.Value(120)).current;
  const lastScrollY = useRef(0);
  const navVisible  = useRef(true);

  const hideNav = () => {
    if (!navVisible.current) return;
    navVisible.current = false;
    Animated.timing(navAnim,  { toValue: -(NAV_HEIGHT + insets.top), duration: 240, useNativeDriver: true }).start();
    Animated.spring(floatAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }).start();
  };

  const showNav = () => {
    if (navVisible.current) return;
    navVisible.current = true;
    Animated.timing(navAnim,  { toValue: 0, duration: 240, useNativeDriver: true }).start();
    Animated.spring(floatAnim, { toValue: 120, tension: 80, friction: 10, useNativeDriver: true }).start();
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 300 && y > lastScrollY.current + 4) hideNav();
    else if (y < lastScrollY.current - 4 || y < 160) showNav();
    lastScrollY.current = y;
  };

  const handleOpenModal = (mode: 'client' | 'pro') => {
    setPrefillEmail('');
    setModalMode(mode);
  };

  const handleSubmitEmail = (email: string, _mode: 'client') => {
    setPrefillEmail(email);
    setModalMode('client');
  };

  const pageTitle = 'Plombier, Électricien, Serrurier à Paris | MendPlace';
  const pageDesc  = 'Plombier, électricien ou serrurier vérifié à Paris. Devis en 1h, paiement sécurisé, facture auto. Accès prioritaire au lancement.';

  const sections = (
    <>
      <HeroSection onSubmitEmail={handleSubmitEmail} />
      <PromisesSection />
      <HowItWorksSection />
      <ProSection onOpenModal={handleOpenModal} />
      <TrustSection />
      <FAQSection />
      <FinalCTASection onSubmitEmail={handleSubmitEmail} />
      <FooterSection />
      {/* Bottom spacer — same color as footer so overscroll bounce matches */}
      <View style={styles.bottomSpacer} />
    </>
  );

  /* ── WEB ── */
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href="https://mendplace.com" />
        </Head>
        <Animated.View
          style={[styles.webNavFixed, { transform: [{ translateY: navAnim }] }] as any}
        >
          <NavBar onOpenModal={handleOpenModal} web />
        </Animated.View>
        <ScrollView
          style={styles.scroll}
          /* prevent any child from causing horizontal overflow on web */
          contentContainerStyle={[styles.webContent, { paddingTop: NAV_HEIGHT }]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {sections}
        </ScrollView>
        <FloatingBar anim={floatAnim} onOpenModal={handleOpenModal} />
        <WaitlistModal
          visible={modalMode !== null}
          mode={modalMode}
          prefillEmail={prefillEmail}
          onClose={() => setModalMode(null)}
          onSuccess={optimisticAdd}
        />
      </View>
    );
  }

  /* ── NATIVE (iOS / Android) ── */
  return (
    /* Root View — black background so iOS overscroll-bounce at bottom shows footer color */
    <View style={styles.native}>
      <ScrollView
        style={styles.scroll}
        /* paddingTop reserves space for the absolute NavBar */
        contentContainerStyle={{ paddingTop: NAV_HEIGHT + insets.top }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        /* overscroll color for iOS top-bounce matches hero */
        indicatorStyle="black"
      >
        {sections}
      </ScrollView>

      {/* NavBar — absolutely positioned, slides out on scroll-down */}
      <Animated.View
        style={[
          styles.navAbsolute,
          { paddingTop: insets.top, transform: [{ translateY: navAnim }] },
        ]}
      >
        <NavBar onOpenModal={handleOpenModal} />
      </Animated.View>

      {/* FloatingCTA — absolutely positioned, slides in on scroll-down */}
      <FloatingBar anim={floatAnim} onOpenModal={handleOpenModal} />

      <WaitlistModal
        visible={modalMode !== null}
        mode={modalMode}
        prefillEmail={prefillEmail}
        onClose={() => setModalMode(null)}
        onSuccess={optimisticAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /* Native root — sand50 at top (for top bounce), footer BG will be handled by spacer */
  native: {
    flex: 1,
    backgroundColor: C.sand50,
  },
  webRoot: {
    flex: 1,
    backgroundColor: C.sand50,
    /* Prevent horizontal overflow on web */
    overflow: 'hidden' as any,
  },
  scroll: {
    flex: 1,
    /* sand50 = hero color → top overscroll matches hero on iOS */
    backgroundColor: C.sand50,
  },
  webContent: {
    /* Forces the content to never exceed viewport width on web */
    maxWidth: '100%' as any,
    overflow: 'hidden' as any,
  },
  /* Bottom spacer — black to match footer color on overscroll bounce */
  bottomSpacer: {
    height: 100,
    backgroundColor: C.black,
  },
  /* Fixed NavBar for web — sits outside scroll flow, animates with navAnim */
  webNavFixed: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  /* Absolute NavBar */
  navAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(250,248,244,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: C.sand200,
  },
  /* Floating CTA wrapper */
  floatingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  floatingBar: {
    flexDirection: 'row',
    gap: S.sm,
    padding: S.sm,
    backgroundColor: 'rgba(31,28,24,0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    elevation: 12,
    boxShadow: '0px 12px 40px rgba(0,0,0,0.25)',
  },
  floatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: R.lg,
    minWidth: 110,
  },
  floatBtnGhost: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  floatBtnGhostTxt: {
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: '600',
    color: C.white,
  },
  floatBtnAccent: {
    backgroundColor: C.terra500,
  },
  floatBtnAccentTxt: {
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: '600',
    color: C.white,
  },
});
