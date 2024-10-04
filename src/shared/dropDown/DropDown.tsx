import React, { useState, useMemo, useCallback } from "react";
import Flag from "react-world-flags";
import { CgAsterisk } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import ReactLoading from "react-loading";

export interface DropdownItem {
  id?: number;
  name?: string; 
  [key: string]: any;
}

interface ToggleDropdownProps {
  items: DropdownItem[];
  selectedItem: DropdownItem | null | undefined;
  onSelectItem: (item: DropdownItem) => void;
  label?: string;
  asterisk?: boolean;
  searchVisible?: boolean;
  labelClassName?: string;
  className?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  renderItem?: (item: DropdownItem) => React.ReactNode;
  useEndpointSearch?: boolean;
  onDropdownToggle?: (isOpen: boolean) => void;
  disabled?: boolean; 
  placeholder?: string;
}

const useToggleDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggleDropdown,
    closeDropdown,
  };
};

export const Dropdown: React.FC<ToggleDropdownProps> = ({
  items,
  selectedItem,
  onSelectItem,
  label,
  asterisk = false,
  searchVisible = false,
  className = "",
  labelClassName = "",
  onChange,
  loading = false,
  renderItem,
  useEndpointSearch = false,
  onDropdownToggle,
  disabled = false,
  placeholder, 
}) => {
  const { isOpen, toggleDropdown, closeDropdown } = useToggleDropdown();
  const [search, setSearch] = useState("");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aName = typeof a.name === 'string' ? a.name : '';
      const bName = typeof b.name === 'string' ? b.name : '';
      return aName.localeCompare(bName);
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    if (useEndpointSearch) return sortedItems;
    return sortedItems.filter((item) => {
      const itemName = typeof item.name === 'string' ? item.name : '';
      return itemName.toLowerCase().includes(search.toLowerCase());
    });
  }, [sortedItems, search, useEndpointSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    if (useEndpointSearch) {
      onChange?.(newSearch);
    }
  }, [onChange, useEndpointSearch]);

  const handleSelectItem = (item: DropdownItem) => {
    onSelectItem(item);
    onChange?.(item.name ?? "");
    closeDropdown();
  };

  const handleToggleDropdown = useCallback(() => {
    const newIsOpen = !isOpen;
    toggleDropdown();
    onDropdownToggle?.(newIsOpen);
  }, [isOpen, toggleDropdown, onDropdownToggle]);

  const defaultRenderItem = (item: DropdownItem) => (
    <div className="flex items-center">
      {item.cca2 && (
        <Flag
          code={item.cca2}
          alt={item.name ?? ""}
          style={{ width: 24, height: 16, marginRight: 8 }}
        />
      )}
      {item.name || "Unnamed Item"}
    </div>
  );

  return (
    <div className={`w-full font-outfit ${className}`}>
      <label
        htmlFor="dropdown"
        className={`flex-start text-l flex font-medium ${labelClassName}`}
      >
        {label}
        {asterisk && <CgAsterisk className="ml-1 text-red-500" />}
      </label>
      <div className="relative mt-[10px]">
        <button
          className={`border-border text-l flex w-full items-center justify-between rounded-lg border-[1px] bg-inherit p-3 text-left font-medium`}
          type="button"
          onClick={handleToggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {selectedItem ? (
            defaultRenderItem(selectedItem)
          ) : (
            <span className="text-gray-500">{`${placeholder}`}</span>
          )}
          <IoIosArrowDown className="ml-auto" />
        </button>
        {isOpen && (
          <div className="border-border absolute z-10 mt-2 max-h-[250px] w-full rounded-lg border-[2px] bg-white font-medium">
            {searchVisible && (
              <div className="relative w-full p-2">
                <input
                  type="text"
                  className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm placeholder:text-grey focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                  placeholder={`Search ${label?.toLowerCase()}`}
                  value={search}
                  onChange={handleSearchChange}
                />
                <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
              </div>
            )}
            {loading ? (
              <div className="flex items-center p-4">
                <ReactLoading color="#1F141F" width={25} height={25} />
              </div>
            ) : (
              <ul
                className="flex max-h-[170px] flex-col items-start overflow-auto"
                role="listbox"
                tabIndex={-1}
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <li
                      key={index}
                      className={`flex w-full cursor-pointer flex-col items-start bg-white p-3 hover:bg-gray-100 ${className}`}
                      role="option"
                      aria-selected={selectedItem?.id === item.id}
                      onClick={() => handleSelectItem(item)}
                    >
                      {renderItem ? renderItem(item) : defaultRenderItem(item)}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-sm text-red-600">
                    No results found 📪
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};