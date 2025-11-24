export function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#fad9e6] via-[#fbe9f0] to-[#fad9e6] rounded-2xl p-12 mt-6 shadow-lg border-2 border-[#f5c4d8]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-[#73263f] mb-4">🎂 Tortas artesanales para cada momento especial 🎂</h2>
        <p className="text-gray-700 mb-6">
          Creamos tortas únicas y deliciosas con ingredientes de primera calidad. 
          Desde clásicas hasta personalizadas, tenemos la torta perfecta para tu celebración.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/70 rounded-lg p-4 border border-[#f5c4d8]">
            <p className="text-[#d9668c] mb-1">✨ Ingredientes Premium</p>
            <p className="text-gray-600">Solo lo mejor para ti</p>
          </div>
          <div className="bg-white/70 rounded-lg p-4 border border-[#f5c4d8]">
            <p className="text-[#d9668c] mb-1">🚚 Entrega a Domicilio</p>
            <p className="text-gray-600">Llevamos la dulzura a tu puerta</p>
          </div>
          <div className="bg-white/70 rounded-lg p-4 border border-[#f5c4d8]">
            <p className="text-[#d9668c] mb-1">🎨 Totalmente Personalizables</p>
            <p className="text-gray-600">Diseña la torta de tus sueños</p>
          </div>
        </div>
      </div>
    </section>
  );
}