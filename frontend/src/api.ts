const API_URL = 'http://localhost:3000/api';

export interface Profile {
    id: number;
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    birthdate: string; // ISO date string from DB
    social_links: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
    };
}

export interface ResumeItem {
    id: number;
    category: 'summary' | 'education' | 'experience' | 'certificate';
    title: string;
    subtitle?: string;
    date_range?: string;
    description?: string;
    list_items?: string[];
    ordering: number;
}

export interface ServiceItem {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    image_url: string;
    description?: string;
}

export const fetchProfile = async (): Promise<Profile> => {
    const response = await fetch(`${API_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
};

export const fetchResume = async (): Promise<ResumeItem[]> => {
    const response = await fetch(`${API_URL}/resume`);
    if (!response.ok) throw new Error('Failed to fetch resume');
    return response.json();
};

export const fetchServices = async (): Promise<ServiceItem[]> => {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
};

export const fetchPortfolio = async (): Promise<PortfolioItem[]> => {
    const response = await fetch(`${API_URL}/portfolio`);
    if (!response.ok) throw new Error('Failed to fetch portfolio');
    return response.json();
};

export const sendContactMessage = async (data: { name: string; email: string; subject: string; message: string }) => {
    const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error('Failed to send message');
        (error as any).response = { data: errorData };
        throw error;
    }
    return response.json();
};
