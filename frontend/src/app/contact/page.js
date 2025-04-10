import AuthRedirect from '@/components/AuthRedirect';
import { FiExternalLink } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const socialMedia = [
    // {
    //   name: 'GitHub',
    //   link: 'https://github.com',
    //   icon: <FaGithub className="text-[#181717] text-3xl" />,
    //   description: 'Check out the source code.',
    //   username: 'xxxxxx',
    //   color: 'from-[#181717]/10 to-[#181717]/30',
    //   hoverColor: 'hover:border-[#181717]',
    //   iconBg: 'bg-[#181717]/10',
    // },
  ];

  return (
    <AuthRedirect>
      <main className="bg-gradient-to-br from-[#f8faff] to-[#f0f4ff] text-gray-900 flex items-center justify-center px-4"
        style={{ minHeight: "calc(100vh - 4.5rem)" }}
      >
        <div 
          className="w-full max-w-6xl mx-auto text-center py-16 md:py-20"
        >
          <div className="mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Let's Connect
            </h1>
            <div 
              className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"
            />
          </div>
          
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {socialMedia.map((media) => (
              <a
                key={media.name}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 bg-gradient-to-br ${media.color} backdrop-blur-sm rounded-2xl border-2 border-white/50 ${media.hoverColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative`}
              >
                <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-white/10 z-0" />
                
                <div className="flex flex-col items-center relative z-10">
                  <div className={`p-4 rounded-full ${media.iconBg} mb-4`}>
                    {media.icon}
                  </div>
                  <h2 className="text-2xl font-bold group-hover:text-blue-700 transition-all">
                    {media.name}
                  </h2>
                  <p className="mt-3 text-gray-600 group-hover:text-gray-900 transition-all">
                    {media.description}
                  </p>
                  <p 
                    className="mt-3 text-sm font-medium text-gray-500 group-hover:text-gray-800 bg-white/50 px-3 py-1 rounded-full"
                  >
                    {media.name === 'WhatsApp' ? '+' : '@'}{media.username}
                  </p>
                </div>
              </a>
            ))}
          </div>
          
        </div>
      </main>
    </AuthRedirect>
  );
}