# Enhanced Customer Dashboard

This enhanced Customer Dashboard provides a modern, responsive interface with a collapsible sidebar, navigation menu, and integrated user management.

## Features

### 🎨 **Sidebar Navigation**
- **Collapsible Design**: Toggle between expanded and collapsed states
- **User Avatar**: Displays customer icon/avatar at the top
- **Dynamic Email**: Shows logged-in customer's email from AuthContext
- **Navigation Menu**: 
  - Home
  - Add to Cart
  - Order Details
  - Profile
  - Settings
  - Logout

### 🚀 **React Router Integration**
- **Nested Routes**: `/customer/*` pattern for clean URL structure
- **Navigation**: Seamless navigation between dashboard sections
- **Active States**: Visual indication of current page

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Hamburger Menu**: Mobile-friendly navigation toggle
- **Flexible Layout**: Adapts to different screen dimensions

### 🎯 **Component Structure**

```
src/
├── components/
│   ├── CustomerSidebar.js          # Main sidebar component
│   ├── dashboard/
│   │   ├── HomeSection.js          # Cookie browsing and search
│   │   ├── CartSection.js         # Shopping cart management
│   │   ├── OrdersSection.js       # Order history and details
│   │   ├── ProfileSection.js      # User profile management
│   │   └── SettingsSection.js     # User preferences and settings
│   └── ExampleUsage.js            # Usage example and testing
├── dashboards/CustomerDashboard/
│   └── CustomerDashboard.js       # Main dashboard with routing
└── tailwind.css                   # Custom Tailwind-like styles
```

## Usage

### 1. **Basic Implementation**

```jsx
import CustomerDashboard from './dashboards/CustomerDashboard/CustomerDashboard';

// In your App.js
<Route path="/customer/*" element={<CustomerDashboard />} />
```

### 2. **AuthContext Integration**

The dashboard automatically integrates with your existing AuthContext:

```jsx
const { user, logout } = useContext(AuthContext);

// User data is automatically displayed in the sidebar
// Email: user.email
// Name: user.name
```

### 3. **Navigation Routes**

The dashboard supports the following routes:
- `/customer` - Home section (cookie browsing)
- `/customer/cart` - Shopping cart
- `/customer/orders` - Order history
- `/customer/profile` - User profile
- `/customer/settings` - User settings

### 4. **Sidebar Props**

```jsx
<CustomerSidebar 
  user={user}                    // User object from AuthContext
  onLogout={handleLogout}        // Logout function
  isCollapsed={sidebarCollapsed} // Collapse state
  onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} // Toggle function
/>
```

## Component Details

### **CustomerSidebar.js**
- **Props**: `user`, `onLogout`, `isCollapsed`, `onToggle`
- **Features**: User avatar, email display, navigation menu, logout button
- **Icons**: Uses React Icons (FaUser, FaShoppingCart, etc.)

### **HomeSection.js**
- **Features**: Cookie browsing, search, filtering, add to cart
- **API Integration**: Fetches cookies from backend API
- **Responsive Grid**: Displays cookies in responsive grid layout

### **CartSection.js**
- **Features**: Shopping cart management, quantity updates, order placement
- **Local Storage**: Persists cart data across sessions
- **Order Summary**: Real-time total calculation

### **OrdersSection.js**
- **Features**: Order history, order details modal, status tracking
- **Mock Data**: Currently uses mock data (replace with API integration)

### **ProfileSection.js**
- **Features**: User profile editing, account statistics
- **Form Handling**: Inline editing with save/cancel functionality

### **SettingsSection.js**
- **Features**: Notification preferences, privacy settings, theme options
- **Local Storage**: Saves user preferences

## Styling

The dashboard uses custom Tailwind-like CSS classes defined in `tailwind.css`:

```css
/* Key classes used */
.flex, .flex-col, .items-center, .justify-between
.bg-white, .bg-orange-500, .text-gray-800
.rounded-lg, .shadow-md, .hover:bg-orange-600
.transition-colors, .duration-200
```

## Responsive Breakpoints

- **Mobile**: `< 768px` - Collapsed sidebar, hamburger menu
- **Tablet**: `768px - 1024px` - Partial sidebar visibility
- **Desktop**: `> 1024px` - Full sidebar with all features

## Testing

Use the `ExampleUsage.js` component to test the dashboard:

```jsx
import ExampleUsage from './components/ExampleUsage';

// Add to your routes for testing
<Route path="/example" element={<ExampleUsage />} />
```

## API Integration

### **Cookies API**
```javascript
// Fetch cookies
const response = await fetch('http://localhost:8080/api/cookies');
const cookies = await response.json();
```

### **Orders API** (To be implemented)
```javascript
// Fetch user orders
const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
const orders = await response.json();
```

## Customization

### **Adding New Menu Items**
```jsx
const menuItems = [
  { id: 'new-feature', label: 'New Feature', icon: FaNewIcon, path: '/customer/new-feature' }
];
```

### **Custom Styling**
Override the default styles by modifying `tailwind.css` or adding custom CSS classes.

### **Adding New Sections**
1. Create a new component in `src/components/dashboard/`
2. Add route in `CustomerDashboard.js`
3. Add menu item in `CustomerSidebar.js`

## Dependencies

- **React**: ^19.2.0
- **React Router DOM**: ^7.9.4
- **React Icons**: ^5.5.0
- **Axios**: ^1.12.2 (for API calls)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- **Lazy Loading**: Consider implementing lazy loading for dashboard sections
- **Memoization**: Use React.memo for expensive components
- **API Caching**: Implement caching for frequently accessed data

## Security

- **Authentication**: All routes are protected by ProtectedRoute
- **Data Validation**: Validate user input in forms
- **XSS Protection**: Sanitize user-generated content

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live order updates
- **Advanced Search**: Elasticsearch integration for better search
- **Analytics**: User behavior tracking and analytics
- **PWA Support**: Progressive Web App features
- **Dark Mode**: Theme switching capability
- **Internationalization**: Multi-language support
