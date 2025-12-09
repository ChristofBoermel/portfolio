import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer id="footer" className="bg-white dark:bg-gray-800 py-8 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center space-x-4 mb-4">
                    <a href="https://www.linkedin.com/in/christof-b%C3%B6rmel-723494359/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <span className="text-xs">LI</span>
                    </a>
                </div>

                <div className="text-gray-500 dark:text-gray-400 text-xs">
                    &copy; Copyright <strong>Christof Börmel</strong>. All Rights Reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;
