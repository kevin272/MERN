export const MessageConstants = {
    TOKEN_EXPIRED: "Token expired.",
    INVALID_TOKEN : "Invalid activationToken"
  };
  
  
  export const UserRoles = {
    ADMIN: "admin",
    MEMBERS: "member"
  };
  
  
  export type SearchParams = {
    page?: number;
    limit?: number;
    search?: string | null;
    sort?: string;
    order?: string;
  }
  
  export const validFileExtensions = ['image/jpg', 'image/gif', 'image/png', 'image/jpeg', 'image/svg', 'image/webp'] ;