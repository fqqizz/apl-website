import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { KeyboardAwareScrollViewCompat } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { aplApi } from "@/lib/api";

type Tab = "player" | "franchise";
type Colors = ReturnType<typeof useColors>;

const POSITIONS = ["GK", "DEF", "MID", "FWD"];

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  colors,
  required,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  colors: Colors;
  required?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
        {label}
        {required && <Text style={{ color: colors.primary }}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType ?? "default"}
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.foreground,
            borderRadius: colors.radius - 2,
          },
        ]}
        autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        autoCorrect={false}
      />
    </View>
  );
}

function PositionPicker({
  value,
  onSelect,
  colors,
}: {
  value: string;
  onSelect: (v: string) => void;
  colors: Colors;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
        Position <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <View style={styles.positionRow}>
        {POSITIONS.map((pos) => (
          <TouchableOpacity
            key={pos}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(pos);
            }}
            style={[
              styles.positionChip,
              {
                borderColor: value === pos ? colors.primary : colors.border,
                backgroundColor: value === pos ? "rgba(212,175,55,0.12)" : colors.input,
                borderRadius: colors.radius - 2,
              },
            ]}
          >
            <Text
              style={[
                styles.positionText,
                { color: value === pos ? colors.primary : colors.mutedForeground },
              ]}
            >
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function PlayerForm({ colors }: { colors: Colors }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [position, setPosition] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Missing Fields", "Please fill in your name, email, and phone number.");
      return;
    }
    if (!position) {
      Alert.alert("Select Position", "Please select your playing position.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await aplApi.createPaymentOrder({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\D/g, ""),
      });

      const paymentUrl = result.payment_link || result.paymentLink;
      if (paymentUrl) {
        await WebBrowser.openBrowserAsync(paymentUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
        Alert.alert(
          "Registration Submitted",
          "Check your email for your Player ID after payment confirmation. Use the Status tab to track your application.",
          [{ text: "OK", style: "default" }]
        );
      } else {
        Alert.alert(
          "Payment Gateway",
          "Payment gateway is not configured yet. Your registration request has been noted.",
          [{ text: "OK" }]
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={[styles.feeCard, { backgroundColor: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.25)", borderRadius: colors.radius }]}>
        <Feather name="info" size={14} color={colors.primary} />
        <Text style={[styles.feeText, { color: colors.mutedForeground }]}>
          Registration fee: <Text style={{ color: colors.primary, fontWeight: "700" }}>₹249</Text>. Founding players receive permanent recognition in APL history.
        </Text>
      </View>

      <InputField
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
        colors={colors}
        required
      />
      <InputField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        keyboardType="email-address"
        colors={colors}
        required
      />
      <InputField
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="+91 XXXXXXXXXX"
        keyboardType="phone-pad"
        colors={colors}
        required
      />
      <InputField
        label="City / Area"
        value={city}
        onChangeText={setCity}
        placeholder="e.g. Baramulla, Sopore, Kupwara"
        colors={colors}
      />
      <PositionPicker value={position} onSelect={setPosition} colors={colors} />
      <InputField
        label="Date of Birth"
        value={dob}
        onChangeText={setDob}
        placeholder="DD/MM/YYYY"
        colors={colors}
      />

      <TouchableOpacity
        style={[
          styles.submitBtn,
          {
            backgroundColor: loading ? colors.muted : colors.primary,
            borderRadius: colors.radius,
          },
        ]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
        testID="submit-player-btn"
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <>
            <Feather name="credit-card" size={18} color={colors.primaryForeground} />
            <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
              Proceed to Payment · ₹249
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

function FranchiseForm({ colors }: { colors: Colors }) {
  const [teamName, setTeamName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!teamName.trim() || !ownerName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await aplApi.submitContact({
        name: ownerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: `Franchise Ownership Inquiry — ${teamName.trim()}`,
        message: `Team Name: ${teamName.trim()}\nOwner: ${ownerName.trim()}\nArea: ${area.trim() || "N/A"}\nPhone: ${phone.trim()}`,
      });

      Alert.alert(
        "Inquiry Submitted!",
        "Thank you for your interest in owning a franchise. Our team will contact you within 48 hours.",
        [{ text: "OK", style: "default" }]
      );

      setTeamName("");
      setOwnerName("");
      setEmail("");
      setPhone("");
      setArea("");
    } catch {
      Alert.alert("Submission Failed", "Could not submit your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={[styles.feeCard, { backgroundColor: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.25)", borderRadius: colors.radius }]}>
        <Feather name="info" size={14} color={colors.primary} />
        <Text style={[styles.feeText, { color: colors.mutedForeground }]}>
          Founding franchise owners get <Text style={{ color: colors.primary, fontWeight: "700" }}>priority placement</Text> and exclusive long-term benefits.
        </Text>
      </View>

      <InputField
        label="Team Name"
        value={teamName}
        onChangeText={setTeamName}
        placeholder="Your franchise team name"
        colors={colors}
        required
      />
      <InputField
        label="Owner Full Name"
        value={ownerName}
        onChangeText={setOwnerName}
        placeholder="Your full name"
        colors={colors}
        required
      />
      <InputField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        keyboardType="email-address"
        colors={colors}
        required
      />
      <InputField
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="+91 XXXXXXXXXX"
        keyboardType="phone-pad"
        colors={colors}
        required
      />
      <InputField
        label="Home Area / City"
        value={area}
        onChangeText={setArea}
        placeholder="e.g. Baramulla, Sopore, Kupwara"
        colors={colors}
      />

      <TouchableOpacity
        style={[
          styles.submitBtn,
          {
            backgroundColor: loading ? colors.muted : colors.primary,
            borderRadius: colors.radius,
          },
        ]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
        testID="submit-franchise-btn"
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <>
            <Feather name="send" size={18} color={colors.primaryForeground} />
            <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
              Submit Franchise Inquiry
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("player");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

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
      <Text style={[styles.heading, { color: colors.foreground }]}>Register</Text>
      <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
        Join Kashmir's first professional football league
      </Text>

      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "player" && {
              backgroundColor: colors.primary,
              borderRadius: colors.radius - 2,
            },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveTab("player");
          }}
        >
          <Feather
            name="user"
            size={15}
            color={activeTab === "player" ? colors.primaryForeground : colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabBtnText,
              {
                color:
                  activeTab === "player" ? colors.primaryForeground : colors.mutedForeground,
              },
            ]}
          >
            Player
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "franchise" && {
              backgroundColor: colors.primary,
              borderRadius: colors.radius - 2,
            },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveTab("franchise");
          }}
        >
          <Feather
            name="shield"
            size={15}
            color={activeTab === "franchise" ? colors.primaryForeground : colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabBtnText,
              {
                color:
                  activeTab === "franchise" ? colors.primaryForeground : colors.mutedForeground,
              },
            ]}
          >
            Franchise
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "player" ? (
        <PlayerForm colors={colors} />
      ) : (
        <FranchiseForm colors={colors} />
      )}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  subheading: { fontSize: 13, marginBottom: 20 },
  tabBar: {
    flexDirection: "row",
    padding: 4,
    borderWidth: 1,
    marginBottom: 20,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  tabBtnText: { fontSize: 14, fontWeight: "600" },
  formContainer: { gap: 16 },
  feeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderWidth: 1,
  },
  feeText: { flex: 1, fontSize: 13, lineHeight: 19 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  input: {
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
  },
  positionRow: { flexDirection: "row", gap: 10 },
  positionChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  positionText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    marginTop: 4,
  },
  submitText: { fontSize: 15, fontWeight: "700" },
});
