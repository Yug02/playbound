// backend/controllers/requestController.js
const Request = require('../models/Request');

// @desc    Send a play request
// @route   POST /api/requests
// @access  Private
const sendRequest = async (req, res) => {
    try {
        const { receiverId, game, proposedTime, message } = req.body;

        // Prevent users from sending requests to themselves
        if (receiverId === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }

        const request = await Request.create({
            sender: req.user._id, // Gotten safely from our auth middleware
            receiver: receiverId,
            game,
            proposedTime,
            message
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error while sending request' });
    }
};

// @desc    Get user's requests (both sent and received)
// @route   GET /api/requests
// @access  Private
const getUserRequests = async (req, res) => {
    try {
        // Find requests where the user is either the sender OR the receiver
        // .populate() pulls in the actual name and email instead of just showing the random ID string
        const requests = await Request.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .sort('-createdAt'); // Shows newest first

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error while fetching requests' });
    }
};

// @desc    Update request status (Accept/Decline)
// @route   PUT /api/requests/:id
// @access  Private
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const requestId = req.params.id;

        // 1. Make sure the status is valid
        if (status !== 'accepted' && status !== 'declined') {
            return res.status(400).json({ message: 'Status must be either accepted or declined' });
        }

        // 2. Find the request in the database
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // 3. Security Check: Only the RECEIVER can accept or decline the request
        if (request.receiver.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to respond to this request' });
        }

        // 4. Update the status and save
        request.status = status;
        await request.save();

        res.status(200).json({
            message: `Request ${status} successfully!`,
            request
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error while updating request' });
    }
};

module.exports = {
    sendRequest,
    getUserRequests,
    updateRequestStatus
};