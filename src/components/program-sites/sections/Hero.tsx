type HeroProp = {
  heading: string,
  subheading: string
}

function Hero({ heading, subheading }: HeroProp) {
  return (
    <section className="relative h-[80vh] bg-[url('/images/background.png')] bg-cover bg-no-repeat bg-right md:bg-center">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="container mx-auto px-4 flex flex-col justify-center items-center h-full text-center text-white space-y-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-tight max-w-4xl">
          {heading}
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl font-light">
          {subheading}
        </p>
        <a href="#" className="bg-white text-gray-800 py-2 px-6 font-semibold hover:opacity-80 transition">
          Learn More
        </a>
      </div>
    </section>
  );
}

export default Hero;
