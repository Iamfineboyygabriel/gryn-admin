import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import plus from "../../../../../../../assets/svg/plus.svg";


const News = () => {
  return (
    <main className='font-outfit px-[2em]'>
       <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Search..."
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
          <Link to="/admin/dashboard/news/create_news">
            <button className="mt-4 flex gap-2 rounded-full bg-primary-700 px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              Create News Alert
            </button>
          </Link>
        </div>
      </main>
  )
}

export default News