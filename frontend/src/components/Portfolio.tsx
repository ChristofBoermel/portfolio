import React, { useEffect, useState } from 'react';
import { fetchPortfolio, type PortfolioItem } from '../api';

const Portfolio: React.FC = () => {
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

    useEffect(() => {
        fetchPortfolio().then(setPortfolioItems).catch(console.error);
    }, []);

    return (
        <section id="portfolio" className="py-20 bg-light dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase mb-2 relative inline-block after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mx-auto after:mt-2 text-dark dark:text-gray-100">
                        Portfolio
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        My recent works.
                    </p>
                </div>

                <div className="flex justify-center mb-8 space-x-4">
                    <button className="text-sm font-semibold uppercase text-primary border-b-2 border-primary pb-1">All</button>
                    {/* Filters can be dynamic too later */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                                    <p className="text-gray-300 text-sm uppercase">{item.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
