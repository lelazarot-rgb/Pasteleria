// Views - Admin Dashboard
import { useState, useEffect } from 'react';
import { OrderController } from '../controllers/OrderController';
import { UserController } from '../controllers/UserController';
import { Order, OrderStatus } from '../models/Order';
import { User } from '../models/User';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  UserCog,
  Mail,
  Calendar,
  Shield,
  Trash2
} from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  preparing: { label: 'Preparando', color: 'bg-purple-100 text-purple-800', icon: Package },
  delivering: { label: 'En Camino', color: 'bg-orange-100 text-orange-800', icon: Truck },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    delivering: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const allOrders = await OrderController.getAllOrders();
    setOrders(allOrders);
    const orderStats = await OrderController.getOrderStats();
    setStats(orderStats);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const success = await OrderController.updateOrderStatus(orderId, newStatus, adminNotes);
    if (success) {
      toast.success(`Pedido actualizado a: ${statusConfig[newStatus].label}`);
      await loadOrders();
      setSelectedOrder(null);
      setAdminNotes('');
    } else {
      toast.error('Error al actualizar el pedido');
    }
  };

  const getStatusNextStep = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
    const currentIndex = flow.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      return flow[currentIndex + 1];
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => 
    o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const completedOrders = orders.filter(o => 
    o.status === 'delivered' || o.status === 'cancelled'
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona los pedidos y el estado de las entregas</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-blue-900">Total Pedidos</CardTitle>
            <ShoppingCart className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-700 mt-1">Todos los tiempos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-yellow-900">Pendientes</CardTitle>
            <AlertCircle className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-yellow-900">{stats.pending}</div>
            <p className="text-xs text-yellow-700 mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-purple-900">En Proceso</CardTitle>
            <Package className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-purple-900">
              {stats.confirmed + stats.preparing + stats.delivering}
            </div>
            <p className="text-xs text-purple-700 mt-1">Activos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-green-900">Ingresos</CardTitle>
            <DollarSign className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-green-900">S/. {stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-700 mt-1">Total vendido</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Pedidos */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="size-4" />
            Pendientes ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <TrendingUp className="size-4" />
            Activos ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="size-4" />
            Completados ({completedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="size-4" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No hay pedidos pendientes
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onSelectOrder={setSelectedOrder}
                selectedOrder={selectedOrder}
                adminNotes={adminNotes}
                onNotesChange={setAdminNotes}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No hay pedidos activos
              </CardContent>
            </Card>
          ) : (
            activeOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onSelectOrder={setSelectedOrder}
                selectedOrder={selectedOrder}
                adminNotes={adminNotes}
                onNotesChange={setAdminNotes}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No hay pedidos completados
              </CardContent>
            </Card>
          ) : (
            completedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onSelectOrder={setSelectedOrder}
                selectedOrder={selectedOrder}
                adminNotes={adminNotes}
                onNotesChange={setAdminNotes}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onSelectOrder: (order: Order | null) => void;
  selectedOrder: Order | null;
  adminNotes: string;
  onNotesChange: (notes: string) => void;
}

function OrderCard({ 
  order, 
  onUpdateStatus, 
  onSelectOrder, 
  selectedOrder,
  adminNotes,
  onNotesChange 
}: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusNextStep = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
    const currentIndex = flow.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      return flow[currentIndex + 1];
    }
    return null;
  };

  const isExpanded = selectedOrder?.id === order.id;
  const StatusIcon = statusConfig[order.status].icon;
  const nextStatus = getStatusNextStep(order.status);

  return (
    <Card className={`transition-all ${isExpanded ? 'ring-2 ring-pink-300' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-gray-900">Pedido #{order.orderNumber}</CardTitle>
              <Badge className={statusConfig[order.status].color}>
                <StatusIcon className="size-3 mr-1" />
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Cliente:</strong> {order.customerInfo.name}</p>
              <p><strong>Email:</strong> {order.customerInfo.email}</p>
              <p><strong>Teléfono:</strong> {order.customerInfo.phone}</p>
              <p><strong>Dirección:</strong> {order.customerInfo.address}, {order.customerInfo.city}</p>
              <p><strong>Fecha de entrega:</strong> {new Date(order.deliveryDate).toLocaleDateString('es-ES')}</p>
              <p><strong>Creado:</strong> {formatDate(order.createdAt)}</p>
              {order.updatedAt && (
                <p><strong>Actualizado:</strong> {formatDate(order.updatedAt)}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-900">S/. {order.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{order.items.length} items</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Items del Pedido */}
          <div>
            <p className="text-sm text-gray-700 mb-2">Productos:</p>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>
                    {item.name} - {item.size} x{item.quantity}
                  </span>
                  <span className="text-gray-700">S/. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notas del Admin */}
          {isExpanded && (
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Notas del administrador:</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Agregar notas sobre este pedido..."
                rows={3}
              />
              {order.adminNotes && (
                <p className="text-sm text-gray-600 italic">Notas anteriores: {order.adminNotes}</p>
              )}
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 flex-wrap">
            {!isExpanded ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectOrder(order)}
              >
                Ver Detalles
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectOrder(null)}
              >
                Ocultar Detalles
              </Button>
            )}

            {order.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                >
                  <CheckCircle className="size-4 mr-1" />
                  Aceptar Pedido
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                >
                  <XCircle className="size-4 mr-1" />
                  Rechazar
                </Button>
              </>
            )}

            {nextStatus && order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => onUpdateStatus(order.id, nextStatus)}
              >
                Avanzar a: {statusConfig[nextStatus].label}
              </Button>
            )}

            {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'delivering') && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
              >
                <XCircle className="size-4 mr-1" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState({ total: 0, admins: 0, regularUsers: 0 });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await UserController.getAllUsers();
    setUsers(allUsers);
    const stats = await UserController.getUserStats();
    setUserStats(stats);
  };

  const handleToggleRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const success = await UserController.updateUserRole(userId, newRole);
    
    if (success) {
      toast.success(`Rol actualizado a: ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
      await loadUsers();
    } else {
      toast.error('Error al actualizar el rol');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userEmail === 'admin@tortasmarlyn.com') {
      toast.error('No se puede eliminar el administrador principal');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const success = await UserController.deleteUser(userId);
      
      if (success) {
        toast.success('Usuario eliminado correctamente');
        await loadUsers();
      } else {
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-indigo-900">Total Usuarios</CardTitle>
            <Users className="size-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-indigo-900">{userStats.total}</div>
            <p className="text-xs text-indigo-700 mt-1">Registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-purple-900">Administradores</CardTitle>
            <Shield className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-purple-900">{userStats.admins}</div>
            <p className="text-xs text-purple-700 mt-1">Con permisos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-pink-900">Usuarios</CardTitle>
            <UserCog className="size-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-pink-900">{userStats.regularUsers}</div>
            <p className="text-xs text-pink-700 mt-1">Clientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuarios */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No hay usuarios registrados
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map(user => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <UserCog className="size-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="size-3 text-gray-400" />
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-14">
                      <Calendar className="size-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Registrado: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                    }>
                      <Shield className="size-3 mr-1" />
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </Badge>

                    <Select
                      value={user.role}
                      onValueChange={(value) => handleToggleRole(user.id, user.role)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    {user.email !== 'admin@tortasmarlyn.com' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}