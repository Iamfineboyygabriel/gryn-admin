import { useState, useCallback } from "react";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";
import { button } from "../../shared/buttons/Button"; 

interface Status {
  name: string;
}

interface AssignApplicationProps {
  applicationId: any;
  onClose: () => void;
}

const DirectCompleted = ({ applicationId, onClose }: AssignApplicationProps) => {
  const status: Status[] = [{ name: "Completed" }];
  const [degree, setDegree] = useState<string | null>(null);

  const handleSelectDegree = useCallback((item: DropdownItem) => {
    setDegree(item?.name || null);
  }, []);

  return (
    <main className="px-[5em] py-[2em] font-outfit">
      <div className="m-auto w-[24em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">Direct Application</h1>
          <p className="font-light">Mark as Completed</p>
        </header>
      </div>
      <Dropdown
        label="Status"
        labelClassName="text-grey-primary"
        className="text-purple-deep"
        items={status}
        selectedItem={degree ? { name: degree } : null}
        onSelectItem={handleSelectDegree}
        asterisk
        placeholder="Select"
      />
      <div className="flex justify-center">
        <button.PrimaryButton
          className="m-auto mt-[2em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
          type="button"
          onClick={onClose}
        >
          Continue
        </button.PrimaryButton>
      </div>
    </main>
  );
};

export default DirectCompleted;
