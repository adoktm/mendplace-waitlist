import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { C, F, S } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  {
    q: 'Comment MendPlace vérifie les artisans ?',
    a: 'Avant d\'être accepté sur MendPlace, chaque artisan passe plusieurs vérifications : identité, assurance professionnelle et décennale, qualifications liées à son métier (habilitation électrique, certifications gaz, etc.) et expérience professionnelle. Si un critère manque, le profil n\'est pas validé. Ces contrôles sont renouvelés chaque année.',
  },
  {
    q: 'Est-ce que je sais qui vient chez moi avant l\'intervention ?',
    a: 'Oui. Dès qu\'un artisan accepte votre demande, vous pouvez consulter son profil complet : photo, prénom, métier, zone d\'intervention, expérience, certifications vérifiées et avis laissés par d\'autres clients après de vraies interventions. Vous savez exactement qui intervient chez vous.',
  },
  {
    q: 'Les avis clients sont-ils fiables ?',
    a: 'Oui. Chaque avis provient d\'une intervention réellement effectuée et payée via MendPlace. Il est impossible de publier un faux avis ou d\'en acheter. En cas de signalement, notre équipe vérifie le contenu manuellement. Les avis reflètent donc de vraies expériences clients.',
  },
  {
    q: 'Comment se passe une intervention de A à Z ?',
    a: 'Vous décrivez votre besoin dans l\'application en quelques minutes : type d\'intervention, photos si besoin et disponibilités. Les artisans qualifiés de votre secteur reçoivent la demande et vous envoient un devis clair. Vous choisissez l\'offre qui vous convient, validez le paiement sécurisé, puis l\'artisan intervient au créneau prévu. Une fois le travail terminé, vous confirmez dans l\'application : le paiement est débloqué et la facture est générée automatiquement. Tout est centralisé, simple et transparent.',
  },
  {
    q: 'Les prix sont-ils plus élevés qu\'en passant directement par un artisan ?',
    a: 'Pas forcément. Les artisans fixent eux-mêmes leurs tarifs selon les prix du marché. Avec MendPlace, vous payez surtout pour plus de sécurité : artisans vérifiés, paiement sécurisé et accompagnement en cas de problème. Au final, le plus important n\'est pas seulement le prix affiché, mais la tranquillité d\'esprit.',
  },
  {
    q: 'Quels outils sont inclus, et sont-ils vraiment gratuits ?',
    a: 'Oui, tous les outils sont inclus sans abonnement ni frais supplémentaires : création rapide de devis, facturation automatique, planning synchronisé, optimisation des tournées pour limiter les déplacements, messagerie intégrée et vitrine professionnelle partageable comme un mini site web. De nouveaux outils sont ajoutés régulièrement en fonction des retours des artisans.',
  },
  {
    q: 'La vitrine pro peut-elle remplacer mon site web ?',
    a: 'Pour beaucoup d\'artisans, oui. Votre vitrine MendPlace affiche publiquement votre activité, votre zone d\'intervention, vos certifications vérifiées et vos avis clients, avec un accès direct pour être contacté. Si vous n\'avez pas encore de site web, c\'est une solution simple et efficace. Et si vous en avez déjà un, la vitrine peut renforcer votre crédibilité en complément.',
  },
  {
    q: 'Est-ce que MendPlace peut être utile même si j\'ai déjà assez de clients ?',
    a: 'Oui. Beaucoup d\'artisans utilisent MendPlace surtout pour gagner du temps : devis rapides, facturation automatique, planning centralisé, tournées optimisées et paiements sécurisés sans relances. La plateforme ne sert pas uniquement à trouver des clients, mais aussi à simplifier la gestion quotidienne.',
  },
  {
    q: 'Combien de temps prend l\'inscription ?',
    a: 'La vérification prend généralement entre 2 et 5 jours ouvrés après l\'envoi des documents nécessaires : pièce d\'identité, SIRET, assurance professionnelle (et décennale si nécessaire) ainsi que les éventuelles qualifications métier. Une fois validé, votre profil est immédiatement actif.',
  },
  {
    q: 'Comment MendPlace gagne-t-il de l\'argent ?',
    a: 'MendPlace prend une commission sur les interventions réalisées via la plateforme : une part côté artisan et des frais de service côté client. L\'objectif est de proposer des commissions parmi les plus basses du marché en misant sur le volume plutôt que sur de grosses marges. Tout est transparent et affiché avant chaque transaction. MendPlace ne vend pas de données et n\'affiche pas de publicité.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.question}
        onPress={toggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={q}
        accessibilityHint={open ? 'Appuyer pour fermer la réponse' : 'Appuyer pour afficher la réponse'}
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.questionText}>{q}</Text>
        <Feather
          name="chevron-down"
          size={20}
          color={C.sand400}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.answer} accessibilityLiveRegion="polite">
          <Text style={styles.answerText}>{a}</Text>
        </View>
      )}
    </View>
  );
}

export function FAQSection() {
  return (
    <View style={styles.section} accessibilityRole="none" accessibilityLabel="Questions fréquentes">
      <Container>
        <SectionHead tag="FAQ" title="Questions fréquentes" />
        <View style={styles.faqBox}>
          {FAQS.map((faq, i) => (
            <React.Fragment key={faq.q}>
              <FAQItem q={faq.q} a={faq.a} />
              {i < FAQS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
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
  faqBox: {
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sand200,
    borderRadius: 18,
  },
  item: {},
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  questionText: {
    fontFamily: F.body,
    fontSize: 16,
    fontWeight: '600',
    color: C.sand950,
    flex: 1,
    marginRight: 14,
    lineHeight: 22,
  },
  answer: {
    paddingHorizontal: 24,
    paddingBottom: 22,
  },
  answerText: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.sand600,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: C.sand200,
    marginHorizontal: 0,
  },
});
