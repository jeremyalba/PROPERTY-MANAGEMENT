# Property Management System

A comprehensive desktop application for managing properties, tenants, contracts, and payments built with Vue.js, Electron, and SQLite.

## 🚀 Features

### ✅ Core Features

#### 1. Property & Room Management
- Add and manage multiple properties (buildings, villas, flats)
- Add individual rooms per property with occupancy limits
- Add multiple beds per room with auto-generated or custom Bed IDs
- Set bed status: Available / Occupied / Reserved / Under Maintenance

#### 2. Tenant Management
- Add new tenants with comprehensive information:
  - Full Name, Mobile Number, Email
  - Nationality, Profession / Employer
  - Emirates ID (front & back image support)
  - Passport & Visa details with expiry dates
  - Profile photo upload
- Assign beds to tenants
- Upload signed rental agreements
- Auto-check for visa/passport expiry reminders

#### 3. Contract Management
- Create contracts with start/end dates
- Set rent amounts (monthly/quarterly)
- Payment modes: 4 cheques / 6 cheques / monthly / upfront
- Upload scanned cheque images or reference numbers
- Contract status tracking: Active / Expired / Cancelled / Renewed
- Auto-renewal reminders (30/15/7 days before expiry)

#### 4. Payment & Finance
- Add payment entries (manual/auto-scheduled)
- Record rent received with receipt numbers
- Track security deposits
- Record fines and additional charges
- Auto-generate receipts (PDF download & WhatsApp/email)
- Payment status tracking: Paid / Pending / Overdue
- Dashboard with financial overview

### 🔁 Contract Lifecycle Automation
- Auto-reminders for contract expiry
- Cheque due date notifications
- Visa/Passport expiry alerts
- Contract renewal options

### 📑 Reports & Analytics
- Rent collection reports (by tenant/room/property/month)
- Bed occupancy reports
- Tenant history reports
- Payment history (cheque/online/cash)
- Downloadable reports (PDF, Excel)

### 🔐 Admin Panel
- User roles: Admin, Property Manager, Accountant
- Role-based access permissions
- Audit logs of all user actions

### 📲 Communication Features
- WhatsApp/email integration for:
  - Rent receipts
  - Contract reminders
  - Renewal messages
- Location sharing with Google Maps integration

### 🛠️ Maintenance & Complaint Tracker
- Tenant complaint submission
- Maintenance team assignment
- Status tracking: New / In Progress / Completed

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **UI Framework**: Element Plus
- **Desktop Framework**: Electron.js
- **Database**: SQLite with better-sqlite3
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Date Handling**: Day.js
- **PDF Generation**: jsPDF
- **File Processing**: Sharp, Multer
- **Authentication**: bcryptjs, JWT
- **Scheduling**: node-cron

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build:electron
   ```

## 🔧 Configuration

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

### Database
The application uses SQLite for data storage. The database file is automatically created in the user's application data directory:
- **Windows**: `%APPDATA%/property-management-app/property-management.db`
- **macOS**: `~/Library/Application Support/property-management-app/property-management.db`
- **Linux**: `~/.config/property-management-app/property-management.db`

### Environment Variables
Create a `.env` file in the root directory for custom configurations:
```env
# Database
DB_PATH=./data/property-management.db

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp API (if using)
WHATSAPP_API_KEY=your-api-key
WHATSAPP_API_URL=https://api.whatsapp.com/send
```

## 📱 Usage

### Getting Started

1. **Launch the application**
   - Run `npm run dev` for development
   - Or use the built executable for production

2. **Login**
   - Use default credentials: admin / admin123
   - Change password after first login

3. **Add Properties**
   - Navigate to Properties section
   - Click "Add Property"
   - Fill in property details

4. **Add Tenants**
   - Go to Tenants section
   - Click "Add Tenant"
   - Complete tenant information

5. **Create Contracts**
   - Navigate to Contracts
   - Create new contract linking tenant to bed
   - Set payment terms and schedule

6. **Record Payments**
   - Go to Payments section
   - Record rent payments and other transactions
   - Generate receipts

### Key Workflows

#### Property Setup Workflow
1. Add Property → 2. Add Rooms → 3. Add Beds → 4. Assign Tenants

#### Tenant Onboarding Workflow
1. Add Tenant → 2. Create Contract → 3. Assign Bed → 4. Record Initial Payment

#### Payment Management Workflow
1. View Due Payments → 2. Record Payment → 3. Generate Receipt → 4. Send Notification

## 📊 Database Schema

The application includes the following main tables:

- **users** - System users and authentication
- **properties** - Property information
- **rooms** - Room details per property
- **beds** - Bed information per room
- **tenants** - Tenant profiles and documents
- **bed_assignments** - Tenant-bed assignments
- **contracts** - Rental agreements
- **payments** - Financial transactions
- **maintenance_requests** - Maintenance tracking
- **audit_logs** - System activity logs
- **notifications** - System notifications

## 🔒 Security Features

- **Authentication**: Secure login with bcrypt password hashing
- **Authorization**: Role-based access control
- **Data Protection**: SQLite database with proper indexing
- **Audit Trail**: Complete logging of all user actions
- **Input Validation**: Comprehensive form validation
- **File Upload Security**: Image validation and processing

## 📈 Performance Features

- **Database Optimization**: Proper indexing for fast queries
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient data caching strategies
- **Pagination**: Large dataset handling
- **Search Optimization**: Fast search across all entities

## 🚀 Deployment

### Building for Distribution

1. **Build the application**
   ```bash
   npm run build:electron
   ```

2. **Distribution packages will be created in `dist-electron/`**
   - Windows: `.exe` installer
   - macOS: `.dmg` file
   - Linux: `.AppImage` file

### Platform-Specific Builds

```bash
# Windows
npm run build:electron -- --win

# macOS
npm run build:electron -- --mac

# Linux
npm run build:electron -- --linux
```

## 🔧 Development

### Project Structure
```
property-management-app/
├── electron/                 # Electron main process
│   ├── main.js              # Main process entry
│   ├── preload.js           # Preload script
│   └── database.js          # Database operations
├── src/                     # Vue.js application
│   ├── components/          # Reusable components
│   ├── views/               # Page components
│   ├── stores/              # Pinia stores
│   ├── router/              # Vue Router configuration
│   ├── layouts/             # Layout components
│   ├── App.vue              # Root component
│   └── main.js              # Vue app entry
├── public/                  # Static assets
├── dist/                    # Built Vue app
└── dist-electron/           # Built Electron app
```

### Adding New Features

1. **Create new view component** in `src/views/`
2. **Add route** in `src/router/index.js`
3. **Create store** if needed in `src/stores/`
4. **Add database table** if required in `electron/database.js`
5. **Update navigation** in `src/layouts/MainLayout.vue`

### Database Migrations

To add new tables or modify existing ones:

1. **Update schema** in `electron/database.js`
2. **Add migration logic** if needed
3. **Test thoroughly** with existing data

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check file permissions
   - Verify database path
   - Ensure SQLite is properly installed

2. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Performance issues**
   - Check database indexes
   - Monitor memory usage
   - Optimize queries

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🔄 Updates

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added reporting and analytics
- **v1.2.0** - Enhanced communication features

### Upcoming Features
- Mobile app companion
- Advanced analytics dashboard
- Integration with accounting software
- Multi-language support
- Cloud backup and sync

---

**Built with ❤️ using Vue.js, Electron, and SQLite**
