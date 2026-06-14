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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admission_enquiries: {
        Row: {
          course_id: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          institute_id: string | null
          message: string | null
          phone: string
          remarks: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          institute_id?: string | null
          message?: string | null
          phone: string
          remarks?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          institute_id?: string | null
          message?: string | null
          phone?: string
          remarks?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admission_enquiries_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admission_enquiries_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_name: string
          course_id: string
          created_at: string | null
          end_year: number
          id: string
          is_active: boolean | null
          start_year: number
          updated_at: string | null
        }
        Insert: {
          batch_name: string
          course_id: string
          created_at?: string | null
          end_year: number
          id?: string
          is_active?: boolean | null
          start_year: number
          updated_at?: string | null
        }
        Update: {
          batch_name?: string
          course_id?: string
          created_at?: string | null
          end_year?: number
          id?: string
          is_active?: boolean | null
          start_year?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          course_type: string
          created_at: string | null
          duration_years: number
          id: string
          institute_id: string
          is_active: boolean | null
          name: string
          total_semesters: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          course_type: string
          created_at?: string | null
          duration_years: number
          id?: string
          institute_id: string
          is_active?: boolean | null
          name: string
          total_semesters?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          course_type?: string
          created_at?: string | null
          duration_years?: number
          id?: string
          institute_id?: string
          is_active?: boolean | null
          name?: string
          total_semesters?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      faculties: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          designation: string | null
          email: string
          employee_id: string
          first_name: string
          id: string
          institute_id: string
          joining_date: string | null
          last_name: string | null
          phone: string | null
          profile_photo_url: string | null
          status: Database["public"]["Enums"]["faculty_status"] | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          designation?: string | null
          email: string
          employee_id: string
          first_name: string
          id?: string
          institute_id: string
          joining_date?: string | null
          last_name?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          status?: Database["public"]["Enums"]["faculty_status"] | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string
          employee_id?: string
          first_name?: string
          id?: string
          institute_id?: string
          joining_date?: string | null
          last_name?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          status?: Database["public"]["Enums"]["faculty_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculties_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_documents: {
        Row: {
          document_type: string
          faculty_id: string
          file_name: string
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          document_type: string
          faculty_id: string
          file_name: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          document_type?: string
          faculty_id?: string
          file_name?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_documents_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_categories: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          amount_paid: number
          created_by: string | null
          id: string
          payment_date: string | null
          payment_method: string
          receipt_number: string | null
          receipt_url: string | null
          remarks: string | null
          status: string | null
          student_fee_id: string
          transaction_id: string | null
        }
        Insert: {
          amount_paid: number
          created_by?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          receipt_number?: string | null
          receipt_url?: string | null
          remarks?: string | null
          status?: string | null
          student_fee_id: string
          transaction_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_by?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          receipt_number?: string | null
          receipt_url?: string | null
          remarks?: string | null
          status?: string | null
          student_fee_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_fee_id_fkey"
            columns: ["student_fee_id"]
            isOneToOne: false
            referencedRelation: "student_fees"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          amount: number
          batch_id: string | null
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          batch_id?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          batch_id?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      institutes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          notice_type: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          notice_type?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          notice_type?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          document_type: string
          file_name: string
          file_url: string
          id: string
          student_id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_url: string
          id?: string
          student_id: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          student_id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_fees: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          fee_structure_id: string
          id: string
          remarks: string | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          fee_structure_id: string
          id?: string
          remarks?: string | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          fee_structure_id?: string
          id?: string
          remarks?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_fees_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_guardians: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_primary: boolean | null
          occupation: string | null
          phone: string | null
          relationship: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_primary?: boolean | null
          occupation?: string | null
          phone?: string | null
          relationship: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_primary?: boolean | null
          occupation?: string | null
          phone?: string | null
          relationship?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          admission_date: string | null
          admission_no: string
          auth_user_id: string | null
          batch_id: string
          created_at: string | null
          dob: string | null
          email: string
          first_name: string
          gender: string | null
          id: string
          last_name: string | null
          phone: string | null
          status: Database["public"]["Enums"]["student_status"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          admission_no: string
          auth_user_id?: string | null
          batch_id: string
          created_at?: string | null
          dob?: string | null
          email: string
          first_name: string
          gender?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["student_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          admission_no?: string
          auth_user_id?: string | null
          batch_id?: string
          created_at?: string | null
          dob?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["student_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_super_admin_or_admin: { Args: never; Returns: boolean }
      user_role: { Args: never; Returns: string }
    }
    Enums: {
      faculty_status: "ACTIVE" | "RESIGNED" | "RETIRED" | "INACTIVE"
      student_status: "ACTIVE" | "GRADUATED" | "DROPPED" | "INACTIVE"
      user_role: "SUPER_ADMIN" | "ADMIN" | "FACULTY" | "STUDENT"
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
      faculty_status: ["ACTIVE", "RESIGNED", "RETIRED", "INACTIVE"],
      student_status: ["ACTIVE", "GRADUATED", "DROPPED", "INACTIVE"],
      user_role: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
    },
  },
} as const
