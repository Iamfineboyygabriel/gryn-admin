import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import trashCan from "../../assets/svg/trash.svg";
import { AppDispatch } from '../redux/store';
import { deleteNews } from '../redux/admin/slices/notificationApplication.slices';

interface ViewNewsProps {
  onClose: () => void;
  onDelete?: () => void;
  news: {
    id: number;
    topic: string;
    description: string;
    sendTo: string[];
  };
}

const ViewNews: React.FC<ViewNewsProps> = ({ onClose, onDelete, news }) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: any) => state?.notification?.loading);
  const error = useSelector((state: any) => state?.notification?.error);

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this news?");
      
      if (confirmDelete) {
        await dispatch(deleteNews(news.id)).unwrap();
        onDelete?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  return (
    <main className="font-outfit">
      <div className="m-auto w-[40em]">
        <div className="px-[1em] mt-[1em] flex flex-col gap-[1em]">
          <p className="font-normal text-gray-500">
            from: <span className="font-normal text-black">admin@grynindex.com</span>
          </p>
          <header className="ml-2">
            <h1 className="font-semibold">{news.topic}</h1>
          </header>
          <hr />
          <div>
            <article className="text-gray-500 font-normal">
              <p>{news.description}</p>
            </article>
          </div>
        </div>
        <div className="flex justify-between py-[1.5em] mt-[2em] items-center px-[1em] bg-purple-white">
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <img src={trashCan} alt="trash_icon" />
            {loading ? 'Deleting...' : 'Delete News'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </main>
  );
};

export default ViewNews;