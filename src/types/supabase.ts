export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      musictrack: {
        Row: {
          artist: string | null;
          id: string;
          index: number | null;
          music_zone_id: string;
          thumbnail_url: string;
          time: string | null;
          title: string;
          track_url: string;
        };
        Insert: {
          artist?: string | null;
          id?: string;
          index?: number | null;
          music_zone_id?: string;
          thumbnail_url?: string;
          time?: string | null;
          title: string;
          track_url: string;
        };
        Update: {
          artist?: string | null;
          id?: string;
          index?: number | null;
          music_zone_id?: string;
          thumbnail_url?: string;
          time?: string | null;
          title?: string;
          track_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "musictrack_music_zone_id_fkey";
            columns: ["music_zone_id"];
            isOneToOne: false;
            referencedRelation: "musiczone";
            referencedColumns: ["id"];
          },
        ];
      };
      musiczone: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          musiczone_img: string;
          user_id: string | null;
          zone_name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          musiczone_img?: string;
          user_id?: string | null;
          zone_name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          musiczone_img?: string;
          user_id?: string | null;
          zone_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "musiczone_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      user: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          id: string;
          music_zone_count: number;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          id: string;
          music_zone_count?: number;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          id?: string;
          music_zone_count?: number;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "USER_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type UserRow = Database["public"]["Tables"]["user"]["Row"];

export type AllTables = keyof PublicSchema["Tables"];

export type createTrack = Pick<
  Tables<"musictrack">,
  "title" | "thumbnail_url" | "track_url"
>;

export type trackRow = Database["public"]["Tables"]["musictrack"]["Row"];

export type trackRowWithFile = trackRow & {
  file: File | null;
};

export type musicZoneRow = Database["public"]["Tables"]["musiczone"]["Row"];
