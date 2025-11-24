import { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle, 
  Clock,
  Truck,
  MapPin,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  XCircle,
  FileText,
  Copy,
  RefreshCw
} from 'lucide-react';
import { OrderController } from '../controllers/OrderController';
import { formatCurrency, formatDate, getOrderSteps } from '../lib/utils';
import { Order } from '../lib/types';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface OrderTrackingProps {
  initialToken?: string;
}

export function OrderTracking({ initialToken = '' }: OrderTrackingProps) {
  const [trackingToken, setTrackingToken] = useState(initialToken);
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialToken) {
      setTrackingToken(initialToken);
      setTimeout(() => {
        handleSearchOrder(initialToken.trim());
      }, 100);
    }
  }, [initialToken]);

  const handleSearchOrder = async (token: string) => {
    const foundOrder = await OrderController.getOrderByToken(token);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setOrder(null);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingToken.trim()) {
      toast.error('Por favor ingresa un código de seguimiento');
      return;
    }

    setIsSearching(true);

    setTimeout(async () => {
      const foundOrder = await OrderController.getOrderByToken(trackingToken.trim());
      
      if (foundOrder) {
        setOrder(foundOrder);
        toast.success('¡Pedido encontrado!');
      } else {
        toast.error('No se encontró ningún pedido con ese código');
        setOrder(null);
      }
      
      setIsSearching(false);
    }, 500);
  };

  const copyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      toast.success('Código copiado');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getEstimatedDelivery = (order: Order) => {
    const orderDate = new Date(order.createdAt);
    const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : null;
    
    if (deliveryDate) {
      return deliveryDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    // Estimate 3-5 days from order date
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 4);
    return estimatedDate.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const orderSteps = order ? getOrderSteps(order.status) : [];

  const statusConfig = {
    pending: { 
      label: 'Pendiente', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Clock,
      description: 'Tu pedido está siendo revisado por nuestro equipo'
    },
    confirmed: { 
      label: 'Confirmado', 
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle,
      description: 'Tu pedido ha sido confirmado y será preparado pronto'
    },
    preparing: { 
      label: 'En Preparación', 
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Package,
      description: 'Estamos preparando tu deliciosa torta con mucho cariño'
    },
    delivering: { 
      label: 'En Camino', 
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: Truck,
      description: 'Tu pedido está en camino hacia tu dirección'
    },
    delivered: { 
      label: 'Entregado', 
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle,
      description: '¡Tu pedido ha sido entregado exitosamente!'
    },
    cancelled: { 
      label: 'Cancelado', 
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle,
      description: 'Este pedido ha sido cancelado'
    },
  };

  const currentStatus = order ? statusConfig[order.status] : null;
  const StatusIcon = currentStatus?.icon || Clock;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#d9668c] rounded-lg">
                <Package className="size-6 text-white" />
              </div>
              <div>
                <CardTitle>Seguimiento de Pedido</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Rastrea tu pedido en tiempo real
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={trackingToken}
                  onChange={(e) => setTrackingToken(e.target.value.toUpperCase())}
                  placeholder="Ingresa tu código de seguimiento (ej: ABC1234567)"
                  className="w-full px-4 py-3 pl-12 bg-white border-2 border-gray-300 rounded-lg focus:border-[#d9668c] focus:outline-none transition-colors"
                  maxLength={10}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex-1 px-6 py-3 bg-[#d9668c] text-white rounded-lg hover:bg-[#c55579] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="size-5 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="size-5" />
                      Buscar Pedido
                    </>
                  )}
                </button>
                
                {order && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.trackingToken)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Copy className="size-5" />
                    Copiar
                  </button>
                )}
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  Puedes encontrar tu código de seguimiento en el email de confirmación de tu pedido o en la sección "Mis Pedidos".
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Banner */}
            <Card className={`border-2 ${currentStatus?.color}`}>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-full">
                    <StatusIcon className="size-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">Pedido #{order.orderNumber}</h3>
                    <p className="text-sm opacity-90">
                      {currentStatus?.description}
                    </p>
                  </div>
                  <Badge className={`${currentStatus?.color} px-4 py-2`}>
                    {currentStatus?.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            {order.status !== 'cancelled' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="size-5 text-[#d9668c]" />
                    Progreso del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {orderSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4 mb-8 last:mb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                            step.completed 
                              ? 'bg-[#d9668c] border-[#d9668c] scale-110' 
                              : 'bg-white border-gray-300'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="size-6 text-white" />
                            ) : (
                              <div className="w-4 h-4 bg-gray-300 rounded-full" />
                            )}
                          </div>
                          {index < orderSteps.length - 1 && (
                            <div className={`w-1 flex-1 min-h-[60px] transition-all ${
                              step.completed ? 'bg-[#d9668c]' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className={`mb-1 ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.name}
                          </p>
                          {step.date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="size-4" />
                              {formatDate(step.date)}
                            </div>
                          )}
                          {!step.completed && index === orderSteps.findIndex(s => !s.completed) && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              Siguiente paso
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.status === 'delivering' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="size-5 text-orange-600" />
                        <p className="text-orange-900">Estimación de entrega</p>
                      </div>
                      <p className="text-orange-800 ml-8">
                        {getEstimatedDelivery(order)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cancelled Status */}
            {order.status === 'cancelled' && (
              <Card className="border-2 border-red-200 bg-red-50">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="size-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-900 mb-2">Pedido Cancelado</h4>
                      <p className="text-red-700">
                        Este pedido ha sido cancelado. Si tienes alguna pregunta o necesitas asistencia, 
                        por favor contáctanos a través de nuestros canales de atención.
                      </p>
                      {order.adminNotes && (
                        <div className="mt-3 p-3 bg-white rounded border border-red-200">
                          <p className="text-sm text-red-800">
                            <strong>Nota:</strong> {order.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="size-5 text-[#d9668c]" />
                    Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <p className="text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.size} • Cantidad: {item.quantity}
                          </p>
                          {item.customMessage && (
                            <div className="mt-2 p-2 bg-pink-50 rounded border border-pink-200">
                              <p className="text-xs text-pink-800 flex items-start gap-1">
                                <FileText className="size-3 mt-0.5 flex-shrink-0" />
                                <span>"{item.customMessage}"</span>
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-900 ml-4">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-[#d9668c]">{formatCurrency(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5 text-[#d9668c]" />
                    Información de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="size-4 text-blue-700" />
                          <p className="text-blue-900">{order.customerInfo.name}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="size-4 text-blue-700 mt-0.5 flex-shrink-0" />
                          <div className="text-blue-800">
                            <p>{order.customerInfo.address}</p>
                            <p>{order.customerInfo.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-blue-700" />
                          <p className="text-blue-800">{order.customerInfo.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-blue-700" />
                          <p className="text-blue-800">{order.customerInfo.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="size-4 text-pink-700" />
                        <p className="text-pink-900">Fecha de Pedido</p>
                      </div>
                      <p className="text-pink-800 ml-6">{formatDate(order.createdAt)}</p>
                    </div>

                    {order.deliveryDate && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="size-4 text-green-700" />
                          <p className="text-green-900">Fecha de Entrega</p>
                        </div>
                        <p className="text-green-800 ml-6">
                          {new Date(order.deliveryDate).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Section */}
            <Card className="border-2 border-gray-200">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="size-6 text-gray-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-gray-900 mb-2">¿Necesitas ayuda?</h4>
                    <p className="text-gray-600 mb-3">
                      Si tienes alguna pregunta sobre tu pedido o necesitas hacer cambios, 
                      no dudes en contactarnos.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href="tel:+1234567890" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#d9668c] text-white rounded-lg hover:bg-[#c55579] transition-colors"
                      >
                        <Phone className="size-4" />
                        Llamar
                      </a>
                      <a 
                        href="mailto:info@thepastryshop.com" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Mail className="size-4" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {!order && trackingToken && !isSearching && (
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="py-12 text-center">
              <Package className="size-16 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-yellow-900 mb-2">Pedido no encontrado</h3>
              <p className="text-yellow-800 mb-1">
                No se encontró ningún pedido con el código: <strong>{trackingToken}</strong>
              </p>
              <p className="text-yellow-700">
                Por favor verifica que el código sea correcto e intenta nuevamente.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}