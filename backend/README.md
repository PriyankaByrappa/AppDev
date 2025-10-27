# Cookie Management System - Backend API

A comprehensive Spring Boot backend API for managing a cookie store business with authentication, inventory management, order processing, and cart functionality.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Cookie Management**: Full CRUD operations for cookie inventory
- **Order Processing**: Complete order lifecycle management
- **Shopping Cart**: Session-based cart functionality
- **Payment Tracking**: Payment processing and status tracking
- **User Management**: Customer and admin user management
- **RESTful API**: Well-documented REST endpoints
- **Database Integration**: MySQL with JPA/Hibernate ORM
- **CORS Support**: Cross-origin request handling

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.5.6
- **Database**: MySQL 8.0+
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **Java Version**: 17

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## 🚀 Quick Start

### 1. Database Setup

Create a MySQL database:
```sql
CREATE DATABASE cookie;
```

### 2. Configuration

Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cookie
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Application

```bash
# Clone the repository
git clone <repository-url>
cd cookiemanagement

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/admin/register` - Admin registration

### Cookie Management
- `GET /api/cookies` - Get all cookies
- `GET /api/cookies/{id}` - Get cookie by ID
- `POST /api/cookies` - Create new cookie (Admin only)
- `PUT /api/cookies/{id}` - Update cookie (Admin only)
- `DELETE /api/cookies/{id}` - Delete cookie (Admin only)

### Order Management
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Cart Management
- `GET /api/cart-items` - Get cart items
- `POST /api/cart-items` - Add item to cart
- `PUT /api/cart-items/{id}` - Update cart item
- `DELETE /api/cart-items/{id}` - Remove item from cart

### User Management
- `GET /api/customers` - Get all customers
- `GET /api/admin/admins` - Get all admins (Admin only)

## 🧪 Testing

### Using the Test Script

Run the provided test script to verify the API:

```bash
# Windows PowerShell
.\test_api.sh

# Linux/Mac
chmod +x test_api.sh
./test_api.sh
```

### Manual Testing with curl

```bash
# Test public endpoint
curl http://localhost:8080/api/cookies

# Register a new customer
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phonenumber": "1234567890",
    "address": "123 Main St"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🔧 Configuration

### Database Configuration
The application uses MySQL as the primary database. Update the connection properties in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cookie
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### JWT Configuration
JWT settings can be configured in `application.properties`:

```properties
jwt.secret=your-secret-key
jwt.expiration=3600000
```

### CORS Configuration
CORS is configured in `WebConfig.java` to allow cross-origin requests from any origin.

## 📁 Project Structure

```
src/
├── main/
│   ├── java/com/example/cookie/cookiemanagement/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── repo/           # Repository interfaces
│   │   ├── security/       # Security configuration
│   │   └── service/        # Business logic services
│   └── resources/
│       └── application.properties
└── test/                   # Test classes
```

## 🔒 Security

- JWT-based authentication
- Role-based authorization (ADMIN, CUSTOMER)
- Password encryption using BCrypt
- CORS configuration for cross-origin requests
- SQL injection protection through JPA

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Verify database credentials
   - Check if the `cookie` database exists

2. **Port Already in Use**
   - Change the port in `application.properties`
   - Or stop the process using port 8080

3. **Authentication Issues**
   - Verify JWT secret configuration
   - Check user roles and permissions

### Logs

Check the console output when running `mvn spring-boot:run` for detailed error messages.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.
