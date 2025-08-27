type FooterProps = {
    program: string
}

function Footer({program} : FooterProps) {
    const year = new Date().getFullYear();

  return (
    <footer className="text-center text-white bg-gray-900 font-medium p-6 text-lg">
        <div className="container mx-auto px-4">
            <p>&copy; {year}. {program} | ALL RIGHTS RESERVED</p>
        </div>
    </footer>
  )
}

export default Footer