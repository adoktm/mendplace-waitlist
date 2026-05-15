import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { C, F, R, S } from '@/constants/theme';
import { submitWaitlist } from '@/lib/supabase';

type StepType = 'single' | 'multi' | 'text';
interface Step { q: string; type: StepType; options?: string[]; placeholder?: string; optional?: boolean }
interface Survey { title: string; subtitle: string; emailPlaceholder: string; emailLabel: string; steps: Step[] }

const SURVEYS: Record<'client' | 'pro', Survey> = {
  client: {
    title: 'Aide-nous à construire l\'app qui vous facilite vraiment la vie.',
    subtitle: '2 min · 4 questions · Accès prioritaire + 1ère intervention sans frais',
    emailPlaceholder: 'Votre adresse email',
    emailLabel: 'Votre email pour rester informé(e)',
    steps: [
      {
        q: 'Avez-vous déjà eu une mauvaise expérience avec un artisan ?',
        type: 'single',
        options: [
          'Oui, une fois',
          'Oui, plusieurs fois',
          'Non, ça s\'est toujours bien passé',
          'Je n\'ai jamais fait appel à un artisan',
        ],
      },
      {
        q: 'La dernière fois que vous avez eu besoin d\'un artisan, qu\'est-ce qui s\'est passé ?',
        type: 'multi',
        options: [
          'Je n\'ai trouvé personne de disponible rapidement',
          'J\'ai eu du mal à obtenir un devis clair',
          'J\'ai eu un problème avec la qualité du travail',
          'J\'ai eu un problème de paiement ou de prix',
          'Tout s\'est bien passé',
        ],
      },
      {
        q: 'Comment trouvez-vous habituellement un artisan aujourd\'hui ?',
        type: 'single',
        options: [
          'Bouche-à-oreille, recommandation d\'un proche',
          'Recherche Google',
          'Une autre application ou site',
          'Je n\'ai pas encore de méthode fiable',
        ],
      },
      {
        q: 'Pour quel type d\'intervention utiliseriez-vous MendPlace en premier ?',
        type: 'single',
        options: [
          'Urgence (fuite, panne, serrure bloquée)',
          'Travaux planifiés (rénovation, installation)',
          'Les deux selon le besoin',
        ],
      },
      {
        q: 'Une remarque, une idée ou quelque chose que vous aimeriez nous dire ?',
        type: 'text',
        placeholder: 'Ce que vous attendez de MendPlace, ce qui vous manque aujourd\'hui, vos questions... (optionnel)',
        optional: true,
      },
    ],
  },
  pro: {
    title: 'Aide-nous à construire l\'outil qui vous fait gagner du temps.',
    subtitle: '2 min · 4 questions · Accès prioritaire + 1 mois de frais réduits',
    emailPlaceholder: 'Votre adresse email professionnelle',
    emailLabel: 'Votre email professionnel',
    steps: [
      {
        q: 'Quel est votre métier principal ?',
        type: 'single',
        options: ['Plombier', 'Électricien', 'Serrurier', 'Chauffagiste', 'Peintre', 'Menuisier', 'Carreleur', 'Autre'],
      },
      {
        q: 'Combien d\'interventions réalisez-vous environ par mois ?',
        type: 'single',
        options: ['Moins de 10', 'Entre 10 et 30', 'Entre 30 et 70', 'Plus de 70'],
      },
      {
        q: 'Quel est votre plus grand problème dans votre activité aujourd\'hui ?',
        type: 'multi',
        options: [
          'Les impayés ou retards de paiement',
          'Trouver suffisamment de clients réguliers',
          'La gestion administrative (devis, factures, comptabilité)',
          'Les clients peu sérieux ou qui annulent',
          'Les temps de trajet trop longs entre les interventions',
        ],
      },
      {
        q: 'Utilisez-vous actuellement des outils numériques pour gérer votre activité ?',
        type: 'single',
        options: [
          'Oui, un logiciel dédié (Obat, Sinao, autre)',
          'Oui, des outils génériques (Excel, WhatsApp, email)',
          'Oui, une application de mise en relation (comme MendPlace)',
          'Non, je gère tout à la main',
          'Non, j\'ai quelqu\'un qui s\'en occupe pour moi',
        ],
      },
      {
        q: 'Une remarque, une idée ou quelque chose que vous aimeriez nous dire ?',
        type: 'text',
        placeholder: 'Ce qui vous ferait vraiment gagner du temps, ce que vous attendez de la plateforme... (optionnel)',
        optional: true,
      },
    ],
  },
};

interface Props {
  visible: boolean;
  mode: 'client' | 'pro' | null;
  prefillEmail?: string;
  onClose: () => void;
  onSuccess?: (initials: string) => void;
}

