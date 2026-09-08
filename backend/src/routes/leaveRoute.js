const express = require('express')
const leaveRouter = express.Router()
const {
    requestLeave, getRequestLeave, approveLeave,
    deleteLeave
} = require('../controllers/leaveController');
const isAuthorize = require('../middleware/isAuthorized')
const protect = require('../middleware/protect');


leaveRouter.post('/leaves', protect, requestLeave)

leaveRouter.get('/leaves', protect, getRequestLeave);

leaveRouter.put('/leaves/:id',protect, isAuthorize(['admin', 'manager']),  approveLeave)

leaveRouter.delete('/leaves/:id', protect, isAuthorize(['admin', 'manager']), deleteLeave )

module.exports = leaveRouter