import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem } from '../dropDown/DropDown';
import { button } from "../../shared/buttons/Button";
import { GoPlus } from "react-icons/go";
import ApplicationLinks from './ApplicationLinks';
import { findSchoolByCountryName, findSchoolLinkByCountryAndUniversity } from '../redux/admin/services/application.services';
import ReactLoading from 'react-loading';
import { useSchoolListCountries } from '../redux/hooks/admin/getAdminProfile';
import Modal from './Modal';

interface LinkData {
  name: string;
  url: string;
}

interface DirectApplicationProps {
  addSchoolLink: string; 
}

const DirectApplication: React.FC<DirectApplicationProps> = ({ addSchoolLink }) => {
    const { listCountries, loading: countryLoading } = useSchoolListCountries();
    const [showApplicationLinks, setShowApplicationLinks] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [university, setUniversity] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [universityItems, setUniversityItems] = useState<DropdownItem[]>([]); 
    const [applicationLinks, setApplicationLinks] = useState<LinkData[]>([]);

    const countryItems: DropdownItem[] = useMemo(() => {
        return listCountries?.map((country: any) => ({
            name: country,
        })) || [];
    }, [listCountries]);

    const handleSelectUniversity = (item: DropdownItem) => {
        if (item?.name) {
            setUniversity(item?.name);
            setError('');
        }
    };

    const handleSelectCountry = (item: DropdownItem) => {
        if (item.name) {
            setCountry(item?.name);
            setError('');
            fetchUniversities(item?.name); 
        }
    };

    const fetchUniversities = async (country: string) => {
        setLoading(true);
        setError('');

        try {
            const endpoint = `/school/findschoolwithcountry?country=${country}`;
            const response = await findSchoolByCountryName(endpoint);
            if (response?.status === 200 && response?.data) {
                const universities = response?.data?.map((school: any) => ({
                    name: school.name,
                }));
                setUniversityItems(universities);
            } else {
                setError(response?.message || 'Failed to fetch universities. Please try again.');
            }
        } catch (error: any) {
            setError(error?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!university || !country) return;

        setLoading(true);
        setError('');

        try {
            const endpoint = `/school/SchoolLinkByCountryAndUniversity?country=${encodeURIComponent(country)}&university=${encodeURIComponent(university)}`;
            const response = await findSchoolLinkByCountryAndUniversity(endpoint);
            if (response?.status === 200 && response.data) {
                const links: LinkData[] = response?.data?.map((url: string) => ({
                    name: url,
                    url: url
                }));
                setApplicationLinks(links);
                setShowApplicationLinks(true);
            } else {
                setError(response.message || 'An error occurred. Please try again.');
            }
        } catch (error: any) {
            setError(error?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="px-[5em] font-outfit">
            {!showApplicationLinks ? (
                <div className="m-auto w-[24em] py-[1em] text-center">
                    <header className="flex flex-col">
                        <h1 className="text-2xl font-semibold">Direct Application</h1>
                        <p className='font-light tracking-wide space-x-2 mt-[1.1em]'>Enter the required details.</p>
                    </header>
                    <article className="space-y-4 mt-6">
                        <Dropdown
                            label="Country"
                            items={countryItems}
                            selectedItem={country ? { name: country } : null}
                            onSelectItem={handleSelectCountry}
                            asterisk
                            loading={countryLoading}
                            searchVisible
                            placeholder='Select a Country'
                        />
                        <Dropdown
                            label="University"
                            items={universityItems}
                            selectedItem={university ? { name: university } : null}
                            onSelectItem={handleSelectUniversity}
                            asterisk
                            loading={loading}
                            searchVisible
                            placeholder='Select a University'
                        />
                    </article>
                    {error && (
                        <p className="text-red-500 text-sm mt-2 mb-[-8px]">{error}</p>
                    )}
                    <button.PrimaryButton
                        className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white"
                        disabled={!university || !country || loading}
                        onClick={handleContinue}
                    >
                        {loading ? (
                            <div className='mr-auto'>
                            <ReactLoading
                                color="#FFFFFF"
                                width={25}
                                height={25}
                                type="spin"
                                />
                            </div>
                        ) : (
                            'Continue'
                        )}
                    </button.PrimaryButton>
                    <Link to={addSchoolLink}>
                        <span className='text-pink-primary font-medium items-center mb-2 cursor-pointer mt-[8px] flex justify-center'>
                            <GoPlus className='text-pink-primary size-8 mr-2' />Add New School
                        </span>
                    </Link>
                </div>
            ) : (
                <Modal
                isOpen={showApplicationLinks}
                onClose={() => setShowApplicationLinks(false)}
                data-aos="zoom-in"
            >
                <ApplicationLinks links={applicationLinks} onClose={() => setShowApplicationLinks(false)} />
            </Modal>
            )}
        </main>
    );
};

export default DirectApplication;
