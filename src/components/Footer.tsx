import { Heart, Facebook, Instagram, MessageCircle } from 'lucide-react';

type View = 'home' | 'tracking' | 'customize' | 'checkout' | 'myorders' | 'contact' | 'login';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#faf6eb] mt-16 py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Sobre nosotros */}
          <div>
            <h3 className="text-[#d9668c] mb-4">The PastryShop</h3>
            <p className="text-gray-600 mb-4">
              Creamos tortas especiales con amor y dedicación para hacer tus momentos inolvidables.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/tortasmarlyn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#d9668c] transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/tortasmarlyn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#d9668c] transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#d9668c] transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-600 hover:text-[#d9668c] transition-colors"
                >
                  Catálogo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customize')}
                  className="text-gray-600 hover:text-[#d9668c] transition-colors"
                >
                  Personalizar Torta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="text-gray-600 hover:text-[#d9668c] transition-colors"
                >
                  Rastrear Pedido
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-600 hover:text-[#d9668c] transition-colors"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="mb-4">Información</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Tiempo de entrega: 48h</li>
              <li>Entregas en Lima</li>
              <li>Opciones sin gluten</li>
              <li>Opciones veganas</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="tel:+51948771201" className="hover:text-[#d9668c] transition-colors">
                  +51 948 771 201
                </a>
              </li>
              <li>
                <a href="mailto:thepastryshopperu@gmail.com" className="hover:text-[#d9668c] transition-colors">
                  thepastryshopperu@gmail.com
                </a>
              </li>
              <li>Valle Hermoso, Santiago de Surco 15038</li>
              <li>Lima-Perú</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-center md:text-left">
              © {currentYear} The PASTRY SHOP N & A S.A.C . Todos los derechos reservados.
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              Hecho con <Heart size={16} className="text-[#d9668c] fill-[#d9668c]" /> para ti
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
