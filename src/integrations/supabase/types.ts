export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      exchange_requests: {
        Row: {
          admin_notes: string | null
          admin_result_amount: number | null
          admin_result_type: string | null
          admin_user_id: string | null
          amount: string
          back_image_path: string | null
          code: string
          country: string | null
          created_at: string
          email: string
          front_image_path: string | null
          giftcard_name: string
          giftcard_wanted: string | null
          id: string
          payment_details: Json | null
          payment_method: string | null
          pin: string | null
          status: string
          type: string
          updated_at: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_result_amount?: number | null
          admin_result_type?: string | null
          admin_user_id?: string | null
          amount: string
          back_image_path?: string | null
          code: string
          country?: string | null
          created_at?: string
          email: string
          front_image_path?: string | null
          giftcard_name: string
          giftcard_wanted?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          pin?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_result_amount?: number | null
          admin_result_type?: string | null
          admin_user_id?: string | null
          amount?: string
          back_image_path?: string | null
          code?: string
          country?: string | null
          created_at?: string
          email?: string
          front_image_path?: string | null
          giftcard_name?: string
          giftcard_wanted?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          pin?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      gift_card_verifications: {
        Row: {
          admin_notes: string | null
          admin_result_amount: number | null
          admin_result_type: string | null
          admin_user_id: string | null
          amount: string
          back_image_path: string | null
          code: string
          country: string
          created_at: string
          email: string
          front_image_path: string | null
          giftcard_name: string
          id: string
          pin: string | null
          status: string
          updated_at: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_result_amount?: number | null
          admin_result_type?: string | null
          admin_user_id?: string | null
          amount: string
          back_image_path?: string | null
          code: string
          country: string
          created_at?: string
          email: string
          front_image_path?: string | null
          giftcard_name: string
          id?: string
          pin?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_result_amount?: number | null
          admin_result_type?: string | null
          admin_user_id?: string | null
          amount?: string
          back_image_path?: string | null
          code?: string
          country?: string
          created_at?: string
          email?: string
          front_image_path?: string | null
          giftcard_name?: string
          id?: string
          pin?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: Database["public"]["Enums"]["country_code"]
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          email: string
          first_name: string | null
          gift_cards_purchased: number | null
          gift_cards_sold: number | null
          gift_cards_verified: number | null
          id: string
          is_admin: boolean
          last_name: string | null
          referral_code: string | null
          referred_by_code: string | null
          signup_bonus_earned: boolean | null
          signup_bonus_redeemable: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          email: string
          first_name?: string | null
          gift_cards_purchased?: number | null
          gift_cards_sold?: number | null
          gift_cards_verified?: number | null
          id?: string
          is_admin?: boolean
          last_name?: string | null
          referral_code?: string | null
          referred_by_code?: string | null
          signup_bonus_earned?: boolean | null
          signup_bonus_redeemable?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          email?: string
          first_name?: string | null
          gift_cards_purchased?: number | null
          gift_cards_sold?: number | null
          gift_cards_verified?: number | null
          id?: string
          is_admin?: boolean
          last_name?: string | null
          referral_code?: string | null
          referred_by_code?: string | null
          signup_bonus_earned?: boolean | null
          signup_bonus_redeemable?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_amount: number | null
          bonus_currency: Database["public"]["Enums"]["currency_code"] | null
          bonus_earned: boolean | null
          bonus_redeemable: boolean | null
          created_at: string | null
          id: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
        }
        Insert: {
          bonus_amount?: number | null
          bonus_currency?: Database["public"]["Enums"]["currency_code"] | null
          bonus_earned?: boolean | null
          bonus_redeemable?: boolean | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
        }
        Update: {
          bonus_amount?: number | null
          bonus_currency?: Database["public"]["Enums"]["currency_code"] | null
          bonus_earned?: boolean | null
          bonus_redeemable?: boolean | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          admin_notes: string | null
          admin_user_id: string | null
          amount: number
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          description: string | null
          id: string
          reference_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          admin_user_id?: string | null
          amount: number
          created_at?: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          id?: string
          reference_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          admin_user_id?: string | null
          amount?: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          id: string
          pending_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          pending_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          pending_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_current_user_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      country_code:
        | "US"
        | "CA"
        | "AU"
        | "GB"
        | "DE"
        | "FR"
        | "ES"
        | "IT"
        | "NL"
        | "BE"
        | "AT"
        | "IE"
        | "PT"
        | "FI"
        | "SE"
        | "DK"
        | "NO"
        | "CH"
        | "LU"
      currency_code: "USD" | "CAD" | "AUD" | "GBP" | "EUR"
      transaction_type:
        | "signup_bonus"
        | "referral_bonus"
        | "gift_card_purchase"
        | "gift_card_sale"
        | "gift_card_exchange"
        | "deposit"
        | "withdrawal"
        | "admin_adjustment"
        | "verification"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      country_code: [
        "US",
        "CA",
        "AU",
        "GB",
        "DE",
        "FR",
        "ES",
        "IT",
        "NL",
        "BE",
        "AT",
        "IE",
        "PT",
        "FI",
        "SE",
        "DK",
        "NO",
        "CH",
        "LU",
      ],
      currency_code: ["USD", "CAD", "AUD", "GBP", "EUR"],
      transaction_type: [
        "signup_bonus",
        "referral_bonus",
        "gift_card_purchase",
        "gift_card_sale",
        "gift_card_exchange",
        "deposit",
        "withdrawal",
        "admin_adjustment",
        "verification",
      ],
    },
  },
} as const
