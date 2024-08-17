import profile from "../../../../../../assets/svg/Profile.svg";

const MessageChat = () => {
  return (
    <main className="h-screen w-full overflow-y-auto rounded-xl bg-white p-[1em] dark:bg-gray-800 dark:text-white">
      <header>
        <nav className="flex items-center gap-[1em] border-b-[2px] border-gray-100 py-3 dark:border-gray-700">
          <img src={profile} alt="profile_Pic" />
          <h1 className="font-semibold">President Tinubu</h1>
        </nav>
      </header>
      <section>
        <div className="mt-[1em] flex gap-[1em]">
          <img src={profile} alt="profile_pic" />
          <div className="flex w-[50%] flex-col gap-2">
            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
              <small>Oya No Vex ,Send AZA !</small>
            </div>
            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
              <small>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis autem😂😂😂 eveniet ratione ut dolor tempore officia
                deleniti eos non accusantium. Autem, amet. Voluptas repellat
                labore officiis quibusdam 😂 sed excepturi at!
              </small>
            </div>
          </div>
        </div>
        <div className="ml-auto mt-[1em] w-[50%] rounded-lg bg-primary-700 p-2 text-white">
          <small>
            Tinubu😂 shey you know say you dey crazz😂 na me you wan give 2
            billion ? is it for eba
          </small>
        </div>
      </section>
    </main>
  );
};

export default MessageChat;
