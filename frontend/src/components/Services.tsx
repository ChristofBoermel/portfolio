import React, { useEffect, useState } from 'react';
import { fetchServices, type ServiceItem } from '../api';

const Services: React.FC = () => {
    const [services, setServices] = useState<ServiceItem[]>([]);

    useEffect(() => {
        fetchServices().then(setServices).catch(console.error);
    }, []);

    // Simulating icon mapping for now since we store string in DB
    const getIcon = (_iconName: string) => {
        // Simple placeholder icon
        return (
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )
    }

    return (
        <section id="services" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase mb-2 relative inline-block after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mx-auto after:mt-2 text-dark dark:text-gray-100">
                        Services
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        How I can help you achieve your goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="p-8 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 text-center rounded-lg group"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                {getIcon(service.icon)}
                            </div>
                            <h3 className="text-xl font-bold text-dark dark:text-white mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
