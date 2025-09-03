import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { InlineLoading, LoadingOverlay, ButtonWithSpinner } from '../components/Loading'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`

const Header = styled.div`
  margin-bottom: 40px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
`

const LogoutButton = styled.button`
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  float: right;
  margin-top: -60px;

  &:hover {
    background: #ef4444;
    color: white;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`

const CardContent = styled.div`
  color: #6b7280;
`

const OrdersTable = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #f1f5f9;
  color: #374151;
  font-weight: 600;
`

const TableRow = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #6b7280;
`

const StatusBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$bg};
  color: ${props => props.$color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const OrderDetailsModal = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    padding: 24px;
    margin: 0 16px;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  .info-item {
    .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 14px;
      color: #1a1a1a;
      font-weight: 500;
    }
  }
`

const OrderItems = styled.div`
  margin-bottom: 24px;
`

const OrderItemsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 12px;
  
  .item-info {
    flex: 1;
    
    .name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    
    .quantity {
      font-size: 14px;
      color: #6b7280;
    }
  }
  
  .item-total {
    font-size: 16px;
    font-weight: 600;
    color: #FF6B35;
  }
`

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  
  .label {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .amount {
    font-size: 20px;
    font-weight: 700;
    color: #FF6B35;
  }
`

const ClickableRow = styled(TableRow)`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f9ff !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  
  .icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  .description {
    font-size: 16px;
    margin-bottom: 24px;
  }
  
  .action {
    color: #FF6B35;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const StatsCard = styled(Card)`
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }
`

interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
  billing: any
  dateCreated: string
}

interface OrderLineItem {
  id: number
  name: string
  quantity: number
  total: string
  meta_data: any[]
}

interface Order {
  id: number
  number: string
  status: string
  date_created: string
  date_modified: string
  total: string
  currency: string
  payment_method: string
  payment_method_title: string
  line_items: OrderLineItem[]
  billing: any
  meta_data: any[]
}

const DashboardPage: React.FC = () => {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken')
    const storedCustomer = localStorage.getItem('customer')

    if (!token || !storedCustomer) {
      router.push('/auth')
      return
    }

    try {
      const customerData = JSON.parse(storedCustomer)
      setCustomer(customerData)
      fetchOrders(customerData.id)
    } catch (err) {
      console.error('Error parsing customer data:', err)
      router.push('/auth')
    }
  }, [router])

  const fetchOrders = async (customerId: number, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
        setError('')
      }

      const response = await fetch(`/api/orders/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('authToken')
          localStorage.removeItem('customer')
          router.push('/auth')
          return
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(`Bestellungen konnten nicht geladen werden: ${err.message || 'Unbekannter Fehler'}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshOrders = () => {
    if (customer && !refreshing) {
      fetchOrders(customer.id, true)
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const closeOrderDetails = () => {
    setShowOrderDetails(false)
    setSelectedOrder(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('customer')
    router.push('/')
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'In Bearbeitung'
      case 'completed': return 'Abgeschlossen'
      case 'pending': return 'Ausstehend'
      case 'on-hold': return 'Wartend'
      case 'cancelled': return 'Storniert'
      case 'refunded': return 'Erstattet'
      case 'failed': return 'Fehlgeschlagen'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return { bg: '#fef3c7', text: '#92400e' }
      case 'completed': return { bg: '#d1fae5', text: '#065f46' }
      case 'pending': return { bg: '#e0e7ff', text: '#3730a3' }
      case 'on-hold': return { bg: '#fef3c7', text: '#92400e' }
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }
      case 'refunded': return { bg: '#f3f4f6', text: '#374151' }
      case 'failed': return { bg: '#fee2e2', text: '#991b1b' }
      default: return { bg: '#f3f4f6', text: '#374151' }
    }
  }

  const getPaymentMethodDisplay = (method: string, title?: string) => {
    if (title) return title
    switch (method) {
      case 'paypal': return 'PayPal'
      case 'stripe': return 'Kreditkarte'
      case 'bacs': return 'Banküberweisung'
      default: return method || 'Unbekannt'
    }
  }

  const calculateOrderStats = () => {
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0)
    const completedOrders = orders.filter(o => o.status === 'completed')
    const processingOrders = orders.filter(o => o.status === 'processing')
    const pendingOrders = orders.filter(o => o.status === 'pending')

    return {
      totalOrders: orders.length,
      completedCount: completedOrders.length,
      processingCount: processingOrders.length,
      pendingCount: pendingOrders.length,
      totalSpent,
      averageOrder: orders.length > 0 ? totalSpent / orders.length : 0
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout title="Dashboard - youshark">
        <Container>
          <InlineLoading text="Dashboard wird geladen..." size="large" />
        </Container>
      </Layout>
    )
  }

  if (!customer) {
    return null // Will redirect to auth
  }

  const stats = calculateOrderStats()

  return (
    <Layout 
      title="Dashboard - youshark"
      description="Verwalten Sie Ihre youshark Bestellungen und Kontoinformationen."
    >
      <Container>
        <Header>
          <Title>Willkommen zurück, {customer.firstName}!</Title>
          <Subtitle>Verwalten Sie Ihre Bestellungen und Kontoinformationen</Subtitle>
          <LogoutButton onClick={handleLogout}>Abmelden</LogoutButton>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Grid>
          <Card>
            <CardTitle>Kontoinformationen</CardTitle>
            <CardContent>
              <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
              <p><strong>E-Mail:</strong> {customer.email}</p>
              <p><strong>Mitglied seit:</strong> {formatDate(customer.dateCreated)}</p>
              {customer.billing?.country && (
                <p><strong>Land:</strong> {customer.billing.country}</p>
              )}
              {customer.billing?.city && (
                <p><strong>Stadt:</strong> {customer.billing.city}</p>
              )}
            </CardContent>
          </Card>

          <StatsCard>
            <CardTitle>Gesamtausgaben</CardTitle>
            <CardContent>
              <div className="stat-value">€{stats.totalSpent.toFixed(2)}</div>
              <div className="stat-label">Über {stats.totalOrders} Bestellungen</div>
            </CardContent>
          </StatsCard>

          <Card>
            <CardTitle>Bestellstatistiken</CardTitle>
            <CardContent>
              <p><strong>Gesamtbestellungen:</strong> {stats.totalOrders}</p>
              <p><strong>Abgeschlossen:</strong> {stats.completedCount}</p>
              <p><strong>In Bearbeitung:</strong> {stats.processingCount}</p>
              <p><strong>Ausstehend:</strong> {stats.pendingCount}</p>
              {stats.averageOrder > 0 && (
                <p><strong>Durchschnitt:</strong> €{stats.averageOrder.toFixed(2)}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Schnellaktionen</CardTitle>
            <CardContent>
              <p style={{ marginBottom: '12px' }}>
                <a href="/shop" style={{ color: '#FF6B35', textDecoration: 'none' }}>
                  🛒 Neue Bestellung aufgeben
                </a>
              </p>
              <p style={{ marginBottom: '12px' }}>
                <a href="/contact" style={{ color: '#FF6B35', textDecoration: 'none' }}>
                  💬 Support kontaktieren
                </a>
              </p>
              <p>
                <a href="/faq" style={{ color: '#FF6B35', textDecoration: 'none' }}>
                  ❓ FAQ ansehen
                </a>
              </p>
            </CardContent>
          </Card>
        </Grid>

        <OrdersTable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <CardTitle style={{ margin: 0 }}>
              Ihre Bestellungen {refreshing && <span style={{ fontSize: '14px', color: '#6b7280' }}>(wird aktualisiert...)</span>}
            </CardTitle>
            <RefreshButton onClick={refreshOrders} disabled={refreshing}>
              <ButtonWithSpinner loading={refreshing} size="small">
                🔄 Aktualisieren
              </ButtonWithSpinner>
            </RefreshButton>
          </div>
          
          {orders.length === 0 ? (
            <EmptyState>
              <div className="icon">📦</div>
              <div className="title">Keine Bestellungen gefunden</div>
              <div className="description">Sie haben noch keine Bestellungen aufgegeben.</div>
              <a href="/shop" className="action">
                Jetzt bestellen →
              </a>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Bestellnummer</TableHeader>
                  <TableHeader>Datum</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Services</TableHeader>
                  <TableHeader>Zahlungsart</TableHeader>
                  <TableHeader>Gesamt</TableHeader>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusColor = getStatusColor(order.status)
                  return (
                    <ClickableRow key={order.id} onClick={() => openOrderDetails(order)}>
                      <TableCell>#{order.number}</TableCell>
                      <TableCell>{formatDate(order.date_created)}</TableCell>
                      <TableCell>
                        <StatusBadge $bg={statusColor.bg} $color={statusColor.text}>
                          {getStatusText(order.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {order.line_items.length > 0 ? (
                          <div>
                            {order.line_items.slice(0, 1).map((item, index) => (
                              <div key={index} style={{ fontSize: '13px', marginBottom: '2px' }}>
                                {item.name}
                              </div>
                            ))}
                            {order.line_items.length > 1 && (
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                +{order.line_items.length - 1} weitere
                              </div>
                            )}
                          </div>
                        ) : (
                          'Keine Services'
                        )}
                      </TableCell>
                      <TableCell style={{ fontSize: '13px' }}>
                        {getPaymentMethodDisplay(order.payment_method, order.payment_method_title)}
                      </TableCell>
                      <TableCell style={{ fontWeight: '600', color: '#FF6B35' }}>
                        €{parseFloat(order.total || '0').toFixed(2)}
                      </TableCell>
                    </ClickableRow>
                  )
                })}
              </tbody>
            </Table>
          )}
        </OrdersTable>

        {/* Order Details Modal */}
        <OrderDetailsModal show={showOrderDetails} onClick={closeOrderDetails}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {selectedOrder && (
              <>
                <ModalHeader>
                  <ModalTitle>Bestellung #{selectedOrder.number}</ModalTitle>
                  <CloseButton onClick={closeOrderDetails}>×</CloseButton>
                </ModalHeader>
                
                <OrderInfo>
                  <div className="info-item">
                    <div className="label">Bestelldatum</div>
                    <div className="value">{formatDate(selectedOrder.date_created)}</div>
                  </div>
                  <div className="info-item">
                    <div className="label">Status</div>
                    <div className="value">
                      <StatusBadge 
                        $bg={getStatusColor(selectedOrder.status).bg} 
                        $color={getStatusColor(selectedOrder.status).text}
                      >
                        {getStatusText(selectedOrder.status)}
                      </StatusBadge>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="label">Zahlungsart</div>
                    <div className="value">
                      {getPaymentMethodDisplay(selectedOrder.payment_method, selectedOrder.payment_method_title)}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="label">Letzte Änderung</div>
                    <div className="value">{formatDate(selectedOrder.date_modified)}</div>
                  </div>
                </OrderInfo>

                <OrderItems>
                  <OrderItemsTitle>Bestellte Services</OrderItemsTitle>
                  {selectedOrder.line_items.map((item) => (
                    <OrderItem key={item.id}>
                      <div className="item-info">
                        <div className="name">{item.name}</div>
                        <div className="quantity">Menge: {item.quantity}</div>
                      </div>
                      <div className="item-total">€{parseFloat(item.total || '0').toFixed(2)}</div>
                    </OrderItem>
                  ))}
                </OrderItems>

                <OrderTotal>
                  <div className="label">Gesamtsumme</div>
                  <div className="amount">€{parseFloat(selectedOrder.total || '0').toFixed(2)}</div>
                </OrderTotal>
              </>
            )}
          </ModalContent>
        </OrderDetailsModal>
      </Container>
    </Layout>
  )
}

export default DashboardPage