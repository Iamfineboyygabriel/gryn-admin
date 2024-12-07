import trashCan from "../../assets/svg/trash.svg"


const ReadNotification = ({onClose,news}:any) => {
  return (
    <main className="font-outfit">
      <div className="m-auto w-[40em]">
        <div className="px-[1em] mt-[1em] flex flex-col gap-[1em]">
            <p className="font-normal text-gray-500">from: <span className="font-normal text-black">
            admin@grynindex.com
            </span>
            </p>
            <header className="ml-2">
                <h1 className="font-semibold">{news?.topic}</h1>
            </header>
            <hr />
            <div>
                <article className="text-gray-500 font-normal">
                    <p>
                 {news?.description}
                    </p>
                </article>
            </div>
        </div>
      <div className="flex justify-between py-[1.5em] mt-[2em] items-center px-[1em] bg-purple-white">
        {/* <div>
         <img src={trashCan} alt="trash_icon" />
        </div> */}
      </div>
      </div>
    </main>
  );
};

export default ReadNotification;
