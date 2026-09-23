// import {  Linkedin } from "lucide-react";


export function Footer() {
  return (
    <footer className="FooterContent w-full bg-[##BBD5DA] text-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
        <p className="text-sm">
          © {new Date().getFullYear()} CaremelFlow. All rights reserved.
        </p>

        <a href="public/customerprotection/privacy-policy.html" className="text-sm underline hover:opacity-70">
          Privacy Policy
        </a>

        {/* <div className="flex items-center gap-4">
          
          <a  href="https://www.instagram.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-black hover:opacity-70"
          
            Instagram size={22}>
          
            </a>

          
           <a href="https://www.linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-black hover:opacity-70"
          >
            <Linkedin size={22} />
          </a>
        </div> */}
      </div>
    </footer>
  );
}