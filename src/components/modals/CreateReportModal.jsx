import React, { useState } from 'react';
import { X, CheckCircle } from 'phosphor-react';
import axiosInstance from '../../utils/axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const CreateReportModal = ({
    isOpen,
    onClose,
    categories,
    onReportCreated,
}) => {
    const { showError, showSuccess } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(3);
    const [categoryId, setCategoryId] = useState('');

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/reports', {
                title,
                description,
                priority,
                categoryId,
            });

            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu || 'Sikeres regisztráció!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn || 'Registration successful!'
                  );

            setTitle('');
            setDescription('');
            setPriority(3);
            setCategoryId('');
            onReportCreated();
            onClose();
        } catch (err) {
            language === 'hu'
                ? showError(
                      language,
                      err.response?.data?.messageHu ||
                          'Hiba történt a hibajegy mentése során.'
                  )
                : showError(
                      language,
                      err.response?.data?.messageEn ||
                          'Error occurred while saving report.'
                  );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority(3);
        setCategoryId('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-[#27374D] p-5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <CheckCircle
                            size={24}
                            weight="fill"
                            className="text-emerald-400"
                        />
                        <h2 className="text-xl font-semibold">
                            {t('createReportModal.newReport')}
                        </h2>
                    </div>
                    <button
                        onClick={resetForm}
                        className="hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#27374D] mb-1.5">
                            {t('createReportModal.title')}
                        </label>
                        <input
                            required
                            placeholder={t('createReportModal.title')}
                            className="w-full p-3 border border-[#526D82] rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all bg-[#27374D] text-white placeholder-gray-400"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#27374D] mb-1.5">
                            {t('createReportModal.category')}
                        </label>
                        <select
                            required
                            className="w-full p-3 border border-[#526D82] rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all appearance-none cursor-pointer"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            style={{
                                backgroundColor: '#27374D',
                                color: '#FFFFFF',
                            }}
                        >
                            <option
                                value=""
                                style={{
                                    backgroundColor: '#27374D',
                                    color: '#9CA3AF',
                                }}
                            >
                                {t('createReportModal.pickCategory')}
                            </option>
                            {categories.map((cat) => (
                                <option
                                    key={cat.id}
                                    value={cat.id}
                                    style={{
                                        backgroundColor: '#27374D',
                                        color: '#FFFFFF',
                                    }}
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#27374D] mb-1.5">
                            {t('createReportModal.priority')}
                        </label>
                        <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setPriority(num)}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                                        priority === num
                                            ? 'bg-[#526D82] text-white shadow-md'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#27374D] mb-1.5">
                            {t('createReportModal.description')}
                        </label>
                        <textarea
                            required
                            rows="4"
                            placeholder={t(
                                'createReportModal.descriptionPlaceholder'
                            )}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none resize-none transition-all"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {t('createReportModal.cancelButton')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#27374D] hover:bg-[#1e2b3c] text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                        >
                            {loading
                                ? t('createReportModal.submitButtonLoading')
                                : t('createReportModal.submitButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReportModal;
