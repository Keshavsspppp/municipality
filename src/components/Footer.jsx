const Footer = () => (
  <footer className="bg-white border-t mt-8 py-4 text-center text-gray-500 text-sm">
    <div>&copy; {new Date().getFullYear()} Raipur Smart City Mission. All rights reserved.</div>
    <div className="mt-1">Empowering citizens for a smarter, cleaner, and more connected city.</div>
    <div className="mt-1">
      Contact: <a href="mailto:info@raipursmartcity.gov" className="text-blue-500 hover:underline">info@raipursmartcity.gov</a> | Phone: <a href="tel:1234567890" className="text-blue-500 hover:underline">123-456-7890</a>
    </div>
    <div className="mt-1">
      <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a>
    </div>
  </footer>
);

export default Footer; 