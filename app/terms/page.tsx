import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { OWNER_NAME } from "@/config";

export default function Terms() {
    const OWNER_NAME = "MedSage CDSS";
    
    return (
        <div className="w-full flex justify-center p-10 bg-gray-50 min-h-screen">
            <div className="w-full max-w-screen-md space-y-6 bg-white p-8 rounded-lg shadow-sm">
                <a
                    href="/"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 underline cursor-pointer"
                >
                    <span>←</span> Back to MedSage CDSS
                </a>
                <h1 className="text-3xl font-bold text-gray-900">MedSage CDSS</h1>
                <h2 className="text-2xl font-semibold text-gray-800">Terms of Use / Disclaimer</h2>

                <p className="text-gray-700">
                    The following terms of use govern access to and use of the MedSage CDSS
                    ("Clinical Decision Support System" or "System"), an artificial intelligence-powered
                    medical assistance tool. By engaging with the System, you agree to these terms.
                    If you do not agree, you may not use the System.
                </p>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">General Information</h3>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">Provider and Purpose:</span> MedSage CDSS
                            is a clinical decision support tool designed to assist healthcare professionals
                            with patient management, prescription creation, and patient communication.
                            This System is intended as a supplementary tool and should not replace
                            professional medical judgment, diagnosis, or treatment decisions.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">For Healthcare Professionals Only:</span>{" "}
                            This System is designed exclusively for use by licensed healthcare professionals,
                            including physicians, nurses, pharmacists, and other qualified medical personnel.
                            It is not intended for direct patient use.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Third-Party Involvement:</span>{" "}
                            The System utilizes multiple third-party platforms, AI models, and
                            vendors, including but not limited to OpenAI, Twilio, and database services.
                            Your inputs may be transmitted, processed, and stored by these
                            third-party systems. As such, absolute confidentiality, security, and privacy
                            cannot be guaranteed.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">No Guarantee of Accuracy:</span>{" "}
                            The System is designed to provide helpful clinical suggestions and
                            recommendations but may deliver inaccurate, incomplete, or outdated
                            information. All outputs must be independently verified by qualified
                            healthcare professionals before being used in patient care decisions.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Not a Substitute for Professional Judgment:</span>{" "}
                            MedSage CDSS does not provide medical diagnoses, treatment decisions, or
                            medical advice. Healthcare professionals remain solely responsible for all
                            clinical decisions and patient outcomes.
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Medical Disclaimer</h3>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-800 font-semibold">
                            CRITICAL MEDICAL DISCLAIMER: This System does not provide medical advice,
                            diagnosis, or treatment. Always seek the advice of qualified healthcare
                            professionals with any questions regarding medical conditions. Never disregard
                            professional medical advice or delay in seeking it because of information
                            provided by this System.
                        </p>
                    </div>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">Clinical Validation Required:</span>{" "}
                            All medication recommendations, dosages, drug interactions, and allergy
                            warnings generated by the System must be independently verified against
                            current medical literature, drug databases, and clinical guidelines.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Professional Responsibility:</span>{" "}
                            Healthcare professionals using this System retain full responsibility for:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                <li>Verifying all medication recommendations and dosages</li>
                                <li>Checking for drug interactions and contraindications</li>
                                <li>Confirming patient allergies and medical history</li>
                                <li>Ensuring appropriateness of all treatment decisions</li>
                                <li>Obtaining informed consent from patients when required</li>
                            </ul>
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">SMS Communication Limitations:</span>{" "}
                            SMS messages sent through Twilio integration can only be sent to whitelisted
                            numbers. SMS communication should not be used for urgent or emergency medical
                            information. Healthcare professionals must ensure HIPAA compliance when using
                            SMS features.
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Liability</h3>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">Use at Your Own Risk:</span> The
                            System is provided on an "as-is" and "as-available" basis. To
                            the fullest extent permitted by law:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                <li>
                                    MedSage CDSS disclaims all warranties, express or implied,
                                    including but not limited to warranties of merchantability,
                                    fitness for a particular purpose, and non-infringement.
                                </li>
                                <li>
                                    MedSage CDSS is not liable for any errors, inaccuracies, or
                                    omissions in the information provided by the System.
                                </li>
                                <li>
                                    MedSage CDSS is not liable for any adverse patient outcomes,
                                    medical errors, or harm resulting from use of the System.
                                </li>
                            </ul>
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">
                                No Responsibility for Medical Outcomes:
                            </span>{" "}
                            Under no circumstances shall MedSage CDSS, its developers,
                            partners, affiliated entities, or representatives be liable for
                            any direct, indirect, incidental, consequential, special, or
                            punitive damages arising out of or in connection with the use of
                            the System, including but not limited to medical malpractice claims,
                            patient harm, or adverse medical outcomes.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">AI Model Limitations:</span>{" "}
                            The System relies on AI models (including OpenAI) that may experience
                            timeouts, errors, or generate incorrect information. Users acknowledge
                            these limitations and agree to wait for responses and verify all outputs.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">
                                Modification or Discontinuation:
                            </span>{" "}
                            We reserve the right to modify, suspend, or discontinue the System's
                            functionalities at any time without notice.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Future Fees:</span> While the System
                            may currently be provided free of charge to certain users, we reserve
                            the right to implement fees for its use at any time.
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">User Responsibilities</h3>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">Professional Eligibility:</span> Use of the
                            System is restricted to licensed healthcare professionals aged 18 or older
                            who are authorized to practice medicine in their jurisdiction.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">HIPAA Compliance:</span> Healthcare
                            professionals are responsible for ensuring all use of the System complies
                            with HIPAA, state privacy laws, and other applicable regulations. Do not
                            input protected health information (PHI) unless you have verified the
                            System's compliance with your organizational policies.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Prohibited Conduct:</span> By
                            using the System, you agree not to:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                <li>Use the System for emergency medical situations</li>
                                <li>Rely solely on System outputs without independent verification</li>
                                <li>Share System access credentials with unauthorized individuals</li>
                                <li>Input patient data without proper authorization and consent</li>
                                <li>Use the System in violation of medical ethics or regulations</li>
                                <li>Attempt to compromise the security or functionality of the System</li>
                                <li>Copy, distribute, modify, reverse engineer, or extract the source code</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Data Privacy and Security</h3>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <p className="text-blue-800">
                            <span className="font-semibold">⚕️ HIPAA Notice:</span> Patient data must remain
                            strictly confidential and cannot be shared without the patient's explicit consent.
                            Healthcare professionals are responsible for ensuring HIPAA compliance.
                        </p>
                    </div>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">Data Handling:</span> While we implement
                            security measures, the System does not guarantee absolute privacy,
                            confidentiality, or security of the information you provide. Patient data
                            may be processed by third-party AI services.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Data Storage:</span> Conversations, patient
                            records, prescriptions, and EHR uploads may be stored in our database for
                            future reference and system improvement purposes.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Data Transmission:</span> Inputs
                            are transmitted to and processed by third-party services including OpenAI
                            and Twilio. SMS messages are sent through Twilio and subject to their
                            terms of service.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">User Responsibility for PHI:</span> Users
                            are responsible for de-identifying patient data when appropriate and
                            ensuring compliance with all applicable privacy regulations.
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">System Features and Limitations</h3>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">Patient Management:</span> The System allows
                            searching patient records, tracking allergies and medical history, accessing
                            previous medications, and uploading EHRs. All data must be verified for accuracy.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Prescription Creation:</span> The System provides
                            evidence-based medication suggestions, allergy conflict checking, and formatted
                            prescriptions. All prescriptions must be reviewed and approved by a licensed
                            healthcare professional before being issued to patients.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Patient Communication:</span> SMS features
                            require whitelisted Twilio numbers. Healthcare professionals must ensure
                            patient consent before sending SMS messages and comply with telehealth
                            regulations.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Technical Limitations:</span> The System
                            may experience timeouts, especially with OpenAI integration. Users should
                            wait for responses rather than submitting duplicate requests.
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Ownership of Content</h3>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className="text-gray-700">
                            <span className="font-semibold">System Outputs:</span> All data generated
                            by the System, including medication recommendations, prescription formats,
                            and clinical suggestions, remain the property of MedSage CDSS.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Research and Improvement:</span> MedSage CDSS
                            reserves the right to use anonymized, de-identified data for system improvement,
                            research, and development purposes.
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Patient Data Ownership:</span> Healthcare
                            professionals and patients retain ownership of their medical data. MedSage
                            CDSS claims no ownership over patient health information.
                        </li>
                    </ol>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Indemnification</h3>
                    <p className="text-gray-700">
                        By using the System, you agree to indemnify and hold harmless
                        MedSage CDSS, its developers, partners, affiliated entities, and
                        representatives from any claims, damages, losses, liabilities,
                        including medical malpractice claims, arising out of your use of the
                        System or violation of these terms.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Regulatory Compliance</h3>
                    <p className="text-gray-700">
                        Healthcare professionals using this System are responsible for ensuring
                        compliance with all applicable laws and regulations, including but not
                        limited to HIPAA, state medical practice acts, FDA regulations, DEA
                        requirements for controlled substances, and telehealth regulations.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Governing Law and Jurisdiction</h3>
                    <p className="text-gray-700">
                        These terms are governed by applicable healthcare regulations and laws.
                        Any disputes arising under or in connection with these terms shall be
                        subject to binding arbitration or the jurisdiction of appropriate courts.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Acceptance of Terms</h3>
                    <p className="text-gray-700">
                        By using MedSage CDSS, you confirm that you are a licensed healthcare
                        professional and that you have read, understood, and agreed to these
                        Terms of Use and Disclaimer. If you do not agree with any part of these
                        terms, you may not use the System.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Contact and Support</h3>
                    <p className="text-gray-700">
                        For questions about these terms, system functionality, or to request
                        Twilio number whitelisting for SMS features, please contact the system
                        administrator.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Last Updated: November 27, 2025</p>
                    <p className="text-sm text-gray-600 mt-2">© 2025 MedSage CDSS. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
