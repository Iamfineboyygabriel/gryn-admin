import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import {
  searchUser,
  createChat,
  fetchAllUserChats,
  updateReadStatus,
  fetchUnreadCount,
  selectMessageState,
  setSearch,
} from "../../shared/slices/message.slices";
import { AppDispatch } from "../../store";
import { useCurrentUser } from "./getUserProfile";
import socket from "../../../../socket/socket";

export const useMessage = () => {
  const dispatch: AppDispatch = useDispatch();
  const messageState = useSelector(selectMessageState);
  const { userDetails } = useCurrentUser();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const socketService = useMemo(() => socket, []);

  useEffect(() => {
    const initializeMessaging = async () => {
      try {
        await dispatch(fetchAllUserChats()).unwrap();
        await dispatch(fetchUnreadCount()).unwrap();
        socketService.connect();
      } catch (error) {}
    };

    initializeMessaging();

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, socketService]);

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.trim()) {
        dispatch(setSearch(searchTerm));
        dispatch(searchUser(searchTerm));
      }
    }, 300),
    [dispatch]
  );

  const handleCreateChat = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(createChat(userId)).unwrap();
        setSelectedChatId(result.id);
        setSelectedUserId(userId);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  return {
    ...messageState,
    selectedChatId,
    selectedUserId,
    currentUserId: userDetails?.data?.id,
    handleSearch,
    handleCreateChat,
    socketService,
  };
};
