import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';

export type LegalModalType = 'legal' | 'privacy' | 'contact';

const TITLES: Record<LegalModalType, string> = {
  legal: 'Mentions légales',
  privacy: 'Politique de confidentialité',
  contact: 'Contact',
};

/* ─── Shared primitives ─── */

function Tag({ children }: { children: string }) {
  return (
    <View style={s.tag}>
      <Text style={s.tagText}>{children.toUpperCase()}</Text>
    </View>
  );
}

function Section({ title }: { title: string }) {
  return <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text style={s.body}>{children}</Text>;
}

function Link({ href, children }: { href: string; children: string }) {
  return (
    <Text style={s.link} onPress={() => Linking.openURL(href)}>
      {children}
    </Text>
  );
}

function TableRow({ cells, header }: { cells: string[]; header?: boolean }) {
  return (
    <View style={[s.tableRow, header && s.tableRowHead]}>
      {cells.map((cell, i) => (
        <Text
          key={i}
          style={[s.tableCell, header && s.tableCellHead, { flex: i === 0 ? 1 : i === 1 ? 2 : 1 }]}
        >
          {cell}
        </Text>
      ))}
    </View>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <View style={s.table}>
      <TableRow cells={headers} header />
      {rows.map((row, i) => (
        <TableRow key={i} cells={row} />
      ))}
    </View>
  );
}

/* ─── Modal contents ─── */

function LegalContent() {
  return (
    <>
      {/* TODO: replace [PRENOM NOM] with real first and last name */}
      {/* TODO: replace [ADRESSE POSTALE] with real postal address or PO box */}
      {/* TODO: update with company details (raison sociale, SIRET, RCS) once company is created */}
      <Tag>Éditeur</Tag>
      <Body>
        Ce site est édité par <Text style={s.bold}>[PRENOM NOM]</Text>, agissant en tant que personne physique.{'\n'}
        Adresse : <Text style={s.bold}>[ADRESSE POSTALE]</Text>{'\n'}
        Email : <Link href="mailto:hello@mendplace.com">hello@mendplace.com</Link>{'\n'}
        Directeur de la publication : <Text style={s.bold}>[PRENOM NOM]</Text>
      </Body>

      <Section title="Hébergement" />
      <Body>
        Vercel Inc.{'\n'}
        340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis{'\n'}
        <Link href="https://vercel.com">vercel.com</Link>
      </Body>

      <Section title="Propriété intellectuelle" />
      <Body>
        L'ensemble du contenu de ce site (textes, visuels, logo MendPlace) est la propriété exclusive de MendPlace et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation ou diffusion, en tout ou partie, est interdite sans autorisation écrite préalable.
      </Body>

      <Section title="Responsabilité" />
      <Body>
        MendPlace s'efforce d'assurer l'exactitude des informations publiées sur ce site, mais ne peut garantir leur exhaustivité ni leur mise à jour permanente. MendPlace ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
      </Body>

      <Section title="Droit applicable" />
      <Body>
        Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents. Ce site est conforme à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
      </Body>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      {/* TODO: replace [PRENOM NOM] with real first and last name */}
      {/* TODO: if using Google Analytics 4 instead of Plausible, update the cookies paragraph and add a consent banner */}
      <Tag>RGPD</Tag>
      <Body>
        MendPlace s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés. Dernière mise à jour : janvier 2026.
      </Body>

      <Section title="Responsable du traitement" />
      <Body>
        <Text style={s.bold}>[PRENOM NOM]</Text> — <Link href="mailto:hello@mendplace.com">hello@mendplace.com</Link>
      </Body>

      <Section title="Données collectées et finalités" />
      <Table
        headers={['Donnée', 'Finalité', 'Base légale']}
        rows={[
          ['Prénom, Nom', 'Personnalisation des communications', 'Consentement'],
          ['Adresse email', 'Confirmation d\'inscription et communications MendPlace', 'Consentement'],
          ['Réponses au questionnaire', 'Amélioration du produit et segmentation', 'Consentement'],
        ]}
      />

      <Section title="Durée de conservation" />
      <Body>
        Vos données sont conservées jusqu'à votre désinscription ou pendant 3 ans maximum après le dernier contact, conformément aux recommandations de la CNIL.
      </Body>

      <Section title="Sous-traitants" />
      <Body>
        Vos données sont transmises exclusivement aux prestataires suivants, dans le strict cadre de la gestion de la liste d'attente :
      </Body>
      <Table
        headers={['Prestataire', 'Rôle', 'Pays']}
        rows={[
          ['Brevo', 'Envoi d\'emails', 'France (UE)'],
          ['Vercel', 'Hébergement', 'États-Unis'],
        ]}
      />
      <Body>
        Ces prestataires agissent en qualité de sous-traitants et ne peuvent utiliser vos données à d'autres fins.
      </Body>

      <Section title="Cookies et analytics" />
      <Body>
        Ce site utilise Plausible Analytics, un outil d'analyse d'audience ne déposant aucun cookie et ne collectant aucune donnée personnelle identifiable. Aucun bandeau de consentement aux cookies n'est requis.
      </Body>

      <Section title="Vos droits" />
      <Body>
        Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, opposition, limitation du traitement et portabilité de vos données.{'\n'}
        Pour exercer ces droits : <Link href="mailto:hello@mendplace.com">hello@mendplace.com</Link>{'\n'}
        Vous pouvez également introduire une réclamation auprès de la <Link href="https://www.cnil.fr">CNIL</Link>.
      </Body>

      <Section title="Modifications" />
      <Body>
        Cette politique peut être mise à jour à tout moment. La date de dernière modification est indiquée en haut de ce document. Nous vous informerons de toute modification substantielle par email.
      </Body>
    </>
  );
}

