import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { C, F, R, S } from '@/constants/theme';

interface Props {
  visible: boolean;
  onOpenModal: (mode: 'client' | 'pro') => void;
}

export function FloatingCTA({ visible, onOpenModal }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 120,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          bottom: 18 + insets.bottom,
          transform: [{ translateY }],
          pointerEvents: visible ? 'auto' : 'none',
        } as any,
      ]}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={() => onOpenModal('client')}
          activeOpacity={0.85}
        >
          <Feather name="user" size={14} color={C.white} />
          <Text style={styles.btnGhostText}>Client</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnAccent]}
          onPress={() => onOpenModal('pro')}
          activeOpacity={0.85}
        >
          <Feather name="tool" size={14} color={C.white} />
          <Text style={styles.btnAccentText}>Artisan</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  container: {
    flexDirection: 'row',
    gap: S.sm,
    padding: S.sm,
    backgroundColor: 'rgba(31,28,24,0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    boxShadow: '0px 12px 40px rgba(0,0,0,0.25)',
    elevation: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: R.lg,
    minWidth: 100,
  },
  btnGhost: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  btnGhostText: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  btnAccent: {
    backgroundColor: C.terra500,
  },
  btnAccentText: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
});
