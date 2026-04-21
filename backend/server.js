// server.js - SmartCheck API Backend Real
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware esencial
app.use(cors({
  origin: '*', // Permitir todas las origins (para móvil)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ 
    name: 'SmartCheck API', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// ✅ Base de datos en memoria (para desarrollo)
// En producción, reemplazar con MongoDB/PostgreSQL
const users = new Map();
const products = [
  {
    id: '1',
    name: 'Leche Entera 1L',
    price: 899.99,
    originalPrice: 1099.99,
    category: 'Lácteos',
    supermarket: 'Coto',
    image: 'https://via.placeholder.com/150/001f3f/ffffff?text=Leche',
    description: 'Leche entera pasteurizada',
    inStock: true,
    discount: 18
  },
  {
    id: '2',
    name: 'Arroz Largo Fino 1kg',
    price: 1299.50,
    originalPrice: 1299.50,
    category: 'Almacén',
    supermarket: 'Carrefour',
    image: 'https://via.placeholder.com/150/28a745/ffffff?text=Arroz',
    description: 'Arroz de primera calidad',
    inStock: true,
    discount: 0
  },
  {
    id: '3',
    name: 'Aceite de Girasol 1.5L',
    price: 2499.00,
    originalPrice: 2899.00,
    category: 'Almacén',
    supermarket: 'Jumbo',
    image: 'https://via.placeholder.com/150/ffc107/000000?text=Aceite',
    description: 'Aceite puro de girasol',
    inStock: true,
    discount: 14
  }
];

// ==================== AUTH ENDPOINTS ====================

// ✅ POST /api/auth/register - Registro REAL
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Nombre, email y contraseña son requeridos' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Verificar si email ya existe
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'El email ya está registrado' 
      });
    }
    
    // Crear usuario (en producción: hashear password con bcrypt)
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // ⚠️ En producción: usar bcrypt.hash()
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Guardar en "base de datos"
    users.set(newUser.id, newUser);
    
    // Generar token simple (en producción: usar JWT)
    const token = `mock_jwt_${newUser.id}_${Date.now()}`;
    
    console.log(`✅ Usuario registrado: ${newUser.email}`);
    
    // Responder SIN password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ POST /api/auth/login - Login REAL
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }
    
    // Buscar usuario
    const user = Array.from(users.values()).find(u => u.email === email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Verificar password (en producción: usar bcrypt.compare())
    if (user.password !== password) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Generar token
    const token = `mock_jwt_${user.id}_${Date.now()}`;
    
    console.log(`✅ Login exitoso: ${user.email}`);
    
    // Responder SIN password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});

// ✅ GET /api/auth/me - Obtener usuario actual (para validar token)
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  
  // Buscar usuario por token (simplificado)
  const userId = token.split('_')[1];
  const user = users.get(userId);
  
  if (!user) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// ==================== PRODUCTS ENDPOINTS ====================

// ✅ GET /api/products - Listar productos
app.get('/api/products', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    
    let result = [...products];
    
    // Filtro por categoría
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Búsqueda por nombre
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtro por precio
    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Ordenamiento
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
    
  } catch (error) {
    console.error('❌ Error en products:', error);
    res.status(500).json({ message: 'Error al cargar productos' });
  }
});

// ✅ GET /api/products/:id - Producto por ID
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({ success: true, data: product });
    
  } catch (error) {
    console.error('❌ Error en product/:id:', error);
    res.status(500).json({ message: 'Error al cargar producto' });
  }
});

// ✅ GET /api/products/featured - Productos destacados
app.get('/api/products/featured', (req, res) => {
  try {
    // Retornar productos con descuento como "destacados"
    const featured = products.filter(p => p.discount > 0).slice(0, 4);
    
    res.json({
      success: true,
      count: featured.length,
      data: featured
    });
    
  } catch (error) {
    console.error('❌ Error en featured:', error);
    res.status(500).json({ message: 'Error al cargar destacados' });
  }
});

// ✅ GET /api/categories - Listar categorías
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  
  res.json({
    success: true,
    count: categories.length,
    data: categories.map(name => ({ id: name.toLowerCase(), name }))
  });
});

// ==================== MIDDLEWARE DE ERROR ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Endpoint no encontrado: ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /',
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/auth/me',
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/products/featured',
      'GET /api/categories'
    ]
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ✅ Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartCheck API running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});
