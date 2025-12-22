import express from 'express'
import Order from '../models/Order.js'
import Dealer from '../models/Dealer.js'
import Product from '../models/Product.js'
import Employee from '../models/Employee.js'

const router = express.Router()

const clean = (value) => (typeof value === 'string' ? value.trim() : value || '')

// Generate order ID (ORD001, ORD002, etc.)
const generateOrderId = async () => {
  try {
    const lastOrder = await Order.findOne({ orderId: { $exists: true } })
      .sort({ orderId: -1 })
      .exec()

    let nextNumber = 1
    if (lastOrder && lastOrder.orderId) {
      const match = lastOrder.orderId.match(/ORD(\d+)/i)
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1
      }
    }

    return `ORD${String(nextNumber).padStart(3, '0')}`
  } catch (err) {
    console.error('Error generating order ID:', err)
    return `ORD${String(Date.now()).slice(-3)}`
  }
}

// Helper to build items and totals
const buildOrderItems = async (dealerId, rawItems = [], rawDiscountAmount = 0, rawDiscountEnabled = false) => {
  const dealerDoc = await Dealer.findById(dealerId)
  if (!dealerDoc) {
    throw new Error('Dealer not found')
  }

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { dealerDoc, items: [], total: 0, grandTotal: 0 }
  }

  const items = []
  let total = 0
  let grandTotal = 0
  const discountAmount = parseFloat(rawDiscountAmount) || 1
  const discountEnabled = !!rawDiscountEnabled

  for (const raw of rawItems) {
    if (!raw?.product || !raw?.quantity) {
      throw new Error('Product and quantity are required for each item')
    }

    const productDoc = await Product.findById(raw.product)
    if (!productDoc) {
      throw new Error('Product not found')
    }

    let unitPrice = productDoc.price || 0
    let variant = null
    if (raw.variant && raw.variant.productCode && productDoc.priceCategory === 'per_variant') {
      const selectedVariant = productDoc.variants?.find(
        v => v.productCode === raw.variant.productCode
      )
      if (selectedVariant) {
        unitPrice = selectedVariant.price || 0
        variant = {
          productCode: clean(selectedVariant.productCode),
          packSize: clean(selectedVariant.packSize || ''),
          packUnit: clean(selectedVariant.packUnit || 'ml'),
          cartoonSize: typeof selectedVariant.cartoonSize === 'number' ? selectedVariant.cartoonSize : (parseInt(selectedVariant.cartoonSize, 10) || 1),
          cartoonUnit: clean(selectedVariant.cartoonUnit || 'Pcs'),
          price: unitPrice
        }
      }
    } else if (raw.variant && raw.variant.productCode) {
      variant = {
        productCode: clean(raw.variant.productCode),
        packSize: clean(raw.variant.packSize || ''),
        packUnit: clean(raw.variant.packUnit || 'ml'),
        cartoonSize: typeof raw.variant.cartoonSize === 'number' ? raw.variant.cartoonSize : (parseInt(raw.variant.cartoonSize, 10) || 1),
        cartoonUnit: clean(raw.variant.cartoonUnit || 'Pcs'),
        price: unitPrice
      }
    }

    const qty = parseFloat(raw.quantity) || 1
    const itemTotal = unitPrice * qty
    const itemGrandTotal = discountEnabled && discountAmount > 0 ? Math.round(itemTotal * discountAmount) : itemTotal
    total += itemTotal
    grandTotal += itemGrandTotal

    items.push({
      product: productDoc._id,
      productName: productDoc.name || '',
      productId: productDoc.productId || '',
      variant: variant || undefined,
      quantity: qty,
      unitPrice,
      totalPrice: itemTotal,
      grandTotal: itemGrandTotal,
      notes: clean(raw.notes || ''),
      hasOffer: productDoc.hasOffer || false,
      buyQuantity: productDoc.buyQuantity || null,
      freeQuantity: productDoc.freeQuantity || null
    })
  }

  return { dealerDoc, items, total, grandTotal }
}

