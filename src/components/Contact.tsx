import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateEmail, validatePhone } from '../lib/utils';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Número de teléfono inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSending(true);

    // Simular envío del mensaje
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSending(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+51 948 771 201',
      link: 'tel:+51948771201',
    },
    {
      icon: Mail,
      title: 'Correo',
      content: 'thepastryshopperu@gmail.com',
      link: 'mailto:thepastryshopperu@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Valle Hermoso, Santiago de Surco 15038',
      link: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Sáb: 8:00 AM - 7:00 PM',
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: 'Instagram',
      url: 'https://instagram.com/tortasmarlyn',
      color: 'hover:bg-pink-500',
    },
    {
      icon: Facebook,
      name: 'Facebook',
      url: 'https://facebook.com/tortasmarlyn',
      color: 'hover:bg-blue-500',
    },
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      url: 'https://wa.me/573001234567',
      color: 'hover:bg-green-500',
    },
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="mb-4">Contáctanos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ¿Tienes alguna pregunta o necesitas ayuda con tu pedido? Estamos aquí para ayudarte.
          Contáctanos y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Información de contacto */}
        <div>
          <h3 className="mb-6">Información de Contacto</h3>
          
          <div className="space-y-4 mb-8">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#fef9fb] rounded-full flex items-center justify-center flex-shrink-0">
                  <info.icon size={24} className="text-[#d9668c]" />
                </div>
                <div>
                  <h4 className="mb-1">{info.title}</h4>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-[#d9668c] transition-colors"
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="mb-4">Síguenos en redes sociales</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors ${social.color}`}
                  title={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8157994871707!2d-74.07209!3d4.6486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzgnNTUuMCJOIDc0wrAwNCcxOS41Ilc!5e0!3m2!1sen!2sco!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Tortas Marlyn"
              />
            </div>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div>
          <h3 className="mb-6">Envíanos un Mensaje</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Juan Pérez"
              />
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="300 123 4567"
              />
              {errors.phone && (
                <p className="text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Escribe tu mensaje aquí..."
              />
              {errors.message && (
                <p className="text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Mensaje
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#fef9fb] border border-[#fad9e6] rounded-lg">
            <p className="text-gray-600">
              También puedes llamarnos directamente o escribirnos por WhatsApp para una respuesta más rápida.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h3 className="text-center mb-8">Preguntas Frecuentes</h3>
        
        <div className="space-y-4">
          <details className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <summary className="cursor-pointer text-gray-800">
              ¿Cuál es el tiempo de entrega?
            </summary>
            <p className="mt-3 text-gray-600">
              El tiempo de entrega varía según el tipo de torta y personalización. Generalmente requerimos un mínimo de 48 horas de anticipación para pedidos personalizados.
            </p>
          </details>

          <details className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <summary className="cursor-pointer text-gray-800">
              ¿Hacen entregas a domicilio?
            </summary>
            <p className="mt-3 text-gray-600">
              Sí, hacemos entregas a domicilio en toda la ciudad. El costo de envío depende de la ubicación y se calcula al finalizar la compra.
            </p>
          </details>

          <details className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <summary className="cursor-pointer text-gray-800">
              ¿Puedo cancelar mi pedido?
            </summary>
            <p className="mt-3 text-gray-600">
              Puedes cancelar tu pedido hasta 24 horas antes de la fecha de entrega programada. Contáctanos lo antes posible si necesitas hacer cambios.
            </p>
          </details>

          <details className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <summary className="cursor-pointer text-gray-800">
              ¿Ofrecen opciones sin gluten o veganas?
            </summary>
            <p className="mt-3 text-gray-600">
              Sí, ofrecemos opciones especiales sin gluten, veganas y para diferentes necesidades dietéticas. Por favor especifica tus requerimientos al hacer tu pedido.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
