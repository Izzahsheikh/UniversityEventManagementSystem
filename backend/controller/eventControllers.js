const eventModel = require('../models/eventModels.js');

const createEvent = async (req, res) => {
    try {
        const { title, date, category, venue, description } = req.body;
        if (!title || !date || !category || !venue || !description) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }
        await eventModel.createEvent(req.body, req.user.email);
        res.status(201).json({ message: 'Event submitted for approval successfully!' });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error during event creation' });
    }
};

const getEvents = async (req, res) => {
    try {
        // students/organizers only see approved events on the public list
        const events = await eventModel.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching events' });
    }
};

const getAllEventsAdmin = async (req, res) => {
    try {
        const events = await eventModel.getAllEventsForAdmin();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching events' });
    }
};

const getPendingEvents = async (req, res) => {
    try {
        const events = await eventModel.getPendingEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching pending events' });
    }
};

const getMyEvents = async (req, res) => {
    try {
        const events = await eventModel.getEventsByOrganizer(req.user.email);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching your events' });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizerEmail !== req.user.email) {
            return res.status(403).json({ message: 'You can only edit your own events' });
        }
        await eventModel.updateEvent(req.params.id, req.body);
        res.status(200).json({ message: 'Event updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating event' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (req.user.role !== 'admin' && event.organizerEmail !== req.user.email) {
            return res.status(403).json({ message: 'You can only delete your own events' });
        }
        await eventModel.deleteEvent(req.params.id);
        res.status(200).json({ message: 'Event deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting event' });
    }
};

const approveEvent = async (req, res) => {
    try {
        const affected = await eventModel.setStatus(req.params.id, 'approved');
        if (!affected) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event approved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error approving event' });
    }
};

const rejectEvent = async (req, res) => {
    try {
        const affected = await eventModel.setStatus(req.params.id, 'rejected');
        if (!affected) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event rejected successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error rejecting event' });
    }
};

module.exports = {
    createEvent, getEvents, getAllEventsAdmin, getPendingEvents,
    getMyEvents, updateEvent, deleteEvent, approveEvent, rejectEvent
};