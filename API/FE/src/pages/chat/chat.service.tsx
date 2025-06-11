import HttpService from "../../service/http.service";

// ChatService handles chat-related API requests
class ChatService extends HttpService {
    getAdminConversations = async () => {
        try {
            const response = await this.getRequest('/chat/admin/conversations', { auth: true });
            return response.result;
        } catch (error: any) {
            console.error("ChatService: Error fetching admin conversations:", error);
            throw error;
        }
    };

    getMessagesByConversationId = async (conversationId: string) => {
        try {
            const response = await this.getRequest(`/chat/conversations/${conversationId}/messages`, { auth: true });
            return response.result;
        } catch (error: any) {
            console.error(`ChatService: Error fetching messages for conversation ${conversationId}:`, error);
            throw error;
        }
    };

    getGuestMessagesByGuestId = async (guestId: string) => {
        try {
            const response = await this.getRequest(`/chat/guest/conversations/${guestId}/messages`);
            return response.result;
        } catch (error: any) {
            console.error(`ChatService: Error fetching guest messages for guest ID ${guestId}:`, error);
            throw error;
        }
    };

    sendMessage = async (data: { conversationId?: string; guestId?: string; guestName?: string; senderId: string; senderName: string; text: string; isGuest: boolean }) => {
        try {
            const config = data.isGuest ? {} : { auth: true };
            const response = await this.postRequest('/chat/message', data, config);
            return response.result;
        } catch (error: any) {
            console.error("ChatService: Error sending message:", error);
            throw error;
        }
    };
}

const chatService = new ChatService();
export default chatService;
