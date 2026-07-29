import { NavItem, UserProfile, MetricCardData, SalesOverviewPoint, CustomerUserDetail, ICategory, IProduct } from "./types";

export const APP_CONFIG = {
  name: "ApexAdmin",
  description: "Next-gen Scalable E-Commerce Admin Console",
};

export const VERTICAL_NAV_ITEMS: NavItem[] = [
  {
    title: "Account Settings",
    href: "/settings",
    icon: "account",
  },
  {
    title: "Analysis & Overview",
    href: "/",
    icon: "analytics",
    badge: "Live",
  },
  {
    title: "Employee Management",
    href: "/employees",
    icon: "employees",
  },
  {
    title: "Inventory Management",
    href: "/inventory",
    icon: "inventory",
  },
  {
    title: "Order Management",
    href: "/orders",
    icon: "orders",
    badge: "12",
  },
  {
    title: "User Order Details",
    href: "/orders/user/sarah-jenkins",
    icon: "user-orders",
    badge: "New",
  },
  {
    title: "Story Management",
    href: "/stories",
    icon: "stories",
  },
];

export const CURRENT_USER: UserProfile = {
  name: "Alexander Pierce",
  email: "alexander@apex.store",
  role: "Super Admin",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
};

export const MOCK_USER_ORDER_DETAIL: CustomerUserDetail = {
  id: "USR-88291",
  username: "sarah-jenkins",
  fullName: "Sarah Jenkins",
  email: "sarah.j@example.com",
  phone: "+1 (555) 234-8901",
  avatar: "SJ",
  joinedDate: "Jan 12, 2024",
  totalOrdersCount: 8,
  totalSpent: 2849.50,
  loyaltyTier: "VIP Platinum Customer",
  orders: [
    // LATEST ORDER ON TOP
    {
      id: "ORD-9481",
      date: "Jul 28, 2026 • 16:50 PM",
      timestamp: 1785238200,
      items: [
        {
          name: "Wireless Noise-Canceling Headphones Studio Max",
          quantity: 1,
          price: 299.99,
          sku: "AUDIO-MAX-BLK",
        },
        {
          name: "Protective Hard Travel Case",
          quantity: 1,
          price: 49.50,
          sku: "ACC-CASE-01",
        },
      ],
      totalAmount: 349.49,
      status: "Completed",
      paymentDetails: {
        method: "Credit Card (Visa)",
        cardLast4: "4242",
        transactionId: "TXN-9841209341",
        status: "Paid",
        paidAt: "Jul 28, 2026 16:51 PM",
        billingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      },
      shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      trackingNumber: "TRK-FEDEX-9928174",
    },
    {
      id: "ORD-9120",
      date: "Jun 14, 2026 • 11:20 AM",
      timestamp: 1781436000,
      items: [
        {
          name: "UltraWide 34' Curved Monitor 144Hz",
          quantity: 1,
          price: 849.00,
          sku: "DISP-34-CRV",
        },
      ],
      totalAmount: 849.00,
      status: "Completed",
      paymentDetails: {
        method: "PayPal Express",
        transactionId: "PAYPAL-8812903",
        status: "Paid",
        paidAt: "Jun 14, 2026 11:22 AM",
        billingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      },
      shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      trackingNumber: "TRK-UPS-1102938",
    },
    {
      id: "ORD-8812",
      date: "Apr 02, 2026 • 09:15 AM",
      timestamp: 1775121300,
      items: [
        {
          name: "Ergonomic Aluminium Desk Stand Pro",
          quantity: 2,
          price: 129.50,
          sku: "DESK-STAND-ALU",
        },
      ],
      totalAmount: 259.00,
      status: "Refunded",
      paymentDetails: {
        method: "Apple Pay (Mastercard)",
        cardLast4: "8812",
        transactionId: "APAY-7728104",
        status: "Refunded",
        paidAt: "Apr 02, 2026 09:16 AM",
        billingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      },
      shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      refundHistory: [
        {
          refundId: "REF-001928",
          amount: 259.00,
          reason: "Customer returned undamaged items within 30-day window",
          date: "Apr 08, 2026",
        },
      ],
    },
  ],
};

