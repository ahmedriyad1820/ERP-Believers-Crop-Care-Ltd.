import Asset from '../models/Asset.js'

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private/Admin
export const getAssets = async (req, res) => {
    try {
        const assets = await Asset.find({}).sort({ createdAt: -1 })
        res.json(assets)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Private/Admin
export const createAsset = async (req, res) => {
    try {
        const {
            name,
            category,
            purchaseDate,
            quantity,
            purchaseShop,
            value,
            paid,
            due,
            status,
            notes
        } = req.body

        const asset = new Asset({
            name,
            category,
            purchaseDate,
            quantity: quantity || 1,
            purchaseShop,
            value: value || 0,
            paid: paid || 0,
            due: due || 0,
            status: status || 'Active',
            notes
        })

        const createdAsset = await asset.save()
        res.status(201).json(createdAsset)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
// @access  Private/Admin
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id)

        if (asset) {
            await asset.deleteOne()
            res.json({ message: 'Asset removed' })
        } else {
            res.status(404).json({ message: 'Asset not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// @desc    Update an asset
// @route   PUT /api/assets/:id
// @access  Private/Admin
export const updateAsset = async (req, res) => {
    try {
        const {
            name,
            category,
            purchaseDate,
            quantity,
            purchaseShop,
            value,
            paid,
            status,
            notes
        } = req.body

        const asset = await Asset.findById(req.params.id)

        if (asset) {
            asset.name = name || asset.name
            asset.category = category || asset.category
            asset.purchaseDate = purchaseDate || asset.purchaseDate
            asset.quantity = quantity || asset.quantity
            asset.purchaseShop = purchaseShop || asset.purchaseShop
            asset.value = value || asset.value
            asset.paid = paid || asset.paid
            asset.due = (value || asset.value) - (paid || asset.paid)
            asset.status = status || asset.status
            asset.notes = notes || asset.notes

            const updatedAsset = await asset.save()
            res.json(updatedAsset)
        } else {
            res.status(404).json({ message: 'Asset not found' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
