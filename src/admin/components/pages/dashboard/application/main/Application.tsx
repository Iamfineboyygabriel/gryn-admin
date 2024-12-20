import { useState } from "react";
import { Link } from "react-router-dom";
import AllApplication from "../allApplication/main/AllApplication";
import DirectApplication from "../../../../../../shared/modal/DirectApplication";
import Modal from "../../../../../../shared/modal/Modal";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import FindStudentByAll from "../modal/FindStudentByAll";
import Direct from "../allApplication/directApplication/Direct";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <h1 className="text-2xl font-bold">Application</h1>
          <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3">
            <PrivateElement feature="APPLICATION" page="Direct Application">
              <button.PrimaryButton
                onClick={handleOpenModal}
                className="flex items-center gap-1.5 bg-approve rounded-full px-3 py-1.5 font-medium text-white min-w-[120px] md:min-w-fit"
              >
                <img src={plus} alt="cross" className="w-4 h-4" />
                <span className="whitespace-nowrap text-sm">
                  Direct Application
                </span>
              </button.PrimaryButton>
            </PrivateElement>

            <PrivateElement feature="APPLICATION" page="Update Application">
              <button.PrimaryButton
                onClick={handleFindByAllOpen}
                className="flex items-center gap-1.5 bg-pink-primary rounded-full px-3 py-1.5 font-medium text-white min-w-[120px] md:min-w-fit"
              >
                <img src={plus} alt="cross" className="w-4 h-4" />
                <span className="whitespace-nowrap text-sm">
                  Update Application
                </span>
              </button.PrimaryButton>
            </PrivateElement>

            <PrivateElement feature="APPLICATION" page="New Application">
              <Link
                to="/admin/dashboard/application/new_application"
                className="min-w-[120px] md:min-w-fit"
              >
                <button.PrimaryButton className="flex items-center gap-1.5 bg-primary-700 rounded-full px-3 py-1.5 font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white w-full">
                  <img src={plus} alt="cross" className="w-4 h-4" />
                  <span className="whitespace-nowrap text-sm">
                    New Application
                  </span>
                </button.PrimaryButton>
              </Link>
            </PrivateElement>
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

                <PrivateElement feature="APPLICATION" page="Direct Application">
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
                </PrivateElement>
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
          <DirectApplication addSchoolLink="/admin/dashboard/application/new_school" />
        </Modal>
      )}
      {isFindByModalOpen && (
        <Modal
          isOpen={isFindByModalOpen}
          onClose={handleFindByAllClose}
          data-aos="zoom-in"
        >
          <FindStudentByAll />
        </Modal>
      )}
    </main>
  );
};

export default Application;
