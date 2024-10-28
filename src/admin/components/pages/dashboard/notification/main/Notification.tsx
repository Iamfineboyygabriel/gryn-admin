import { useState } from "react";
import All from "../all/All";
import UnRead from "../unRead/UnRead";
import Read from "../read/Read";
import News from "../news/main/News";
import Drafts from "../drafts/Drafts";

const Notification = () => {
  const [activeLink, setActiveLink] = useState("all");

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Notification</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em] dark:bg-gray-800">
        <div>
          <nav>
            <div className="flex px-[2em] gap-[2em] border-b-[3px] border-gray-100 text-base font-semibold dark:border-white">
              <div
                className={`cursor-pointer py-3 ${activeLink === "all" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("all")}
              >
               All
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "unRead" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("unRead")}
              >
                Unread
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "read" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("read")}
              >
                Read
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "news" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("news")}
              >
                News
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "drafts" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("drafts")}
              >
                Drafts
              </div>
            </div>
          </nav>
          <section className="mt-8">
            {activeLink === "all" && <All />}
            {activeLink === "unRead" && <UnRead />}
            {activeLink === "read" && <Read />}
            {activeLink === "news" && <News />}
            {activeLink === "drafts" && <Drafts />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Notification;