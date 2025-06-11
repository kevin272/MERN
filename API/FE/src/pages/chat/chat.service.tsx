import HttpService from "../../service/http.service";

class ChatService extends HttpService {
    // Fetches a list of all active guest conversations for the admin
    getAdminConversations = async () => {
        try {
            const response = await this.getRequest('/chat/admin/conversations', { auth: true });
            return response.result; // Assuming backend returns { result: [], ... }
        } catch (error: any) {
            console.error("ChatService: Error fetching admin conversations:", error);
            throw error;
        }
    };

    // Fetches all messages for a specific conversation (FOR AUTHENTICATED USERS/ADMINS)
    getMessagesByConversationId = async (conversationId: string) => {
        try {
            const response = await this.getRequest(`/chat/conversations/${conversationId}/messages`, { auth: true });
            return response.result; // Assuming backend returns { result: [], ... }
        } catch (error: any) {
            console.error(`ChatService: Error fetching messages for conversation ${conversationId}:`, error);
            throw error;
        }
    };

    // NEW: Fetches messages for a specific guest's conversation (FOR GUESTS)
    getGuestMessagesByGuestId = async (guestId: string) => {
        try {
            // This endpoint is designed to be unauthenticated for guests.
            const response = await this.getRequest(`/chat/guest/conversations/${guestId}/messages`); // NO { auth: true }
            return response.result; // Assuming backend returns { result: [], ... }
        } catch (error: any) {
            console.error(`ChatService: Error fetching guest messages for guest ID ${guestId}:`, error);
            throw error;
        }
    };

    // Sends a message (used by both guest and admin)
    sendMessage = async (data: { conversationId?: string; guestId?: string; guestName?: string; senderId: string; senderName: string; text: string; isGuest: boolean }) => {
        try {
            const config = data.isGuest ? {} : { auth: true }; // Only send auth header if not a guest
            const response = await this.postRequest('/chat/message', data, config);
            return response.result; // Assuming backend returns the saved message
        } catch (error: any) {
            console.error("ChatService: Error sending message:", error);
            throw error;
        }
    };
}

const chatService = new ChatService();
export default chatService;