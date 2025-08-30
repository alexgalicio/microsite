function Hero() {
  return (
    <section className="relative h-[80vh] bg-[url('/images/pimentel.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="container mx-auto px-4 flex flex-col justify-center items-center h-full text-center text-white space-y-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-tight max-w-4xl">
          College of Information and Communications Technology
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl font-light">
          A Center of Innovation at Bulacan State University where future tech innovators grow and excel
        </p>
      </div>
    </section>
  );
}

export default Hero;
