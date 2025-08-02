import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)

  const fetchNotifications = async () => {
    try {
      const data = await window.electronAPI.dbAll(
        'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
      )
      notifications.value = data
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await window.electronAPI.dbExec(
        'UPDATE notifications SET is_read = 1 WHERE id = ?',
        [notificationId]
      )
      
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.is_read = 1
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await window.electronAPI.dbExec('UPDATE notifications SET is_read = 1')
      notifications.value.forEach(n => n.is_read = 1)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await window.electronAPI.dbExec(
        'DELETE FROM notifications WHERE id = ?',
        [notificationId]
      )
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const addNotification = async (type, title, message, relatedId = null, relatedType = null) => {
    try {
      const result = await window.electronAPI.dbExec(
        'INSERT INTO notifications (type, title, message, related_id, related_type) VALUES (?, ?, ?, ?, ?)',
        [type, title, message, relatedId, relatedType]
      )
      
      const newNotification = {
        id: result.lastInsertRowid,
        type,
        title,
        message,
        related_id: relatedId,
        related_type: relatedType,
        is_read: 0,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      
      notifications.value.unshift(newNotification)
      return newNotification
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }

  const startPolling = () => {
    // Fetch notifications every 30 seconds
    fetchNotifications()
    setInterval(fetchNotifications, 30000)
  }

  const checkExpiryReminders = async () => {
    try {
      // Check contract expiry
      const expiringContracts = await window.electronAPI.dbAll(`
        SELECT c.id, c.contract_number, c.end_date, t.full_name, t.mobile_number
        FROM contracts c
        JOIN tenants t ON c.tenant_id = t.id
        WHERE c.status = 'active' 
        AND c.end_date BETWEEN DATE('now') AND DATE('now', '+30 days')
      `)

      for (const contract of expiringContracts) {
        const daysUntilExpiry = dayjs(contract.end_date).diff(dayjs(), 'day')
        
        if (daysUntilExpiry <= 7) {
          await addNotification(
            'contract_expiry',
            'Contract Expiry Alert',
            `Contract ${contract.contract_number} expires in ${daysUntilExpiry} days`,
            contract.id,
            'contract'
          )
        }
      }

      // Check visa/passport expiry
      const expiringDocuments = await window.electronAPI.dbAll(`
        SELECT id, full_name, passport_expiry, visa_expiry
        FROM tenants
        WHERE (passport_expiry BETWEEN DATE('now') AND DATE('now', '+30 days'))
        OR (visa_expiry BETWEEN DATE('now') AND DATE('now', '+30 days'))
      `)

      for (const tenant of expiringDocuments) {
        if (tenant.passport_expiry) {
          const daysUntilExpiry = dayjs(tenant.passport_expiry).diff(dayjs(), 'day')
          if (daysUntilExpiry <= 30) {
            await addNotification(
              'document_expiry',
              'Passport Expiry Alert',
              `Passport for ${tenant.full_name} expires in ${daysUntilExpiry} days`,
              tenant.id,
              'tenant'
            )
          }
        }

        if (tenant.visa_expiry) {
          const daysUntilExpiry = dayjs(tenant.visa_expiry).diff(dayjs(), 'day')
          if (daysUntilExpiry <= 30) {
            await addNotification(
              'document_expiry',
              'Visa Expiry Alert',
              `Visa for ${tenant.full_name} expires in ${daysUntilExpiry} days`,
              tenant.id,
              'tenant'
            )
          }
        }
      }

      // Check payment due dates
      const duePayments = await window.electronAPI.dbAll(`
        SELECT p.id, p.due_date, p.amount, t.full_name, c.contract_number
        FROM payments p
        JOIN contracts c ON p.contract_id = c.id
        JOIN tenants t ON c.tenant_id = t.id
        WHERE p.status = 'pending'
        AND p.due_date BETWEEN DATE('now') AND DATE('now', '+7 days')
      `)

      for (const payment of duePayments) {
        const daysUntilDue = dayjs(payment.due_date).diff(dayjs(), 'day')
        await addNotification(
          'payment_due',
          'Payment Due Alert',
          `Payment of ${payment.amount} for ${payment.full_name} is due in ${daysUntilDue} days`,
          payment.id,
          'payment'
        )
      }
    } catch (error) {
      console.error('Error checking expiry reminders:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    startPolling,
    checkExpiryReminders
  }
})