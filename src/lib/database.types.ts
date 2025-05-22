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
			admin_settings: {
				Row: {
					availability_message: string | null;
					is_available: boolean;
					singleton_id: boolean;
					updated_at: string | null;
				};
				Insert: {
					availability_message?: string | null;
					is_available?: boolean;
					singleton_id?: boolean;
					updated_at?: string | null;
				};
				Update: {
					availability_message?: string | null;
					is_available?: boolean;
					singleton_id?: boolean;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			case_communications: {
				Row: {
					case_id: string | null;
					content: string;
					created_at: string | null;
					id: string;
					is_general_inquiry: boolean;
					read_at: string | null;
					receiver_id: string | null;
					sender_id: string;
				};
				Insert: {
					case_id?: string | null;
					content: string;
					created_at?: string | null;
					id?: string;
					is_general_inquiry?: boolean;
					read_at?: string | null;
					receiver_id?: string | null;
					sender_id: string;
				};
				Update: {
					case_id?: string | null;
					content?: string;
					created_at?: string | null;
					id?: string;
					is_general_inquiry?: boolean;
					read_at?: string | null;
					receiver_id?: string | null;
					sender_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'case_communications_case_id_fkey';
						columns: ['case_id'];
						isOneToOne: false;
						referencedRelation: 'cases';
						referencedColumns: ['id'];
					},
				];
			};
			case_documents: {
				Row: {
					case_id: string;
					file_name: string;
					file_size_bytes: number | null;
					id: string;
					mime_type: string | null;
					storage_path: string;
					uploaded_at: string | null;
					user_id: string;
				};
				Insert: {
					case_id: string;
					file_name: string;
					file_size_bytes?: number | null;
					id?: string;
					mime_type?: string | null;
					storage_path: string;
					uploaded_at?: string | null;
					user_id: string;
				};
				Update: {
					case_id?: string;
					file_name?: string;
					file_size_bytes?: number | null;
					id?: string;
					mime_type?: string | null;
					storage_path?: string;
					uploaded_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'case_documents_case_id_fkey';
						columns: ['case_id'];
						isOneToOne: false;
						referencedRelation: 'cases';
						referencedColumns: ['id'];
					},
				];
			};
			cases: {
				Row: {
					admin_feedback: string | null;
					client_agreed_to_terms_id: string | null;
					consultant_progress_notes: string | null;
					created_at: string | null;
					custom_instructions: string | null;
					id: string;
					payment_deposit_id: string | null;
					status: Database['public']['Enums']['case_status'];
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					admin_feedback?: string | null;
					client_agreed_to_terms_id?: string | null;
					consultant_progress_notes?: string | null;
					created_at?: string | null;
					custom_instructions?: string | null;
					id?: string;
					payment_deposit_id?: string | null;
					status?: Database['public']['Enums']['case_status'];
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					admin_feedback?: string | null;
					client_agreed_to_terms_id?: string | null;
					consultant_progress_notes?: string | null;
					created_at?: string | null;
					custom_instructions?: string | null;
					id?: string;
					payment_deposit_id?: string | null;
					status?: Database['public']['Enums']['case_status'];
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'cases_client_agreed_to_terms_id_fkey';
						columns: ['client_agreed_to_terms_id'];
						isOneToOne: false;
						referencedRelation: 'user_terms_agreement';
						referencedColumns: ['id'];
					},
				];
			};
			contact_messages: {
				Row: {
					body: string | null;
					created_at: string | null;
					email: string | null;
					id: string;
					name: string | null;
					subject: string | null;
					updated_at: string | null;
				};
				Insert: {
					body?: string | null;
					created_at?: string | null;
					email?: string | null;
					id?: string;
					name?: string | null;
					subject?: string | null;
					updated_at?: string | null;
				};
				Update: {
					body?: string | null;
					created_at?: string | null;
					email?: string | null;
					id?: string;
					name?: string | null;
					subject?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					created_at: string | null;
					id: string;
					name: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					name?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			stripe_customers: {
				Row: {
					created_at: string | null;
					stripe_customer_id: string | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					stripe_customer_id?: string | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					stripe_customer_id?: string | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			terms_of_service: {
				Row: {
					content: string;
					created_at: string | null;
					effective_date: string;
					id: string;
					is_latest: boolean | null;
					version: string;
				};
				Insert: {
					content: string;
					created_at?: string | null;
					effective_date: string;
					id?: string;
					is_latest?: boolean | null;
					version: string;
				};
				Update: {
					content?: string;
					created_at?: string | null;
					effective_date?: string;
					id?: string;
					is_latest?: boolean | null;
					version?: string;
				};
				Relationships: [];
			};
			user_products: {
				Row: {
					created_at: string;
					stripe_product_id: string;
					type: Database['public']['Enums']['stripe_payment_mode'];
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					stripe_product_id: string;
					type: Database['public']['Enums']['stripe_payment_mode'];
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					stripe_product_id?: string;
					type?: Database['public']['Enums']['stripe_payment_mode'];
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			user_terms_agreement: {
				Row: {
					agreed_at: string | null;
					id: string;
					terms_id: string;
					user_id: string;
				};
				Insert: {
					agreed_at?: string | null;
					id?: string;
					terms_id: string;
					user_id: string;
				};
				Update: {
					agreed_at?: string | null;
					id?: string;
					terms_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_terms_agreement_terms_id_fkey';
						columns: ['terms_id'];
						isOneToOne: false;
						referencedRelation: 'terms_of_service';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			user_password_set: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
		};
		Enums: {
			case_status:
				| 'draft'
				| 'submitted'
				| 'under_review'
				| 'in_progress'
				| 'declined'
				| 'completed';
			stripe_payment_mode: 'payment' | 'subscription';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
				DefaultSchema['Views'])
		? (DefaultSchema['Tables'] &
				DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			case_status: [
				'draft',
				'submitted',
				'under_review',
				'in_progress',
				'declined',
				'completed',
			],
			stripe_payment_mode: ['payment', 'subscription'],
		},
	},
} as const;
