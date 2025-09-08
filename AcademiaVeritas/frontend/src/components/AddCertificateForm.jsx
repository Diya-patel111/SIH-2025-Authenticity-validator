import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { addCertificate, extractCertificateData } from '../apiService';

const AddCertificateForm = () => {
    const [activeTab, setActiveTab] = useState('manual');
    const [formData, setFormData] = useState({ student_name: '', roll_number: '', course_name: '', grade: '', issue_date: '' });
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [status, setStatus] = useState({ loading: false, error: null, success: null, processing: false });

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const resetStatus = () => setStatus({ loading: false, error: null, success: null, processing: status.processing });
    
    const resetForm = () => {
        setFormData({ student_name: '', roll_number: '', course_name: '', grade: '', issue_date: '' });
        setFile(null);
        setFilePreview(null);
    }

    const onDrop = useCallback(async (acceptedFiles) => {
        const currentFile = acceptedFiles[0];
        if (!currentFile) return;

        resetStatus();
        setStatus(prev => ({ ...prev, processing: true }));
        setFile(currentFile);

        if (currentFile.type.startsWith('image/')) {
            setFilePreview(URL.createObjectURL(currentFile));
        } else {
            setFilePreview(null); // No preview for PDF
        }

        try {
            const response = await extractCertificateData(currentFile);
            console.log('OCR Response:', response); // Debug log
            
            // Handle the nested response structure from backend
            const extractedData = response.extracted_data || response;
            
            if (extractedData) {
                // Convert date format if needed (YYYY-MM-DD for HTML date input)
                let formattedDate = extractedData.issue_date || '';
                if (formattedDate) {
                    // Handle various date formats from OCR
                    const dateFormats = [
                        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
                        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
                        /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/ // YYYY/MM/DD
                    ];
                    
                    // If it's already in YYYY-MM-DD format, use as is
                    if (!dateFormats[0].test(formattedDate)) {
                        // Try to parse other formats
                        const match = formattedDate.match(dateFormats[1]) || formattedDate.match(dateFormats[2]);
                        if (match) {
                            // Assume DD/MM/YYYY format and convert to YYYY-MM-DD
                            const day = match[1].padStart(2, '0');
                            const month = match[2].padStart(2, '0');
                            const year = match[3];
                            formattedDate = `${year}-${month}-${day}`;
                        }
                    }
                }
                
                const newFormData = {
                    student_name: extractedData.student_name || '',
                    roll_number: extractedData.roll_number || '',
                    course_name: extractedData.course_name || '',
                    grade: extractedData.grade || '',
                    issue_date: formattedDate,
                };
                
                console.log('Setting form data:', newFormData);
                setFormData(newFormData);
                
                // Count how many fields were extracted successfully
                const extractedFieldsCount = Object.values(newFormData).filter(value => value && value.trim()).length;
                setStatus(prev => ({
                    ...prev, 
                    success: `Data extracted successfully! ${extractedFieldsCount}/5 fields detected. Please review and correct any details before submitting.`
                }));
            } else {
                setStatus(prev => ({...prev, error: "No data could be extracted from the certificate image."}));
            }
        } catch (err) {
            console.error('OCR Error:', err);
            setStatus(prev => ({...prev, error: err.message || 'Failed to extract data from certificate. Please check the image quality.'}));
        } finally {
            setStatus(prev => ({...prev, processing: false}));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetStatus();
        setStatus(prev => ({ ...prev, loading: true }));

        try {
            const response = await addCertificate(formData);
            setStatus(prev => ({ ...prev, loading: false, success: `Certificate added! Tx: ${response.blockchain_tx_hash ? response.blockchain_tx_hash.slice(0, 15) + '...' : 'N/A'}`}));
            resetForm();
        } catch (err) {
            setStatus(prev => ({ ...prev, loading: false, error: err.message || 'Failed to add certificate.' }));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': ['.jpeg', '.png'], 'application/pdf':['.pdf']}, multiple: false });

    return (
        <div className="bg-clarity-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-academic-blue mb-6">Add New Certificate Record</h2>

            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button onClick={() => setActiveTab('manual')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'manual' ? 'bg-white text-academic-blue shadow' : 'text-gray-500'}`}>Manual Entry</button>
                <button onClick={() => setActiveTab('upload')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'upload' ? 'bg-white text-academic-blue shadow' : 'text-gray-500'}`}>Upload Certificate</button>
            </div>
            
            {status.error && <div className="bg-red-100 border border-red-400 text-failure-red px-4 py-3 rounded-lg relative mb-4" role="alert">{status.error}</div>}
            {status.success && <div className="bg-green-100 border border-green-400 text-success-green px-4 py-3 rounded-lg relative mb-4" role="alert">{status.success}</div>}

            <form onSubmit={handleSubmit}>
                {activeTab === 'upload' && (
                    <div className="mb-6">
                        { !file ? (
                             <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors ${isDragActive ? 'border-academic-blue bg-blue-50' : 'border-gray-300 hover:border-academic-blue'}`}>
                                <input {...getInputProps()} />
                                <p className="text-gray-500">{status.processing ? 'Processing...' : 'Upload Certificate Image or PDF'}</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                {filePreview && <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-md mb-2"/>}
                                <p>File: {file.name}</p>
                                <button onClick={() => { setFile(null); setFilePreview(null); resetForm(); resetStatus(); }} className="text-sm text-failure-red mt-2">Clear</button>
                            </div>
                        )}
                        {status.success ? (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4 rounded-r-lg" role="alert">
                                <p className="font-bold">✅ OCR Extraction Complete!</p>
                                <p>{status.success}</p>
                                <p className="text-sm mt-1">The form below has been automatically filled. Please review and correct any details before submitting.</p>
                            </div>
                        ) : (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 rounded-r-lg" role="alert">
                                <p className="font-bold">📄 Processing Certificate</p>
                                <p>Upload your certificate image and we'll automatically extract the details for you.</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-600 mb-1">Student Full Name</label>
                        <input type="text" name="student_name" value={formData.student_name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Roll Number / ID</label>
                        <input type="text" name="roll_number" value={formData.roll_number} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Course / Degree Name</label>
                        <input type="text" name="course_name" value={formData.course_name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Grade / CGPA</label>
                        <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Issue Date</label>
                        <input type="date" name="issue_date" value={formData.issue_date} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" required />
                    </div>
                </div>

                <div className="bg-blue-100 border-l-4 border-academic-blue text-academic-blue p-4 mt-6 rounded-r-lg" role="alert">
                    <p className="font-bold">Note</p>
                    <p>This will add the certificate record to both the database and the blockchain. The transaction is permanent.</p>
                </div>
                
                <div className="mt-6">
                    <button type="submit" disabled={status.loading || status.processing} className="w-full bg-academic-blue text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                        {status.loading ? 'Submitting...' : activeTab === 'manual' ? 'Add Record to Database & Blockchain' : 'Add Extracted Certificate to Database & Blockchain'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCertificateForm;

