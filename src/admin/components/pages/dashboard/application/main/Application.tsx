import { useState } from "react";
import { Link } from "react-router-dom";
import AllApplication from "../allApplication/main/AllApplication";
import DirectApplication from "../../../../../../shared/modal/DirectApplication";
import Modal from "../../../../../../shared/modal/Modal";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import FindStudentByAll from "../modal/FindStudentByAll";
import Direct from "../allApplication/directApplication/Direct";

const Application = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFindByModalOpen, setIsFindByModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("allApplication");


  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleFindByAllOpen = async () => setIsFindByModalOpen(true);
  const handleFindByAllClose = () => setIsFindByModalOpen(false);

  return (
    <main className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Application</h1>
          <div className="flex gap-[1em]">
            <button.PrimaryButton onClick={handleOpenModal} className="flex gap-2 bg-approve rounded-full px-[1.5em] py-[8px] font-medium text-white">
              <img src={plus} alt="cross" />
              Direct Application
            </button.PrimaryButton>
            <button.PrimaryButton onClick={handleFindByAllOpen} className="flex gap-2 bg-pink-primary rounded-full px-[1.5em] py-[8px] font-medium text-white">
              <img src={plus} alt="cross" />
              Update Application
            </button.PrimaryButton>
            <Link to="/admin/dashboard/application/new_application">
              <button.PrimaryButton className="flex gap-2 bg-primary-700 rounded-full px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                <img src={plus} alt="cross" />
                New Application
              </button.PrimaryButton>
            </Link>
          </div>
        </div>
      </header>

      <section className="font-outfit">
      <div className="mt-[1em] h-auto w-full  rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
              <div
                className={`${
                  activeLink === "allApplication"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("allApplication")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  All Application
                </button.PrimaryButton>
              </div>
              <div
                className={`${
                  activeLink === "directApplication"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("directApplication")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Direct Application
                </button.PrimaryButton>
              </div>

            </div>
          </nav>
          <section className="mt-3">

            {activeLink === "allApplication" && <AllApplication />}
            {activeLink === "directApplication" && <Direct />}
          </section>
        </div>
      </div>
    </section>



      {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            data-aos="zoom-in"
          >
            <DirectApplication addSchoolLink="/admin/dashboard/application/new_school"/>
          </Modal>
        )}
         {isFindByModalOpen && (
          <Modal
            isOpen={isFindByModalOpen}
            onClose={handleFindByAllClose}
            data-aos="zoom-in"
          >
            <FindStudentByAll/>
          </Modal>
        )}
            </main>
          );
        };

export default Application;
