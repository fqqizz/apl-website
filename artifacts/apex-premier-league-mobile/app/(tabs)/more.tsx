import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

type Colors = ReturnType<typeof useColors>;

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    q: "What is the Apex Premier League?",
    a: "APL is Kashmir's first professional franchise football league, based in North Kashmir (Baramulla region). Founded in 2025, Season One launches in 2026 under the tagline 'Rise Above'. It connects players, franchise owners, and communities in a professional football ecosystem.",
  },
  {
    q: "How do I register as a player?",
    a: "Go to the Register tab, fill in your details, and complete a one-time registration fee of ₹249. After payment, you will receive a unique Player ID via email. Founding players receive permanent recognition in APL history.",
  },
  {
    q: "What is the league format?",
    a: "APL Season 1 is a 12-week league with 83 scheduled matches across 4 stages: Group Stage (round-robin) → Elite League Phase (points table) → Playoffs (knockout) → Grand Final (championship). 16 franchise teams, 288 registered players.",
  },
  {
    q: "What awards are given?",
    a: "APL has 13 awards: Champions Trophy, Runner-Up Trophy, Golden Boot, Golden Glove, Player of the Tournament, Young Player Award, Best Defender, Best Midfielder, Best Forward, Best Coach, Goal of the Season, Fans' Player of the Season, Fair Play Award, and Most Improved Player. Man of the Match is awarded in every game.",
  },
  {
    q: "What is the total prize pool?",
    a: "The total prize pool for APL Season 1 is ₹5,00,000 (₹5 Lakh) distributed across champion teams and individual award winners.",
  },
  {
    q: "How do I check my application status?",
    a: "Go to the Status tab and enter your Player ID (format: APL-XXXX). Your Player ID was emailed to you after completing registration. If you haven't registered yet, visit the Register tab.",
  },
  {
    q: "How do I own a franchise?",
    a: "Go to the Register tab and select the Franchise option. Fill in your team details and submit an inquiry. Our team will contact you within 48 hours. Founding franchise owners receive priority placement and exclusive long-term benefits.",
  },
  {
    q: "What is a Founding Player?",
    a: "Founding Players are the first cohort of registered APL players. They receive permanent recognition in APL history, a special Founding Member badge on their player credential, and are part of building Kashmir's first professional football league from the ground up.",
  },
];