function ContactContent() {
  return (
    <>
      <Tag>On vous répond</Tag>
      <Body>
        Une question, une suggestion, une demande liée à vos données personnelles ? Écrivez-nous directement — nous répondons à toutes les demandes sous 48 heures ouvrées.
      </Body>

      <Section title="Email" />
      <Body>
        <Link href="mailto:hello@mendplace.com">hello@mendplace.com</Link>
      </Body>

      <Section title="Données personnelles" />
      <Body>
        Pour toute demande d'accès, de rectification ou de suppression de vos données, précisez "Demande RGPD" en objet de votre email. Nous traitons ces demandes en priorité sous 72 heures.
      </Body>

      <Section title="Presse & partenariats" />
      <Body>
        Pour toute demande presse ou proposition de partenariat, utilisez le même email en précisant l'objet de votre demande.
      </Body>
    </>
  );
}

const CONTENT: Record<LegalModalType, React.ReactNode> = {
  legal: <LegalContent />,
  privacy: <PrivacyContent />,
  contact: <ContactContent />,
};

/* ─── Modal shell ─── */

interface Props {
  type: LegalModalType | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: Props) {
  return (
    <Modal
      visible={type !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={s.backdrop} pointerEvents="none" />
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
          accessibilityLabel="Fermer"
          accessibilityRole="button"
        />
        <View style={s.card} pointerEvents="box-none">
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
            {/* Header */}
            <View style={s.head}>
              <Text style={s.title}>{type ? TITLES[type] : ''}</Text>
              <TouchableOpacity
                style={s.closeBtn}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
              >
                <Feather name="x" size={14} color={C.sand600} />
              </TouchableOpacity>
            </View>
            {/* Body */}
            <ScrollView
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {type && CONTENT[type]}
              <View style={{ height: 8 }} />
            </ScrollView>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31,28,24,0.55)',
  },
  safe: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.sand200,
    maxHeight: '82%' as any,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.sand200,
  },
  title: {
    fontFamily: F.display,
    fontSize: 16,
    fontWeight: '700',
    color: C.sand950,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.sand200,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scroll: { flexShrink: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: C.indigo50,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: F.body,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: C.indigo700,
  },
  sectionTitle: {
    fontFamily: F.body,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: C.sand950,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 6,
  },
  body: {
    fontFamily: F.body,
    fontSize: 13,
    lineHeight: 21,
    color: C.sand600,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: C.sand800,
  },
  link: {
    color: C.indigo700,
    textDecorationLine: 'underline',
  },
  table: {
    borderWidth: 1,
    borderColor: C.sand200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.sand200,
  },
  tableRowHead: {
    backgroundColor: C.sand50,
  },
  tableCell: {
    fontFamily: F.body,
    fontSize: 11,
    color: C.sand600,
    padding: 7,
    borderRightWidth: 1,
    borderRightColor: C.sand200,
  },
  tableCellHead: {
    fontWeight: '600',
    color: C.sand800,
  },
});