export const ANALYTICS_METRICS: MetricCardData[] = [
  {
    title: "Total Revenue",
    value: "$128,450.00",
    change: "+14.2%",
    isPositive: true,
    period: "vs last month",
    icon: "analytics",
  },
  {
    title: "Total Orders",
    value: "3,842",
    change: "+8.7%",
    isPositive: true,
    period: "vs last month",
    icon: "orders",
  },
  {
    title: "Active Customers",
    value: "14,920",
    change: "+22.5%",
    isPositive: true,
    period: "vs last month",
    icon: "customers",
  },
  {
    title: "Avg. Order Value",
    value: "$142.80",
    change: "-1.8%",
    isPositive: false,
    period: "vs last month",
    icon: "products",
  },
];

export const REVENUE_GRAPH_DATA: SalesOverviewPoint[] = [
  { month: "Jan", revenue: 42000, orders: 1200 },
  { month: "Feb", revenue: 53000, orders: 1450 },
  { month: "Mar", revenue: 61000, orders: 1800 },
  { month: "Apr", revenue: 58000, orders: 1650 },
  { month: "May", revenue: 79000, orders: 2100 },
  { month: "Jun", revenue: 95000, orders: 2600 },
  { month: "Jul", revenue: 128450, orders: 3842 },
];

export const RECENT_ORDERS_DATA = MOCK_USER_ORDER_DETAIL.orders.map((o) => ({
  id: o.id,
  customerName: MOCK_USER_ORDER_DETAIL.fullName,
  customerEmail: MOCK_USER_ORDER_DETAIL.email,
  product: o.items[0]?.name || "Merchandise",
  amount: o.totalAmount,
  status: o.status,
  date: o.date,
}));

export const MOCK_CATEGORIES: ICategory[] = [
  {
    _id: "cat_66a9b001",
    name: "Audio & Headphones",
    slug: "audio-headphones",
    description: "Premium noise-canceling headphones, wireless earbuds, and studio acoustics.",
    media: [
      {
        public_id: "cat_audio_01",
        secure_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
        resource_type: "image",
      },
    ],
    is_active: true,
    productCount: 8,
  },
  {
    _id: "cat_66a9b002",
    name: "Displays & Monitors",
    slug: "displays-monitors",
    description: "UltraWide 4K & OLED curved gaming and productivity display screens.",
    media: [
      {
        public_id: "cat_disp_01",
        secure_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
        resource_type: "image",
      },
    ],
    is_active: true,
    productCount: 5,
  },
  {
    _id: "cat_66a9b003",
    name: "Ergonomics & Desk Wear",
    slug: "ergonomics-desk-wear",
    description: "Aluminium stands, mechanical keypads, ergonomic seating, and desk mats.",
    media: [
      {
        public_id: "cat_ergo_01",
        secure_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
        resource_type: "image",
      },
    ],
    is_active: true,
    productCount: 12,
  },
  {
    _id: "cat_66a9b004",
    name: "Keyboards & Inputs",
    slug: "keyboards-inputs",
    description: "Custom mechanical switches, wireless keyboards, and precision mice.",
    media: [
      {
        public_id: "cat_kb_01",
        secure_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600",
        resource_type: "image",
      },
    ],
    is_active: true,
    productCount: 6,
  },
  {
    _id: "cat_66a9b005",
    name: "Smart Wearables",
    slug: "smart-wearables",
    description: "Fitness bands, smartwatches, and biometric tracking wearables.",
    media: [
      {
        public_id: "cat_wear_01",
        secure_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
        resource_type: "image",
      },
    ],
    is_active: false,
    productCount: 3,
  },
];

