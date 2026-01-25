import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import {
  searchUser,
  createChat,
  fetchUnreadCount,
  selectMessageState,
  setSearch,
  setCurrentUserId,
  updateReadStatus,
} from "../../shared/slices/message.slices";
import { AppDispatch } from "../../store";
import { useCurrentUser } from "./getUserProfile";
import socket from "../../../../socket/socket";

export const useMessage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const messageState = useSelector(selectMessageState);
  const { userDetails } = useCurrentUser();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const socketService = useMemo(() => socket, []);

  useEffect(() => {
    const initializeMessaging = async () => {
      try {
        const unreadResponse = await dispatch(fetchUnreadCount()).unwrap();
        setUnreadCount(unreadResponse.count || 0);
        socketService.connect();
        if (userDetails?.data?.id) {
          dispatch(setCurrentUserId(userDetails.data.id));
        }
      } catch (error) {
        console.error("Error initializing messaging:", error);
      }
    };

    initializeMessaging();

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, socketService, userDetails?.data?.id]);

  const handleSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        if (searchTerm.trim()) {
          dispatch(setSearch(searchTerm));
          dispatch(searchUser(searchTerm));
        }
      }, 300),
    [dispatch],
  );

  const handleCreateChat = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(createChat(userId)).unwrap();
        setSelectedChatId(result.id);
        setSelectedUserId(userId);
        dispatch(
          updateReadStatus({
            chatId: result.id,
            currentUserId: userDetails?.data?.id || "",
          }),
        );
        return result;
      } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
      }
    },
    [dispatch, userDetails?.data?.id],
  );

  return {
    ...messageState,
    selectedChatId,
    selectedUserId,
    currentUserId: userDetails?.data?.id || "",
    handleSearch,
    handleCreateChat,
    socketService,
    unreadCount,
  };
};
