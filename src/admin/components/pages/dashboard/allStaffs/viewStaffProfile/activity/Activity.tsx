import React, { useEffect, useCallback } from 'react'
import { useStaffDetails } from '../../../../../../../shared/redux/hooks/admin/getAdminProfile'
import { useDispatch, useSelector } from 'react-redux'
import { clearData, getUserActivity } from '../../../../../../../shared/redux/admin/slices/application.slices'
import { AppDispatch } from '../../../../../../../shared/redux/store'
import empty from "../../../../../../../assets/svg/Transaction.svg"
import CustomPagination from '../../../../../../../shared/utils/customPagination'

const ITEMS_PER_PAGE = 10;

const SkeletonRow: React.FC = () => (
  <div className="animate-pulse px-[2em] py-4 border-b border-gray-100">
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

const ActivityItem: React.FC<{ activity: any; isEven: boolean }> = ({ activity, isEven }) => (
  <div className={`px-[2em] py-4 ${isEven ? 'bg-[#F7F7F7]' : 'bg-white'}`}>
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-gray-900">{activity?.activity}</h3>
      <div className="text-sm text-gray-500">
        {new Date(activity?.createdAt)?.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }).toUpperCase()}{' '}
        {new Date(activity?.createdAt)?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
      <div className="text-sm">
        <span className="font-medium text-gray-700">Description: </span>
        <span className="text-gray-600">{activity?.description}</span>
      </div>
    </div>
  </div>
);

const Activity: React.FC<{ staffEmail: any | null }> = ({
  staffEmail,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { staffDetail, loading: staffLoading } = useStaffDetails(staffEmail);
  const staffId = staffDetail?.data?.profile?.userId;
  const { allUserActivity, loading } = useSelector(
    (state: any) => state?.application
  );
  const currentPage = allUserActivity?.currentPage || 1;

  useEffect(() => {
    dispatch(clearData());
    
    if (staffId) {
      dispatch(getUserActivity({ 
        userId: staffId,
        page: 1,
        limit: ITEMS_PER_PAGE
      }));
    }
  }, [staffId, dispatch]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    if (staffId) {
      dispatch(getUserActivity({ 
        userId: staffId,
        page: newPage,
        limit: ITEMS_PER_PAGE
      }));
    }
  }, [staffId, dispatch]);

  if (loading || staffLoading) {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(5)]?.map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    );
  }

  const activities = allUserActivity?.data || [];

  if (!activities.length) {  
    return (
      <div className="px-[2em] flex flex-col justify-center py-8 text-center">
        <img src={empty} alt="empty" className="w-[8em] m-auto"/>
        <p className="text-gray-500">No activity records found.</p>
      </div>
    );
  }

  return (
    <main className="font-outfit divide-y divide-gray-100">
      {activities.map((activity: any, index: number) => (
        <ActivityItem 
          key={activity?.id} 
          activity={activity} 
          isEven={index % 2 === 0}
        />
      ))}
      
      {!loading && activities?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={activities?.length === ITEMS_PER_PAGE}
          />
        </div>
      )}
    </main>
  );
};

export default Activity;