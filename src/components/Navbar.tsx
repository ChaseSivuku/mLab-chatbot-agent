export default function Navbar() {
    return (
        <nav>
            <div className="flex bg-[#003d4d] justify-between h-20 items-center">

                {/* Logo */}
                <img src="/logo.png" alt="Logo" className="w-26 h-12 ml-20" />

                {/* Navigation Links */}
                <div className="flex gap-5 text-white items-center mr-36 text-sm">
                    <label className="border-b-2 border-[#a6ce39]">HOME</label>
                    <label>WHO WE ARE</label>
                    <label>WHAT WE DO</label>
                    <label>PARTNERS</label>
                    <label>NEWS</label>
                    <label>RESOURCES</label>
                    <label>CONTACT US</label>
                    <div className="bg-[#a6ce39] px-4 py-2 flex items-center justify-center h-20 w-40">
                        <label className="tracking-widest">CODETRIBE</label>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>

                    </div>
                </div>

            </div>
        </nav>
    );
}