function FaqItem({
  item,
  index,
  colors,
}: {
  item: FaqItem;
  index: number;
  colors: Colors;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    Haptics.selectionAsync();
    setExpanded((prev) => !prev);
  };

  return (
    <View
      style={[
        styles.faqItem,
        {
          backgroundColor: colors.card,
          borderColor: expanded ? "rgba(212,175,55,0.3)" : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <TouchableOpacity
        onPress={toggle}
        style={styles.faqQuestion}
        activeOpacity={0.7}
        testID={`faq-item-${index}`}
      >
        <Text style={[styles.faqQ, { color: colors.foreground }]}>{item.q}</Text>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={expanded ? colors.primary : colors.mutedForeground}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.faqAnswer, { borderTopColor: colors.border }]}>
          <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{item.a}</Text>
        </View>
      )}
    </View>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
  colors: Colors;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.contactRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.contactIcon, { backgroundColor: "rgba(212,175,55,0.1)", borderRadius: 8 }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.contactText}>
        <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.contactValue, { color: colors.foreground }]}>{value}</Text>
      </View>
      {onPress && <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const openPhone = () => Linking.openURL("tel:+918491900407");
  const openEmail = () => Linking.openURL("mailto:contact@apexpremiereleague.in");
  const openWebsite = () => Linking.openURL("https://apexpremiereleague.in");
  const openInstagram = () =>
    Linking.openURL("https://instagram.com/apexpremiereleague");
  const openWhatsApp = () =>
    Linking.openURL("https://wa.me/918491900407");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPadding + 16,
        paddingBottom: Platform.OS === "web" ? 120 : 110,
        paddingHorizontal: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* About card */}
      <View
        style={[
          styles.aboutCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View style={[styles.aboutGoldBar, { backgroundColor: colors.primary }]} />
        <View style={styles.aboutBody}>
          <View style={[styles.aboutBadge, { backgroundColor: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.3)" }]}>
            <Text style={[styles.aboutBadgeText, { color: colors.primary }]}>
              RISE ABOVE
            </Text>
          </View>
          <Text style={[styles.aboutTitle, { color: colors.foreground }]}>
            About APL
          </Text>
          <Text style={[styles.aboutDesc, { color: colors.mutedForeground }]}>
            Apex Premier League is Kashmir's first professional franchise football league,
            founded to build structure, visibility, and long-term opportunity for Kashmiri
            football talent. Season One launches in 2026, rooted in North Kashmir's
            Baramulla region.
          </Text>
          <View style={[styles.aboutStats, { borderTopColor: colors.border }]}>
            {[
              { val: "16", lbl: "Teams" },
              { val: "288", lbl: "Players" },
              { val: "83", lbl: "Matches" },
              { val: "₹5L", lbl: "Prizes" },
            ].map(({ val, lbl }) => (
              <View key={lbl} style={styles.aboutStat}>
                <Text style={[styles.aboutStatVal, { color: colors.primary }]}>{val}</Text>
                <Text style={[styles.aboutStatLbl, { color: colors.mutedForeground }]}>{lbl}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Contact section */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Contact Us</Text>

      <View style={styles.contactList}>
        <ContactRow
          icon="phone"
          label="Phone / WhatsApp"
          value="+91 84919 00407"
          onPress={openPhone}
          colors={colors}
        />
        <ContactRow
          icon="mail"
          label="Email"
          value="contact@apexpremiereleague.in"
          onPress={openEmail}
          colors={colors}
        />
        <ContactRow
          icon="globe"
          label="Website"
          value="apexpremiereleague.in"
          onPress={openWebsite}
          colors={colors}
        />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity
          onPress={openInstagram}
          style={[
            styles.socialBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.8}
        >
          <Feather name="instagram" size={20} color={colors.primary} />
          <Text style={[styles.socialText, { color: colors.foreground }]}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openWhatsApp}
          style={[
            styles.socialBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={20} color={colors.primary} />
          <Text style={[styles.socialText, { color: colors.foreground }]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ section */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        Frequently Asked Questions
      </Text>

      <View style={styles.faqList}>
        {FAQ_DATA.map((item, i) => (
          <FaqItem key={i} item={item} index={i} colors={colors} />
        ))}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          © 2026 Apex Premier League · All Rights Reserved
        </Text>
        <Text style={[styles.footerSub, { color: colors.mutedForeground }]}>
          apexpremiereleague.in
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  aboutCard: { borderWidth: 1, overflow: "hidden", marginBottom: 28 },
  aboutGoldBar: { height: 3 },
  aboutBody: { padding: 20, gap: 12 },
  aboutBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aboutBadgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  aboutTitle: { fontSize: 22, fontWeight: "800" },
  aboutDesc: { fontSize: 13, lineHeight: 20 },
  aboutStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 14,
  },
  aboutStat: { flex: 1, alignItems: "center" },
  aboutStatVal: { fontSize: 20, fontWeight: "800" },
  aboutStatLbl: { fontSize: 10, fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  contactList: { gap: 10, marginBottom: 14 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  contactIcon: { padding: 9 },
  contactText: { flex: 1 },
  contactLabel: { fontSize: 10, fontWeight: "600", letterSpacing: 0.5 },
  contactValue: { fontSize: 14, fontWeight: "500", marginTop: 1 },
  socialRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
  },
  socialText: { fontSize: 14, fontWeight: "600" },
  faqList: { gap: 10, marginBottom: 28 },
  faqItem: { borderWidth: 1, overflow: "hidden" },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  faqQ: { fontSize: 14, fontWeight: "600", flex: 1, lineHeight: 20 },
  faqAnswer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 12,
  },
  faqA: { fontSize: 13, lineHeight: 20 },
  footer: { borderTopWidth: 1, paddingTop: 20, alignItems: "center", gap: 4 },
  footerText: { fontSize: 11 },
  footerSub: { fontSize: 10 },
});
