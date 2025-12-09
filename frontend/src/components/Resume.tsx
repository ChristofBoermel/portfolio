import React, { useEffect, useState } from 'react';
import { fetchResume, type ResumeItem } from '../api';

const Resume: React.FC = () => {
    const [resumeItems, setResumeItems] = useState<ResumeItem[]>([]);

    useEffect(() => {
        fetchResume().then(setResumeItems).catch(console.error);
    }, []);

    const education = resumeItems.filter(item => item.category === 'education');
    const experience = resumeItems.filter(item => item.category === 'experience');
    const certificates = resumeItems.filter(item => item.category === 'certificate');

    return (
        <section id="resume" className="py-20 bg-light dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase mb-2 relative inline-block after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mx-auto after:mt-2 text-dark dark:text-gray-100">
                        Resume
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        My professional journey and certifications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Education & Certificates */}
                    <div>
                        <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">Education</h3>
                        {education.map((edu) => (
                            <div key={edu.id} className="relative pl-8 border-l-2 border-primary pb-8 last:pb-0">
                                <span className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary"></span>
                                <h4 className="text-lg font-bold text-dark dark:text-gray-200 uppercase mb-1">{edu.title}</h4>
                                <div className="bg-gray-200 dark:bg-gray-800 text-dark dark:text-gray-300 px-3 py-1 inline-block text-sm font-semibold mb-2">{edu.date_range}</div>
                                <p className="italic mb-2 text-gray-700 dark:text-gray-300">{edu.subtitle}</p>
                                <p className="text-gray-600 dark:text-gray-400">{edu.description}</p>
                            </div>
                        ))}

                        <h3 className="text-2xl font-bold text-dark dark:text-white mb-6 mt-12">Certificates</h3>
                        {certificates.map((cert) => (
                            <div key={cert.id} className="relative pl-8 border-l-2 border-primary pb-8 last:pb-0">
                                <span className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary"></span>
                                <h4 className="text-lg font-bold text-dark dark:text-gray-200 uppercase mb-1">{cert.title}</h4>
                                <div className="bg-gray-200 dark:bg-gray-800 text-dark dark:text-gray-300 px-3 py-1 inline-block text-sm font-semibold mb-2">{cert.date_range}</div>
                                <p className="italic mb-2 text-gray-700 dark:text-gray-300">{cert.subtitle}</p>
                            </div>
                        ))}
                    </div>

                    {/* Professional Experience */}
                    <div>
                        <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">Professional Experience</h3>
                        {experience.map((exp) => (
                            <div key={exp.id} className="relative pl-8 border-l-2 border-primary pb-8 last:pb-0">
                                <span className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary"></span>
                                <h4 className="text-lg font-bold text-dark dark:text-gray-200 uppercase mb-1">{exp.title}</h4>
                                <div className="bg-gray-200 dark:bg-gray-800 text-dark dark:text-gray-300 px-3 py-1 inline-block text-sm font-semibold mb-2">{exp.date_range}</div>
                                <p className="italic mb-2 text-gray-700 dark:text-gray-300">{exp.subtitle}</p>
                                {exp.list_items && (
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                                        {exp.list_items.map((item, idx) => <li key={idx}>{item}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;
