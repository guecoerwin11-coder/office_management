const express = require('express')
const annouceRouter = express.Router()
const { createAnnouncement, getAnnoucement, deleteAnnouce } = require('../controllers/annouceController')
const protect = require('../middleware/protect')
const isAuthorized = require('../middleware/isAuthorized')

// any authenticated user can read announcements
annouceRouter.get('/announcements', protect, getAnnoucement)

annouceRouter.post('/announcements', protect, isAuthorized(['admin', 'manager']), createAnnouncement)

annouceRouter.delete('/announcements/:id', protect, isAuthorized(['admin']), deleteAnnouce)

module.exports = annouceRouter
