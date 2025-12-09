import React, { useEffect, useState } from 'react';
import { fetchProfile, type Profile } from '../api';

const About: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        fetchProfile().then(setProfile).catch(console.error);
    }, []);

    if (!profile) return null;

    const calculateAge = (birthdate: string) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formattedBio = profile.bio ? profile.bio.replace('{age}', calculateAge(profile.birthdate).toString()) : '';

    return (
        <section id="about" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase mb-2 relative inline-block after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mx-auto after:mt-2 text-dark dark:text-gray-100">
                        About
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        {profile.title}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/3">
                        <img
                            src="/me.jpg"
                            alt="Profile"
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">Software Developer & Team Leader</h3>
                        <p className="italic text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                            {formattedBio}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center">
                                    <span className="text-primary mr-2">›</span>
                                    <strong className="text-dark dark:text-gray-200 mr-2">City:</strong> {profile.location}
                                </li>
                                <li className="flex items-center">
                                    <span className="text-primary mr-2">›</span>
                                    <strong className="text-dark dark:text-gray-200 mr-2">Email:</strong> {profile.email}
                                </li>
                                <li className="flex items-center">
                                    <span className="text-primary mr-2">›</span>
                                    <strong className="text-dark dark:text-gray-200 mr-2">Phone:</strong> {profile.phone}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
