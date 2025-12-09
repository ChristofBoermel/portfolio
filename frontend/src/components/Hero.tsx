import React, { useEffect, useState } from 'react';
import { fetchProfile, type Profile } from '../api';

const Hero: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        fetchProfile().then(setProfile).catch(console.error);
    }, []);

    if (!profile) return null; // Or a loading spinner

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center">
            {/* Background Image Placeholder */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/background.png")',
                    opacity: 0.8
                }}
            ></div>
            <div className="absolute inset-0 bg-white/30 z-0"></div>

            <div className="container relative z-10 text-center px-4" data-aos="fade-up">
                <h1 className="text-5xl md:text-7xl font-bold text-dark dark:text-gray-100 mb-4">{profile.name}</h1>
                <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light mb-8">
                    {profile.title} at {profile.location}
                </h2>
                <a
                    href="#about"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-full text-sm uppercase font-semibold tracking-wider hover:bg-green-600 transition-colors duration-300"
                >
                    About Me
                </a>
            </div>
        </section>
    );
};

export default Hero;
