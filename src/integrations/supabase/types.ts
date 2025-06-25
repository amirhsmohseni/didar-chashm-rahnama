export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string
          after_data: Json | null
          before_data: Json | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_alt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          slug: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_alt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_alt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_settings: {
        Row: {
          ai_enabled: boolean | null
          amount_threshold: number | null
          auto_trading_enabled: boolean | null
          created_at: string
          id: string
          max_risk: number | null
          percent_threshold: number | null
          triangular_enabled: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_enabled?: boolean | null
          amount_threshold?: number | null
          auto_trading_enabled?: boolean | null
          created_at?: string
          id?: string
          max_risk?: number | null
          percent_threshold?: number | null
          triangular_enabled?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_enabled?: boolean | null
          amount_threshold?: number | null
          auto_trading_enabled?: boolean | null
          created_at?: string
          id?: string
          max_risk?: number | null
          percent_threshold?: number | null
          triangular_enabled?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bot_status: {
        Row: {
          created_at: string
          id: string
          is_running: boolean | null
          last_started: string | null
          last_stopped: string | null
          total_runtime_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_running?: boolean | null
          last_started?: string | null
          last_stopped?: string | null
          total_runtime_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_running?: boolean | null
          last_started?: string | null
          last_stopped?: string | null
          total_runtime_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          age: number | null
          assigned_admin_id: string | null
          created_at: string
          current_medications: string | null
          doctor_id: string | null
          email: string
          follow_up_required: boolean | null
          gender: string | null
          id: string
          medical_condition: string
          medical_history: string | null
          name: string
          notes: string | null
          phone: string
          preferred_contact_method: string | null
          preferred_date: string | null
          preferred_time: string | null
          response_sent_at: string | null
          status: string | null
          updated_at: string
          urgency_level: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          assigned_admin_id?: string | null
          created_at?: string
          current_medications?: string | null
          doctor_id?: string | null
          email: string
          follow_up_required?: boolean | null
          gender?: string | null
          id?: string
          medical_condition: string
          medical_history?: string | null
          name: string
          notes?: string | null
          phone: string
          preferred_contact_method?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          response_sent_at?: string | null
          status?: string | null
          updated_at?: string
          urgency_level?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          assigned_admin_id?: string | null
          created_at?: string
          current_medications?: string | null
          doctor_id?: string | null
          email?: string
          follow_up_required?: boolean | null
          gender?: string | null
          id?: string
          medical_condition?: string
          medical_history?: string | null
          name?: string
          notes?: string | null
          phone?: string
          preferred_contact_method?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          response_sent_at?: string | null
          status?: string | null
          updated_at?: string
          urgency_level?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_days: string[] | null
          available_hours: string | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          education: string | null
          experience_years: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          profile_description: string | null
          specialty: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available_days?: string[] | null
          available_hours?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          education?: string | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          profile_description?: string | null
          specialty: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available_days?: string[] | null
          available_hours?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          education?: string | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          profile_description?: string | null
          specialty?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      exchanges: {
        Row: {
          api_key: string | null
          api_secret: string | null
          api_url: string | null
          created_at: string
          enabled: boolean
          fee_buy: number | null
          fee_sell: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          api_url?: string | null
          created_at?: string
          enabled?: boolean
          fee_buy?: number | null
          fee_sell?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          api_url?: string | null
          created_at?: string
          enabled?: boolean
          fee_buy?: number | null
          fee_sell?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          order_index: number | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          file_url: string
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          order_index: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          template: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          template?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          template?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_reviews: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          patient_email: string | null
          patient_name: string
          rating: number | null
          review_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          patient_email?: string | null
          patient_name: string
          rating?: number | null
          review_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          patient_email?: string | null
          patient_name?: string
          rating?: number | null
          review_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      real_prices: {
        Row: {
          buy_price: number
          created_at: string
          currency: string
          exchange_name: string
          id: string
          last_updated: string
          sell_price: number
        }
        Insert: {
          buy_price: number
          created_at?: string
          currency: string
          exchange_name: string
          id?: string
          last_updated?: string
          sell_price: number
        }
        Update: {
          buy_price?: number
          created_at?: string
          currency?: string
          exchange_name?: string
          id?: string
          last_updated?: string
          sell_price?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string
          detailed_content: string | null
          featured_image: string | null
          gallery_images: Json | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          order_index: number | null
          price: number | null
          reading_time: number | null
          slug: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          detailed_content?: string | null
          featured_image?: string | null
          gallery_images?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          order_index?: number | null
          price?: number | null
          reading_time?: number | null
          slug?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          detailed_content?: string | null
          featured_image?: string | null
          gallery_images?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          order_index?: number | null
          price?: number | null
          reading_time?: number | null
          slug?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          label: string
          sort_order: number | null
          type: string
          updated_at: string | null
          updated_by: string | null
          validation_rules: Json | null
          value: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          label: string
          sort_order?: number | null
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          validation_rules?: Json | null
          value?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          label?: string
          sort_order?: number | null
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          validation_rules?: Json | null
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          after_image: string | null
          before_image: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          order_index: number | null
          patient_image: string | null
          patient_name: string
          procedure_type: string
          rating: number | null
          testimonial_text: string
          updated_at: string | null
        }
        Insert: {
          after_image?: string | null
          before_image?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          patient_image?: string | null
          patient_name: string
          procedure_type: string
          rating?: number | null
          testimonial_text: string
          updated_at?: string | null
        }
        Update: {
          after_image?: string | null
          before_image?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          patient_image?: string | null
          patient_name?: string
          procedure_type?: string
          rating?: number | null
          testimonial_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          buy_exchange: string
          buy_price: number
          created_at: string
          currency: string
          id: string
          profit: number
          profit_percent: number
          sell_exchange: string
          sell_price: number
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          buy_exchange: string
          buy_price: number
          created_at?: string
          currency: string
          id?: string
          profit: number
          profit_percent: number
          sell_exchange: string
          sell_price: number
          status?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          buy_exchange?: string
          buy_price?: number
          created_at?: string
          currency?: string
          id?: string
          profit?: number
          profit_percent?: number
          sell_exchange?: string
          sell_price?: number
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_fees: {
        Row: {
          created_at: string
          currency: string
          exchange_id: string | null
          fee: number
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency: string
          exchange_id?: string | null
          fee: number
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          exchange_id?: string | null
          fee?: number
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_fees_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchanges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          action_name: string
          resource_type_name: string
          resource_id_value?: string
          details_data?: Json
          before_data_value?: Json
          after_data_value?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "user" | "editor" | "manager" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "doctor", "user", "editor", "manager", "viewer"],
    },
  },
} as const
