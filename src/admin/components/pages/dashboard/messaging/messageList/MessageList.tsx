import profile from "../../../../../../assets/svg/Profile.svg";
import { FiSearch } from "react-icons/fi";

const chat = [
  {
    img: profile,
    name: "Atijosan Ashanka",
    message: "Hello Tunde, Send Aza Omo mi...",
    time: "05/7/20224 12:04pm",
  },
  {
    img: profile,
    name: "President Tinubu",
    message: "2 Billion for you...",
    time: "03/7/20224 1:00pm",
  },
  {
    img: profile,
    name: "SOQ",
    message: "Release API Baa...",
    time: "03/7/20224 1:00pm",
  },
];
const MessageList = () => {
  return (
    <main className="h-screen w-[35%] overflow-y-auto rounded-xl bg-white p-[1em] font-outfit dark:bg-gray-800 dark:text-white">
      <section className="relative w-full">
        <input
          type="text"
          className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm dark:bg-gray-700 dark:text-white"
          placeholder="search"
        />
        <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
      </section>
      <section>
        <div className="mt-[2em] flex flex-col gap-[1.2em]">
          {chat.map((person, name) => (
            <div className="flex gap-2" key={name}>
              <img src={person.img} alt="profile_Pic" />
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold">{person.name}</h1>
                <p className="font-light text-grey dark:text-white">
                  {person.message}
                </p>
                <small className="text-primary-700 dark:text-white">
                  {person.time}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MessageList;
