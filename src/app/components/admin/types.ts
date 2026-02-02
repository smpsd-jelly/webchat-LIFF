export type Conversation = {
  id: string | number; 
  line_user_id: string;
  status: "open" | "closed";
  last_message_at: string | null;
  last_message_text: string | null;
  unread_admin_count: number;
  unread_user_count: number;
  created_at: string;
  updated_at: string;
  user: {
    display_name: string | null;
    picture_url: string | null;
    last_seen_at: string | null;
  };
};

export type Message = {
  id: string | number;
  sender_type: "user" | "admin" | "system";
  message_type?: string;
  status?: string;
  text: string;
  created_at: string;
};
