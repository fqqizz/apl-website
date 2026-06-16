import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { aplApi, AiMessage } from "@/lib/api";

type Colors = ReturnType<typeof useColors>;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I'm Apex AI — your official guide to everything APL.\n\nAsk me about registrations, franchise ownership, season format, awards, or anything else about Kashmir's first professional football league. ⚽",
};

const SUGGESTIONS = [
  "How do I register?",
  "What is the prize pool?",
  "How many teams in APL?",
  "Tell me about Season 1",
];

function MessageBubble({ msg, colors }: { msg: ChatMessage; colors: Colors }) {
  const isUser = msg.role === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && (
        <View
          style={[
            styles.avatar,
            { backgroundColor: "rgba(212,175,55,0.12)", borderColor: "rgba(212,175,55,0.3)" },
          ]}
        >
          <Feather name="zap" size={13} color={colors.primary} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
          { borderRadius: colors.radius + 2 },
          isUser ? styles.bubbleUser : styles.bubbleAI,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? colors.primaryForeground : colors.foreground },
          ]}
        >
          {msg.content}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator({ colors }: { colors: Colors }) {
  return (
    <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: "rgba(212,175,55,0.12)", borderColor: "rgba(212,175,55,0.3)" },
        ]}
      >
        <Feather name="zap" size={13} color={colors.primary} />
      </View>
      <View
        style={[
          styles.bubble,
          styles.bubbleAI,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: colors.radius + 2,
          },
        ]}
      >
        <Text style={[styles.bubbleText, { color: colors.mutedForeground }]}>
          Apex AI is thinking…
        </Text>
      </View>
    </View>
  );
}

export default function AiScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setInput("");

      const userMsg: ChatMessage = {
        id: Date.now().toString() + "u",
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [userMsg, ...prev]);
      setLoading(true);

      const history: AiMessage[] = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .slice()
        .reverse()
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const { reply } = await aplApi.sendApexAI([
          ...history,
          { role: "user", content: trimmed },
        ]);
        const aiMsg: ChatMessage = {
          id: Date.now().toString() + "a",
          role: "assistant",
          content: reply,
        };
        setMessages((prev) => [aiMsg, ...prev]);
      } catch {
        const errMsg: ChatMessage = {
          id: Date.now().toString() + "e",
          role: "assistant",
          content: "Sorry, I couldn't reach the server right now. Please try again.",
        };
        setMessages((prev) => [errMsg, ...prev]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => <MessageBubble msg={item} colors={colors} />,
    [colors]
  );

  const KAV = Platform.OS === "ios" ? KeyboardAvoidingView : RNKeyboardAvoidingView;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={[styles.headerLeft]}>
          <View
            style={[
              styles.aiDot,
              { backgroundColor: "rgba(212,175,55,0.12)", borderColor: "rgba(212,175,55,0.35)" },
            ]}
          >
            <Feather name="zap" size={14} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Apex AI</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              Your APL guide
            </Text>
          </View>
        </View>
      </View>

      <KAV
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: 16, paddingTop: 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={loading ? <TypingIndicator colors={colors} /> : null}
        />

        {messages.length === 1 && !loading && (
          <View style={styles.suggestionsWrap}>
            <View style={styles.suggestionsRow}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => sendMessage(s)}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: "rgba(212,175,55,0.08)",
                      borderColor: "rgba(212,175,55,0.25)",
                      borderRadius: 100,
                    },
                  ]}
                >
                  <Text style={[styles.suggestionText, { color: colors.primary }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: bottomInset + 8,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about APL…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            style={[
              styles.chatInput,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.foreground,
                borderRadius: colors.radius,
              },
            ]}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            blurOnSubmit
          />
          <TouchableOpacity
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={[
              styles.sendBtn,
              {
                backgroundColor:
                  !input.trim() || loading ? colors.muted : colors.primary,
                borderRadius: colors.radius,
              },
            ]}
            activeOpacity={0.8}
            testID="send-ai-btn"
          >
            <Feather
              name="send"
              size={18}
              color={!input.trim() || loading ? colors.mutedForeground : colors.primaryForeground}
            />
          </TouchableOpacity>
        </View>
      </KAV>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  aiDot: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    borderWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  headerSub: { fontSize: 11 },
  messageList: { paddingHorizontal: 16 },
  bubbleRow: { marginBottom: 12, flexDirection: "row", gap: 8 },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    alignSelf: "flex-end",
    flexShrink: 0,
  },
  bubble: { maxWidth: "78%", padding: 12 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAI: { borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  suggestionsWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  suggestionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  suggestionText: { fontSize: 13, fontWeight: "500" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
