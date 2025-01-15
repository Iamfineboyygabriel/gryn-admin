import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import eyeImg from "../../../../../../assets/svg/eyeImg.svg";
import { AppDispatch } from "../../../../../../shared/redux/store";
import MainNewsModal from "../../../../../../shared/modal/MainNewsModal";
import ReadNotification from "../../../../../../shared/modal/ReadNotification";
import { updateNotificationStatus } from "../../../../../../shared/redux/admin/slices/notificationApplication.slices";
import { useAllNotification } from "../../../../../../shared/redux/hooks/admin/notification";

const SkeletonRow = () => (
  <div className="animate-pulse flex justify-between px-[2em] items-center mb-2">
    <div className="flex flex-col py-2 gap-[4px]">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
  </div>
);

const Unread = () => {
  const dispatch: AppDispatch = useDispatch();
  const { updates, fetchNotification, currentPage, loading } =
    useAllNotification();
  const [isNewsModalOpen, setNewsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const itemsPerPage = 10;

  const unreadNotifications =
    updates?.filter(
      (notification: any) => notification?.readStatus === false
    ) || [];

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchNotification(currentPage, itemsPerPage);
      setIsInitialLoad(false);
    };
    loadInitialData();
  }, [fetchNotification, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    async (event: React.ChangeEvent<unknown>, page: number) => {
      if (!isNewsModalOpen) {
        await fetchNotification(page, itemsPerPage);
      }
    },
    [fetchNotification, itemsPerPage, isNewsModalOpen]
  );

  const handleOpenModal = async (notification: any) => {
    setSelectedNotification(notification);
    setNewsModalOpen(true);

    try {
      await dispatch(updateNotificationStatus(notification.id));
      await fetchNotification(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };

  const handleCloseModal = () => {
    setNewsModalOpen(false);
    setSelectedNotification(null);
  };

  if (isInitialLoad) {
    return (
      <main className="font-outfit">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </main>
    );
  }

  return (
    <main className="font-outfit">
      {unreadNotifications?.length > 0 ? (
        <>
          {unreadNotifications?.map((notification: any, index: number) => (
            <div
              key={notification?.id}
              className={`flex justify-between px-[2em] items-center mb-2 ${
                index % 2 !== 0 ? "bg-[#F7F7F7]" : ""
              }`}
            >
              <div className="flex flex-col py-2 gap-[4px]">
                <h1 className="font-semibold truncate max-w-[300px] text-gray-500">
                  {notification?.description}
                </h1>
                <small className="text-gray-500 font-normal">
                  {new Date(notification?.createdAt)
                    ?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toUpperCase()}{" "}
                  {new Date(notification?.createdAt)?.toLocaleDateString()}
                </small>
              </div>
              <div
                onClick={() => handleOpenModal(notification)}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <img src={eyeImg} alt="View notification" className="w-6 h-6" />
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={unreadNotifications?.length === itemsPerPage}
            />
          </div>
        </>
      ) : (
        <div className="mt-[2em] flex flex-col items-center justify-center">
          <img src={transaction} alt="No applications" />
          <p className="mt-2 text-sm text-gray-500 dark:text-white">
            No unread notifications available.
          </p>
        </div>
      )}

      {isNewsModalOpen && selectedNotification && (
        <MainNewsModal
          isOpen={isNewsModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <ReadNotification
            onClose={handleCloseModal}
            news={selectedNotification}
          />
        </MainNewsModal>
      )}
    </main>
  );
};

export default Unread;
