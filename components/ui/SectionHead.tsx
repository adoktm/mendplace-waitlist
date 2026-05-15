import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props {
  tag: string;
  title: string;
  lead?: string;
  dark?: boolean;
}

export function SectionHead({ tag, title, lead, dark = false }: Props) {
  return (
    <View style={styles.head}>
      <View style={[styles.tag, dark && styles.tagDark]}>
        <Text style={[styles.tagText, dark && styles.tagTextDark]}>{tag.toUpperCase()}</Text>
      </View>
      <Text style={[styles.h2, dark && styles.h2Dark]} accessibilityRole="header">
        {title}
      </Text>
      {lead && (
        <Text style={[styles.lead, dark && styles.leadDark]}>{lead}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    width: '100%',
    marginBottom: 48,
  },
  tag: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: C.indigo50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  tagDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tagText: {
    fontFamily: F.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: C.indigo700,
  },
  tagTextDark: {
    color: C.indigo200,
  },
  h2: {
    fontFamily: F.display,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 42,
    color: C.sand950,
    marginBottom: 12,
    textAlign: 'center',
  },
  h2Dark: {
    color: C.sand100,
  },
  lead: {
    fontFamily: F.body,
    fontSize: 17,
    lineHeight: 28,
    color: C.sand600,
    textAlign: 'center',
  },
  leadDark: {
    color: 'rgba(245,241,235,0.7)',
  },
});
