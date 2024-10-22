import { useUserActivity } from '../../../../../../shared/redux/hooks/admin/getAdminProfile';

const Activity = () => {
  const { userActivity } = useUserActivity();

  return (
    <main className='font-outfit'>
      {userActivity?.data?.map((activity: any, index: number) => (
        <div
          key={activity?.id}
          className={`flex justify-between font-outfit px-[2em] items-center mb- ${index % 2 !== 0 ? 'bg-[#F7F7F7]' : ''}`} 
        >
          <div className='flex font-outfit flex-col py-2 gap-[4px]'>
            <h1 className='font-medium text-lg'>{activity?.activity}</h1>
            <small className='text-gray-500 font-outfit font-normal'>
              {new Date(activity?.createdAt)
                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                .toUpperCase()} {""}
              {new Date(activity?.createdAt).toLocaleDateString()}
            </small>
            <small> <strong>
               Description:
              </strong>
                <span className='ml-1'>
              {activity?.description}
              </span>
              </small>
          </div>
        </div>
      ))}
    </main>
  );
}

export default Activity;
