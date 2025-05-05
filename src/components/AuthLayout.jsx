const AuthLayout = ({ children, title }) => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/movie-background.jpg')" }}
    >
      {/* Dark overlay with 90% opacity */}
      <div className="absolute inset-0 bg-gray-900/90"></div>

      {/* Logo at top-left */}
      <div className="relative z-10 p-1">
        <img src="/images/logo.png" alt="KKT Logo" className="w-20 h-14" />
      </div>

      {/* Top section - Welcome text */}
      <div className="relative z-10 text-center -mt-4 mb-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Chào mừng đến với
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500">
          KKTMovieTicket
        </h1>
      </div>

      {/* Bottom section - Split into two columns */}
      <div className="relative z-10 flex flex-1 flex-col md:flex-row">
        {/* Left column - Illustration */}
        <div className="flex-1 flex items-center justify-center p-2 ">
          <div className="w-full">
            <img
              src="/images/movie-illustration.png"
              alt="Movie Booking Illustration"
              className="w-full h-auto object-contain ml-10"
            />
          </div>
        </div>

        {/* Right column - Form */}
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
