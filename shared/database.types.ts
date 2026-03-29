export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      degen_outcomes: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          degen_percent: number;
          busted: boolean;
          base_cost: number;
          charged_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          degen_percent: number;
          busted: boolean;
          base_cost: number;
          charged_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          degen_percent?: number;
          busted?: boolean;
          base_cost?: number;
          charged_amount?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      flush_detections: {
        Row: {
          audio_size_kb: number | null;
          confidence: number;
          created_at: string;
          detected: boolean;
          duration_seconds: number | null;
          id: string;
          model_version: string | null;
          user_id: string;
        };
        Insert: {
          audio_size_kb?: number | null;
          confidence: number;
          created_at?: string;
          detected: boolean;
          duration_seconds?: number | null;
          id?: string;
          model_version?: string | null;
          user_id: string;
        };
        Update: {
          audio_size_kb?: number | null;
          confidence?: number;
          created_at?: string;
          detected?: boolean;
          duration_seconds?: number | null;
          id?: string;
          model_version?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      game_config: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      invite_codes: {
        Row: {
          code: string;
          created_at: string;
          expires_at: string | null;
          id: string;
          revoked: boolean;
          used_at: string | null;
          used_by: string | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          revoked?: boolean;
          used_at?: string | null;
          used_by?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          revoked?: boolean;
          used_at?: string | null;
          used_by?: string | null;
        };
        Relationships: [];
      };
      mystery_boxes: {
        Row: {
          created_at: string;
          id: string;
          image_url: string;
          opened: boolean;
          rarity: Database["public"]["Enums"]["nft_rarity"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url: string;
          opened?: boolean;
          rarity: Database["public"]["Enums"]["nft_rarity"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string;
          opened?: boolean;
          rarity?: Database["public"]["Enums"]["nft_rarity"];
          user_id?: string;
        };
        Relationships: [];
      };
      marketplace_listings: {
        Row: {
          id: string;
          listed_at: string;
          nft_id: string;
          price: string;
          seller_id: string;
        };
        Insert: {
          id?: string;
          listed_at?: string;
          nft_id: string;
          price: string;
          seller_id: string;
        };
        Update: {
          id?: string;
          listed_at?: string;
          nft_id?: string;
          price?: string;
          seller_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_nft_id_fkey";
            columns: ["nft_id"];
            isOneToOne: true;
            referencedRelation: "nfts";
            referencedColumns: ["id"];
          },
        ];
      };
      nfts: {
        Row: {
          breed_count: number;
          comfort: number;
          created_at: string;
          efficiency: number;
          energy: number;
          id: string;
          image_url: string;
          last_used_at: string | null;
          level: number;
          luck: number;
          name: string;
          rarity: Database["public"]["Enums"]["nft_rarity"];
          resilience: number;
          stat_points: number;
          type: Database["public"]["Enums"]["nft_type"];
          updated_at: string;
          user_id: string;
          xp: number;
        };
        Insert: {
          breed_count?: number;
          comfort: number;
          created_at?: string;
          efficiency: number;
          energy?: number;
          id?: string;
          image_url: string;
          last_used_at?: string | null;
          level?: number;
          luck: number;
          name: string;
          rarity: Database["public"]["Enums"]["nft_rarity"];
          resilience: number;
          stat_points?: number;
          type: Database["public"]["Enums"]["nft_type"];
          updated_at?: string;
          user_id: string;
          xp?: number;
        };
        Update: {
          breed_count?: number;
          comfort?: number;
          created_at?: string;
          efficiency?: number;
          energy?: number;
          id?: string;
          image_url?: string;
          last_used_at?: string | null;
          level?: number;
          luck?: number;
          name?: string;
          rarity?: Database["public"]["Enums"]["nft_rarity"];
          resilience?: number;
          stat_points?: number;
          type?: Database["public"]["Enums"]["nft_type"];
          updated_at?: string;
          user_id?: string;
          xp?: number;
        };
        Relationships: [];
      };
      pending_loot_rolls: {
        Row: {
          created_at: string;
          holds: number;
          id: string;
          nft_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          holds?: number;
          id?: string;
          nft_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          holds?: number;
          id?: string;
          nft_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          approved: boolean;
          created_at: string;
          id: string;
          invite_code_id: string | null;
          poop_balance: number;
        };
        Insert: {
          approved?: boolean;
          created_at?: string;
          id: string;
          invite_code_id?: string | null;
          poop_balance?: number;
        };
        Update: {
          approved?: boolean;
          created_at?: string;
          id?: string;
          invite_code_id?: string | null;
          poop_balance?: number;
        };
        Relationships: [
          {
            foreignKeyName: "users_invite_code_id_fkey";
            columns: ["invite_code_id"];
            isOneToOne: false;
            referencedRelation: "invite_codes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      _xp_decompose: {
        Args: { total_xp: number };
        Returns: {
          lv: number;
          xp_rem: number;
        }[];
      };
      generate_invite_codes: {
        Args: { p_count?: number };
        Returns: {
          code: string;
        }[];
      };
      get_nft_with_listing_status: {
        Args: { nft_id: string };
        Returns: {
          comfort: number;
          created_at: string;
          efficiency: number;
          energy: number;
          id: string;
          image_url: string;
          is_listed: boolean;
          level: number;
          listing_price: string;
          luck: number;
          name: string;
          rarity: Database["public"]["Enums"]["nft_rarity"];
          resilience: number;
          type: Database["public"]["Enums"]["nft_type"];
          updated_at: string;
          user_id: string;
          xp: number;
        }[];
      };
      decrement_poop_balance: {
        Args: { p_user_id: string; p_amount: number };
        Returns: number;
      };
      increment_poop_balance: {
        Args: { amount: number; user_id: string };
        Returns: number;
      };
      seed_dev_test_nfts: { Args: { p_user_id: string }; Returns: Json };
      seed_test_mystery_boxes: { Args: never; Returns: Json };
      validate_and_approve_user: { Args: { p_code: string }; Returns: Json };
    };
    Enums: {
      nft_rarity: "common" | "rare" | "legendary" | "transcendent";
      nft_type: "cruise-seat" | "turbo-flush" | "zen-fortress";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      nft_rarity: ["common", "rare", "legendary", "transcendent"],
      nft_type: ["cruise-seat", "turbo-flush", "zen-fortress"],
    },
  },
} as const;
