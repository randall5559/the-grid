export interface Comment {
  created_at: string;
  text: string;
  user: {
    app_user_id: number,
    first_name: string,
    last_name: string
  };
}
