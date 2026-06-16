import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { aplApi, StatusResponse } from "@/lib/api";

type Colors = ReturnType<typeof useColors>;

function getStatusColor(status: string, colors: Colors) {
  const s = status.toUpperCase();
  if (s === "APPROVED" || s === "CONFIRMED") return "#22c55e";
  if (s === "REJECTED") return colors.destructive;
  return colors.primary;
}

function StatusBadge({ status, colors }: { status: string; colors: Colors }) {
  const color = getStatusColor(status, colors);
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: `${color}18`, borderColor: `${color}44` },
      ]}
    >
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{status.toUpperCase()}</Text>
    </View>
  );
}

function StatusCard({
  data,
  colors,
}: {
  data: StatusResponse;
  colors: Colors;
}) {
  const date = new Date(data.created_at);
  const formatted = isNaN(date.getTime())
    ? data.created_at
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <View
      style={[
        styles.resultCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.cardGoldBar, { backgroundColor: colors.primary }]} />
      <View style={styles.cardBody}>
        <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>PLAYER ID</Text>
        <Text style={[styles.cardPlayerId, { color: colors.primary }]}>{data.player_id}</Text>

        <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

        <View style={styles.cardRow}>
          <View style={styles.cardRowItem}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>STATUS</Text>
            <StatusBadge status={data.application_status} colors={colors} />
          </View>
          <View style={styles.cardRowItem}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>REGISTERED</Text>
            <Text style={[styles.cardDate, { color: colors.foreground }]}>{formatted}</Text>
          </View>
        </View>

        <View
          style={[
            styles.tipBox,
            {
              backgroundColor: "rgba(212,175,55,0.06)",
              borderColor: "rgba(212,175,55,0.2)",
              borderRadius: colors.radius - 2,
            },
          ]}
        >
          <Feather name="mail" size={13} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
            Your Player ID card was sent to the registered email address.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function StatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [playerId, setPlayerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleSearch = async () => {
    const id = playerId.trim().toUpperCase();
    if (!id) return;

    if (!/^APL-\d{4,5}$/i.test(id)) {
      setError("Enter a valid Player ID like APL-4821");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const data = await aplApi.getStatus(id);
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not fetch status.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPadding + 16,
        paddingBottom: Platform.OS === "web" ? 120 : 110,
        paddingHorizontal: 16,
      }}
      bottomOffset={16}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.heading, { color: colors.foreground }]}>Check Status</Text>
      <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
        Enter your APL Player ID to track your application
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          value={playerId}
          onChangeText={(t) => {
            setPlayerId(t);
            setError(null);
          }}
          placeholder="APL-XXXX"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="characters"
          autoCorrect={false}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.input,
              borderColor: error ? colors.destructive : colors.border,
              color: colors.foreground,
              borderRadius: colors.radius,
            },
          ]}
          testID="player-id-input"
        />
        <TouchableOpacity
          onPress={handleSearch}
          disabled={loading || !playerId.trim()}
          style={[
            styles.searchBtn,
            {
              backgroundColor: loading || !playerId.trim() ? colors.muted : colors.primary,
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.8}
          testID="search-btn"
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Feather name="search" size={20} color={colors.primaryForeground} />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View
          style={[
            styles.errorBox,
            {
              backgroundColor: "rgba(239,68,68,0.08)",
              borderColor: "rgba(239,68,68,0.3)",
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="alert-circle" size={14} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
        </View>
      )}

      {result && <StatusCard data={result} colors={colors} />}

      {!result && !error && !loading && (
        <View style={styles.emptyState}>
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: "rgba(212,175,55,0.06)",
                borderColor: "rgba(212,175,55,0.18)",
                borderRadius: 50,
              },
            ]}
          >
            <Feather name="search" size={28} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Find Your Application
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
            Your Player ID was sent to your email after registration. It looks like{" "}
            <Text style={{ color: colors.primary }}>APL-4821</Text>
          </Text>
        </View>
      )}

      <View
        style={[
          styles.helpCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.helpTitle, { color: colors.foreground }]}>
          Don't have a Player ID?
        </Text>
        <Text style={[styles.helpDesc, { color: colors.mutedForeground }]}>
          Register as a player from the Register tab. After completing payment, your Player ID
          will be emailed to you.
        </Text>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  subheading: { fontSize: 13, marginBottom: 24, lineHeight: 19 },
  searchRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    padding: 14,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  searchBtn: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, flex: 1 },
  resultCard: { borderWidth: 1, overflow: "hidden", marginBottom: 20 },
  cardGoldBar: { height: 3 },
  cardBody: { padding: 20, gap: 14 },
  cardLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5, marginBottom: 4 },
  cardPlayerId: { fontSize: 32, fontWeight: "800", letterSpacing: 2, lineHeight: 38 },
  cardDivider: { height: 1 },
  cardRow: { flexDirection: "row", gap: 20 },
  cardRowItem: { flex: 1 },
  cardDate: { fontSize: 14, fontWeight: "600" },
  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 100,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
  tipText: { flex: 1, fontSize: 12, lineHeight: 18 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12, marginBottom: 24 },
  emptyIcon: { width: 72, height: 72, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyDesc: { fontSize: 13, textAlign: "center", lineHeight: 20, maxWidth: 280 },
  helpCard: {
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  helpTitle: { fontSize: 14, fontWeight: "700" },
  helpDesc: { fontSize: 13, lineHeight: 19 },
});
