import { Link } from 'react-router-dom';

const Home = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex flex-col items-center justify-center p-6 font-sans text-center relative overflow-hidden">
      
      {/* Decorative background emojis to give it that food-app vibe */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 transform -rotate-12">🍔</div>
      <div className="absolute top-20 right-10 text-7xl opacity-20 transform rotate-12">🍕</div>
      <div className="absolute bottom-20 left-16 text-6xl opacity-20 transform rotate-45">🍟</div>
      <div className="absolute bottom-32 right-12 text-7xl opacity-20 transform -rotate-12">🥤</div>

      
      <div className="relative z-10 flex flex-col items-center">
        
        <div className="bg-white p-6 rounded-full shadow-2xl mb-6 flex items-center justify-center">
          <span className="text-5xl">🛵</span>
        </div>

        <h1 className="text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
          CampusConnect
        </h1>
        
        <p className="text-lg text-white font-medium opacity-90 mb-10 max-w-xs drop-shadow-sm">
          Skip the mess line. Get late-night cravings delivered to your hostel block in 10 minutes.
        </p>

        
        <Link 
          to="/menu" 
          className="bg-white text-orange-600 px-10 py-4 rounded-full text-xl font-black shadow-xl hover:scale-105 hover:shadow-2xl active:scale-95 transition-all w-full max-w-xs"
        >
          Explore Menu ➔
        </Link>
      </div>

    
      <div className="absolute bottom-6 text-white text-sm font-medium opacity-70">
        Built for the campus late-nighters.
      </div>

    </div>
  );
};

export default Home;