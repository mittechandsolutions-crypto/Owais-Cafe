export const business = {
  name: 'Owais Cafe | Grill | Fast Food',
  type: 'Cafe, grill and fast food restaurant',
  rating: '4.9',
  reviewsCount: '69',
  address: 'Shop # 10, Main Muzafar Center, Sambrial Rd, Mohalla Thathyaran, Daska, 51010, Pakistan',
  phone: '+92 317 7876060',
  phoneDigits: '923177876060',
  hours: 'Open daily, closes at 2 AM',
  services: ['Dine-in', 'Drive-through', 'No-contact delivery'],
  mapQuery: 'Shop%20%2310%2C%20Main%20Muzafar%20Center%2C%20Sambrial%20Rd%2C%20Daska%2C%20Pakistan',
}

export const menuCategories = ['Burgers', 'Wraps', 'Grill / BBQ', 'Pizza', 'Fries & Sides', 'Drinks']

export const menuItems = [
  { id: 'beef-grilled', category: 'Burgers', name: 'Authentic Grilled Beef Burger', description: 'Smoky flame-grilled beef, melted cheese, crisp lettuce & house sauce.', price: 650, image: 'hero-burger.webp', alt: 'Close-up of a flame-grilled beef burger' },
  { id: 'zinger', category: 'Burgers', name: 'Crispy Zinger Burger', description: 'Crunchy, juicy chicken with slaw and a cool, creamy sauce.', price: 520, image: 'zinger-burger.webp', alt: 'Golden crispy chicken burger' },
  { id: 'double-beef', category: 'Burgers', name: 'Double Smash Beef', description: 'Two seared beef patties, cheddar and a little extra attitude.', price: 850, image: 'double-burger.webp', alt: 'Double beef cheeseburger with melted cheese' },
  { id: 'beef-wrap', category: 'Wraps', name: 'Signature Beef Wrap', description: 'Grilled beef, warm flatbread, fresh vegetables and bold seasoning.', price: 580, image: 'beef-wrap.webp', alt: 'Sliced beef wrap with fresh greens' },
  { id: 'chicken-wrap', category: 'Wraps', name: 'Chicken Tikka Wrap', description: 'Smoky tikka chicken, crunchy salad and a tangy house drizzle.', price: 480, image: 'chicken-wrap.webp', alt: 'Chicken wrap served with greens' },
  { id: 'bbq-platter', category: 'Grill / BBQ', name: 'Mixed Grill Platter', description: 'A generous selection of char-grilled favourites, made to share.', price: 1850, image: 'bbq-platter.webp', alt: 'Assorted barbecue meats fresh from the grill' },
  { id: 'grilled-wings', category: 'Grill / BBQ', name: 'Smoky BBQ Wings', description: 'Juicy wings lacquered with a smoky, sticky barbecue glaze.', price: 720, image: 'bbq-wings.webp', alt: 'Barbecue chicken wings with a glossy glaze' },
  { id: 'pizza', category: 'Pizza', name: 'Tandoori Chicken Pizza', description: 'A golden, cheesy favourite with spiced chicken and peppers.', price: 1250, image: 'pizza.webp', alt: 'Freshly baked pizza with bubbling cheese' },
  { id: 'fries', category: 'Fries & Sides', name: 'Loaded Masala Fries', description: 'Crispy fries tossed in house masala. Perfect for the table.', price: 350, image: 'fries.webp', alt: 'Crispy golden fries served with seasoning' },
  { id: 'shake', category: 'Drinks', name: 'Chocolate Shake', description: 'Thick, chilled and made for that first sip after a spicy bite.', price: 390, image: 'chocolate-shake.webp', alt: 'Rich chocolate milkshake topped with cream' },
  { id: 'tea', category: 'Drinks', name: 'Doodh Patti Chai', description: 'A comforting, freshly brewed cup for long evenings and good chats.', price: 180, image: 'chai.webp', alt: 'Steaming cup of Pakistani milk tea' },
  { id: 'coffee', category: 'Drinks', name: 'Cafe Coffee', description: 'Smooth, warming coffee to round off your meal.', price: 280, image: 'coffee.webp', alt: 'Freshly poured coffee in a ceramic cup' },
]

export const signatures = [
  { title: 'The Grilled Beef', subtitle: 'The one Daska talks about.', price: '₨ 650', image: 'hero-burger.webp', alt: 'Signature grilled beef burger stacked with fresh toppings', tag: 'THE LOCAL LEGEND' },
  { title: 'Beef Wrap', subtitle: 'Big flavour, wrapped right.', price: '₨ 580', image: 'beef-wrap.webp', alt: 'Grilled beef wrap sliced and ready to serve', tag: 'WRAP YOUR DAY' },
  { title: 'Smoky BBQ Platter', subtitle: 'Gather round the grill.', price: '₨ 1,850', image: 'bbq-platter.webp', alt: 'Smoky mixed barbecue platter served hot', tag: 'STRAIGHT FROM THE FIRE' },
]

export const reviews = [
  'I am literally a fan of their beef grilled burger, best in Daska.',
  'This guy makes some authentic grilled beef burgers. His wraps are also worth trying. Such a great taste at an underrated place.',
  'Just tasted the beef wrap. Taste and seasoning is amazing, 10/10 experience.',
]

export const galleryImages = [
  { image: 'hero-burger.webp', alt: 'The house grilled beef burger, stacked high' },
  { image: 'cafe-interior.webp', alt: 'Warm, welcoming cafe interior' },
  { image: 'bbq-platter.webp', alt: 'A mixed platter fresh from the grill' },
  { image: 'fries.webp', alt: 'Crispy golden fries with house seasoning' },
  { image: 'beef-wrap.webp', alt: 'A freshly made beef wrap' },
  { image: 'chocolate-shake.webp', alt: 'Creamy chocolate shake served chilled' },
]

export const whatsappLink = (message) => `https://wa.me/${business.phoneDigits}?text=${encodeURIComponent(message)}`
