import React, { useState } from "react";
import { useNavigate } from "react-router";
import { button } from "../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import Modal from "../../../../../../shared/modal/Modal";
import AddNewSchoolM from "../../../../../../shared/modal/AddNewSchoolM";
import { useAppDispatch } from "../../../../../../shared/redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../../../../../../shared/redux/store";
import { addNewSchool } from "../../../../../../shared/redux/admin/slices/application.slices";
import plus from "../../../../../../assets/svg/plus.svg";

const AddNewSchool = () => {
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState(["", ""]);
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch: AppDispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleBackClick = () => navigate(-1);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addNewUrlFields = () => {
    setUrls([...urls, "", ""]);
  };

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const body = {
        country,
        name,
        url: urls?.filter((url) => url.trim() !== ""),
      };
      await dispatch(addNewSchool(body)).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while adding new school"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                All Application /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  Add New School
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <header>
          <h1 className="text-2xl mt-[1.5em] font-medium">School Details</h1>
        </header>
        <form className="mt-[1.5em] w-[77%]" onSubmit={submitApplication}>
          <div className="flex flex-col lg:flex-row gap-[3em]">
            <div className="w-full">
              <label htmlFor="country" className="flex-start flex font-medium">
                Country
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="country"
                name="country"
                required
                disabled={loading}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="name" className="flex-start flex font-medium">
                University Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          {urls?.map(
            (url, index) =>
              index % 2 === 0 && (
                <div key={index} className="mt-[1em] flex flex-row gap-[3em]">
                  <div className="w-full">
                    <label
                      htmlFor={`url-${index}`}
                      className="flex-start flex font-medium"
                    >
                      Link
                      <CgAsterisk className="text-red-500" />
                    </label>
                    <input
                      id={`url-${index}`}
                      name={`url-${index}`}
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor={`url-${index + 1}`}
                      className="flex-start flex font-medium"
                    >
                      Link
                      <CgAsterisk className="text-red-500" />
                    </label>
                    <input
                      id={`url-${index + 1}`}
                      name={`url-${index + 1}`}
                      type="url"
                      value={urls[index + 1] || ""}
                      onChange={(e) =>
                        handleUrlChange(index + 1, e.target.value)
                      }
                      className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                    />
                  </div>
                </div>
              )
          )}

          <div
            className="flex mt-[2em] text-primary-700 font-semibold items-center cursor-pointer"
            onClick={addNewUrlFields}
          >
            <div>
              <img src={plus} alt="plus" />
            </div>
            <p>Add New Link</p>
          </div>

          <div className="mr-auto mt-4">
            <button.PrimaryButton
              className="m-auto mt-[3.5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <ReactLoading
                  color="#FFFFFF"
                  width={25}
                  height={25}
                  type="spin"
                />
              ) : (
                "Save & Continue"
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <AddNewSchoolM onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default AddNewSchool;
