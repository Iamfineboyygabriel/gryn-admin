import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { button } from "../buttons/Button";
import { findAgentByEmail } from "../redux/shared/slices/shareApplication.slices";
import ReactLoading from 'react-loading';
import { Dropdown, DropdownItem } from "../dropDown/DropDown";
import { useAgentsEmails } from "../redux/hooks/admin/getAdminProfile";
import { useAppDispatch } from "../redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../redux/store";

interface FindAgentByEmailProps {
  onClose: () => void;
  redirect?: string;
}

interface AgentEmail {
  email: string;
}

const FindAgentByEmail: React.FC<FindAgentByEmailProps> = ({ onClose, redirect }) => {
  const { agentsEmail, loading: emailLoading } = useAgentsEmails();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array?.isArray(agentsEmail)) {
      return agentsEmail?.map((item: AgentEmail) => ({ name: item?.email }));
    }
    return [];
  }, [agentsEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem | null) => {
    setEmail(item?.name || '');
    setError(''); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please select an email');
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(findAgentByEmail(email));
      onClose();

      navigate(redirect || "/admin/dashboard/all_users/update_agent", {
        state: { agentData: response.payload }
      });
    } catch (err) {
      setError("Failed to find student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">Agent Application</h1>
          <p className="font-light">Enter the details of the Agent</p>
        </header>
        <form onSubmit={handleSubmit}>
          <article>
            <div className="w-full mt-[2em]">
              <Dropdown
                label="Agent Email"
                items={emailItems}
                selectedItem={email ? { name: email } : null}
                onSelectItem={handleSelectEmail}
                asterisk
                searchVisible
                loading={emailLoading}
                placeholder="Select Agent Email"
              />
            </div>
          </article>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button.PrimaryButton
            className="m-auto mt-[2em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
              'Continue'
            )}
          </button.PrimaryButton>
        </form>
      </div>
    </main>
  );
};

export default FindAgentByEmail;