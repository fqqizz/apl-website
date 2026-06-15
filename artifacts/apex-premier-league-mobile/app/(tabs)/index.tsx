import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { aplApi, AplStats } from "@/lib/api";

type Colors = ReturnType<typeof useColors>;

function StatItem({ value, label, colors }: { value: string; label: string; colors: Colors }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function InfoCard({
  icon,
  title,
  desc,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  desc: string;
  colors: Colors;
}) {
  return (
    <View
      style={[
        styles.infoCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.infoIconWrap, { backgroundColor: "rgba(212,175,55,0.1)", borderRadius: 8 }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={[styles.infoTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.infoDesc, { color: colors.mutedForeground }]}>{desc}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { data: stats, isLoading: statsLoading } = useQuery<AplStats>({
    queryKey: ["stats"],
    queryFn: aplApi.getStats,
    staleTime: 30_000,
  });

  const { data: announcementData } = useQuery({
    queryKey: ["announcement"],
    queryFn: aplApi.getAnnouncement,
    staleTime: 30_000,
  });

  const announcement = announcementData?.announcement;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleRegisterPlayer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/register");
  };

  const handleOwnership = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/register");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPadding + 12,
        paddingBottom: Platform.OS === "web" ? 120 : 110,
      }}
      showsVerticalScrollIndicator={false}
    >
      {announcement && (
        <View
          style={[
            styles.announcementBanner,
            {
              backgroundColor: "rgba(212,175,55,0.12)",
              borderColor: "rgba(212,175,55,0.35)",
              marginHorizontal: 16,
              marginBottom: 14,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="bell" size={13} color={colors.primary} />
          <Text style={[styles.announcementText, { color: colors.primary }]} numberOfLines={2}>
            {announcement.text}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            marginHorizontal: 16,
            borderRadius: colors.radius + 2,
          },
        ]}
      >
        <View style={[styles.goldBar, { backgroundColor: colors.primary }]} />

        <View style={styles.heroContent}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: "rgba(212,175,55,0.1)",
                borderColor: "rgba(212,175,55,0.35)",
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.primary }]}>SEASON I · 2026</Text>
          </View>

          <Text style={[styles.leagueTitle, { color: colors.primary }]}>
            APEX PREMIER{"\n"}LEAGUE
          </Text>
          <Text style={[styles.leagueSubtitle, { color: colors.mutedForeground }]}>
            Kashmir's First Professional{"\n"}Franchise Football League
          </Text>

          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            {statsLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <StatItem value={String(stats?.players ?? 0)} label="Players" colors={colors} />
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <StatItem
                  value={String(stats?.franchises ?? 0)}
                  label="Franchises"
                  colors={colors}
                />
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <StatItem value="₹5L" label="Prize Pool" colors={colors} />
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={[styles.ctaPrimary, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          onPress={handleRegisterPlayer}
          activeOpacity={0.8}
          testID="register-player-btn"
        >
          <Feather name="user-plus" size={18} color={colors.primaryForeground} />
          <Text style={[styles.ctaPrimaryText, { color: colors.primaryForeground }]}>
            Register as Player
          </Text>
          <View
            style={[
              styles.priceTag,
              { backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 20 },
            ]}
          >
            <Text style={[styles.ctaPrice, { color: colors.primaryForeground }]}>₹249</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.ctaSecondary,
            { borderColor: colors.primary, borderRadius: colors.radius },
          ]}
          onPress={handleOwnership}
          activeOpacity={0.8}
          testID="own-franchise-btn"
        >
          <MaterialCommunityIcons name="shield-crown-outline" size={18} color={colors.primary} />
          <Text style={[styles.ctaSecondaryText, { color: colors.primary }]}>
            Own a Franchise
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoSection, { marginHorizontal: 16 }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          LEAGUE FORMAT
        </Text>
        <InfoCard
          icon="calendar"
          title="12-Week Season"
          desc="Group Stage → Elite Phase → Playoffs → Grand Final"
          colors={colors}
        />
        <InfoCard
          icon="users"
          title="16 Franchise Teams"
          desc="288 players. Build your squad, identity, and community."
          colors={colors}
        />
        <InfoCard
          icon="award"
          title="13 Awards"
          desc="Golden Boot, Golden Glove, Player of the Tournament & more."
          colors={colors}
        />
        <InfoCard
          icon="map-pin"
          title="North Kashmir"
          desc="Rooted in Baramulla region. Built for the valley."
          colors={colors}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  announcementBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 11,
    borderWidth: 1,
  },
  announcementText: { flex: 1, fontSize: 12, fontWeight: "600" },
  heroCard: { borderWidth: 1, overflow: "hidden", marginBottom: 16 },
  goldBar: { height: 3 },
  heroContent: { padding: 22 },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  leagueTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 1.5,
    lineHeight: 40,
    marginBottom: 8,
  },
  leagueSubtitle: { fontSize: 13, lineHeight: 20, marginBottom: 22 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 18,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800", marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: "500", letterSpacing: 0.5 },
  statDivider: { width: 1, height: 36, alignSelf: "center" },
  ctaSection: { paddingHorizontal: 16, gap: 10, marginBottom: 24 },
  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  ctaPrimaryText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
    flex: 1,
  },
  priceTag: { paddingHorizontal: 10, paddingVertical: 4 },
  ctaPrice: { fontSize: 13, fontWeight: "700" },
  ctaSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 15,
    borderWidth: 1.5,
  },
  ctaSecondaryText: { fontSize: 15, fontWeight: "600", letterSpacing: 0.3 },
  infoSection: { gap: 10 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderWidth: 1,
  },
  infoIconWrap: { padding: 10 },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  infoDesc: { fontSize: 12, lineHeight: 18 },
});
