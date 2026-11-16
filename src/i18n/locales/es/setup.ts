export default {
  title: '¿Cómo se usará este dispositivo?',
  subtitle: 'Puedes cambiarlo después desde la configuración.',
  connection: {
    cloud: 'Por internet',
    lan: 'Red local del negocio'
  },
  modes: {
    admin: {
      title: 'Administrar mi negocio',
      description: 'Ventas del día, órdenes, turnos, productos e inventario de todas tus sucursales.'
    },
    handheld: {
      title: 'Comandera / caja móvil',
      description:
        'Toma órdenes en la mesa y cobra como segunda caja, conectada al punto de venta principal.'
    },
    kitchen: {
      title: 'Pantalla de cocina',
      description: 'Las órdenes llegan en tiempo real; marca cada una cuando esté lista.'
    },
    display: {
      title: 'Pantalla secundaria',
      description: 'Muestra al cliente su cuenta y el cambio, o un resumen de órdenes y mesas.'
    }
  },
  comingSoon: {
    title: 'En construcción',
    admin: 'Siguiente fase: inicio de sesión y tablero de ventas sin conexión.',
    handheld: 'Llegará después del modo administrador: vinculación con QR y toma de órdenes.',
    kitchen: 'Llegará con la comandera: tablero de órdenes y marcar como listas.',
    display: 'Llegará con la comandera: pantalla para el cliente y resumen del POS.'
  },
  changeMode: 'Cambiar modo'
}
