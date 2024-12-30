import { useState } from "react";
import { button } from "../../../../../../shared/buttons/Button";
import user from "../../../../../../assets/png/avatar.png";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import useUserProfile, {
  useCurrentUser,
} from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import ConfirmDiscard from "../../../../../../shared/modal/ConfirmDiscard";

const BasicInfo = () => {
  const { userProfile, updateUserProfile, uploadUserAvatar } = useUserProfile();
  const [firstName, setFirstName] = useState(userProfile?.firstName || "");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [lastName, setLastName] = useState(userProfile?.lastName || "");
  const [email] = useState(userProfile?.email || "");

  const [editMode, setEditMode] = useState(false);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setAvatarLoading(true);
      await uploadUserAvatar(selectedFile);
      setAvatarLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const response = await updateUserProfile({
      firstName,
      lastName,
      email,
    });
    setLoading(false);

    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setEditMode(false);
  };

  const handleEditClick = async () => {
    setEditMode(true);
  };

  const handleDiscardChanges = () => {
    if (editMode) {
      setIsConfirmDialogOpen(true);
    } else {
      setFirstName(userProfile?.firstName || "");
      setLastName(userProfile?.lastName || "");
      setEditMode(false);
    }
  };

  const confirmDiscardChanges = () => {
    setFirstName(userProfile?.firstName || "");
    setLastName(userProfile?.lastName || "");
    setEditMode(false);
    setIsConfirmDialogOpen(false);
  };

  return (
    <main className="font-outfit px-[2em]">
      <header>
        <h1 className="text-xl font-medium">Basic Information</h1>
      </header>
      <div className="mt-[1em] flex items-center gap-[1em]">
        <div>
          <label htmlFor="file-input">
            <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-200">
              {avatarLoading ? (
                <ReactLoading
                  color="#ffffff"
                  width={50}
                  height={50}
                  type="spin"
                  className="absolute inset-0 m-auto"
                />
              ) : (
                <img
                  src={userProfile?.avatar?.publicURL || user}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              )}
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </label>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">
            {userProfile?.lastName} {userProfile?.firstName}
          </h1>
          <p className="mt-[1.5em] text-xs font-semibold tracking-wide text-completed">
            {userProfile?.user?.role || ""}
          </p>
        </div>
      </div>
      <form className="mt-[1.5em] w-full">
        <div className="mt-[1em] flex flex-col gap-3 lg:w-[50%]">
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
            >
              First Name
            </label>
            <div className="relative flex text-center">
              <input
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                readOnly={!editMode || loading}
                disabled={loading}
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="lastName"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Last Name
            </label>
            <div className="relative flex text-center">
              <input
                name="lastName"
                id="lastName"
                value={lastName}
                disabled={loading}
                onChange={(e) => setLastName(e.target.value)}
                readOnly={!editMode || loading}
                className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="emailAddress"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Email Address
            </label>
            <div className="relative flex items-center text-center">
              <input
                name="emailAddress"
                id="emailAddress"
                value={email}
                readOnly
                className="border-border focus:border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        {!editMode && (
          <button.PrimaryButton
            className="m-auto mt-[5em] w-[30%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
            type="button"
            onClick={handleEditClick}
          >
            Edit Details
          </button.PrimaryButton>
        )}
        {editMode && (
          <>
            <button.PrimaryButton
              className="m-auto mt-[5em] w-[18%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
              type="button"
              disabled={loading}
              onClick={handleSaveChanges}
            >
              {loading ? (
                <ReactLoading
                  color="#FFFFFF"
                  width={25}
                  height={25}
                  type="spin"
                />
              ) : (
                "Save Changes"
              )}
            </button.PrimaryButton>

            {!loading && (
              <p
                className="mt-[1em] cursor-pointer font-medium text-red-500"
                onClick={handleDiscardChanges}
              >
                Discard Changes
              </p>
            )}
          </>
        )}
      </form>
      <ConfirmDiscard
        isOpen={isConfirmDialogOpen}
        onRequestClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDiscardChanges}
        title="Are you sure you want to discard changes?"
        confirmLabel="Yes"
        cancelLabel="No"
      />
    </main>
  );
};

export default BasicInfo;
