import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import { verifyCertificate } from '../apiService';
import { useAuth } from '../context/AuthContext';
import AuthForms from '../components/AuthForms';

const VerifierPage = () => {
	const { auth } = useAuth();
	const [file, setFile] = useState(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const [verificationResult, setVerificationResult] = useState(null);
	const [currentStep, setCurrentStep] = useState('');

	const onDrop = (acceptedFiles) => {
		if (acceptedFiles.length > 0) {
			setFile(acceptedFiles[0]);
			setVerificationResult(null);
		}
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
			'application/pdf': ['.pdf']
		},
		multiple: false
	});
	const handleVerification = async () => {
		if (!file) return;
		setIsVerifying(true);
		setVerificationResult(null);
		try {
			setCurrentStep('Extracting Data...');
			await new Promise(resolve => setTimeout(resolve, 1500));
			setCurrentStep('Checking Database...');
			await new Promise(resolve => setTimeout(resolve, 1500));
			setCurrentStep('Verifying on Blockchain...');
			await new Promise(resolve => setTimeout(resolve, 2000));
			const result = await verifyCertificate(file);
			setVerificationResult(result);
		} catch (error) {
			setVerificationResult({ success: false, error: error.message || 'Verification failed. Please try again.' });
		} finally {
			setIsVerifying(false);
			setCurrentStep('');
		}
	};
	const resetVerification = () => {
		setFile(null);
		setVerificationResult(null);
		setIsVerifying(false);
		setCurrentStep('');
	};

	return (
		<div className="min-h-screen bg-[#FDFEFF] font-inter">
			<Navbar />
			<div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					{auth.token && auth.userType === 'verifier' ? (
						<div>
							<div className="text-center mb-12">
								<h1 className="text-4xl font-bold text-[#0A2342] mb-4">Verify Academic Certificate</h1>
								<p className="text-xl text-[#0A2342]/80">Upload a certificate for instant, secure verification using AI and Blockchain.</p>
							</div>
							<div className="bg-white rounded-2xl shadow-xl p-8">
								{!verificationResult ? (
									<div>
										<div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${isDragActive ? 'border-[#0A2342] bg-[#F9A826]/10' : file ? 'border-[#F9A826] bg-[#F9A826]/10' : 'border-gray-300 hover:border-[#0A2342] hover:bg-gray-50'}`}>
											<input {...getInputProps()} />
											<div className="space-y-4">
												<div className="w-16 h-16 mx-auto">
													<svg className="w-full h-full text-[#0A2342]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
													</svg>
												</div>
												{file ? (
													<div>
														<p className="text-lg font-medium text-[#F9A826] mb-2">✓ File Selected: {file.name}</p>
														<p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
													</div>
												) : (
													<div>
														<p className="text-lg font-medium text-[#0A2342] mb-2">{isDragActive ? 'Drop your certificate here' : 'Drag & drop your certificate here'}</p>
														<p className="text-sm text-gray-500">or click to browse files</p>
														<p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, PDF (Max 10MB)</p>
													</div>
												)}
											</div>
											{file && (
												<div className="mt-8 text-center">
													<button onClick={handleVerification} disabled={isVerifying} className={`bg-[#0A2342] text-white font-bold text-lg px-8 py-4 rounded-lg shadow hover:bg-[#07162a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
														{isVerifying ? 'Verifying...' : 'Verify Certificate'}
													</button>
												</div>
											)}
											{isVerifying && (
												<div className="mt-8 text-center">
													<div className="inline-flex items-center space-x-3">
														<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F9A826]"></div>
														<span className="text-lg font-medium text-[#0A2342]">{currentStep}</span>
													</div>
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="text-center">
										{verificationResult.success ? (
											<div className="space-y-6">
												<div className="w-20 h-20 mx-auto bg-[#16A34A]/10 rounded-full flex items-center justify-center">
													<svg className="w-12 h-12 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
												</div>
												<div>
													<h3 className="text-2xl font-bold text-[#16A34A] mb-2">VERIFIED ON-CHAIN</h3>
													<p className="text-[#0A2342]">This certificate has been successfully verified and is authentic.</p>
												</div>
												<div className="bg-gray-50 rounded-lg p-6 text-left">
													<h4 className="font-heading font-semibold text-dark mb-4">Certificate Details</h4>
													<div className="grid md:grid-cols-2 gap-4">
														<div>
															<p className="text-sm text-gray-500">Student Name</p>
															<p className="font-medium">{verificationResult.studentName || 'John Doe'}</p>
														</div>
														<div>
															<p className="text-sm text-gray-500">Roll Number</p>
															<p className="font-medium">{verificationResult.rollNumber || '2021001'}</p>
														</div>
														<div>
															<p className="text-sm text-gray-500">Course Name</p>
															<p className="font-medium">{verificationResult.courseName || 'Bachelor of Technology'}</p>
														</div>
														<div>
															<p className="text-sm text-gray-500">Grade</p>
															<p className="font-medium">{verificationResult.grade || 'A+'}</p>
														</div>
														<div>
															<p className="text-sm text-gray-500">Institution</p>
															<p className="font-medium">{verificationResult.institution || 'Jharkhand University'}</p>
														</div>
														<div>
															<p className="text-sm text-gray-500">Issue Date</p>
															<p className="font-medium">{verificationResult.issueDate || '2024-05-15'}</p>
														</div>
													</div>
												</div>
												<div className="bg-[#F9A826]/10 rounded-lg p-4">
													<div className="flex items-center justify-center space-x-2">
														<svg className="w-5 h-5 text-[#F9A826]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
														</svg>
														<a href={`https://etherscan.io/tx/${verificationResult.transactionHash || '0x123...abc'}`} target="_blank" rel="noopener noreferrer" className="text-[#F9A826] hover:text-[#0A2342] font-medium">View Transaction on Etherscan</a>
													</div>
												</div>
											</div>
										) : (
											<div className="space-y-6">
												<div className="w-20 h-20 mx-auto bg-[#DC2626]/10 rounded-full flex items-center justify-center">
													<svg className="w-12 h-12 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</div>
												<div>
													<h3 className="text-2xl font-bold text-[#DC2626] mb-2">VERIFICATION FAILED</h3>
													<p className="text-[#0A2342] mb-4">{verificationResult.error || 'This certificate could not be verified in the system.'}</p>
												</div>
												<div className="bg-[#DC2626]/10 rounded-lg p-4">
													<p className="text-[#DC2626] text-sm">Possible reasons: Document not found in the database, blockchain hash mismatch, or invalid file format.</p>
												</div>
											</div>
										)}
										<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
											<button onClick={resetVerification} className="bg-[#F9A826] text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-[#e08c1a] transition-colors">Verify Another Document</button>
											<button onClick={() => window.location.href = '/'} className="border-2 border-[#F9A826] text-[#F9A826] font-bold px-8 py-3 rounded-lg hover:bg-[#F9A826] hover:text-white transition-colors">Back to Home</button>
										</div>
									</div>
								)}
							</div>
						</div>
					) : (
						<div>
							<div className="text-center mb-8">
								<h1 className="text-3xl font-heading font-bold text-dark mb-4">Verifier Access Required</h1>
								<p className="text-xl text-gray-600">Please log in or register as a verifier to access this feature.</p>
							</div>
							<AuthForms userType="verifier" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VerifierPage;
