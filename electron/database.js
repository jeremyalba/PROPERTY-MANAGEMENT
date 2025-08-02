const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const { app } = require('electron')

class PropertyDatabase {
  constructor() {
    let userDataPath
    try {
      // Try to get user data path from Electron
      userDataPath = app.getPath('userData')
    } catch (error) {
      // Fallback for non-Electron environment (testing)
      userDataPath = process.cwd()
    }
    const dbPath = path.join(userDataPath, 'property-management.db')
    this.db = new Database(dbPath)
    this.db.pragma('foreign_keys = ON')
  }

  async initialize() {
    this.createTables()
    this.createIndexes()
    this.insertDefaultData()
  }

  createTables() {
    // Users table for authentication
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        full_name TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `)

    // Properties table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        property_type TEXT NOT NULL,
        total_rooms INTEGER DEFAULT 0,
        total_beds INTEGER DEFAULT 0,
        description TEXT,
        location_coordinates TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Rooms table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER NOT NULL,
        room_number TEXT NOT NULL,
        room_type TEXT NOT NULL,
        floor_number INTEGER,
        occupancy_limit INTEGER DEFAULT 1,
        monthly_rent DECIMAL(10,2),
        status TEXT DEFAULT 'available',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
      )
    `)

    // Beds table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS beds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        bed_number TEXT NOT NULL,
        bed_type TEXT DEFAULT 'single',
        status TEXT DEFAULT 'available',
        monthly_rent DECIMAL(10,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
      )
    `)

    // Tenants table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        mobile_number TEXT NOT NULL,
        email TEXT,
        nationality TEXT,
        profession TEXT,
        employer TEXT,
        emirates_id_front TEXT,
        emirates_id_back TEXT,
        passport_number TEXT,
        passport_expiry DATE,
        visa_number TEXT,
        visa_expiry DATE,
        passport_file TEXT,
        visa_file TEXT,
        profile_photo TEXT,
        emergency_contact TEXT,
        emergency_phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Bed assignments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bed_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bed_id INTEGER NOT NULL,
        tenant_id INTEGER NOT NULL,
        assigned_date DATE NOT NULL,
        end_date DATE,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bed_id) REFERENCES beds (id),
        FOREIGN KEY (tenant_id) REFERENCES tenants (id)
      )
    `)

    // Contracts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        bed_id INTEGER NOT NULL,
        contract_number TEXT UNIQUE NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        rent_amount DECIMAL(10,2) NOT NULL,
        security_deposit DECIMAL(10,2) DEFAULT 0,
        payment_mode TEXT NOT NULL,
        number_of_checks INTEGER DEFAULT 1,
        contract_file TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
        FOREIGN KEY (bed_id) REFERENCES beds (id)
      )
    `)

    // Payments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract_id INTEGER NOT NULL,
        payment_type TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_date DATE NOT NULL,
        due_date DATE,
        payment_method TEXT,
        cheque_number TEXT,
        cheque_image TEXT,
        receipt_number TEXT,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contract_id) REFERENCES contracts (id)
      )
    `)

    // Maintenance requests table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        room_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'new',
        assigned_to TEXT,
        completed_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id)
      )
    `)

    // Audit logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id INTEGER,
        old_values TEXT,
        new_values TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // Notifications table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        related_id INTEGER,
        related_type TEXT,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  createIndexes() {
    // Create indexes for better performance
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_tenants_mobile ON tenants(mobile_number)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_beds_status ON beds(status)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_rooms_property ON rooms(property_id)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_beds_room ON beds(room_id)')
  }

  insertDefaultData() {
    // Insert default admin user if not exists
    const adminExists = this.db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
    if (!adminExists) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      this.db.prepare(`
        INSERT INTO users (username, password_hash, role, full_name, email)
        VALUES (?, ?, 'admin', 'System Administrator', 'admin@property.com')
      `).run('admin', hashedPassword)
    }
  }

  // Database operation methods
  exec(sql, params = []) {
    return this.db.prepare(sql).run(params)
  }

  get(sql, params = []) {
    return this.db.prepare(sql).get(params)
  }

  all(sql, params = []) {
    return this.db.prepare(sql).all(params)
  }

  // Export database
  async exportDatabase(filePath) {
    const backup = new Database(filePath)
    this.db.backup(backup)
    backup.close()
  }

  // Import database
  async importDatabase(filePath) {
    const source = new Database(filePath)
    source.backup(this.db)
    source.close()
  }

  // Close database
  close() {
    this.db.close()
  }
}

module.exports = PropertyDatabase