// Create order (supports multi-item cart)
router.post('/', async (req, res) => {
  try {
    const {
      dealer,
      product,
      variant,
      quantity,
      notes,
      status,
      requestedBy,
      requestedByName,
      requestedByRole,
      items: cartItems,
      paidAmount,
      discountAmount,
      discountEnabled
    } = req.body

    if (!dealer) {
      return res.status(400).json({ message: 'Dealer is required' })
    }

    const useCart = Array.isArray(cartItems) && cartItems.length > 0
    const requesterRoleNormalized = typeof requestedByRole === 'string' ? requestedByRole.toLowerCase() : ''
    const approvalStatus = requesterRoleNormalized && requesterRoleNormalized !== 'admin' ? 'Pending' : 'Approved'

    const orderId = await generateOrderId()

    if (useCart) {
      const { dealerDoc, items, total, grandTotal } = await buildOrderItems(dealer, cartItems, discountAmount, discountEnabled)
      if (!items.length) {
        return res.status(400).json({ message: 'Cart items are invalid' })
      }
      const first = items[0]
      const paid = parseFloat(paidAmount) || 0
      const due = Math.max(0, grandTotal - paid)
      const orderData = {
        orderId,
        dealer: dealerDoc._id,
        dealerName: dealerDoc.name || '',
        dealerId: dealerDoc.dealerId || '',
        product: first.product,
        productName: first.productName,
        productId: first.productId || '',
        variant: first.variant,
        quantity: first.quantity || 1,
        unitPrice: first.unitPrice || 0,
        totalPrice: total,
        grandTotal: grandTotal,
        discountAmount: parseFloat(discountAmount) || 0,
        discountEnabled: !!discountEnabled,
        paidAmount: paid,
        dueAmount: due,
        items,
        approvalStatus,
        requestedBy: requestedBy || null,
        requestedByName: requestedByName || '',
        requestedByRole: requestedByRole || '',
        status: approvalStatus === 'Pending' ? 'Pending' : (status || 'Processing'),
        notes: clean(notes || ''),
        hasOffer: first.hasOffer || false,
        buyQuantity: first.buyQuantity || null,
        freeQuantity: first.freeQuantity || null
      }

      const created = await Order.create(orderData)

      // If order is created by admin and approved, update assigned employee's achieved target
      if (requesterRoleNormalized === 'admin' && approvalStatus === 'Approved') {
        try {
          console.log(`[Admin Order Cart] Processing admin order for dealer ${dealerDoc?._id} (${dealerDoc?.name})`)
          console.log(`[Admin Order Cart] assignedTo value:`, dealerDoc?.assignedTo)
          console.log(`[Admin Order Cart] assignedTo type:`, typeof dealerDoc?.assignedTo)
          console.log(`[Admin Order Cart] assignedTo is null?:`, dealerDoc?.assignedTo === null)
          console.log(`[Admin Order Cart] assignedTo is undefined?:`, dealerDoc?.assignedTo === undefined)

          // Get the dealer to check assignment - handle both populated and unpopulated cases
          if (dealerDoc && dealerDoc.assignedTo !== null && dealerDoc.assignedTo !== undefined) {
            // Get assignedTo ID - handle both ObjectId and populated object
            let assignedToId = null
            if (dealerDoc.assignedTo && typeof dealerDoc.assignedTo === 'object') {
              if (dealerDoc.assignedTo._id) {
                assignedToId = dealerDoc.assignedTo._id.toString()
              } else if (dealerDoc.assignedTo.toString) {
                assignedToId = dealerDoc.assignedTo.toString()
              } else {
                assignedToId = String(dealerDoc.assignedTo)
              }
            } else {
              assignedToId = String(dealerDoc.assignedTo)
            }

            console.log(`[Admin Order Cart] Extracted assignedToId: ${assignedToId}`)
            console.log(`[Admin Order Cart] Looking up assigned employee with ID: ${assignedToId}`)
            const assignedEmployee = await Employee.findById(assignedToId)

            if (assignedEmployee) {
              // Get order total - use grandTotal which includes discount
              const orderTotal = grandTotal
              console.log(`[Admin Order Cart] Found assigned employee: ${assignedEmployee.employeeId} (${assignedEmployee.name}), order grandTotal: ${orderTotal}`)

              if (orderTotal > 0) {
                // Check if this order is already in sales history to avoid duplicates
                const existingSale = assignedEmployee.salesHistory?.find(
                  sale => sale.orderObjectId?.toString() === created._id.toString()
                )

                if (!existingSale) {
                  const previousAchieved = assignedEmployee.achievedTarget || 0
                  // Add order total to achieved target
                  assignedEmployee.achievedTarget = previousAchieved + orderTotal

                  // Add to sales history
                  assignedEmployee.salesHistory = assignedEmployee.salesHistory || []
                  assignedEmployee.salesHistory.push({
                    orderId: created.orderId || '',
                    orderObjectId: created._id,
                    dealerName: created.dealerName || '',
                    dealerId: created.dealerId || '',
                    totalAmount: orderTotal,
                    approvedAt: created.approvedAt || new Date(),
                    approvedBy: requestedBy || null,
                    approvedByName: requestedByName || ''
                  })

                  await assignedEmployee.save()
                  console.log(`[Admin Order Cart] ✅ Updated assigned employee ${assignedEmployee.employeeId} (${assignedEmployee.name}) achieved target: ${previousAchieved} -> ${assignedEmployee.achievedTarget} (+${orderTotal})`)
                } else {
                  console.log(`[Admin Order Cart] ⚠️ Order ${created.orderId} already in sales history for assigned employee ${assignedEmployee.employeeId}`)
                }
              } else {
                console.log(`[Admin Order Cart] ⚠️ Order total is 0, skipping employee update for order ${created.orderId}`)
              }
            } else {
              console.log(`[Admin Order Cart] ❌ Assigned employee not found with ID: ${assignedToId}`)
            }
          } else {
            console.log(`[Admin Order Cart] ⚠️ Dealer ${dealerDoc?._id} (${dealerDoc?.name}) has no assigned employee (assignedTo: ${dealerDoc?.assignedTo})`)
          }
        } catch (empErr) {
          console.error('[Admin Order Cart] ❌ Failed to update assigned employee achieved target:', empErr)
          console.error('[Admin Order Cart] Error details:', empErr.message, empErr.stack)
          // Don't fail the order creation if employee update fails
        }
      } else {
        console.log(`[Admin Order Cart] Skipping employee update - requesterRole: ${requesterRoleNormalized}, approvalStatus: ${approvalStatus}`)
      }

      const populated = await Order.findById(created._id)
        .populate('dealer', 'name phone email dealerId')
        .populate('product', 'name productId')
        .lean()

      return res.json({ success: true, data: populated })
    }

    // Single-item order fallback
    if (!product || !quantity) {
      return res.status(400).json({
        message: 'Dealer, product, and quantity are required'
      })
    }

    const dealerDoc = await Dealer.findById(dealer)
    if (!dealerDoc) {
      return res.status(404).json({ message: 'Dealer not found' })
    }

    const productDoc = await Product.findById(product)
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' })
    }

    let unitPrice = productDoc.price || 0
    if (variant && variant.productCode && productDoc.priceCategory === 'per_variant') {
      const selectedVariant = productDoc.variants?.find(
        v => v.productCode === variant.productCode
      )
      if (selectedVariant) {
        unitPrice = selectedVariant.price || 0
      }
    }

    const qty = parseFloat(quantity) || 1
    const totalPrice = unitPrice * qty
    const grandTotal = discountEnabled && discountAmount > 0 ? Math.round(totalPrice * parseFloat(discountAmount)) : totalPrice
    const paid = parseFloat(paidAmount) || 0
    const due = Math.max(0, grandTotal - paid)

    const orderData = {
      orderId,
      dealer: dealer,
      dealerName: dealerDoc.name || '',
      dealerId: dealerDoc.dealerId || '',
      product: product,
      productName: productDoc.name || '',
      productId: productDoc.productId || '',
      approvalStatus,
      requestedBy: requestedBy || null,
      requestedByName: requestedByName || '',
      requestedByRole: requestedByRole || '',
      variant: variant && variant.productCode ? {
        productCode: clean(variant.productCode),
        packSize: clean(variant.packSize || ''),
        packUnit: clean(variant.packUnit || 'ml'),
        cartoonSize: typeof variant.cartoonSize === 'number' ? variant.cartoonSize : (parseInt(variant.cartoonSize, 10) || 1),
        cartoonUnit: clean(variant.cartoonUnit || 'Pcs'),
        price: unitPrice
      } : undefined,
      quantity: qty,
      unitPrice,
      totalPrice,
      grandTotal,
      discountAmount: parseFloat(discountAmount) || 0,
      discountEnabled: !!discountEnabled,
      paidAmount: paid,
      dueAmount: due,
      status: approvalStatus === 'Pending' ? 'Pending' : (status || 'Processing'),
      notes: clean(notes || ''),
      hasOffer: productDoc.hasOffer || false,
      buyQuantity: productDoc.buyQuantity || null,
      freeQuantity: productDoc.freeQuantity || null
    }

    const created = await Order.create(orderData)

    // If order is created by admin and approved, update assigned employee's achieved target
    if (requesterRoleNormalized === 'admin' && approvalStatus === 'Approved') {
      try {
        console.log(`[Admin Order] Processing admin order for dealer ${dealer}`)

        // Get the dealer to check assignment - handle both populated and unpopulated cases
        const dealerDoc = await Dealer.findById(dealer)
        console.log(`[Admin Order] Dealer found: ${dealerDoc?._id} (${dealerDoc?.name})`)
        console.log(`[Admin Order] assignedTo value:`, dealerDoc?.assignedTo)
        console.log(`[Admin Order] assignedTo type:`, typeof dealerDoc?.assignedTo)
        console.log(`[Admin Order] assignedTo is null?:`, dealerDoc?.assignedTo === null)
        console.log(`[Admin Order] assignedTo is undefined?:`, dealerDoc?.assignedTo === undefined)

        if (dealerDoc && dealerDoc.assignedTo !== null && dealerDoc.assignedTo !== undefined) {
          // Get assignedTo ID - handle both ObjectId and populated object
          let assignedToId = null
          if (dealerDoc.assignedTo && typeof dealerDoc.assignedTo === 'object') {
            if (dealerDoc.assignedTo._id) {
              assignedToId = dealerDoc.assignedTo._id.toString()
            } else if (dealerDoc.assignedTo.toString) {
              assignedToId = dealerDoc.assignedTo.toString()
            } else {
              assignedToId = String(dealerDoc.assignedTo)
            }
          } else {
            assignedToId = String(dealerDoc.assignedTo)
          }

          console.log(`[Admin Order] Extracted assignedToId: ${assignedToId}`)
          console.log(`[Admin Order] Looking up assigned employee with ID: ${assignedToId}`)
          const assignedEmployee = await Employee.findById(assignedToId)

          if (assignedEmployee) {
            // Get order total - for single-item orders, use totalPrice
            const orderTotal = parseFloat(created.totalPrice) || 0

            console.log(`[Admin Order] Found assigned employee: ${assignedEmployee.employeeId} (${assignedEmployee.name}), order total: ${orderTotal}`)

            if (orderTotal > 0) {
              // Check if this order is already in sales history to avoid duplicates
              const existingSale = assignedEmployee.salesHistory?.find(
                sale => sale.orderObjectId?.toString() === created._id.toString()
              )

              if (!existingSale) {
                const previousAchieved = assignedEmployee.achievedTarget || 0
                // Add order total to achieved target
                assignedEmployee.achievedTarget = previousAchieved + orderTotal

                // Add to sales history
                assignedEmployee.salesHistory = assignedEmployee.salesHistory || []
                assignedEmployee.salesHistory.push({
                  orderId: created.orderId || '',
                  orderObjectId: created._id,
                  dealerName: created.dealerName || '',
                  dealerId: created.dealerId || '',
                  totalAmount: orderTotal,
                  approvedAt: created.approvedAt || new Date(),
                  approvedBy: requestedBy || null,
                  approvedByName: requestedByName || ''
                })

                await assignedEmployee.save()
                console.log(`[Admin Order] ✅ Updated assigned employee ${assignedEmployee.employeeId} (${assignedEmployee.name}) achieved target: ${previousAchieved} -> ${assignedEmployee.achievedTarget} (+${orderTotal})`)
              } else {
                console.log(`[Admin Order] ⚠️ Order ${created.orderId} already in sales history for assigned employee ${assignedEmployee.employeeId}`)
              }
            } else {
              console.log(`[Admin Order] ⚠️ Order total is 0, skipping employee update for order ${created.orderId}`)
            }
          } else {
            console.log(`[Admin Order] ❌ Assigned employee not found with ID: ${assignedToId}`)
          }
        } else {
          console.log(`[Admin Order] ⚠️ Dealer ${dealer} (${dealerDoc?.name}) has no assigned employee (assignedTo: ${dealerDoc?.assignedTo})`)
        }
      } catch (empErr) {
        console.error('[Admin Order] ❌ Failed to update assigned employee achieved target:', empErr)
        console.error('[Admin Order] Error details:', empErr.message, empErr.stack)
        // Don't fail the order creation if employee update fails
      }
    } else {
      console.log(`[Admin Order] Skipping employee update - requesterRole: ${requesterRoleNormalized}, approvalStatus: ${approvalStatus}`)
    }

    // Populate dealer and product for response
    const populated = await Order.findById(created._id)
      .populate('dealer', 'name phone email dealerId')
      .populate('product', 'name productId')
      .lean()

    res.json({ success: true, data: populated })
  } catch (err) {
    console.error('[Order] Create error:', err)
    console.error('[Order] Create payload:', {
      dealer: req.body?.dealer,
      product: req.body?.product,
      variant: req.body?.variant,
      quantity: req.body?.quantity,
      requestedBy: req.body?.requestedBy,
      requestedByRole: req.body?.requestedByRole,
      items: req.body?.items
    })
    res.status(500).json({
      message: 'Failed to create order',
      error: err.message
    })
  }
})

