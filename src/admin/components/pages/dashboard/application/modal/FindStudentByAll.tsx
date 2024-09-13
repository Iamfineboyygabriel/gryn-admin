// import React, { useState, useMemo } from 'react'
// import { useTopUniversities } from '../../../../../../shared/redux/hooks/shared/getUserProfile';
// import { Dropdown, DropdownItem } from '../../../../../../shared/dropDown/DropDown';
// import { useAllApplication } from '../../../../../../shared/redux/hooks/admin/getAdminProfile';

// interface University {
//   name: string;
// }

// interface Degree {
//   name: string;
// }


// const FindStudentByAll: React.FC = () => {
//   const { userTopUniversities,loading:universityLoading } = useTopUniversities();
//   const { applications, loading, searchTerm, updateSearchTerm } = useAllApplication();
//   console.log("extract email from here",applications)
//   const data = userTopUniversities.data
//   const itemsPerDropDown = 5;

//   const [university, setUniversity] = useState<string | null>(null);
//   const [degree, setDegree] = useState<Degree | null>(null);

//   const type: Degree[] = [{ name: "BACHELOR" }, { name: "MASTERS" }, { name: "DOCTORATE" }];

//   const dropdownItems: DropdownItem[] = useMemo(() => {
//     return data.map((uni: University) => ({
//       name: uni.name,
//     })
//    )}, [data]);

//     const handleSelectItem = (item: DropdownItem) => {
//       setUniversity(item?.name || null);
//     };

//     const handleSelectDegree = (item: any) => {
//       if (item) {
//         setDegree(item);
//       }
//     };
  

//     return (
//     <main className="px-[5em] font-outfit" data-aos="zoom-in">
//     <div className="m-auto w-[24em] items-center py-[1em] text-center">
//       <header className="flex flex-col gap-[1.5em]">
//         <h1 className="text-3xl font-semibold">Application</h1>
//         <div className="text-sm font-light tracking-wide text-grey">
//           <p>Enter the details of the application to</p>
//           <p>update</p>
//         </div>
//       </header>

//       <div className="mt-[1em] flex flex-col items-center justify-center gap-[1.5em] text-center">

//       <Dropdown
//       //passneccessary prop to display the emails
//       />

//       <Dropdown
//         label="University"
//         items={dropdownItems}
//         selectedItem={university ? { name: university } : null}
//         onSelectItem={handleSelectItem}
//         asterisk
//         searchVisible
//         loading={universityLoading}
//       />
      
//       <Dropdown
//         label="Degree"
//         labelClassName="text-grey-primary"
//         className="text-purple-deep"
//         items={type}
//         selectedItem={degree}
//         onSelectItem={handleSelectDegree}
//         />
              
//       </div>
  
//     </div>
//   </main>
//   )
// }

// export default FindStudentByAll;


import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTopUniversities } from '../../../../../../shared/redux/hooks/shared/getUserProfile';
import { Dropdown, DropdownItem } from '../../../../../../shared/dropDown/DropDown';
import { useAllApplication } from '../../../../../../shared/redux/hooks/admin/getAdminProfile';

interface University {
  name: string;
}

interface Degree {
  name: string;
}

const FindStudentByAll: React.FC = () => {
  const { userTopUniversities, loading: universityLoading } = useTopUniversities();
  const { applications, loading, searchTerm, updateSearchTerm, fetchApplications } = useAllApplication();
  const data = userTopUniversities.data
  const itemsPerDropDown = 5;

  const [university, setUniversity] = useState<string | null>(null);
  const [degree, setDegree] = useState<Degree | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const type: Degree[] = [{ name: "BACHELOR" }, { name: "MASTERS" }, { name: "DOCTORATE" }];

  const dropdownItems: DropdownItem[] = useMemo(() => {
    return data.map((uni: University) => ({
      name: uni.name,
    }))
  }, [data]);

  const emailItems: DropdownItem[] = useMemo(() => {
    return applications.map((app: any) => ({
      name: app.email,
    }))
  }, [applications]);

  const handleSelectItem = (item: DropdownItem) => {
    setUniversity(item?.name || null);
  };

  const handleSelectDegree = (item: any) => {
    if (item) {
      setDegree(item);
    }
  };

  const handleSelectEmail = (item: DropdownItem) => {
    setSelectedEmail(item?.name || null);
  };

  const handleEmailSearch = useCallback((term: string) => {
    if (!isInitialLoad) {
      updateSearchTerm(term);
      fetchApplications(1, itemsPerDropDown);
    }
  }, [updateSearchTerm, fetchApplications, itemsPerDropDown, isInitialLoad]);

  useEffect(() => {
    if (isEmailDropdownOpen && isInitialLoad) {
      fetchApplications(1, itemsPerDropDown);
      setIsInitialLoad(false);
    }
  }, [isEmailDropdownOpen, isInitialLoad, fetchApplications, itemsPerDropDown]);

  const handleEmailDropdownToggle = (isOpen: boolean) => {
    setIsEmailDropdownOpen(isOpen);
    if (isOpen && isInitialLoad) {
      setIsInitialLoad(false);
    }
  };

  return (
    <main className="px-[5em] font-outfit" data-aos="zoom-in">
      <div className="m-auto w-[24em] items-center py-[1em] text-center">
        <header className="flex flex-col gap-[1.5em]">
          <h1 className="text-3xl font-semibold">Application</h1>
          <div className="text-sm font-light tracking-wide text-grey">
            <p>Enter the details of the application to</p>
            <p>update</p>
          </div>
        </header>

        <div className="mt-[1em] flex flex-col items-center justify-center gap-[1.5em] text-center">
          <Dropdown
            label="Email"
            items={emailItems}
            selectedItem={selectedEmail ? { name: selectedEmail } : null}
            onSelectItem={handleSelectEmail}
            asterisk
            searchVisible
            loading={loading}
            onChange={handleEmailSearch}
            useEndpointSearch
            onDropdownToggle={handleEmailDropdownToggle}
          />

          <Dropdown
            label="University"
            items={dropdownItems}
            selectedItem={university ? { name: university } : null}
            onSelectItem={handleSelectItem}
            asterisk
            searchVisible
            loading={universityLoading}
          />
          
          <Dropdown
            label="Degree"
            labelClassName="text-grey-primary"
            className="text-purple-deep"
            items={type}
            selectedItem={degree}
            onSelectItem={handleSelectDegree}
          />
        </div>
      </div>
    </main>
  )
}

export default FindStudentByAll;