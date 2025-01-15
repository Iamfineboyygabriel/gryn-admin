import React, {
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { button } from "../../../../../../shared/buttons/Button";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllStaffForSuperAdmin } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { DownLoadButton } from "../../../../../../shared/downLoad/DownLoadButton";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllStaff = () => {
  const {
    admins,
    currentPage,
    loading,
    searchTerm,
    fetchAdmins,
    updateSearchTerm,
  } = useAllStaffForSuperAdmin();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  const contentRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateSearchTerm(localSearchTerm);
        fetchAdmins(1, itemsPerPage);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    localSearchTerm,
    updateSearchTerm,
    fetchAdmins,
    itemsPerPage,
    searchTerm,
  ]);

  useEffect(() => {
    fetchAdmins(currentPage, itemsPerPage);
  }, [fetchAdmins, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      fetchAdmins(value, itemsPerPage);
    },
    [fetchAdmins, itemsPerPage]
  );

  const escapeRegExp = useCallback((string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }, []);

  const highlightText = useCallback(
    (text: string, query: string) => {
      if (!query) return text;
      const escapedQuery = escapeRegExp(query);
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [escapeRegExp]
  );

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const filteredAdmins = useMemo(() => {
    if (!admins?.data) return [];
    return admins.data.filter((admin: any) => {
      const fullName =
        `${admin?.profile?.firstName} ${admin?.profile?.lastName}`?.toLowerCase();
      return (
        fullName?.includes(localSearchTerm?.toLowerCase()) ||
        admin?.email.toLowerCase()?.includes(localSearchTerm?.toLowerCase()) ||
        admin?.role?.toLowerCase()?.includes(localSearchTerm?.toLowerCase())
      );
    });
  }, [admins, localSearchTerm]);

  const handleViewDetails = useCallback(
    (staffEmail: string) => {
      navigate(`/admin/dashboard/all_staffs/view_profile`, {
        state: { staffEmail },
      });
    },
    [navigate]
  );

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAdmins?.length > 0) {
      return filteredAdmins?.map((admin: any, index: number) => (
        <tr
          key={admin?.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="py-[16px] whitespace-nowrap gap-1 px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${admin?.profile?.lastName} ${admin?.profile?.firstName}`,
                localSearchTerm
              )
            )}
          />
          <td className="py-[16px] whitespace-nowrap px-[24px]">
            {formatData(admin?.role)}
          </td>
          <td
            className="py-[16px] whitespace-nowrap px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(formatData(admin?.email), localSearchTerm)
            )}
          />
          <td
            onClick={() => handleViewDetails(admin?.profile?.email)}
            className="py-[16px] whitespace-nowrap text-primary-700 font-medium cursor-pointer px-[24px]"
          >
            View details
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No admins" />
              <p className="mt-2 text-sm text-gray-500">No Staff found.</p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    loading,
    filteredAdmins,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    localSearchTerm,
    formatData,
  ]);

  return (
    <main ref={contentRef} className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
          <DownLoadButton applicationRef={contentRef} />
        </div>
      </header>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Reports /
                <span className="ml-1 font-medium text-primary-700">
                  All Staffs
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <div className="relative mt-[1.5em]">
          <header className="flex items-center justify-between">
            <h1 className="font-medium text-xl">All Staff</h1>
          </header>
          <div className="flex items-center mt-[1em] w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
            <input
              type="text"
              className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
              placeholder="Search"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <FiSearch className="mr-3 text-lg text-gray-500" />
          </div>

          <table className="w-full mt-4 border-collapse">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>

        {!loading && admins && admins?.data && admins?.data?.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={admins?.data?.length === itemsPerPage}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default AllStaff;
