import React from 'react';
import { Linkedin, Github, Instagram } from 'lucide-react';
import logo from "../assets/logo.png";

// simple card for team members
const TeamMemberCard = ({ name, role, photo, social }) => (
    <div className="bg-white/5 border border-rose/10 rounded-[12px] p-6 text-center hover:border-rose transition-all group">
        <div className="w-[75px] h-[75px] rounded-full border-2 border-rose mx-auto mb-4 overflow-hidden bg-white">
            <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
        <h4 className="font-playfair text-[1rem] font-bold text-white">{name}</h4>
        <p className="text-[0.75rem] text-white/50 mb-4">{role}</p>

        <div className="flex justify-center gap-3">
            <a href={social.linkedin} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Linkedin size={16} />
            </a>
            <a href={social.github} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Github size={16} />
            </a>
            <a href={social.instagram} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Instagram size={16} />
            </a>
        </div>
    </div>
);

const Footer = () => {
    // maybe move this to a data file later?
    const team = [
        {
            name: "Ritik Jagtap",
            role: "Team Lead",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritik",
            social: {
                linkedin: "https://www.linkedin.com/in/ritik-jagtap/",
                github: "https://github.com/ritik",
                instagram: "https://instagram.com/ritik"
            }
        },
        {
            name: "Sachin Patil",
            role: "Team Member",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sachin",
            social: {
                linkedin: "https://www.linkedin.com/in/sachin-patil/",
                github: "https://github.com/sachin",
                instagram: "https://instagram.com/sachin"
            }
        },
        {
            name: "Bhushan Gavale",
            role: "Team Member",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bhushan",
            social: {
                linkedin: "https://www.linkedin.com/in/bhushan-gavale/",
                github: "https://github.com/bhushan",
                instagram: "https://instagram.com/bhushan"
            }
        },
        {
            name: "Sumit Bhoi",
            role: "Team Member",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sumit",
            social: {
                linkedin: "https://www.linkedin.com/in/sumit-bhoi/",
                github: "https://github.com/sumit",
                instagram: "https://instagram.com/sumit"
            }
        }
    ];

    return (
        <footer className="bg-dark p-[60px_40px_30px] text-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-8">
                    <h2 className="font-playfair text-[2.2rem] font-bold">The Innovators Boys</h2>
                    <div className="w-[40px] h-[3px] bg-rose mt-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {team.map((member, i) => (
                        <TeamMemberCard key={i} {...member} />
                    ))}
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center opacity-70 italic text-[0.8rem]">
                    <div className="font-dmsans">
                        © 2026 JanSevAI — Rural Digital Saathi
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="w-6 h-6 rounded-full" />
                        <span>सत्यमेव जयते</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
