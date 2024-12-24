import React from 'react';

interface LinkData {
  name: string;
  url: string;
}

interface ApplicationLinksProps {
  onClose: () => void;
  links: LinkData[];
}

const ApplicationLinks: React.FC<ApplicationLinksProps> = ({ onClose, links }) => {
  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto py-[1em] text-center">
        <header className="flex flex-col">
          <h1 className="text-2xl font-semibold">Application Link</h1>
          <p className='font-light tracking-wide space-x-2 mt-[1.1em]'>List of application links found.</p>
        </header>
        <div className="mt-4 space-y-4">
          {links?.length > 0 ? (
            links?.map((link, index) => (
              <div key={index} className="p-3 bg-purple-white border border-[#FFCCFF] text-primary-700 rounded break-all">
                <a href={link?.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.name || link.url}
                </a>
              </div>
            ))
          ) : (
            <p className="p-3 bg-purple-white border border-[#FFCCFF] text-red-700 rounded">No application links found.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ApplicationLinks;
