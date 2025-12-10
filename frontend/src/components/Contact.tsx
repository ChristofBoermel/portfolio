import React, { useState } from 'react';
import { sendContactMessage } from '../api';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Correcting state key mapping for cleaner code
    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        setIsLoading(true);

        // EmailJS Credentials (Hardcoded for immediate stability)
        const SERVICE_ID = "service_zrggtsh";
        const TEMPLATE_ID = "template_6hdurm2";
        const PUBLIC_KEY = "DC5uBg1TYvM394FEM";

        try {
            // 1. Save to Backend Database (Reliability & Ownership)
            await sendContactMessage(formData);

            // 2. Send Email via EmailJS (Delivery)
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email, // Ensure template uses this variable for 'Reply-To'
                    subject: formData.subject,
                    message: formData.message,
                    // Common fallback variables just in case template names differ
                    user_name: formData.name,
                    user_email: formData.email,
                },
                PUBLIC_KEY
            );

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            console.error('Submission Error:', error);
            // Even if backend fails, we might still want to try sending email? 
            // For now, let's treat any error as a failure to keep it simple.
            if (error.text) {
                // EmailJS specific error often has .text
                setStatus('Failed to send email via EmailJS: ' + error.text);
            } else if (error.response && error.response.data && error.response.data.error) {
                setStatus(error.response.data.error);
            } else {
                setStatus('Failed to send message. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase mb-2 relative inline-block after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mx-auto after:mt-2 text-dark dark:text-gray-100">
                        Contact
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        Get in touch with me (v4 - EmailJS).
                    </p>
                </div>

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="text-center p-6 shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg group hover:border-primary/20 transition-colors">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Location:</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Germany</p>
                        </div>

                        <div className="text-center p-6 shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg group hover:border-primary/20 transition-colors">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Email:</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">christofboermel@gmail.com</p>
                        </div>

                        <div className="text-center p-6 shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg group hover:border-primary/20 transition-colors">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Call:</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">+49 176 56123820</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-dark dark:text-gray-100 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-dark dark:text-gray-100 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-dark dark:text-gray-100 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            required
                        />
                        <textarea
                            rows={5}
                            placeholder="Message"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-dark dark:text-gray-100 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            required
                        ></textarea>

                        {status === 'success' && <p className="text-primary text-center">Message sent successfully!</p>}
                        {status && status !== 'success' && <p className="text-red-500 text-center">{status === 'error' ? 'Failed to send message.' : status}</p>}

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-primary text-white px-8 py-3 rounded-full uppercase text-sm font-semibold hover:bg-green-600 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
