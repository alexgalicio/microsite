export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="z-10 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="py-8 w-full text-center text-white">
          &copy; {year}. College of Information and Communications Technology |
          ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
