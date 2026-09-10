const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Station = require('./models/Station');
const Train = require('./models/Train');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railsmart');
    console.log('Connected to MongoDB for RailSmart seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Station.deleteMany({});
    await Train.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Default Users (Driver/Passenger & Admin)
    const salt = await bcrypt.genSalt(10);
    const userPass = await bcrypt.hash('user123', salt);
    const adminPass = await bcrypt.hash('admin123', salt);

    const passengerUser = await User.create({
      name: 'Rohan Verma',
      email: 'user@railsmart.com',
      phone: '+91 9876543210',
      password: userPass,
      role: 'user',
      savedPassengers: [
        { name: 'Rohan Verma', age: 28, gender: 'male', berthPreference: 'lower', foodPreference: 'veg', seniorCitizen: false },
        { name: 'Pooja Verma', age: 26, gender: 'female', berthPreference: 'window', foodPreference: 'veg', seniorCitizen: false }
      ],
      securityLogs: [
        { device: 'Desktop Chrome 128', browser: 'Chrome', ip: '127.0.0.1', location: 'New Delhi, India', status: 'success' }
      ]
    });

    const adminUser = await User.create({
      name: 'IRCTC Admin Portal',
      email: 'admin@railsmart.com',
      phone: '+91 9876500000',
      password: adminPass,
      role: 'admin',
      securityLogs: [
        { device: 'Admin Terminal', browser: 'Chrome Enterprise', ip: '127.0.0.1', location: 'Rail Bhawan, New Delhi', status: 'success' }
      ]
    });

    console.log('Created Users: user@railsmart.com (user123) & admin@railsmart.com (admin123)');

    // 2. Top Indian Railway Stations
    const stationsData = [
      { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', platforms: 16, latitude: 28.6429, longitude: 77.2195 },
      { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', platforms: 10, latitude: 18.9696, longitude: 72.8193 },
      { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', platforms: 18, latitude: 18.9401, longitude: 72.8351 },
      { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', platforms: 23, latitude: 22.5838, longitude: 88.3426 },
      { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', platforms: 15, latitude: 13.0827, longitude: 80.2707 },
      { code: 'SBC', name: 'KSR Bengaluru City Junction', city: 'Bengaluru', state: 'Karnataka', platforms: 10, latitude: 12.9774, longitude: 77.5670 },
      { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', platforms: 6, latitude: 17.3916, longitude: 78.4687 },
      { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', platforms: 10, latitude: 25.6027, longitude: 85.1376 },
      { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', platforms: 12, latitude: 23.0225, longitude: 72.5714 },
      { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', platforms: 8, latitude: 26.9196, longitude: 75.7878 },
      { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', platforms: 9, latitude: 26.8322, longitude: 80.9208 },
      { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', platforms: 10, latitude: 26.4547, longitude: 80.3507 },
      { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', platforms: 9, latitude: 25.3283, longitude: 82.9863 },
      { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', platforms: 6, latitude: 23.2694, longitude: 77.4126 },
      { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', platforms: 6, latitude: 18.5289, longitude: 73.8744 },
      { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh', platforms: 6, latitude: 30.7046, longitude: 76.8203 },
      { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', platforms: 10, latitude: 26.7588, longitude: 83.3813 },
      { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', platforms: 7, latitude: 31.6340, longitude: 74.8723 },
      { code: 'MAO', name: 'Madgaon Junction', city: 'Goa', state: 'Goa', platforms: 4, latitude: 15.2736, longitude: 73.9583 }
    ];

    await Station.insertMany(stationsData);
    console.log(`Inserted ${stationsData.length} Railway Stations.`);

    // 3. Iconic Trains
    const trainsData = [
      {
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        trainType: 'Vande Bharat',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi',
        toStationCode: 'BSB',
        toStationName: 'Varanasi Junction',
        departureTime: '06:00 AM',
        arrivalTime: '02:00 PM',
        durationHours: '8h 00m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
        pantryAvailable: true,
        cleanlinessRating: 4.9,
        onTimeRating: 4.9,
        classes: [
          { classCode: 'CC', className: 'AC Chair Car', baseFare: 1750, tatkalFare: 2150, totalSeats: 80, availableSeats: 54, status: 'AVAILABLE' },
          { classCode: 'EC', className: 'Executive Chair Car', baseFare: 3300, tatkalFare: 3800, totalSeats: 40, availableSeats: 18, status: 'AVAILABLE' }
        ],
        route: [
          { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:00 AM', departureTime: '06:00 AM', haltMinutes: 0, distanceKm: 0, platform: 16 },
          { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '10:08 AM', departureTime: '10:10 AM', haltMinutes: 2, distanceKm: 440, platform: 5 },
          { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '12:08 PM', departureTime: '12:10 PM', haltMinutes: 2, distanceKm: 635, platform: 6 },
          { stationCode: 'BSB', stationName: 'Varanasi Junction', arrivalTime: '02:00 PM', departureTime: '02:00 PM', haltMinutes: 0, distanceKm: 759, platform: 1 }
        ]
      },
      {
        trainNumber: '12952',
        trainName: 'Mumbai Rajdhani Express',
        trainType: 'Rajdhani',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi',
        toStationCode: 'BCT',
        toStationName: 'Mumbai Central',
        departureTime: '04:55 PM',
        arrivalTime: '08:35 AM',
        durationHours: '15h 40m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        pantryAvailable: true,
        cleanlinessRating: 4.8,
        onTimeRating: 4.9,
        classes: [
          { classCode: '3A', className: 'AC 3 Tier', baseFare: 2420, tatkalFare: 2950, totalSeats: 120, availableSeats: 62, status: 'AVAILABLE' },
          { classCode: '2A', className: 'AC 2 Tier', baseFare: 3450, tatkalFare: 4100, totalSeats: 60, availableSeats: 14, status: 'AVAILABLE' },
          { classCode: '1A', className: 'AC 1st Class', baseFare: 5350, tatkalFare: 5900, totalSeats: 24, availableSeats: 6, status: 'AVAILABLE' }
        ],
        route: [
          { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '04:55 PM', departureTime: '04:55 PM', haltMinutes: 0, distanceKm: 0, platform: 3 },
          { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '09:00 PM', departureTime: '09:05 PM', haltMinutes: 5, distanceKm: 465, platform: 1 },
          { stationCode: 'RTM', stationName: 'Ratlam Junction', arrivalTime: '12:05 AM', departureTime: '12:08 AM', haltMinutes: 3, distanceKm: 730, platform: 4 },
          { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '03:22 AM', departureTime: '03:27 AM', haltMinutes: 5, distanceKm: 991, platform: 2 },
          { stationCode: 'ST', stationName: 'Surat', arrivalTime: '05:13 AM', departureTime: '05:18 AM', haltMinutes: 5, distanceKm: 1120, platform: 1 },
          { stationCode: 'BCT', stationName: 'Mumbai Central', arrivalTime: '08:35 AM', departureTime: '08:35 AM', haltMinutes: 0, distanceKm: 1384, platform: 1 }
        ]
      },
      {
        trainNumber: '12004',
        trainName: 'Lucknow Swarna Shatabdi Express',
        trainType: 'Shatabdi',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi',
        toStationCode: 'LKO',
        toStationName: 'Lucknow Charbagh',
        departureTime: '06:10 AM',
        arrivalTime: '12:40 PM',
        durationHours: '6h 30m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        pantryAvailable: true,
        cleanlinessRating: 4.7,
        onTimeRating: 4.8,
        classes: [
          { classCode: 'CC', className: 'AC Chair Car', baseFare: 1165, tatkalFare: 1450, totalSeats: 90, availableSeats: 38, status: 'AVAILABLE' },
          { classCode: 'EC', className: 'Executive Chair Car', baseFare: 2125, tatkalFare: 2500, totalSeats: 40, availableSeats: 8, status: 'AVAILABLE' }
        ],
        route: [
          { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:10 AM', departureTime: '06:10 AM', haltMinutes: 0, distanceKm: 0, platform: 6 },
          { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '11:20 AM', departureTime: '11:25 AM', haltMinutes: 5, distanceKm: 440, platform: 1 },
          { stationCode: 'LKO', stationName: 'Lucknow Charbagh', arrivalTime: '12:40 PM', departureTime: '12:40 PM', haltMinutes: 0, distanceKm: 512, platform: 2 }
        ]
      },
      {
        trainNumber: '12626',
        trainName: 'Kerala Superfast Express',
        trainType: 'Superfast',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi',
        toStationCode: 'MAS',
        toStationName: 'Chennai Central',
        departureTime: '08:10 PM',
        arrivalTime: '04:30 AM',
        durationHours: '32h 20m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        pantryAvailable: true,
        cleanlinessRating: 4.5,
        onTimeRating: 4.6,
        classes: [
          { classCode: 'SL', className: 'Sleeper', baseFare: 740, tatkalFare: 980, totalSeats: 150, availableSeats: 72, status: 'AVAILABLE' },
          { classCode: '3A', className: 'AC 3 Tier', baseFare: 1980, tatkalFare: 2420, totalSeats: 100, availableSeats: 29, status: 'AVAILABLE' },
          { classCode: '2A', className: 'AC 2 Tier', baseFare: 2890, tatkalFare: 3450, totalSeats: 50, availableSeats: 11, status: 'AVAILABLE' }
        ],
        route: [
          { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:10 PM', departureTime: '08:10 PM', haltMinutes: 0, distanceKm: 0, platform: 4 },
          { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '05:20 AM', departureTime: '05:25 AM', haltMinutes: 5, distanceKm: 705, platform: 1 },
          { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '11:45 AM', departureTime: '11:50 AM', haltMinutes: 5, distanceKm: 1095, platform: 2 },
          { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '04:30 AM', departureTime: '04:30 AM', haltMinutes: 0, distanceKm: 2180, platform: 5 }
        ]
      },
      {
        trainNumber: '20608',
        trainName: 'Mysuru - Chennai Vande Bharat',
        trainType: 'Vande Bharat',
        fromStationCode: 'SBC',
        fromStationName: 'KSR Bengaluru City',
        toStationCode: 'MAS',
        toStationName: 'Chennai Central',
        departureTime: '02:50 PM',
        arrivalTime: '07:20 PM',
        durationHours: '4h 30m',
        runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
        pantryAvailable: true,
        cleanlinessRating: 4.9,
        onTimeRating: 4.9,
        classes: [
          { classCode: 'CC', className: 'AC Chair Car', baseFare: 995, tatkalFare: 1250, totalSeats: 90, availableSeats: 64, status: 'AVAILABLE' },
          { classCode: 'EC', className: 'Executive Chair Car', baseFare: 1985, tatkalFare: 2350, totalSeats: 40, availableSeats: 16, status: 'AVAILABLE' }
        ],
        route: [
          { stationCode: 'SBC', stationName: 'KSR Bengaluru City', arrivalTime: '02:50 PM', departureTime: '02:50 PM', haltMinutes: 0, distanceKm: 0, platform: 7 },
          { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrivalTime: '03:10 PM', departureTime: '03:12 PM', haltMinutes: 2, distanceKm: 14, platform: 2 },
          { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '05:33 PM', departureTime: '05:35 PM', haltMinutes: 2, distanceKm: 230, platform: 2 },
          { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '07:20 PM', departureTime: '07:20 PM', haltMinutes: 0, distanceKm: 360, platform: 2 }
        ]
      }
    ];

    await Train.insertMany(trainsData);
    console.log(`Inserted ${trainsData.length} Iconic Trains.`);

    // 4. e-Catering Restaurants & Food Items
    const restaurant1 = await Restaurant.create({
      name: "Haldiram's Express",
      stationCode: 'NDLS',
      stationName: 'New Delhi',
      cuisine: ['North Indian', 'Snacks', 'Sweets', 'Thali'],
      rating: 4.8,
      deliveryMinutes: 15,
      minOrder: 150,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'
    });

    const restaurant2 = await Restaurant.create({
      name: 'Behrouz Royal Biryani',
      stationCode: 'CNB',
      stationName: 'Kanpur Central',
      cuisine: ['Mughlai', 'Biryani', 'Kebabs'],
      rating: 4.7,
      deliveryMinutes: 20,
      minOrder: 250,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'
    });

    const restaurant3 = await Restaurant.create({
      name: 'IRCTC Jan Aahar Deluxe',
      stationCode: 'BCT',
      stationName: 'Mumbai Central',
      cuisine: ['Indian Thali', 'Breakfast', 'South Indian'],
      rating: 4.5,
      deliveryMinutes: 15,
      minOrder: 100,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80'
    });

    const foodItems = [
      // Haldiram's Express - Restaurant 1
      { restaurantId: restaurant1._id, name: 'Deluxe Maharaja Thali', description: 'Paneer Butter Masala, Dal Makhani, Mix Veg, Jeera Rice, 3 Butter Roti, Gulab Jamun & Raita', price: 280, isVeg: true, category: 'Thali' },
      { restaurantId: restaurant1._id, name: 'Special Rajma Chawal Bowl', description: 'Slow-cooked spiced Kashmiri Rajma served over fragrant steamed basmati rice with pickle', price: 160, isVeg: true, category: 'Thali' },
      { restaurantId: restaurant1._id, name: 'Masala Dosa & Sambar', description: 'Crispy golden crepe with spiced potato filling, served with coconut chutney & hot sambar', price: 130, isVeg: true, category: 'Breakfast' },
      { restaurantId: restaurant1._id, name: 'Adrak Masala Chai & Samosa (2 pcs)', description: 'Hot piping ginger cardamom tea with crispy potato peas samosas and mint chutney', price: 80, isVeg: true, category: 'Snacks & Beverages' },
      { restaurantId: restaurant1._id, name: 'Aloo Paratha with Butter & Curd', description: 'Freshly made whole wheat parathas stuffed with spiced mashed potato, served with white butter and thick curd', price: 110, isVeg: true, category: 'Breakfast' },
      { restaurantId: restaurant1._id, name: 'Chole Bhature (2 pcs)', description: 'Fluffy deep-fried bhature with rich spiced chickpea curry, pickled onion and green chutney', price: 140, isVeg: true, category: 'Breakfast' },
      { restaurantId: restaurant1._id, name: 'Veg Pulao with Raita', description: 'Fragrant basmati rice cooked with garden vegetables, whole spices and fresh herbs, served with creamy raita', price: 120, isVeg: true, category: 'Thali' },
      { restaurantId: restaurant1._id, name: 'Paneer Tikka Wrap', description: 'Tandoor-roasted paneer cubes with bell peppers and onions, wrapped in whole wheat roti with mint mayo', price: 160, isVeg: true, category: 'Snacks & Beverages' },
      { restaurantId: restaurant1._id, name: 'Mango Lassi (Large)', description: 'Thick chilled blended yogurt drink with fresh Alphonso mango pulp and a hint of cardamom', price: 70, isVeg: true, category: 'Snacks & Beverages' },
      { restaurantId: restaurant1._id, name: 'Gulab Jamun (4 pcs)', description: 'Soft milk-solid dumplings fried golden and soaked in rose-flavored sugar syrup — a classic Indian sweet', price: 60, isVeg: true, category: 'Desserts' },
      { restaurantId: restaurant1._id, name: 'Railway Veg Sandwich', description: 'Toasted sandwich with cucumber, tomato, boiled potato, cheese and green chutney — a rail journey classic', price: 75, isVeg: true, category: 'Snacks & Beverages' },
      { restaurantId: restaurant1._id, name: 'Moong Dal Halwa', description: 'Rich slow-cooked yellow lentil dessert made with ghee, sugar, saffron and dry fruits', price: 90, isVeg: true, category: 'Desserts' },

      // Behrouz Royal Biryani - Restaurant 2
      { restaurantId: restaurant2._id, name: 'Dum Gosht Mutton Biryani', description: 'Tender succulent mutton pieces layered with aromatic long-grain basmati rice and saffron', price: 380, isVeg: false, category: 'Biryani & Rice' },
      { restaurantId: restaurant2._id, name: 'Zaikedaar Paneer Biryani', description: 'Fresh marinated paneer cubes tossed in rich royal spices and aged basmati rice', price: 290, isVeg: true, category: 'Biryani & Rice' },
      { restaurantId: restaurant2._id, name: 'Chicken Seekh Kebab (4 pcs)', description: 'Juicy minced chicken mixed with herbs and spices, grilled on skewers and served with mint chutney', price: 220, isVeg: false, category: 'Snacks & Beverages' },
      { restaurantId: restaurant2._id, name: 'Veg Seekh Kebab (4 pcs)', description: 'Spiced mixed vegetable and paneer patties grilled in tandoor, served with green chutney and onion rings', price: 160, isVeg: true, category: 'Snacks & Beverages' },
      { restaurantId: restaurant2._id, name: 'Chicken Korma with Naan', description: 'Creamy slow-cooked chicken in a rich almond cashew gravy, served with 2 butter naan', price: 310, isVeg: false, category: 'Thali' },
      { restaurantId: restaurant2._id, name: 'Mutton Keema Pav (2 pcs)', description: 'Spiced minced mutton cooked with onion, tomato, and green chillies, served with soft pav buns', price: 195, isVeg: false, category: 'Snacks & Beverages' },

      // IRCTC Jan Aahar Deluxe - Restaurant 3
      { restaurantId: restaurant3._id, name: 'Standard IRCTC Veg Meal', description: 'Paneer curry, Dal, Rice, 2 Chapati, Pickle and Sweet', price: 140, isVeg: true, category: 'Thali' },
      { restaurantId: restaurant3._id, name: 'South Indian Combo Plate', description: 'Idli (3 pcs), Medu Vada (2 pcs), Sambar, Coconut chutney and Tomato chutney', price: 120, isVeg: true, category: 'Breakfast' },
      { restaurantId: restaurant3._id, name: 'Economy Veg Thali', description: 'Dal Tadka, Sabzi of the day, steamed rice, 2 Phulka roti, pickle and papad — simple and filling', price: 95, isVeg: true, category: 'Thali' },
      { restaurantId: restaurant3._id, name: 'Upma with Coconut Chutney', description: 'Classic semolina upma tempered with mustard seeds, curry leaves and cashews — a healthy morning meal', price: 80, isVeg: true, category: 'Breakfast' },
      { restaurantId: restaurant3._id, name: 'Poha with Sev & Lemon', description: 'Flattened rice flakes cooked with mustard, turmeric, peas and onions, garnished with fresh coriander and lemon', price: 65, isVeg: true, category: 'Breakfast' },
    ];

    await FoodItem.insertMany(foodItems);
    console.log(`Inserted ${foodItems.length} Food Items across restaurants.`);

    // 5. Sample Booking & Payment
    const sampleTrain = trainsData[0];
    const samplePNR = '2458913456';

    const payment = await Payment.create({
      userId: passengerUser._id,
      pnr: samplePNR,
      transactionId: 'TXN_RAILSMART_DEMO_01',
      amount: 1750,
      paymentMethod: 'UPI',
      status: 'SUCCESS'
    });

    await Booking.create({
      pnr: samplePNR,
      userId: passengerUser._id,
      trainId: (await Train.findOne({ trainNumber: '22436' }))._id,
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      fromStation: 'NDLS',
      toStation: 'BSB',
      fromStationName: 'New Delhi',
      toStationName: 'Varanasi Junction',
      journeyDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      departureTime: '06:00 AM',
      arrivalTime: '02:00 PM',
      travelClass: 'CC',
      quota: 'GENERAL',
      passengers: [
        { name: 'Rohan Verma', age: 28, gender: 'male', berthPreference: 'window', allocatedCoach: 'C2', allocatedBerth: 45, allocatedBerthType: 'WINDOW', currentStatus: 'CNF', statusDetails: 'Confirmed (C2 / 45)' }
      ],
      fareBreakdown: { baseFare: 1560, reservationFee: 40, superfastFee: 45, cateringFee: 0, gst: 105, totalFare: 1750 },
      status: 'CONFIRMED',
      chartPrepared: false,
      qrToken: `RAILSMART-TICKET-${samplePNR}`,
      paymentId: payment._id
    });

    console.log('Database Seeding Completed Successfully! 🚆');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();