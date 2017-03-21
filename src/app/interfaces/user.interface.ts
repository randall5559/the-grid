export interface User {
  first_name: string;
  last_name: string;
  entitlements: string[];
  app_user_id: number;
  sso_id: number;
  email: string;
  active: boolean;
}
