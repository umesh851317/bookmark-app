export type Profile = {
  id: string;
  handle: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