// List orders (supports ?approvalStatus=Pending/Approved/Rejected)
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.approvalStatus) {
      filter.approvalStatus = req.query.approvalStatus
    }
    const orders = await Order.find(filter)
      .populate('dealer', 'name phone email dealerId')
      .populate('product', 'name productId')
      .sort({ createdAt: -1 })
      .lean()

    res.json({ success: true, data: orders })
  } catch (err) {
    console.error('[Order] List error:', err)
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('dealer', 'name phone email dealerId')
      .populate('product', 'name productId variants priceCategory price')
      .lean()

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ success: true, data: order })
  } catch (err) {
    console.error('[Order] Get error:', err)
    res.status(500).json({ message: 'Failed to fetch order' })
  }
})

// Update order
router.put('/:id', async (req, res) => {
  try {
    const {
      dealer,
      product,
      variant,
      quantity,
      notes,
      status,
      approvalStatus,
      requestedBy,
      requestedByName,
      requestedByRole,
      paidAmount,
      commission,
      newPayment,
      discountAmount,
      discountEnabled
    } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Update fields if provided
    if (dealer) {
      const dealerDoc = await Dealer.findById(dealer)
      if (!dealerDoc) {
        return res.status(404).json({ message: 'Dealer not found' })
      }
      order.dealer = dealer
      order.dealerName = dealerDoc.name || ''
      order.dealerId = dealerDoc.dealerId || ''
    }

    if (product) {
      const productDoc = await Product.findById(product)
      if (!productDoc) {
        return res.status(404).json({ message: 'Product not found' })
      }
      order.product = product
      order.productName = productDoc.name || ''
      order.productId = productDoc.productId || ''

      // Recalculate price if product or variant changed
      let unitPrice = productDoc.price || 0
      if (variant && variant.productCode && productDoc.priceCategory === 'per_variant') {
        const selectedVariant = productDoc.variants?.find(
          v => v.productCode === variant.productCode
        )
        if (selectedVariant) {
          unitPrice = selectedVariant.price || 0
        }
      }
      order.unitPrice = unitPrice
      if (variant && variant.productCode) {
        order.variant = {
          productCode: clean(variant.productCode),
          packSize: clean(variant.packSize || ''),
          packUnit: clean(variant.packUnit || 'ml'),
          cartoonSize: typeof variant.cartoonSize === 'number' ? variant.cartoonSize : (parseInt(variant.cartoonSize, 10) || 1),
          cartoonUnit: clean(variant.cartoonUnit || 'Pcs'),
          price: unitPrice
        }
      }
    }

    if (req.body.items && Array.isArray(req.body.items) && req.body.items.length > 0) {
      const { dealerDoc, items, total, grandTotal } = await buildOrderItems(order.dealer, req.body.items, discountAmount !== undefined ? discountAmount : order.discountAmount, discountEnabled !== undefined ? discountEnabled : order.discountEnabled)
      if (!items.length) {
        return res.status(400).json({ message: 'Cart items are invalid' })
      }
      const first = items[0]
      order.items = items
      order.product = first.product
      order.productName = first.productName
      order.productId = first.productId || ''
      order.variant = first.variant
      order.quantity = first.quantity || 1
      order.unitPrice = first.unitPrice || 0
      order.totalPrice = total
      order.grandTotal = grandTotal
      order.dealerName = dealerDoc.name || order.dealerName
      order.dealerId = dealerDoc.dealerId || order.dealerId || ''
      // Update discount settings if provided
      if (discountAmount !== undefined) order.discountAmount = parseFloat(discountAmount) || 0
      if (discountEnabled !== undefined) order.discountEnabled = !!discountEnabled
    } else {
      // If items not provided, we might still be updating discount settings
      if (discountAmount !== undefined) order.discountAmount = parseFloat(discountAmount) || 0
      if (discountEnabled !== undefined) order.discountEnabled = !!discountEnabled

      // Recalculate grandTotal based on existing totalPrice
      order.grandTotal = order.discountEnabled && order.discountAmount > 0
        ? Math.round(order.totalPrice * order.discountAmount)
        : order.totalPrice
    }

    // Update paidAmount and recalculate dueAmount
    if (paidAmount !== undefined) {
      order.paidAmount = parseFloat(paidAmount) || 0
    }

    // Calculate total commission from existing history and new payment
    const existingCommission = (order.paymentHistory || []).reduce((sum, p) => sum + (parseFloat(p.commission) || 0), 0)
    const newCommValue = newPayment ? (parseFloat(newPayment.commission) || 0) : 0
    const totalComm = existingCommission + newCommValue

    // Recalculate dueAmount based on current grandTotal, paidAmount AND total commission
    order.dueAmount = Math.max(0, order.grandTotal - ((order.paidAmount || 0) + totalComm))

    if (commission !== undefined) {
      order.commission = commission
    }

    if (newPayment) {
      console.log('[Order Update] Processing new payment:', newPayment)
      order.paymentHistory = order.paymentHistory || []
      order.paymentHistory.push({
        date: newPayment.date || new Date(),
        amount: parseFloat(newPayment.amount) || 0,
        commission: parseFloat(newPayment.commission) || 0,
        due: order.dueAmount
      })
      console.log('[Order Update] Updated payment history length:', order.paymentHistory.length)
    }

    if (notes !== undefined) {
      order.notes = clean(notes)
    }

    // Track previous approval status and status to detect changes
    const previousApprovalStatus = order.approvalStatus
    const previousStatus = order.status
    const wasApproved = previousApprovalStatus === 'Approved'
    const wasCancelled = previousStatus === 'Cancelled'

    if (approvalStatus) {
      order.approvalStatus = approvalStatus
      if (approvalStatus === 'Approved') {
        // If status is provided, use it; otherwise set to Processing for newly approved orders
        if (status) {
          order.status = status
        } else if (!wasApproved) {
          // Newly approved order - set to Processing
          order.status = 'Processing'
        } else {
          // Already approved, keep existing status
          order.status = order.status || 'Processing'
        }
        order.approvedAt = new Date()
        if (req.body.approvedBy) order.approvedBy = req.body.approvedBy
      } else if (approvalStatus === 'Rejected') {
        order.status = 'Cancelled'
        order.approvedAt = new Date()
      } else {
        order.status = 'Pending'
      }
    } else if (status) {
      order.status = status
    }

    if (requestedBy !== undefined) order.requestedBy = requestedBy
    if (requestedByName !== undefined) order.requestedByName = requestedByName
    if (requestedByRole !== undefined) order.requestedByRole = requestedByRole

    await order.save()

    // Update employee's achieved target AFTER order is saved
    if (approvalStatus === 'Approved' && !wasApproved) {
      console.log('[Order Approval] Processing approval:', {
        orderId: order.orderId,
        requestedBy: order.requestedBy,
        requestedByRole: order.requestedByRole,
        totalPrice: order.totalPrice,
        hasItems: !!(order.items && order.items.length)
      })

      // Case 1: Order created by employee (non-admin)
      if (order.requestedBy && order.requestedByRole && order.requestedByRole.toLowerCase() !== 'admin') {
        try {
          const employee = await Employee.findById(order.requestedBy)
          if (employee) {
            // Get order total - use items array total if available, otherwise use totalPrice
            let orderTotal = 0
            if (order.grandTotal !== undefined) {
              orderTotal = parseFloat(order.grandTotal) || 0
              console.log('[Order Approval] Using order grandTotal:', orderTotal)
            } else if (order.items && Array.isArray(order.items) && order.items.length > 0) {
              const baseTotal = order.items.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0)
              const discount = order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1
              orderTotal = baseTotal * discount
              console.log('[Order Approval] Calculated grand total from items and discount:', orderTotal)
            } else {
              const baseTotal = parseFloat(order.totalPrice) || 0
              const discount = order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1
              orderTotal = baseTotal * discount
              console.log('[Order Approval] Using order totalPrice and discount:', orderTotal)
            }

            if (orderTotal > 0) {
              // Check if this order is already in sales history to avoid duplicates
              const existingSale = employee.salesHistory?.find(
                sale => sale.orderObjectId?.toString() === order._id.toString()
              )

              if (!existingSale) {
                const previousAchieved = employee.achievedTarget || 0
                // Add order total to achieved target
                employee.achievedTarget = previousAchieved + orderTotal

                // Add to sales history
                employee.salesHistory = employee.salesHistory || []
                employee.salesHistory.push({
                  orderId: order.orderId || '',
                  orderObjectId: order._id,
                  dealerName: order.dealerName || '',
                  dealerId: order.dealerId || '',
                  totalAmount: orderTotal,
                  approvedAt: order.approvedAt || new Date(),
                  approvedBy: req.body.approvedBy || null,
                  approvedByName: req.body.approvedByName || ''
                })

                await employee.save()
                console.log(`[Order Approval] Updated employee ${employee.employeeId} (${employee.name}) achieved target: ${previousAchieved} -> ${employee.achievedTarget} (+${orderTotal})`)
              } else {
                console.log(`[Order Approval] Order ${order.orderId} already in sales history for employee ${employee.employeeId}`)
              }
            } else {
              console.log(`[Order Approval] Order total is 0, skipping employee update for order ${order.orderId}`)
            }
          } else {
            console.log(`[Order Approval] Employee not found with ID: ${order.requestedBy}`)
          }
        } catch (empErr) {
          console.error('[Order Approval] Failed to update employee achieved target:', empErr)
          console.error('[Order Approval] Error details:', empErr.message, empErr.stack)
          // Don't fail the order update if employee update fails
        }
      }
      // Case 2: Order created by admin - update assigned employee's achieved target
      else if (order.requestedByRole && order.requestedByRole.toLowerCase() === 'admin') {
        try {
          // Get the dealer to check assignment - handle both populated and unpopulated cases
          const dealerDoc = await Dealer.findById(order.dealer)
          if (dealerDoc && dealerDoc.assignedTo) {
            // Get assignedTo ID - handle both ObjectId and populated object
            const assignedToId = dealerDoc.assignedTo._id || dealerDoc.assignedTo
            const assignedEmployee = await Employee.findById(assignedToId)
            if (assignedEmployee) {
              // Get order total
              let orderTotal = 0
              orderTotal = parseFloat(order.grandTotal || 0) || (parseFloat(order.totalPrice || 0) * (order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1))

              if (orderTotal > 0) {
                // Check if this order is already in sales history to avoid duplicates
                const existingSale = assignedEmployee.salesHistory?.find(
                  sale => sale.orderObjectId?.toString() === order._id.toString()
                )

                if (!existingSale) {
                  const previousAchieved = assignedEmployee.achievedTarget || 0
                  // Add order total to achieved target
                  assignedEmployee.achievedTarget = previousAchieved + orderTotal

                  // Add to sales history
                  assignedEmployee.salesHistory = assignedEmployee.salesHistory || []
                  assignedEmployee.salesHistory.push({
                    orderId: order.orderId || '',
                    orderObjectId: order._id,
                    dealerName: order.dealerName || '',
                    dealerId: order.dealerId || '',
                    totalAmount: orderTotal,
                    approvedAt: order.approvedAt || new Date(),
                    approvedBy: req.body.approvedBy || order.requestedBy || null,
                    approvedByName: req.body.approvedByName || order.requestedByName || ''
                  })

                  await assignedEmployee.save()
                  console.log(`[Admin Order Approval] Updated assigned employee ${assignedEmployee.employeeId} (${assignedEmployee.name}) achieved target: ${previousAchieved} -> ${assignedEmployee.achievedTarget} (+${orderTotal})`)
                } else {
                  console.log(`[Admin Order Approval] Order ${order.orderId} already in sales history for assigned employee ${assignedEmployee.employeeId}`)
                }
              } else {
                console.log(`[Admin Order Approval] Order total is 0, skipping employee update for order ${order.orderId}`)
              }
            } else {
              console.log(`[Admin Order Approval] Assigned employee not found with ID: ${assignedToId}`)
            }
          } else {
            console.log(`[Admin Order Approval] Dealer ${order.dealer} has no assigned employee`)
          }
        } catch (empErr) {
          console.error('[Admin Order Approval] Failed to update assigned employee achieved target:', empErr)
          console.error('[Admin Order Approval] Error details:', empErr.message, empErr.stack)
          // Don't fail the order update if employee update fails
        }
      } else {
        console.log('[Order Approval] Skipping employee update - missing requestedBy info')
      }
    } else if (approvalStatus === 'Rejected' && wasApproved) {
      // Handle rejection - remove from employee's achieved target (both employee-created and admin-created orders)
      const isEmployeeOrder = order.requestedBy && order.requestedByRole && order.requestedByRole.toLowerCase() !== 'admin'
      const isAdminOrder = order.requestedByRole && order.requestedByRole.toLowerCase() === 'admin'

      if (isEmployeeOrder && order.requestedBy) {
        // If order is being rejected and was previously approved, remove from employee's achieved target
        try {
          const employee = await Employee.findById(order.requestedBy)
          if (employee) {
            // Get order total
            let orderTotal = 0
            if (order.grandTotal !== undefined) {
              orderTotal = parseFloat(order.grandTotal) || 0
            } else if (order.items && Array.isArray(order.items) && order.items.length > 0) {
              const baseTotal = order.items.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0)
              const discount = order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1
              orderTotal = baseTotal * discount
            } else {
              const baseTotal = parseFloat(order.totalPrice) || 0
              const discount = order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1
              orderTotal = baseTotal * discount
            }

            if (orderTotal > 0) {
              employee.achievedTarget = Math.max(0, (employee.achievedTarget || 0) - orderTotal)

              // Remove from sales history
              if (employee.salesHistory && Array.isArray(employee.salesHistory)) {
                employee.salesHistory = employee.salesHistory.filter(
                  sale => sale.orderObjectId?.toString() !== order._id.toString()
                )
              }

              await employee.save()
              console.log(`[Order Rejection] Removed ${orderTotal} from employee ${employee.employeeId} achieved target`)
            }
          }
        } catch (empErr) {
          console.error('[Order Rejection] Failed to update employee achieved target:', empErr)
        }
      } else if (isAdminOrder) {
        // Handle rejection of admin-created order - remove from assigned employee's achieved target
        try {
          const dealerDoc = await Dealer.findById(order.dealer)
          if (dealerDoc && dealerDoc.assignedTo) {
            // Get assignedTo ID - handle both ObjectId and populated object
            const assignedToId = dealerDoc.assignedTo._id || dealerDoc.assignedTo
            const assignedEmployee = await Employee.findById(assignedToId)
            if (assignedEmployee) {
              // Get order total
              let orderTotal = 0
              if (order.grandTotal !== undefined) {
                orderTotal = parseFloat(order.grandTotal) || 0
              } else if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                const baseTotal = order.items.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0)
                const discount = order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1
                orderTotal = baseTotal * discount
              } else {
                const baseTotal = parseFloat(order.totalPrice) || 0
                const discount = order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1
                orderTotal = baseTotal * discount
              }

              if (orderTotal > 0) {
                assignedEmployee.achievedTarget = Math.max(0, (assignedEmployee.achievedTarget || 0) - orderTotal)

                // Remove from sales history
                if (assignedEmployee.salesHistory && Array.isArray(assignedEmployee.salesHistory)) {
                  assignedEmployee.salesHistory = assignedEmployee.salesHistory.filter(
                    sale => sale.orderObjectId?.toString() !== order._id.toString()
                  )
                }

                await assignedEmployee.save()
                console.log(`[Admin Order Rejection] Removed ${orderTotal} from assigned employee ${assignedEmployee.employeeId} achieved target`)
              }
            } else {
              console.log(`[Admin Order Rejection] Assigned employee not found with ID: ${assignedToId}`)
            }
          } else {
            console.log(`[Admin Order Rejection] Dealer ${order.dealer} has no assigned employee`)
          }
        } catch (empErr) {
          console.error('[Admin Order Rejection] Failed to update assigned employee achieved target:', empErr)
          console.error('[Admin Order Rejection] Error details:', empErr.message, empErr.stack)
        }
      }
    }

    // Handle cancellation - if status is changed to 'Cancelled' and order was approved, reduce from employee's achieved target
    if (order.status === 'Cancelled' && !wasCancelled && wasApproved) {
      console.log('[Order Cancellation] Processing cancellation:', {
        orderId: order.orderId,
        requestedBy: order.requestedBy,
        requestedByRole: order.requestedByRole,
        totalPrice: order.totalPrice
      })

      const isEmployeeOrder = order.requestedBy && order.requestedByRole && order.requestedByRole.toLowerCase() !== 'admin'
      const isAdminOrder = order.requestedByRole && order.requestedByRole.toLowerCase() === 'admin'

      if (isEmployeeOrder && order.requestedBy) {
        // Remove from employee's achieved target
        try {
          const employee = await Employee.findById(order.requestedBy)
          if (employee) {
            // Get order total
            let orderTotal = 0
            orderTotal = parseFloat(order.grandTotal || 0) || (parseFloat(order.totalPrice || 0) * (order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1))

            if (orderTotal > 0) {
              employee.achievedTarget = Math.max(0, (employee.achievedTarget || 0) - orderTotal)

              // Remove from sales history
              if (employee.salesHistory && Array.isArray(employee.salesHistory)) {
                const orderIdStr = String(order._id)
                employee.salesHistory = employee.salesHistory.filter(sale => {
                  if (!sale || !sale.orderObjectId) return true
                  const saleOrderId = sale.orderObjectId._id ? String(sale.orderObjectId._id) : String(sale.orderObjectId)
                  return saleOrderId !== orderIdStr
                })
                console.log(`[Order Cancellation] Removed order ${order.orderId} from employee ${employee.employeeId} sales history`)
              }

              await employee.save()
              console.log(`[Order Cancellation] Removed ${orderTotal} from employee ${employee.employeeId} achieved target`)
            }
          }
        } catch (empErr) {
          console.error('[Order Cancellation] Failed to update employee achieved target:', empErr)
        }
      } else if (isAdminOrder) {
        // Remove from assigned employee's achieved target
        try {
          const dealerDoc = await Dealer.findById(order.dealer)
          if (dealerDoc && dealerDoc.assignedTo !== null && dealerDoc.assignedTo !== undefined) {
            // Get assignedTo ID - handle both ObjectId and populated object
            let assignedToId = null
            if (dealerDoc.assignedTo && typeof dealerDoc.assignedTo === 'object') {
              if (dealerDoc.assignedTo._id) {
                assignedToId = dealerDoc.assignedTo._id.toString()
              } else if (dealerDoc.assignedTo.toString) {
                assignedToId = dealerDoc.assignedTo.toString()
              } else {
                assignedToId = String(dealerDoc.assignedTo)
              }
            } else {
              assignedToId = String(dealerDoc.assignedTo)
            }

            const assignedEmployee = await Employee.findById(assignedToId)
            if (assignedEmployee) {
              // Get order total
              let orderTotal = 0
              orderTotal = parseFloat(order.grandTotal || 0) || (parseFloat(order.totalPrice || 0) * (order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1))

              if (orderTotal > 0) {
                assignedEmployee.achievedTarget = Math.max(0, (assignedEmployee.achievedTarget || 0) - orderTotal)

                // Remove from sales history
                if (assignedEmployee.salesHistory && Array.isArray(assignedEmployee.salesHistory)) {
                  const orderIdStr = String(order._id)
                  assignedEmployee.salesHistory = assignedEmployee.salesHistory.filter(sale => {
                    if (!sale || !sale.orderObjectId) return true
                    const saleOrderId = sale.orderObjectId._id ? String(sale.orderObjectId._id) : String(sale.orderObjectId)
                    return saleOrderId !== orderIdStr
                  })
                  console.log(`[Order Cancellation] Removed order ${order.orderId} from assigned employee ${assignedEmployee.employeeId} sales history`)
                }

                await assignedEmployee.save()
                console.log(`[Order Cancellation] Removed ${orderTotal} from assigned employee ${assignedEmployee.employeeId} achieved target`)
              }
            } else {
              console.log(`[Order Cancellation] Assigned employee not found with ID: ${assignedToId}`)
            }
          } else {
            console.log(`[Order Cancellation] Dealer ${order.dealer} has no assigned employee`)
          }
        } catch (empErr) {
          console.error('[Order Cancellation] Failed to update assigned employee achieved target:', empErr)
          console.error('[Order Cancellation] Error details:', empErr.message, empErr.stack)
        }
      }
    }

    const updated = await Order.findById(order._id)
      .populate('dealer', 'name phone email')
      .populate('product', 'name productId')
      .lean()

    res.json({ success: true, data: updated })
  } catch (err) {
    console.error('[Order Update] Error:', err)
    res.status(500).json({
      message: 'Failed to update order',
      error: err.message
    })
  }
})

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Before deleting, remove from employee's sales history and adjust achieved target
    const isEmployeeOrder = order.requestedBy && order.requestedByRole && order.requestedByRole.toLowerCase() !== 'admin'
    const isAdminOrder = order.requestedByRole && order.requestedByRole.toLowerCase() === 'admin'

    if (isEmployeeOrder && order.requestedBy) {
      // Remove from employee's achieved target
      try {
        const employee = await Employee.findById(order.requestedBy)
        if (employee) {
          // Get order total
          let orderTotal = 0
          orderTotal = parseFloat(order.grandTotal || 0) || (parseFloat(order.totalPrice || 0) * (order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1))

          if (orderTotal > 0) {
            employee.achievedTarget = Math.max(0, (employee.achievedTarget || 0) - orderTotal)

            // Remove from sales history
            if (employee.salesHistory && Array.isArray(employee.salesHistory)) {
              const orderIdStr = String(order._id)
              employee.salesHistory = employee.salesHistory.filter(sale => {
                if (!sale || !sale.orderObjectId) return true // Keep entries without orderObjectId
                const saleOrderId = sale.orderObjectId._id ? String(sale.orderObjectId._id) : String(sale.orderObjectId)
                return saleOrderId !== orderIdStr
              })
              console.log(`[Order Delete] Removed order ${order.orderId} from employee ${employee.employeeId} sales history`)
            }

            await employee.save()
            console.log(`[Order Delete] Removed ${orderTotal} from employee ${employee.employeeId} achieved target`)
          }
        }
      } catch (empErr) {
        console.error('[Order Delete] Failed to update employee achieved target:', empErr)
      }
    } else if (isAdminOrder) {
      // Remove from assigned employee's achieved target
      try {
        const dealerDoc = await Dealer.findById(order.dealer)
        if (dealerDoc && dealerDoc.assignedTo !== null && dealerDoc.assignedTo !== undefined) {
          // Get assignedTo ID - handle both ObjectId and populated object
          let assignedToId = null
          if (dealerDoc.assignedTo && typeof dealerDoc.assignedTo === 'object') {
            if (dealerDoc.assignedTo._id) {
              assignedToId = dealerDoc.assignedTo._id.toString()
            } else if (dealerDoc.assignedTo.toString) {
              assignedToId = dealerDoc.assignedTo.toString()
            } else {
              assignedToId = String(dealerDoc.assignedTo)
            }
          } else {
            assignedToId = String(dealerDoc.assignedTo)
          }

          const assignedEmployee = await Employee.findById(assignedToId)
          if (assignedEmployee) {
            // Get order total
            let orderTotal = 0
            orderTotal = parseFloat(order.grandTotal || 0) || (parseFloat(order.totalPrice || 0) * (order.discountEnabled && order.discountAmount > 0 ? order.discountAmount : 1))

            if (orderTotal > 0) {
              assignedEmployee.achievedTarget = Math.max(0, (assignedEmployee.achievedTarget || 0) - orderTotal)

              // Remove from sales history
              if (assignedEmployee.salesHistory && Array.isArray(assignedEmployee.salesHistory)) {
                const orderIdStr = String(order._id)
                assignedEmployee.salesHistory = assignedEmployee.salesHistory.filter(sale => {
                  if (!sale || !sale.orderObjectId) return true // Keep entries without orderObjectId
                  const saleOrderId = sale.orderObjectId._id ? String(sale.orderObjectId._id) : String(sale.orderObjectId)
                  return saleOrderId !== orderIdStr
                })
                console.log(`[Order Delete] Removed order ${order.orderId} from assigned employee ${assignedEmployee.employeeId} sales history`)
              }

              await assignedEmployee.save()
              console.log(`[Order Delete] Removed ${orderTotal} from assigned employee ${assignedEmployee.employeeId} achieved target`)
            }
          }
        }
      } catch (empErr) {
        console.error('[Order Delete] Failed to update assigned employee achieved target:', empErr)
      }
    }

    // Now delete the order
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Order deleted' })
  } catch (err) {
    console.error('[Order] Delete error:', err)
    res.status(500).json({ message: 'Failed to delete order' })
  }
})

export default router
