import React, { useState, useEffect } from 'react';
import { AppDispatch } from '../../../../../../../shared/redux/store';
import { createDraft } from '../../../../../../../shared/redux/shared/slices/shareApplication.slices';
import { createNews } from '../../../../../../../shared/redux/admin/slices/notificationApplication.slices';
import { useAppDispatch } from '../../../../../../../shared/redux/hooks/shared/reduxHooks';
import NewsCreated from '../../../../../../../shared/modal/NewsCreated';
import Modal from '../../../../../../../shared/modal/Modal';
import { Dropdown, DropdownItem } from '../../../../../../../shared/dropDown/DropDown';
import { button } from "../../../../../../../shared/buttons/Button";
import { useNavigate, useLocation } from 'react-router';
import { CgAsterisk } from 'react-icons/cg';
import ReactLoading from "react-loading";
import { toast } from "react-toastify";

const CreateNews: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [sendTo, setSendTo] = useState<DropdownItem | null>(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState("");
    const [newsLoading, setNewsLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [isNewsModalOpen, setNewsModalOpen] = useState(false);  

    const dispatch: AppDispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const draftData = location.state?.draftData;
        if (draftData) {
            setTopic(draftData.topic || "");
            setDescription(draftData.description || "");
            
            if (draftData.sendTo) {
                setSendTo(draftData.sendTo); 
            }
            
            setDate(draftData.date || "");
            setTime(draftData.time || "");
            setLink(draftData.link || "");
        }
    }, [location.state]);


    const handleOpenModal = () => setNewsModalOpen(true);
    const handleCloseModal = () => setNewsModalOpen(false);
    
    const handleBackClick = () => navigate(-1);

    const send: DropdownItem[] = [{ name: "STUDENTS" }];

    const handleSelectItem = (item: DropdownItem | null) => setSendTo(item);

    const formatDateTime = () => {
        if (!date || !time) return '';
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
    };

    const prepareNewsData = () => ({
         topic,
         description,
         date: formatDateTime(),
         time: formatDateTime(),
         link,
         sendTo: sendTo ? [sendTo.name] : []
    });

    const resetForm = () => {
        setTopic("");
        setDescription("");
        setSendTo(null);
        setDate("");
        setTime("");
        setLink("");
    };

    const submitNews = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setNewsLoading(true);
        try {
            await dispatch(createNews(prepareNewsData())).unwrap();
            handleOpenModal();
            resetForm();
        } catch (error: any) {
            toast.error(error);
        } finally {
            setNewsLoading(false);
        }
    };

    const submitDraft = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setDraftLoading(true);
        try {
            await dispatch(createDraft(prepareNewsData())).unwrap();
            toast.success("Draft saved successfully");
            resetForm();
        } catch (error: any) {
            toast.error(error || "Failed to save draft");
        } finally {
            setDraftLoading(false);
        }
    };


    return (
        <main className="font-outfit">
            <h1 className="text-2xl font-bold">Notification</h1>
            <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
                <header className="flex items-center justify-between">
                    <h1 className="font-medium dark:text-gray-700">
                        News / <span className="ml-1 font-medium text-primary-700 dark:text-white">Create News Alert</span>
                    </h1>
                    <button.PrimaryButton className="btn-2" onClick={handleBackClick}>Back</button.PrimaryButton>
                </header>
                <h2 className="text-xl mt-[1em] font-semibold dark:text-white">Create News</h2>
                <form className="mt-[2em] w-[50%] dark:text-white">
                    <div className="flex flex-col gap-[1.5em]">
                        <div className="w-full">
                            <label htmlFor="headline" className="flex items-center font-medium">
                                Headline <CgAsterisk className="text-red-500" />
                            </label>
                            <input
                                id="headline"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="mt-[1em] w-full rounded-lg border border-gray-300 p-3 focus:border-primary-700 focus:outline-none"
                                maxLength={1000}
                                required
                            />
                            <p className='text-pink-primary font-medium mt-2'>{topic.length}/1000</p>
                        </div>

                        <div className="w-full">
                            <label htmlFor="message" className="flex items-center font-medium">
                                Message / Description <CgAsterisk className="text-red-500" />
                            </label>
                            <textarea 
                                id="message"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='mt-[1em] w-full h-[120px] rounded-lg border border-gray-300 p-3 focus:border-primary-700 focus:outline-none'
                                maxLength={1000}
                                required
                            ></textarea>
                            <p className='text-pink-primary font-medium mt-2'>{description.length}/1000</p>
                        </div>

                        <div className="w-full flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="date" className="flex items-center font-medium">
                                    Date <CgAsterisk className="text-red-500" />
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="mt-[1em] w-full rounded-lg border border-gray-300 p-3 focus:border-primary-700 focus:outline-none"
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="time" className="flex items-center font-medium">
                                    Time <CgAsterisk className="text-red-500" />
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    className="mt-[1em] w-full rounded-lg border border-gray-300 p-3 focus:border-primary-700 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label htmlFor="link" className="flex items-center font-medium">
                                Link <span className="ml-2 font-normal text-gray-500">(Optional)</span>
                            </label>
                            <input
                                id="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="mt-[1em] w-full rounded-lg border border-gray-300 p-3 focus:border-primary-700 focus:outline-none"
                                maxLength={1000}
                            />
                            <p className='text-pink-primary font-medium mt-2'>{link.length}/1000</p>
                        </div>

                        <div className='w-[19em]'>
                            <Dropdown
                              label="Send To"
                              labelClassName="text-gray-700"
                              className="text-purple-deep"
                              items={send}
                              selectedItem={sendTo}
                              onSelectItem={handleSelectItem}
                              asterisk
                              placeholder='To:'
                            />
                        </div>
                    </div>
                </form>
                <div className="flex mt-[7em] w-[50%] justify-between items-center">
                    <button.PrimaryButton
                        onClick={submitDraft}
                        className="rounded-full w-[45%] bg-purple-pink py-[12px] text-center text-lg font-semibold text-pink-primary"
                    >
                        {draftLoading ? <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" /> : "Save to Draft"}
                    </button.PrimaryButton>

                    <button.PrimaryButton
                        onClick={submitNews}
                        className="bg-linear-gradient rounded-full w-[45%] py-[12px] text-center text-lg font-semibold text-white"
                    >
                        {newsLoading ? <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" /> : "Create News"}
                    </button.PrimaryButton>
                </div>
            </div>
            {isNewsModalOpen && (
                <Modal
                    isOpen={isNewsModalOpen}
                    onClose={handleCloseModal}
                    data-aos="zoom-in"
                >
                    <NewsCreated onClose={handleCloseModal} />
                </Modal>
            )}
        </main>
    );
};

export default CreateNews;