import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { C, F, R } from '@/constants/theme';

interface Props {
  onSubmit: (email: string) => void;
  dark?: boolean;
}

export function EmailForm({ onSubmit, dark = false }: Props) {
  const [email, setEmail]     = useState('');
  const [focused, setFocused] = useState(false);
  const { width } = useWindowDimensions();
  const stacked = width < 500;

  const handleSubmit = () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      Alert.alert('Email invalide', 'Veuillez saisir une adresse email valide.');
      return;
    }
    onSubmit(trimmed);
    setEmail('');
  };

  return (
    <View
      style={[
        styles.form,
        dark && styles.formDark,
        stacked && styles.formStacked,
        focused && (dark ? styles.formFocusedDark : styles.formFocused),
      ]}
      accessibilityRole="none"
    >
      <TextInput
        style={[styles.input, dark && styles.inputDark, stacked && styles.inputStacked, dark && { WebkitTextFillColor: 'white', caretColor: 'white' } as any]}
        nativeID={dark ? 'email-cta-dark' : undefined}
        placeholder="Votre adresse email"
        placeholderTextColor={dark ? 'rgba(255,255,255,0.45)' : C.sand400}
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        accessibilityLabel="Adresse email"
        accessibilityHint="Saisissez votre adresse email pour rejoindre la liste d'attente"
        textContentType="emailAddress"
      />
      <TouchableOpacity
        style={[styles.btn, stacked && styles.btnStacked]}
        onPress={handleSubmit}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Rejoindre la liste d'attente"
      >
        <Text style={styles.btnText}>Rejoindre →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.sand200,
    borderRadius: 14,
    padding: 6,
    alignItems: 'center',
  },
  formDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  formFocused: {
    borderColor: C.indigo700,
  },
  formFocusedDark: {
    borderColor: 'rgba(255,255,255,0.55)',
  },
  formStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: F.body,
    fontSize: 15,
    color: C.sand950,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 0,
  },
  inputDark: {
    color: C.white,
  },
  inputStacked: {
    flex: 0,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  btn: {
    backgroundColor: C.terra500,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: R.lg,
    flexShrink: 0,
  },
  btnStacked: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: R.md,
  },
  btnText: {
    fontFamily: F.body,
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
});
