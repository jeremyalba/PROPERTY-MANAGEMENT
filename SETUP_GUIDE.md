# Property Management System - Quick Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Python 3 (for native dependencies)

### Installation Steps

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd property-management-app
   ```

2. **Install system dependencies (Linux/Ubuntu)**
   ```bash
   sudo apt-get update
   sudo apt-get install -y python3-setuptools python3-dev build-essential
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

   Or use the provided startup script:
   ```bash
   ./start.sh
   ```

## 🔑 Default Login Credentials
- **Username**: admin
- **Password**: admin123

## 📱 Application Features

### ✅ Implemented Features
- **Authentication System** - Secure login with role-based access
- **Dashboard** - Overview with statistics and quick actions
- **Property Management** - Add, edit, delete properties with room/bed management
- **Tenant Management** - Comprehensive tenant profiles with document tracking
- **Database System** - SQLite database with proper schema and relationships
- **Modern UI** - Beautiful interface using Element Plus components
- **Responsive Design** - Works on different screen sizes

### 🚧 Features Ready for Implementation
- **Contracts Management** - Rental agreements and payment schedules
- **Payment Tracking** - Rent collection and financial management
- **Maintenance Requests** - Issue tracking and resolution
- **Reports & Analytics** - Comprehensive reporting system
- **User Management** - Multi-user system with permissions
- **Settings** - System configuration and preferences

## 🛠️ Development

### Project Structure
```
property-management-app/
├── electron/                 # Electron main process
│   ├── main.js              # Main process entry
│   ├── preload.js           # Preload script for security
│   └── database.js          # Database operations
├── src/                     # Vue.js application
│   ├── views/               # Page components
│   ├── stores/              # Pinia state management
│   ├── router/              # Vue Router configuration
│   ├── layouts/             # Layout components
│   └── main.js              # Vue app entry
├── dist/                    # Built Vue app
└── package.json             # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build Vue.js application
- `npm run build:electron` - Build complete Electron app
- `npm run preview` - Preview built application

### Database Schema
The application includes tables for:
- Users (authentication)
- Properties (buildings, villas, etc.)
- Rooms (per property)
- Beds (per room)
- Tenants (profiles and documents)
- Bed Assignments (tenant-bed relationships)
- Contracts (rental agreements)
- Payments (financial transactions)
- Maintenance Requests (issue tracking)
- Audit Logs (activity tracking)
- Notifications (system alerts)

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom settings:
```env
# Database
DB_PATH=./data/property-management.db

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Database Location
The SQLite database is automatically created in:
- **Windows**: `%APPDATA%/property-management-app/`
- **macOS**: `~/Library/Application Support/property-management-app/`
- **Linux**: `~/.config/property-management-app/`

## 🐛 Troubleshooting

### Common Issues

1. **Native module build errors**
   ```bash
   sudo apt-get install -y python3-setuptools python3-dev build-essential
   npm install
   ```

2. **Database connection issues**
   - Check file permissions
   - Verify database path exists
   - Ensure SQLite is properly installed

3. **Build errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Testing the Application
Run the test script to verify everything works:
```bash
node test-app.js
```

## 📦 Building for Distribution

### Create Executable
```bash
npm run build:electron
```

### Platform-Specific Builds
```bash
# Windows
npm run build:electron -- --win

# macOS
npm run build:electron -- --mac

# Linux
npm run build:electron -- --linux
```

## 🔒 Security Features

- **Authentication**: bcrypt password hashing
- **Authorization**: Role-based access control
- **Data Protection**: SQLite with proper indexing
- **Audit Trail**: Complete activity logging
- **Input Validation**: Comprehensive form validation

## 📈 Performance Features

- **Database Optimization**: Proper indexing
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient data caching
- **Pagination**: Large dataset handling
- **Search Optimization**: Fast search across entities

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the README.md file
3. Create an issue in the repository

## 🔄 Next Steps

### Immediate Improvements
1. Complete the Contracts module
2. Implement Payment tracking
3. Add Maintenance request system
4. Create comprehensive Reports

### Future Enhancements
1. Mobile app companion
2. Cloud backup and sync
3. Advanced analytics
4. Multi-language support
5. Integration with accounting software

---

**🎉 Your Property Management System is ready to use!**