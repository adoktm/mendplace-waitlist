import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { C, F, R } from '@/constants/theme';

interface Props {
  onOpenModal: (mode: 'client' | 'pro') => void;
  web?: boolean;
}

export function NavBar({ onOpenModal, web = false }: Props) {
  const { width } = useWindowDimensions();
  const compact  = width < 460;
  const tiny     = width < 360;
  const isLarge  = width >= 768;

  const webStyle: any = web && Platform.OS === 'web'
    ? { backgroundColor: 'rgba(250,248,244,0.96)', borderBottomWidth: 1, borderBottomColor: C.sand200 }
    : {};

  return (
    <View
      style={[styles.nav, webStyle]}
      accessibilityLabel="Navigation principale"
    >
      <View style={[styles.inner, { paddingHorizontal: tiny ? 14 : compact ? 18 : 24 }]}>
        <Image
          source={
            isLarge
              ? require('@/assets/images/Logo_MendPlace_Long.png')
              : require('@/assets/images/Logo_MendPlace_Petit.png')
          }
          style={isLarge ? styles.logoLarge : styles.logoSmall}
          resizeMode="contain"
          accessible
          accessibilityLabel="Logo MendPlace"
          accessibilityRole="image"
          alt="Logo MendPlace"
          {...({ title: 'MendPlace — Plombier, Électricien, Serrurier à Paris' } as any)}
        />
        <View style={{ flex: 1, minWidth: 8 }} />
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnGhost, compact && styles.btnCompact]}
            onPress={() => onOpenModal('client')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Je suis client — rejoindre la liste d'attente"
          >
            <Text style={[styles.btnGhostText, compact && styles.btnTextSm]} numberOfLines={1}>
              {compact ? 'Client' : 'Je suis client'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary, compact && styles.btnCompact]}
            onPress={() => onOpenModal('pro')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Je suis artisan — rejoindre la liste d'attente"
          >
            <Text style={[styles.btnPrimaryText, compact && styles.btnTextSm]} numberOfLines={1}>
              {compact ? 'Artisan' : 'Je suis artisan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 60,
    overflow: 'hidden',
  },
  inner: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoLarge: {
    height: 26,
    width: 141,
    flexShrink: 0,
  },
  logoSmall: {
    height: 22,
    width: 24,
    flexShrink: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: R.lg,
  },
  btnCompact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: C.sand200,
  },
  btnGhostText: {
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: '600',
    color: C.sand800,
  },
  btnPrimary: {
    backgroundColor: C.indigo700,
  },
  btnPrimaryText: {
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: '600',
    color: C.white,
  },
  btnTextSm: {
    fontSize: 12,
  },
});
