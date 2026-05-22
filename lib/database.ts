/**
 * Supabase Database Helper Functions
 * Handle all database operations for players and franchises
 */

import { supabase } from "./supabase";
import type { Database, Player, Franchise, DatabaseResult } from "./database.types";

// Use an untyped alias to avoid strict generic typing issues with supabase-js
const untyped = supabase as unknown as any;
const PLAYER_ID_PREFIX = "APL-";
const MAX_PLAYER_ID_ATTEMPTS = 20;

function createPlayerIdCandidate() {
  const digits = Math.random() < 0.5 ? 4 : 5;
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${PLAYER_ID_PREFIX}${value}`;
}

async function isPlayerIdTaken(playerId: string): Promise<boolean> {
  const { data, error } = await untyped
    .from("players")
    .select("player_id")
    .eq("player_id", playerId)
    .limit(1);

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data.length > 0 : Boolean(data);
}

async function generateUniquePlayerId(): Promise<string> {
  for (let attempt = 0; attempt < MAX_PLAYER_ID_ATTEMPTS; attempt += 1) {
    const candidate = createPlayerIdCandidate();
    const taken = await isPlayerIdTaken(candidate);
    if (!taken) {
      return candidate;
    }
  }
  throw new Error("Unable to generate a unique Player ID. Please try again.");
}

/**
 * Insert a new player registration into the database
 * Called after successful payment and file uploads
 */
export async function insertPlayer(
  playerData: Omit<Database["public"]["Tables"]["players"]["Insert"], "id">
): Promise<DatabaseResult<Player>> {
  try {
    for (let attempt = 0; attempt < MAX_PLAYER_ID_ATTEMPTS; attempt += 1) {
      const playerId = await generateUniquePlayerId();
      const insertPayload = { ...playerData, player_id: playerId };
      const { data, error } = await untyped.from("players").insert([insertPayload]).select().single();

      if (error) {
        const message = String(error.message || "").toLowerCase();
        if (message.includes("duplicate") || message.includes("unique") || message.includes("player_id")) {
          continue;
        }

        console.error("Insert player error:", error);
        return { success: false, error: error.message };
      }

      const player: Player = {
        id: data.id,
        fullName: data.full_name,
        age: data.age,
        position: data.position,
        preferredFoot: data.preferred_foot,
        contactNumber: data.contact_number,
        email: data.email,
        instagram: data.instagram || undefined,
        area: data.area,
        photoUrl: data.photo_url || undefined,
        idUrl: data.id_url || undefined,
        paymentStatus: data.payment_status,
        orderId: data.order_id || undefined,
        playerId: data.player_id || undefined,
        createdAt: data.created_at,
      };

      return { success: true, data: player };
    }

    return { success: false, error: "Unable to generate a unique Player ID. Please try again." };
  } catch (err: any) {
    console.error("Insert player exception:", err);
    return { success: false, error: "Failed to save player registration" };
  }
}

/**
 * Update player payment status after successful Cashfree payment
 */
export async function updatePlayerPaymentStatus(
  playerId: string,
  status: "completed" | "failed",
  orderId: string
): Promise<DatabaseResult<void>> {
  try {
    const { error } = await untyped
      .from("players")
      .update({ payment_status: status, order_id: orderId })
      .eq("id", playerId);

    if (error) {
      console.error("Update payment status error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Update payment status exception:", err);
    return { success: false, error: "Failed to update payment status" };
  }
}

/**
 * Get player by order ID (for callback verification)
 */
export async function getPlayerByOrderId(orderId: string): Promise<DatabaseResult<Player>> {
  try {
    const { data, error } = await untyped.from("players").select().eq("order_id", orderId).single();

    if (error) {
      console.error("Get player by order ID error:", error);
      return { success: false, error: error.message };
    }

    if (!data) return { success: false, error: "Player not found" };

    const player: Player = {
      id: data.id,
      fullName: data.full_name,
      age: data.age,
      position: data.position,
      preferredFoot: data.preferred_foot,
      contactNumber: data.contact_number,
      email: data.email,
      instagram: data.instagram || undefined,
      area: data.area,
      photoUrl: data.photo_url || undefined,
      idUrl: data.id_url || undefined,
      paymentStatus: data.payment_status,
      orderId: data.order_id || undefined,
      playerId: data.player_id || undefined,
      createdAt: data.created_at,
    };

    return { success: true, data: player };
  } catch (err: any) {
    console.error("Get player by order ID exception:", err);
    return { success: false, error: "Failed to fetch player" };
  }
}

/**
 * Insert a new franchise application into the database
 */
export async function insertFranchise(
  franchiseData: Omit<Database["public"]["Tables"]["franchises"]["Insert"], "id">
): Promise<DatabaseResult<Franchise>> {
  try {
    const { data, error } = await untyped.from("franchises").insert([franchiseData]).select().single();

    if (error) {
      console.error("Insert franchise error:", error);
      return { success: false, error: error.message };
    }

    const franchise: Franchise = {
      id: data.id,
      ownerName: data.owner_name,
      contactNumber: data.contact_number,
      email: data.email,
      teamArea: data.team_area,
      teamName: data.team_name || undefined,
      teamColors: data.team_colors || undefined,
      squadEstimate: data.squad_estimate || undefined,
      managerName: data.manager_name || undefined,
      instagram: data.instagram || undefined,
      previousExperience: data.previous_experience || undefined,
      logoUrl: data.logo_url || undefined,
      approvalStatus: data.approval_status,
      createdAt: data.created_at,
    };

    return { success: true, data: franchise };
  } catch (err: any) {
    console.error("Insert franchise exception:", err);
    return { success: false, error: "Failed to save franchise application" };
  }
}

/**
 * Get franchise by ID
 */
export async function getFranchiseById(franchiseId: string): Promise<DatabaseResult<Franchise>> {
  try {
    const { data, error } = await untyped.from("franchises").select().eq("id", franchiseId).single();

    if (error) {
      console.error("Get franchise error:", error);
      return { success: false, error: error.message };
    }

    if (!data) return { success: false, error: "Franchise not found" };

    const franchise: Franchise = {
      id: data.id,
      ownerName: data.owner_name,
      contactNumber: data.contact_number,
      email: data.email,
      teamArea: data.team_area,
      teamName: data.team_name || undefined,
      teamColors: data.team_colors || undefined,
      squadEstimate: data.squad_estimate || undefined,
      managerName: data.manager_name || undefined,
      instagram: data.instagram || undefined,
      previousExperience: data.previous_experience || undefined,
      logoUrl: data.logo_url || undefined,
      approvalStatus: data.approval_status,
      createdAt: data.created_at,
    };

    return { success: true, data: franchise };
  } catch (err: any) {
    console.error("Get franchise exception:", err);
    return { success: false, error: "Failed to fetch franchise" };
  }
}

/**
 * Get all franchises (for admin/dashboard)
 */
export async function getAllFranchises(): Promise<DatabaseResult<Franchise[]>> {
  try {
    const { data, error } = await untyped.from("franchises").select().order("created_at", { ascending: false });

    if (error) {
      console.error("Get all franchises error:", error);
      return { success: false, error: error.message };
    }

    const franchises: Franchise[] = (data || []).map((row: any) => ({
      id: row.id,
      ownerName: row.owner_name,
      contactNumber: row.contact_number,
      email: row.email,
      teamArea: row.team_area,
      teamName: row.team_name || undefined,
      teamColors: row.team_colors || undefined,
      squadEstimate: row.squad_estimate || undefined,
      managerName: row.manager_name || undefined,
      instagram: row.instagram || undefined,
      previousExperience: row.previous_experience || undefined,
      logoUrl: row.logo_url || undefined,
      approvalStatus: row.approval_status,
      createdAt: row.created_at,
    }));

    return { success: true, data: franchises };
  } catch (err: any) {
    console.error("Get all franchises exception:", err);
    return { success: false, error: "Failed to fetch franchises" };
  }
}

/**
 * Get all players (for admin/dashboard)
 */
export async function getAllPlayers(): Promise<DatabaseResult<Player[]>> {
  try {
    const { data, error } = await untyped.from("players").select().order("created_at", { ascending: false });

    if (error) {
      console.error("Get all players error:", error);
      return { success: false, error: error.message };
    }

    const players: Player[] = (data || []).map((row: any) => ({
      id: row.id,
      fullName: row.full_name,
      age: row.age,
      position: row.position,
      preferredFoot: row.preferred_foot,
      contactNumber: row.contact_number,
      email: row.email,
      instagram: row.instagram || undefined,
      area: row.area,
      photoUrl: row.photo_url || undefined,
      idUrl: row.id_url || undefined,
      paymentStatus: row.payment_status,
      orderId: row.order_id || undefined,
      playerId: row.player_id || undefined,
      createdAt: row.created_at,
    }));

    return { success: true, data: players };
  } catch (err: any) {
    console.error("Get all players exception:", err);
    return { success: false, error: "Failed to fetch players" };
  }
}