export function WaitlistModal({ visible, mode, prefillEmail, onClose, onSuccess }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmallH     = height < 680;
  const isNarrow     = width < 400;
  const isLargeScreen = width >= 600;

  const survey = SURVEYS[mode || 'client'];
  const total  = survey.steps.length + 1;

  const [step, setStep]           = useState(0);
  const [email, setEmail]         = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [honeypot, setHoneypot]   = useState('');
  const [answers, setAnswers]     = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const openedAt = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;
    setEmail(prefillEmail || '');
    setFirstName('');
    setLastName('');
    setHoneypot('');
    setStep(0);
    setAnswers({});
    openedAt.current = Date.now();
  }, [visible, prefillEmail, mode]);

  const sanitize = (s: string) => s.replace(/[<>{}\\|]/g, '').trim().slice(0, 100);

  const checkRateLimit = (): boolean => true;
  const markRateLimit = () => {};

  const handleNext = async () => {
    if (step === 0) {
      if (honeypot.length > 0) return;
      if (Date.now() - openedAt.current < 3000) return;
      if (!checkRateLimit()) {
        Alert.alert('Déjà inscrit', 'Vous êtes déjà sur notre liste. On vous contactera au lancement !');
        return;
      }
      const t = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
        Alert.alert('Email invalide', 'Veuillez saisir une adresse email valide.');
        return;
      }
      setAnswers((p) => ({ ...p, email: t, firstName: sanitize(firstName), lastName: sanitize(lastName) }));
      setStep(1);
      return;
    }
    if (step === survey.steps.length) {
      setSubmitting(true);
      const result = await submitWaitlist({
        mode:       mode as 'client' | 'pro',
        first_name: (answers.firstName as string) ?? '',
        last_name:  (answers.lastName  as string) ?? '',
        email:      (answers.email     as string) ?? '',
        q1:         (answers.q0 as string) ?? null,
        q2:         (answers.q1 as string) ?? null,
        q3:         (answers.q2 as string) ?? null,
        q4:         (answers.q3 as string) ?? null,
        message:    (answers.q4 as string) || null,
      });
      setSubmitting(false);
      if (result === 'duplicate') {
        Alert.alert(
          'Déjà inscrit(e) !',
          'Cette adresse email est déjà sur notre liste. On vous contactera au lancement 🎉'
        );
        return;
      }
      if (result === 'error') {
        Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }
      markRateLimit();
      const fn = ((answers.firstName as string) || firstName).trim();
      const ln = ((answers.lastName  as string) || lastName).trim();
      onSuccess?.((fn[0] || '?').toUpperCase() + (ln[0] || '?').toUpperCase());
    }
    setStep((s) => Math.min(s + 1, total));
  };

  const toggleOption = (key: string, opt: string, multi: boolean) => {
    if (multi) {
      const cur = (answers[key] as string[]) || [];
      setAnswers((p) => ({ ...p, [key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] }));
    } else {
      setAnswers((p) => ({ ...p, [key]: opt }));
    }
  };

  const isSuccess = step > survey.steps.length;

  const canContinue = (() => {
    if (isSuccess) return true;
    if (step === 0) return email.trim().length > 0 && firstName.trim().length >= 2 && lastName.trim().length >= 2;
    const idx = step - 1;
    if (idx >= survey.steps.length) return true;
    const s = survey.steps[idx];
    if (s.optional) return true;
    const answer = answers[`q${idx}`];
    if (s.type === 'multi') return Array.isArray(answer) && answer.length > 0;
    if (s.type === 'text') return typeof answer === 'string' && answer.trim().length > 0;
    return typeof answer === 'string' && answer.length > 0;
  })();

  const renderBody = () => {
    /* ── Email step ── */
    if (step === 0) return (
      <View style={styles.stepWrap}>
        <Text style={[styles.stepTitle, isSmallH && styles.stepTitleSm]}>{survey.title}</Text>
        <Text style={styles.stepSub}>{survey.subtitle}</Text>
        {/* Bot trap — invisible to humans, filled by bots */}
        {Platform.OS === 'web' && (
          <TextInput
            style={styles.honeypotField as any}
            value={honeypot}
            onChangeText={setHoneypot}
            {...({ tabIndex: -1, 'aria-hidden': 'true', autoComplete: 'off' } as any)}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        )}
        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Prénom"
            placeholderTextColor={C.sand400}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            autoFocus
            accessibilityLabel="Prénom"
            textContentType="givenName"
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Nom"
            placeholderTextColor={C.sand400}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            accessibilityLabel="Nom"
            textContentType="familyName"
          />
        </View>
        <Text style={styles.label}>{survey.emailLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={survey.emailPlaceholder}
          placeholderTextColor={C.sand400}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleNext}
          accessibilityLabel="Adresse email"
          accessibilityHint="Saisissez votre adresse email pour rejoindre la liste d'attente"
          textContentType="emailAddress"
        />
      </View>
    );

    /* ── Success ── */
    if (isSuccess) return (
      <View style={styles.successWrap}>
        <View style={styles.successCircle}>
          <Feather name="check" size={28} color={C.sage} />
        </View>
        <Text style={styles.successTitle}>Merci ! C'est noté.</Text>
        <Text style={styles.successText}>
          {mode === 'client'
            ? <>Tu seras parmi les premiers prévenus et ta{' '}<Text style={styles.accent}>première intervention est sans frais de service.</Text></>
            : <>Tu seras parmi les premiers prévenus et tu bénéficies d'<Text style={styles.accent}>1 mois de frais réduits</Text>{' '}au lancement.</>
          }
        </Text>
        <View style={styles.successBox}>
          <Text style={styles.successBoxText}>
            <Text style={{ fontWeight: '700' }}>Et après ?</Text>
            {' '}Email au lancement, accès prioritaire, et une question par mois pour co-construire l'app.
          </Text>
        </View>
      </View>
    );

    /* ── Survey step ── */
    const idx = step - 1;
    const s   = survey.steps[idx];
    const key = `q${idx}`;
    const answer = answers[key];
    return (
      <View style={styles.stepWrap}>
        <Text style={[styles.qNum, isSmallH && styles.qNumSm]}>
          Question {step} / {survey.steps.length}
        </Text>
        <Text style={styles.label}>
          {s.q}
          {s.type === 'multi' && <Text style={styles.multiHint}> (plusieurs choix)</Text>}
          {s.optional && <Text style={styles.multiHint}> (optionnel)</Text>}
        </Text>

        {(s.type === 'single' || s.type === 'multi') && (
          <View style={styles.optList}>
            {s.options?.map((opt) => {
              const sel = s.type === 'multi'
                ? ((answer as string[]) || []).includes(opt)
                : answer === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.opt, sel && styles.optSel]}
                  onPress={() => toggleOption(key, opt, s.type === 'multi')}
                  activeOpacity={0.7}
                  accessibilityRole={s.type === 'multi' ? 'checkbox' : 'radio'}
                  accessibilityLabel={opt}
                  accessibilityState={{ checked: sel }}
                >
                  <Text style={[styles.optText, sel && styles.optTextSel]}>{opt}</Text>
                  <View style={[styles.check, sel && styles.checkSel]} accessibilityElementsHidden>
                    {sel && <Feather name="check" size={9} color={C.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {s.type === 'text' && (
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder={s.placeholder || ''}
            placeholderTextColor={C.sand400}
            value={(answer as string) || ''}
            onChangeText={(v) => setAnswers((p) => ({ ...p, [key]: v }))}
            multiline
            numberOfLines={isSmallH ? 3 : 4}
            textAlignVertical="top"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      {/* Semi-transparent backdrop — covers entire screen */}
      <View style={styles.backdrop} pointerEvents="none" />

      {/* Safe area container handles notch/home indicator */}
      <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Tap outside to close */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={onClose}
            activeOpacity={1}
            accessibilityLabel="Fermer"
            accessibilityRole="button"
          />

          {/* Modal card — compact on large screens, full-width with margins on mobile */}
          <View
            style={[
              styles.modal,
              isLargeScreen
                ? styles.modalLarge
                : { marginHorizontal: isNarrow ? 12 : 16 },
            ]}
            pointerEvents="box-none"
          >
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
              {/* Header — progress + close */}
              <View style={[styles.header, isSmallH && styles.headerSm]}>
                <View
                  style={styles.progressRow}
                  accessibilityLabel={`Étape ${step + 1} sur ${total}`}
                  accessibilityRole="progressbar"
                >
                  {Array.from({ length: total }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        i < step  && styles.dotDone,
                        i === step && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Fermer la fenêtre"
                >
                  <Feather name="x" size={15} color={C.sand600} />
                </TouchableOpacity>
              </View>

              {/* Scrollable body */}
              <ScrollView
                style={styles.body}
                contentContainerStyle={[styles.bodyPad, isSmallH && styles.bodyPadSm]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {renderBody()}
              </ScrollView>

              {/* Footer — fixed at bottom of modal */}
              <View style={[styles.footer, isSmallH && styles.footerSm]}>
                {isSuccess ? (
                  <>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      style={styles.btnPrimary}
                      onPress={onClose}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel="Fermer"
                    >
                      <Text style={styles.btnPrimaryTxt}>Fermer</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {step > 0 ? (
                      <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => setStep((s) => s - 1)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Retour à l'étape précédente"
                      >
                        <Text style={styles.btnBackTxt}>← Retour</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}
                    {!isNarrow && (
                      <Text style={styles.stepHint} accessibilityElementsHidden>Étape {step + 1} / {total}</Text>
                    )}
                    <TouchableOpacity
                      style={[styles.btnPrimary, (!canContinue || submitting) && styles.btnDisabled]}
                      onPress={canContinue && !submitting ? handleNext : undefined}
                      activeOpacity={canContinue && !submitting ? 0.85 : 1}
                      accessibilityRole="button"
                      accessibilityLabel={step === survey.steps.length ? 'Terminer et envoyer' : 'Continuer à l\'étape suivante'}
                      accessibilityState={{ disabled: !canContinue || submitting }}
                    >
                      <Text style={styles.btnPrimaryTxt}>
                        {submitting ? 'Envoi...' : step === survey.steps.length ? 'Terminer ✓' : 'Continuer →'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* Backdrop covers the full screen */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31,28,24,0.72)',
  },
  /* SafeAreaView fills screen, handles notch */
  safeContainer: {
    flex: 1,
  },
  /* KAV fills safe area, centers modal */
  kav: {
    flex: 1,
    justifyContent: 'center',
  },
  /* Modal card */
  modal: {
    backgroundColor: C.white,
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '100%',
  },
  /* Large-screen variant — capped width, centered */
  modalLarge: {
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  /* Header */
  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerSm: { paddingTop: 14 },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    paddingTop: 8,
  },
  dot: {
    flex: 1,
    height: 3,
    backgroundColor: C.sand200,
    borderRadius: 2,
  },
  dotDone:   { backgroundColor: C.sage },
  dotActive: { backgroundColor: C.indigo700 },
  closeBtn: {
    width: 32,
    height: 32,
    backgroundColor: C.sand100,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  /* Body */
  body: { flexShrink: 1 },
  bodyPad: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 4,
  },
  bodyPadSm: { paddingHorizontal: 18, paddingTop: 4 },
  /* Step content */
  stepWrap: { paddingVertical: 10 },
  stepTitle: {
    fontFamily: F.display,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: C.sand950,
    lineHeight: 25,
    marginBottom: 6,
  },
  stepTitleSm: { fontSize: 16, lineHeight: 21 },
  stepSub: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.sand600,
    lineHeight: 19,
    marginBottom: 18,
  },
  qNum: {
    fontFamily: F.display,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: C.sand950,
    marginBottom: 10,
  },
  qNumSm: { fontSize: 16, marginBottom: 8 },
  label: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: '600',
    color: C.sand950,
    marginBottom: 10,
    lineHeight: 20,
  },
  multiHint: { fontWeight: '400', fontSize: 12, color: C.sand400 },
  /* Option list — always vertical column */
  optList: {
    gap: 8,
  },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: C.sand200,
    borderRadius: 10,
    backgroundColor: C.white,
  },
  optSel: { borderColor: C.indigo700, backgroundColor: C.indigo50 },
  optText: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.sand800,
    flex: 1,
    lineHeight: 18,
  },
  optTextSel: { color: C.indigo700, fontWeight: '600' },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: C.sand200,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkSel: { backgroundColor: C.indigo700, borderColor: C.indigo700 },
  honeypotField: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
    height: 0,
    width: 0,
    pointerEvents: 'none',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
  },
  input: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.sand950,
    borderWidth: 1.5,
    borderColor: C.sand200,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: C.white,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  /* Footer */
  footer: {
    borderTopWidth: 1,
    borderTopColor: C.sand200,
    backgroundColor: C.sand50,
    paddingHorizontal: 22,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerSm: { paddingVertical: 10 },
  btnBack: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: C.sand200,
    borderRadius: R.lg,
    backgroundColor: C.white,
  },
  btnBackTxt: {
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: '600',
    color: C.sand800,
  },
  stepHint: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.sand600,
    flex: 1,
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: C.indigo700,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: R.lg,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnPrimaryTxt: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  /* Success */
  successWrap: { paddingVertical: 20, alignItems: 'center' },
  successCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.sageBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontFamily: F.display,
    fontSize: 22,
    fontWeight: '700',
    color: C.sand950,
    marginBottom: 8,
  },
  successText: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.sand600,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 14,
  },
  accent: { color: C.terra500, fontWeight: '700' },
  successBox: {
    backgroundColor: C.indigo50,
    borderRadius: 10,
    padding: 12,
    width: '100%',
  },
  successBoxText: {
    fontFamily: F.body,
    fontSize: 13,
    color: C.indigo700,
    lineHeight: 19,
  },
});
