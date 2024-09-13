import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTopCountries, useTopUniversities } from '../redux/hooks/shared/getUserProfile';
import { Dropdown, DropdownItem } from '../dropDown/DropDown';
import { button } from "../../shared/buttons/Button";

const DirectApplication = () => {
    const { userTopCountries, loading: countryLoading } = useTopCountries();
    const { userTopUniversities, loading: universityLoading } = useTopUniversities();

    const [university, setUniversity] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);

    const universityItems: DropdownItem[] = useMemo(() => {
        return userTopUniversities?.data?.map((uni: any) => ({
            name: uni.name,
            id: uni.id
        })) || [];
    }, [userTopUniversities]);

    const countryItems: DropdownItem[] = useMemo(() => {
        return userTopCountries?.data?.map((country: any) => ({
            name: country.name,
            id: country.id
        })) || [];
    }, [userTopCountries]);

    const handleSelectUniversity = (item: DropdownItem) => {
        if (item.name) {
            setUniversity(item.name);
        }
    };

    const handleSelectCountry = (item: DropdownItem) => {
        if (item.name) {
            setCountry(item.name);
        }
    };

    return (
        <main className="px-[5em] font-outfit">
            <div className="m-auto w-[24em] py-[1em] text-center">
                <header className="flex flex-col">
                    <h1 className="text-2xl font-semibold">Direct Application</h1>
                    <p className='font-light tracking-wide space-x-2 mt-[1.1em]'>Enter the required details.</p>
                </header>
                <article className="space-y-4 mt-6">
                    <Dropdown
                        label="University"
                        items={universityItems}
                        selectedItem={university ? { name: university } : null}
                        onSelectItem={handleSelectUniversity}
                        asterisk
                        loading={universityLoading}
                        searchVisible
                    />
                    <Dropdown
                        label="Country"
                        items={countryItems}
                        selectedItem={country ? { name: country } : null}
                        onSelectItem={handleSelectCountry}
                        asterisk
                        loading={countryLoading}
                        searchVisible
                    />
                </article>
                <Link to="">
                    <button.PrimaryButton 
                        className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white"
                        disabled={!university || !country}
                    >
                        Continue
                    </button.PrimaryButton>
                </Link>
            </div>
        </main>
    );
};

export default DirectApplication;