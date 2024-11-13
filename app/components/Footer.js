// components/Footer.js

const Footer = () => {
    return (
      <footer className="bg-gray-300 py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-3 mb-4">
            {/* <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" /> */}
            <h1 className="text-gray-800 font-bold">Arejeng</h1>
          </div>
          <p className="mt-4">Food Experts</p>
          <form className="flex justify-center mb-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-2 py-2 rounded-2-md border border-black-400"
            />
            <button className="bg-red-600 text-white px-2 py-2 rounded-r-md">
              Connect with Us
            </button>
          </form>
        </div>
      </footer>
    );
  };
  
  export default Footer;