export const MOCK_PRODUCTS: IProduct[] = [
  {
    _id: "prd_66a9c001",
    name: "Wireless Noise-Canceling Headphones Studio Max",
    slug: "wireless-noise-canceling-headphones-studio-max",
    description: "Industry-leading hybrid active noise cancellation with 40mm custom acoustic drivers, 30-hour playback duration, and ultra-plush memory foam cushions.",
    original_price: 349.99,
    current_price: 299.99,
    discount_percentage: 14,
    sku: "AUDIO-MAX-BLK",
    stock: 12,
    is_in_stock: true,
    is_it_featured: true,
    category_id: "cat_66a9b001",
    category_name: "Audio & Headphones",
    brand: "AeroSound",
    media: [
      {
        public_id: "prod_audio_01_a",
        secure_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        resource_type: "image",
      },
      {
        public_id: "prod_audio_01_b",
        secure_url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800",
        resource_type: "image",
      },
    ],
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    highlights: [
      { title: "Active ANC 3.0", description: "Blocks up to 98% of low-frequency ambient environmental noises." },
      { title: "Multipoint Bluetooth 5.3", description: "Seamless switching between laptop, smartphone, and desktop." },
      { title: "Quick Fast Charge", description: "10-minute USB-C charge yields 5 hours of continuous playback." },
    ],
    specifications: [
      {
        category_name: "Technical Specs",
        specs: [
          { key: "Driver Size", value: "40mm Titanium Dome" },
          { key: "Frequency Response", value: "20Hz - 40kHz" },
          { key: "Battery Life", value: "30 Hours (ANC ON)" },
          { key: "Charging Port", value: "USB-C Fast Charging" },
        ],
      },
      {
        category_name: "Physical & Connectivity",
        specs: [
          { key: "Weight", value: "254g" },
          { key: "Bluetooth Version", value: "v5.3 Low Energy" },
          { key: "Codec Support", value: "LDAC, AAC, SBC, aptX Adaptive" },
        ],
      },
    ],
    faqs: [
      { question: "Is this water resistant for gym use?", answer: "Rated IPX4 splash and sweat resistant for workouts.", asked_by: "Alex M." },
      { question: "Can I use it wired?", answer: "Includes 3.5mm audio cable for zero latency wired listening.", asked_by: "Samantha P." },
    ],
    ratings: {
      average: 4.8,
      count: 246,
    },
    stock_availabilty_flag: "LOW_STOCK",
    is_active: true,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-07-28T14:30:00Z",
  },
  {
    _id: "prd_66a9c002",
    name: "UltraWide 34' Curved OLED Monitor 144Hz",
    slug: "ultrawide-34-curved-oled-monitor-144hz",
    description: "Immersive 1800R curved 3440x1440 resolution display panel featuring Quantum Dot OLED technology, 0.1ms response time, and HDR1000 brightness peak.",
    original_price: 999.00,
    current_price: 849.00,
    discount_percentage: 15,
    sku: "DISP-34-CRV",
    stock: 45,
    is_in_stock: true,
    is_it_featured: true,
    category_id: "cat_66a9b002",
    category_name: "Displays & Monitors",
    brand: "VortexView",
    media: [
      {
        public_id: "prod_disp_01_a",
        secure_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
        resource_type: "image",
      },
    ],
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400",
    highlights: [
      { title: "Quantum Dot OLED", description: "Infinite contrast ratio with true zero blacks and 99.3% DCI-P3 color gamut." },
      { title: "0.1ms Response", description: "Ultra-fast pixel transition eliminating motion blur completely." },
    ],
    specifications: [
      {
        category_name: "Display Specs",
        specs: [
          { key: "Screen Size", value: "34 Inches 21:9 Curved" },
          { key: "Resolution", value: "3440 x 1440 WQHD" },
          { key: "Refresh Rate", value: "144Hz Native" },
          { key: "HDR Rating", value: "VESA DisplayHDR True Black 400" },
        ],
      },
    ],
    faqs: [
      { question: "Does it come with a VESA mount?", answer: "Yes, standard 100x100mm VESA bracket is included in the package.", asked_by: "David K." },
    ],
    ratings: {
      average: 4.9,
      count: 128,
    },
    stock_availabilty_flag: "IN_STOCK",
    is_active: true,
    createdAt: "2026-05-15T09:12:00Z",
    updatedAt: "2026-07-20T11:00:00Z",
  },
  {
    _id: "prd_66a9c003",
    name: "Ergonomic Aluminium Desk Stand Pro",
    slug: "ergonomic-aluminium-desk-stand-pro",
    description: "Precision CNC-machined anodized space gray aluminium laptop & monitor riser with integrated cable management routes and silicone anti-scratch pads.",
    original_price: 149.00,
    current_price: 129.50,
    discount_percentage: 13,
    sku: "DESK-STAND-ALU",
    stock: 88,
    is_in_stock: true,
    is_it_featured: false,
    category_id: "cat_66a9b003",
    category_name: "Ergonomics & Desk Wear",
    brand: "NordicCraft",
    media: [
      {
        public_id: "prod_ergo_01_a",
        secure_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800",
        resource_type: "image",
      },
    ],
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400",
    highlights: [
      { title: "Aerospace Aluminium", description: "Supports up to 25kg monitors without any deflection." },
      { title: "Ventilated Cooling", description: "Heat sink aluminum frame cools laptop processors passively." },
    ],
    specifications: [
      {
        category_name: "Build & Dimensions",
        specs: [
          { key: "Material", value: "Anodized Series 6000 Aluminium" },
          { key: "Dimensions", value: "520mm x 210mm x 90mm" },
          { key: "Max Payload", value: "25 kg (55 lbs)" },
        ],
      },
    ],
    faqs: [
      { question: "Will a 16-inch MacBook Pro fit underneath?", answer: "Yes, keyboards and laptops up to 480mm wide easily slide underneath.", asked_by: "Elena R." },
    ],
    ratings: {
      average: 4.7,
      count: 94,
    },
    stock_availabilty_flag: "IN_STOCK",
    is_active: true,
    createdAt: "2026-04-01T08:00:00Z",
    updatedAt: "2026-07-25T16:00:00Z",
  },
  {
    _id: "prd_66a9c004",
    name: "Mechanical RGB Wireless Keypad Studio Edition",
    slug: "mechanical-rgb-wireless-keypad-studio-edition",
    description: "Hot-swappable gasket-mounted mechanical keypad with pre-lubed linear switches, per-key RGB backlight, and rotary CNC volume knob.",
    original_price: 219.00,
    current_price: 189.00,
    discount_percentage: 14,
    sku: "KEYBOARD-RGB",
    stock: 4,
    is_in_stock: true,
    is_it_featured: true,
    category_id: "cat_66a9b004",
    category_name: "Keyboards & Inputs",
    brand: "KeyWorks",
    media: [
      {
        public_id: "prod_kb_01_a",
        secure_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800",
        resource_type: "image",
      },
    ],
    thumbnail: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400",
    highlights: [
      { title: "Hot-Swappable PCB", description: "Swap 3-pin and 5-pin MX switches without soldering." },
      { title: "Tri-Mode Connectivity", description: "Bluetooth 5.1, 2.4GHz Wireless USB Dongle, and Type-C." },
    ],
    specifications: [
      {
        category_name: "Keypad Specifications",
        specs: [
          { key: "Layout", value: "75% Compact (82 Keys)" },
          { key: "Switches", value: "Custom Lubed Gateron Yellow Pro" },
          { key: "Keycaps", value: "Double-shot PBT Cherry Profile" },
        ],
      },
    ],
    faqs: [
      { question: "Is macOS layout supported?", answer: "Includes dedicated Mac keycaps and hardware toggle switch.", asked_by: "Lucas S." },
    ],
    ratings: {
      average: 4.6,
      count: 310,
    },
    stock_availabilty_flag: "LOW_STOCK",
    is_active: true,
    createdAt: "2026-03-20T12:00:00Z",
    updatedAt: "2026-07-28T18:00:00Z",
  },
  {
    _id: "prd_66a9c005",
    name: "Biometric Fitness & Sleep Tracker Band V2",
    slug: "biometric-fitness-sleep-tracker-band-v2",
    description: "Advanced PPG optical biometric tracker with continuous heart-rate monitoring, HRV recovery metrics, SPO2 sensor, and 14-day battery life.",
    original_price: 129.99,
    current_price: 99.99,
    discount_percentage: 23,
    sku: "WEAR-FIT-V2",
    stock: 0,
    is_in_stock: false,
    is_it_featured: false,
    category_id: "cat_66a9b005",
    category_name: "Smart Wearables",
    brand: "AeroSound",
    media: [
      {
        public_id: "prod_wear_01_a",
        secure_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        resource_type: "image",
      },
    ],
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
    highlights: [
      { title: "Clinical Grade SPO2", description: "Real-time blood oxygen saturation tracking." },
      { title: "Sleep Architecture", description: "Deep, REM, light sleep, and sleep efficiency score calculation." },
    ],
    specifications: [
      {
        category_name: "Hardware Specs",
        specs: [
          { key: "Display", value: "1.47 Inch AMOLED Touch Display" },
          { key: "Water Resistance", value: "5 ATM (50 meters)" },
          { key: "Battery", value: "210mAh Li-Po (14 Days typical)" },
        ],
      },
    ],
    faqs: [
      { question: "Does it work with Apple Health?", answer: "Syncs bi-directionally with Apple Health and Google Health Connect.", asked_by: "Chloe B." },
    ],
    ratings: {
      average: 4.5,
      count: 82,
    },
    stock_availabilty_flag: "OUT_OF_STOCK",
    is_active: false,
    createdAt: "2026-02-10T15:00:00Z",
    updatedAt: "2026-07-29T08:00:00Z",
  },
];

