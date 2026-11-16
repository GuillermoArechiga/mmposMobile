export default {
  title: 'How will this device be used?',
  subtitle: 'You can change it later in settings.',
  connection: {
    cloud: 'Over the internet',
    lan: "Business's local network"
  },
  modes: {
    admin: {
      title: 'Manage my business',
      description: "Today's sales, orders, shifts, products and inventory for every location."
    },
    handheld: {
      title: 'Order taker / mobile till',
      description: 'Take orders at the table and charge as a second till, connected to the main POS.'
    },
    kitchen: {
      title: 'Kitchen display',
      description: 'Orders arrive in real time; mark each one when it is ready.'
    },
    display: {
      title: 'Second display',
      description: "Show customers their bill and change, or a summary of orders and tables."
    }
  },
  comingSoon: {
    title: 'Under construction',
    admin: 'Next phase: sign-in and an offline sales dashboard.',
    handheld: 'Comes after admin mode: QR pairing and order taking.',
    kitchen: 'Comes with the order taker: an order board with "mark ready".',
    display: 'Comes with the order taker: customer display and POS summary.'
  },
  changeMode: 'Change mode'
}
