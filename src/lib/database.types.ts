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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      data_sources: {
        Row: {
          connection_config: Json | null
          created_at: string
          description: string | null
          id: string
          last_sync: string | null
          name: string
          organization_id: string
          project_id: string | null
          records_count: number
          schema_config: Json | null
          size: string | null
          status: Database["public"]["Enums"]["data_source_status"]
          type: Database["public"]["Enums"]["data_source_type"]
          updated_at: string
        }
        Insert: {
          connection_config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          last_sync?: string | null
          name: string
          organization_id: string
          project_id?: string | null
          records_count?: number
          schema_config?: Json | null
          size?: string | null
          status?: Database["public"]["Enums"]["data_source_status"]
          type?: Database["public"]["Enums"]["data_source_type"]
          updated_at?: string
        }
        Update: {
          connection_config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          last_sync?: string | null
          name?: string
          organization_id?: string
          project_id?: string | null
          records_count?: number
          schema_config?: Json | null
          size?: string | null
          status?: Database["public"]["Enums"]["data_source_status"]
          type?: Database["public"]["Enums"]["data_source_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      dataset_rows: {
        Row: {
          created_at: string
          data_source_id: string
          id: string
          organization_id: string
          row_data: Json
          row_number: number
        }
        Insert: {
          created_at?: string
          data_source_id: string
          id?: string
          organization_id: string
          row_data: Json
          row_number: number
        }
        Update: {
          created_at?: string
          data_source_id?: string
          id?: string
          organization_id?: string
          row_data?: Json
          row_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "dataset_rows_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataset_rows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          change_pct: number | null
          color: string | null
          created_at: string
          current_value: number | null
          description: string | null
          display_value: string | null
          formula: string | null
          frequency: string | null
          icon: string | null
          id: string
          linked_metric: string | null
          linked_node_key: string | null
          name: string
          organization_id: string
          project_id: string | null
          target: number | null
          trend: string | null
          type: string | null
          unit: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          change_pct?: number | null
          color?: string | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          display_value?: string | null
          formula?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          linked_metric?: string | null
          linked_node_key?: string | null
          name: string
          organization_id: string
          project_id?: string | null
          target?: number | null
          trend?: string | null
          type?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          change_pct?: number | null
          color?: string | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          display_value?: string | null
          formula?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          linked_metric?: string | null
          linked_node_key?: string | null
          name?: string
          organization_id?: string
          project_id?: string | null
          target?: number | null
          trend?: string | null
          type?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          completion: number
          created_at: string
          created_by: string | null
          data_config: Json | null
          id: string
          location: string | null
          name: string
          next_milestone: string | null
          next_milestone_date: string | null
          operation_type: Database["public"]["Enums"]["operation_type"]
          organization_id: string
          real_time_updates: boolean
          risk_level: Database["public"]["Enums"]["risk_level"]
          status: Database["public"]["Enums"]["project_status"]
          team_size: number
          updated_at: string
        }
        Insert: {
          budget?: number | null
          completion?: number
          created_at?: string
          created_by?: string | null
          data_config?: Json | null
          id?: string
          location?: string | null
          name: string
          next_milestone?: string | null
          next_milestone_date?: string | null
          operation_type?: Database["public"]["Enums"]["operation_type"]
          organization_id: string
          real_time_updates?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["project_status"]
          team_size?: number
          updated_at?: string
        }
        Update: {
          budget?: number | null
          completion?: number
          created_at?: string
          created_by?: string | null
          data_config?: Json | null
          id?: string
          location?: string | null
          name?: string
          next_milestone?: string | null
          next_milestone_date?: string | null
          operation_type?: Database["public"]["Enums"]["operation_type"]
          organization_id?: string
          real_time_updates?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["project_status"]
          team_size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_connections: {
        Row: {
          created_at: string
          duration: string | null
          from_node_key: string
          id: string
          organization_id: string
          progress: number
          to_node_key: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          duration?: string | null
          from_node_key: string
          id?: string
          organization_id: string
          progress?: number
          to_node_key: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          duration?: string | null
          from_node_key?: string
          id?: string
          organization_id?: string
          progress?: number
          to_node_key?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_connections_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_nodes: {
        Row: {
          cost: string | null
          created_at: string
          duration: string | null
          id: string
          kpis: Json | null
          name: string
          node_key: string
          organization_id: string
          position_x: number
          position_y: number
          progress: number
          status: Database["public"]["Enums"]["node_status"]
          type: string
          workflow_id: string
        }
        Insert: {
          cost?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          kpis?: Json | null
          name: string
          node_key: string
          organization_id: string
          position_x?: number
          position_y?: number
          progress?: number
          status?: Database["public"]["Enums"]["node_status"]
          type: string
          workflow_id: string
        }
        Update: {
          cost?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          kpis?: Json | null
          name?: string
          node_key?: string
          organization_id?: string
          position_x?: number
          position_y?: number
          progress?: number
          status?: Database["public"]["Enums"]["node_status"]
          type?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_nodes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_nodes_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          ai_recommendations: Json | null
          created_at: string
          description: string | null
          estimated_cost: string | null
          id: string
          name: string
          organization_id: string
          project_id: string
          risk_score: number | null
          total_duration: string | null
          updated_at: string
        }
        Insert: {
          ai_recommendations?: Json | null
          created_at?: string
          description?: string | null
          estimated_cost?: string | null
          id?: string
          name: string
          organization_id: string
          project_id: string
          risk_score?: number | null
          total_duration?: string | null
          updated_at?: string
        }
        Update: {
          ai_recommendations?: Json | null
          created_at?: string
          description?: string | null
          estimated_cost?: string | null
          id?: string
          name?: string
          organization_id?: string
          project_id?: string
          risk_score?: number | null
          total_duration?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_ids: { Args: never; Returns: string[] }
      user_has_org_role: {
        Args: {
          _org_id: string
          _roles: Database["public"]["Enums"]["org_role"][]
        }
        Returns: boolean
      }
    }
    Enums: {
      data_source_status: "connected" | "warning" | "error" | "pending"
      data_source_type: "excel" | "database" | "api" | "cloud" | "iot"
      node_status: "pending" | "scheduled" | "running" | "completed" | "error"
      operation_type:
        | "manufacturing"
        | "logistics"
        | "infrastructure"
        | "billing"
        | "business"
        | "marketing"
        | "hr"
        | "sales"
        | "finance"
        | "research"
        | "support"
      org_role: "owner" | "admin" | "member"
      project_status:
        | "planning"
        | "active"
        | "paused"
        | "completed"
        | "cancelled"
      risk_level: "low" | "medium" | "high"
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
      data_source_status: ["connected", "warning", "error", "pending"],
      data_source_type: ["excel", "database", "api", "cloud", "iot"],
      node_status: ["pending", "scheduled", "running", "completed", "error"],
      operation_type: [
        "manufacturing",
        "logistics",
        "infrastructure",
        "billing",
        "business",
        "marketing",
        "hr",
        "sales",
        "finance",
        "research",
        "support",
      ],
      org_role: ["owner", "admin", "member"],
      project_status: [
        "planning",
        "active",
        "paused",
        "completed",
        "cancelled",
      ],
      risk_level: ["low", "medium", "high"],
    },
  },
} as const
